<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BranchUser extends Pivot
{
    protected $table = 'branch_users';

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }
}
