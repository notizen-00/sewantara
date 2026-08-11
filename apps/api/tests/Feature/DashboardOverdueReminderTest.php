<?php

use App\Models\Tenant;
use App\Models\User;
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

    createDashboardOverdueReminderTestTables();

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

    $this->user = User::query()->create([
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
        'user_id' => $this->user->getKey(),
        'is_primary' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    DB::table('customers')->insert([
        'id' => 1,
        'tenant_id' => 'tenant-a',
        'name' => 'Budi Santoso',
        'phone' => '081234567890',
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->headers = [
        'Authorization' => 'Bearer '.$this->user
            ->createToken('dashboard-overdue-reminder-test', ['tenant:access'])
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

function makeOverdueTestBooking(array $overrides = []): int
{
    static $nextId = 1;
    $id = $nextId++;

    DB::table('bookings')->insert(array_merge([
        'id' => $id,
        'tenant_id' => 'tenant-a',
        'branch_id' => 1,
        'customer_id' => 1,
        'booking_number' => 'BKG-TEST-'.$id,
        'start_at' => now()->subDays(5),
        'end_at' => now()->subDays(2),
        'actual_start_at' => now()->subDays(5),
        'actual_end_at' => null,
        'status' => 'ongoing',
        'fulfillment_type' => 'pickup',
        'payment_status' => 'paid',
        'created_at' => now(),
        'updated_at' => now(),
    ], $overrides));

    DB::table('booking_items')->insert([
        'tenant_id' => 'tenant-a',
        'booking_id' => $id,
        'product_name' => 'Kamera Sony A7',
        'quantity' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return $id;
}

test('dashboard report surfaces overdue booking reminders for the branch', function () {
    $overdueId = makeOverdueTestBooking();

    // Booking yang masih dalam periode sewa — tidak boleh muncul sebagai keterlambatan.
    makeOverdueTestBooking([
        'end_at' => now()->addDays(2),
    ]);

    // Booking yang sudah dikembalikan tepat waktu — tidak boleh muncul.
    makeOverdueTestBooking([
        'end_at' => now()->subDays(3),
        'actual_end_at' => now()->subDays(3),
        'status' => 'completed',
    ]);

    $response = $this->getJson('/api/tenant/tenant-a/reports/dashboard', $this->headers);

    $response->assertOk()
        ->assertJsonPath('data.summary.overdue_bookings', 1)
        ->assertJsonPath('data.overdue_bookings.0.id', $overdueId)
        ->assertJsonPath('data.overdue_bookings.0.customer_name', 'Budi Santoso')
        ->assertJsonPath('data.overdue_bookings.0.days_late', 2)
        ->assertJsonPath('data.overdue_bookings.0.items.0.product_name', 'Kamera Sony A7');
});

function createDashboardOverdueReminderTestTables(): void
{
    Schema::create('users', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->nullable()->index();
        $table->string('name');
        $table->string('email');
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

    Schema::create('products', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->index();
        $table->string('name');
        $table->boolean('is_active')->default(true);
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('customers', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->index();
        $table->string('name');
        $table->string('email')->nullable();
        $table->string('phone')->nullable();
        $table->string('status')->default('active');
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('bookings', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->index();
        $table->unsignedBigInteger('branch_id')->nullable();
        $table->unsignedBigInteger('customer_id');
        $table->unsignedBigInteger('created_by')->nullable();
        $table->string('booking_number', 100);
        $table->timestampTz('start_at');
        $table->timestampTz('end_at');
        $table->timestampTz('actual_start_at')->nullable();
        $table->timestampTz('actual_end_at')->nullable();
        $table->string('status', 30)->default('draft');
        $table->string('fulfillment_type', 30);
        $table->string('payment_status', 30)->default('unpaid');
        $table->timestamps();
        $table->softDeletes();
    });

    Schema::create('booking_items', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->index();
        $table->unsignedBigInteger('booking_id');
        $table->unsignedBigInteger('product_id')->nullable();
        $table->string('product_name');
        $table->unsignedInteger('quantity')->default(1);
        $table->timestamps();
    });

    Schema::create('payments', function (Blueprint $table): void {
        $table->id();
        $table->string('tenant_id')->index();
        $table->unsignedBigInteger('booking_id');
        $table->string('type')->default('payment');
        $table->string('status')->default('pending');
        $table->decimal('amount', 18, 2)->default(0);
        $table->timestamps();
    });
}
