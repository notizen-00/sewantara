<?php

namespace Database\Seeders;

use App\Modules\Organization\Application\SeedDefaultAccessControl;
use Database\Seeders\Concerns\SeedsDemoTenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TenantAccessControlSeeder extends Seeder
{
    use SeedsDemoTenant;

    public function run(): void
    {
        $this->withinDemoTenant(function (string $tenantId): void {
            $accessControl = new SeedDefaultAccessControl;
            $roleId = $accessControl->ensureOwnerRole($tenantId);

            $ownerId = (int) DB::table('users')
                ->where('email', DemoTenantRegistrationSeeder::OWNER_EMAIL)
                ->value('id');

            $accessControl->assignRole($ownerId, $roleId);
        });
    }
}
