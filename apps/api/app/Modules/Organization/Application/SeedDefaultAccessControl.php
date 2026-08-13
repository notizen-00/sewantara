<?php

namespace App\Modules\Organization\Application;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

/**
 * Single source of truth for the permission catalog and the tenant's
 * built-in "Owner" role. Used both when a real tenant is provisioned
 * (InitializeTenantDatabase) and by the demo tenant seeder, so the two
 * never drift apart.
 */
class SeedDefaultAccessControl
{
    /**
     * @return array<int, array{code: string, name: string, module: string}>
     */
    public function permissions(): array
    {
        return [
            ['code' => 'branches.manage', 'name' => 'Kelola cabang', 'module' => 'organization'],
            ['code' => 'customers.manage', 'name' => 'Kelola pelanggan', 'module' => 'customer'],
            ['code' => 'inventory.manage', 'name' => 'Kelola inventaris', 'module' => 'inventory'],
            ['code' => 'bookings.manage', 'name' => 'Kelola pemesanan', 'module' => 'booking'],
            ['code' => 'payments.manage', 'name' => 'Kelola pembayaran', 'module' => 'billing'],
            ['code' => 'reports.view', 'name' => 'Lihat laporan', 'module' => 'reporting'],
            ['code' => 'user.view', 'name' => 'Lihat pengguna', 'module' => 'user'],
            ['code' => 'user.create', 'name' => 'Tambah pengguna', 'module' => 'user'],
            ['code' => 'user.update', 'name' => 'Perbarui pengguna', 'module' => 'user'],
            ['code' => 'user.delete', 'name' => 'Hapus pengguna', 'module' => 'user'],
            ['code' => 'user.assign_role', 'name' => 'Tetapkan role pengguna', 'module' => 'user'],
        ];
    }

    /**
     * Ensures every permission in the catalog exists, ensures the tenant has
     * a built-in "Owner" role, attaches every permission to it, and returns
     * that role's id.
     */
    public function ensureOwnerRole(string $tenantId): int
    {
        $roleId = DB::table('roles')->where([
            'tenant_id' => $tenantId,
            'code' => 'owner',
        ])->value('id');

        if ($roleId === null) {
            $roleId = Role::query()->create([
                'tenant_id' => $tenantId,
                'name' => 'Owner',
                'code' => 'owner',
                'is_system' => true,
            ])->getKey();
        }

        $permissionIds = collect($this->permissions())->map(
            fn (array $permission) => Permission::query()->firstOrCreate(
                ['code' => $permission['code']],
                ['name' => $permission['name'], 'module' => $permission['module']],
            )->getKey(),
        );

        DB::table('role_permissions')->where('role_id', $roleId)->delete();
        DB::table('role_permissions')->insert(
            $permissionIds->map(fn (int $permissionId) => [
                'role_id' => $roleId,
                'permission_id' => $permissionId,
            ])->all(),
        );

        return $roleId;
    }

    public function assignRole(int $userId, int $roleId, ?int $branchId = null): void
    {
        DB::table('user_roles')->updateOrInsert([
            'user_id' => $userId,
            'role_id' => $roleId,
            'branch_id' => $branchId,
        ]);
    }
}
