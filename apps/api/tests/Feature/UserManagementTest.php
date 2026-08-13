<?php

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Organization\Application\SeedDefaultAccessControl;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravelcm\Subscriptions\Models\Subscription;
use Stancl\Tenancy\Resolvers\PathTenantResolver;
use Stancl\Tenancy\Tenancy;

beforeEach(function () {
    config()->set('database.default', 'sqlite');
    config()->set('database.connections.sqlite.database', ':memory:');
    config()->set('tenancy.database.central_connection', 'sqlite');
    DB::purge('sqlite');
    DB::setDefaultConnection('sqlite');

    createUserManagementTestTables();

    $this->tenancy = app(Tenancy::class);
    $this->tenancy->getBootstrappersUsing = fn () => [];

    $subscription = new Subscription(['ends_at' => now()->addDay()]);
    $this->tenant = Mockery::mock(Tenant::class)->makePartial();
    $this->tenant->forceFill([
        'id' => 'tenant-a',
        'name' => 'Tenant A',
        'status' => 'active',
    ]);
    $this->tenant->shouldReceive('planSubscription')
        ->with('main')
        ->andReturn($subscription);

    $resolver = Mockery::mock(PathTenantResolver::class);
    $resolver->shouldReceive('resolve')->andReturn($this->tenant);
    app()->instance(PathTenantResolver::class, $resolver);

    $this->owner = User::query()->create([
        'tenant_id' => 'tenant-a',
        'name' => 'Tenant Owner',
        'email' => 'owner@example.com',
        'password' => 'unused',
        'is_active' => true,
    ]);
    DB::table('branches')->insert([
        'id' => 1,
        'tenant_id' => 'tenant-a',
        'name' => 'Cabang Utama',
        'code' => 'MAIN',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    DB::table('branch_users')->insert([
        'branch_id' => 1,
        'user_id' => $this->owner->getKey(),
        'is_primary' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $accessControl = new SeedDefaultAccessControl;
    $ownerRoleId = $accessControl->ensureOwnerRole('tenant-a');
    $accessControl->assignRole($this->owner->getKey(), $ownerRoleId);

    $this->headers = [
        'Authorization' => 'Bearer '.$this->owner
            ->createToken('user-management-test', ['tenant:access'])
            ->plainTextToken,
        'X-Branch-Id' => '1',
    ];
});

afterEach(function () {
    app()->forgetInstance('currentTenant');
    app()->forgetInstance(PathTenantResolver::class);
    $this->tenancy->end();
    Mockery::close();
});

test('owner can create update assign role to and delete a staff user', function () {
    $created = $this->postJson('/api/tenant/tenant-a/users', [
        'name' => 'Staff Satu',
        'email' => 'staff@example.com',
        'phone' => '081234567890',
        'password' => 'StrongPassword123',
        'password_confirmation' => 'StrongPassword123',
        'is_active' => true,
        'branch_ids' => [1],
    ], $this->headers);

    $created->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Staff Satu')
        ->assertJsonPath('data.email', 'staff@example.com')
        ->assertJsonPath('data.tenant_id', 'tenant-a')
        ->assertJsonPath('data.branches.0.id', 1)
        ->assertJsonPath('data.branches.0.pivot.is_primary', true);

    $staffId = $created->json('data.id');

    expect(DB::table('users')->where('id', $staffId)->value('password'))
        ->not->toBe('StrongPassword123');

    $this->getJson('/api/tenant/tenant-a/users', $this->headers)
        ->assertOk()
        ->assertJsonCount(2, 'data.data');

    $this->getJson("/api/tenant/tenant-a/users/{$staffId}", $this->headers)
        ->assertOk()
        ->assertJsonPath('data.email', 'staff@example.com');

    $this->patchJson("/api/tenant/tenant-a/users/{$staffId}", [
        'name' => 'Staff Satu Updated',
        'email' => 'staff@example.com',
        'phone' => null,
        'is_active' => false,
        'branch_ids' => [1],
    ], $this->headers)->assertOk()
        ->assertJsonPath('data.name', 'Staff Satu Updated')
        ->assertJsonPath('data.is_active', false)
        ->assertJsonPath('data.phone', null);

    $ownerRoleId = DB::table('roles')->where(['tenant_id' => 'tenant-a', 'code' => 'owner'])->value('id');
    $this->postJson("/api/tenant/tenant-a/users/{$staffId}/roles", [
        'role_id' => $ownerRoleId,
        'branch_id' => 1,
    ], $this->headers)->assertOk()
        ->assertJsonPath('data.roles.0.code', 'owner')
        ->assertJsonPath('data.roles.0.pivot.branch_id', 1);

    $this->assertDatabaseHas('user_roles', [
        'user_id' => $staffId,
        'role_id' => $ownerRoleId,
        'branch_id' => 1,
    ]);

    $this->deleteJson("/api/tenant/tenant-a/users/{$staffId}", [], $this->headers)
        ->assertOk()
        ->assertJsonPath('success', true);

    expect(DB::table('users')->where('id', $staffId)->value('deleted_at'))->not->toBeNull();
});

test('user creation rejects duplicate email within the same tenant but allows it across tenants', function () {
    $this->postJson('/api/tenant/tenant-a/users', [
        'name' => 'Staff Satu',
        'email' => 'duplicate@example.com',
        'password' => 'StrongPassword123',
        'password_confirmation' => 'StrongPassword123',
        'branch_ids' => [1],
    ], $this->headers)->assertCreated();

    $this->postJson('/api/tenant/tenant-a/users', [
        'name' => 'Staff Dua',
        'email' => 'duplicate@example.com',
        'password' => 'StrongPassword123',
        'password_confirmation' => 'StrongPassword123',
        'branch_ids' => [1],
    ], $this->headers)->assertStatus(422)
        ->assertJsonValidationErrors('email');

    DB::table('users')->insert([
        'tenant_id' => 'tenant-b',
        'name' => 'Owner Tenant B',
        'email' => 'duplicate@example.com',
        'password' => 'unused',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect(DB::table('users')->where('email', 'duplicate@example.com')->count())->toBe(2);
});

test('a user cannot delete their own account and must select at least one branch to be created', function () {
    $this->deleteJson("/api/tenant/tenant-a/users/{$this->owner->getKey()}", [], $this->headers)
        ->assertStatus(422);

    $this->postJson('/api/tenant/tenant-a/users', [
        'name' => 'Staff Tanpa Cabang',
        'email' => 'nobranch@example.com',
        'password' => 'StrongPassword123',
        'password_confirmation' => 'StrongPassword123',
        'branch_ids' => [],
    ], $this->headers)->assertStatus(422)
        ->assertJsonValidationErrors('branch_ids');
});

test('roles endpoint exposes the tenant owner role with its permissions', function () {
    $this->getJson('/api/tenant/tenant-a/roles', $this->headers)
        ->assertOk()
        ->assertJsonPath('data.0.code', 'owner')
        ->assertJsonPath('data.0.is_system', true)
        ->assertJsonCount(11, 'data.0.permissions');
});

function createUserManagementTestTables(): void
{
    Schema::create('users', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->nullable()->index();
        $table->string('name');
        $table->string('email');
        $table->string('phone')->nullable();
        $table->string('password');
        $table->boolean('is_active')->default(true);
        $table->timestamp('last_login_at')->nullable();
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('personal_access_tokens', function (Blueprint $table): void {
        $table->id();
        $table->morphs('tokenable');
        $table->string('name');
        $table->string('token', 64)->unique();
        $table->text('abilities')->nullable();
        $table->timestamp('last_used_at')->nullable();
        $table->timestamp('expires_at')->nullable();
        $table->timestamps();
    });

    Schema::create('branches', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id');
        $table->string('name');
        $table->string('code');
        $table->boolean('is_active')->default(true);
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('branch_users', function (Blueprint $table): void {
        $table->unsignedBigInteger('branch_id');
        $table->unsignedBigInteger('user_id');
        $table->boolean('is_primary')->default(false);
        $table->timestamps();
        $table->primary(['branch_id', 'user_id']);
    });

    Schema::create('roles', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->nullable()->index();
        $table->string('name');
        $table->string('code');
        $table->boolean('is_system')->default(false);
        $table->timestamps();
        $table->unique(['tenant_id', 'code']);
    });

    Schema::create('permissions', function (Blueprint $table): void {
        $table->id();
        $table->string('name');
        $table->string('code')->unique();
        $table->string('module');
        $table->timestamps();
    });

    Schema::create('role_permissions', function (Blueprint $table): void {
        $table->unsignedBigInteger('role_id');
        $table->unsignedBigInteger('permission_id');
        $table->primary(['role_id', 'permission_id']);
    });

    Schema::create('user_roles', function (Blueprint $table): void {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('role_id');
        $table->unsignedBigInteger('branch_id')->nullable();
        $table->unique(['user_id', 'role_id', 'branch_id']);
    });
}
