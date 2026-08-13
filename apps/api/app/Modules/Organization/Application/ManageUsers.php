<?php

namespace App\Modules\Organization\Application;

use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ManageUsers
{
    /**
     * @return Collection<int, Role>
     */
    public function listRoles(string $tenantId): Collection
    {
        return Role::query()
            ->where('tenant_id', $tenantId)
            ->with('permissions')
            ->orderByDesc('is_system')
            ->orderBy('name')
            ->get();
    }

    public function paginate(?string $search, ?bool $isActive, int $perPage = 20): LengthAwarePaginator
    {
        return User::query()
            ->with(['roles.permissions', 'branches'])
            ->when($search, fn ($query, string $value) => $query->where(
                fn ($query) => $query
                    ->where('name', 'ilike', "%{$value}%")
                    ->orWhere('email', 'ilike', "%{$value}%")
                    ->orWhere('phone', 'ilike', "%{$value}%"),
            ))
            ->when($isActive !== null, fn ($query) => $query->where('is_active', $isActive))
            ->latest()
            ->paginate(min(max($perPage, 1), 100));
    }

    public function detail(User $user): User
    {
        return $user->load(['roles.permissions', 'branches']);
    }

    public function create(string $tenantId, array $attributes): User
    {
        $this->assertWithinPlanLimit();

        return DB::transaction(function () use ($tenantId, $attributes): User {
            $user = User::create([
                'tenant_id' => $tenantId,
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'phone' => $attributes['phone'] ?? null,
                'password' => Hash::make($attributes['password']),
                'is_active' => $attributes['is_active'] ?? true,
            ]);

            $this->syncBranches($user, $attributes['branch_ids']);

            return $user->load(['roles.permissions', 'branches']);
        });
    }

    public function update(User $user, array $attributes): User
    {
        return DB::transaction(function () use ($user, $attributes): User {
            $payload = [];

            foreach (['name', 'email', 'phone', 'is_active'] as $field) {
                if (array_key_exists($field, $attributes)) {
                    $payload[$field] = $attributes[$field];
                }
            }

            if (! empty($attributes['password'])) {
                $payload['password'] = Hash::make($attributes['password']);
            }

            $user->update($payload);

            if (array_key_exists('branch_ids', $attributes)) {
                $this->syncBranches($user, $attributes['branch_ids']);
            }

            return $user->refresh()->load(['roles.permissions', 'branches']);
        });
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function assignRole(User $user, int $roleId, ?int $branchId): User
    {
        DB::table('user_roles')->updateOrInsert([
            'user_id' => $user->getKey(),
            'role_id' => $roleId,
            'branch_id' => $branchId,
        ]);

        return $user->load(['roles.permissions', 'branches']);
    }

    /**
     * @param  array<int, int>  $branchIds
     */
    private function syncBranches(User $user, array $branchIds): void
    {
        $primaryBranchId = $branchIds[0] ?? null;

        $user->branches()->sync(collect($branchIds)->mapWithKeys(
            fn (int $branchId) => [$branchId => ['is_primary' => $branchId === $primaryBranchId]],
        )->all());
    }

    private function assertWithinPlanLimit(): void
    {
        /** @var Tenant $tenant */
        $tenant = app('currentTenant');
        $subscription = $tenant->planSubscription('main');
        $limitFeature = $subscription?->plan?->features?->firstWhere('slug', 'users.limit');
        $limit = $limitFeature ? (int) $limitFeature->value : null;

        if ($limit !== null && $limit > 0 && User::query()->count() >= $limit) {
            throw ValidationException::withMessages([
                'name' => ["Batas {$limit} pengguna pada paket saat ini sudah tercapai."],
            ]);
        }
    }
}
