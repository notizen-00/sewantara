<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Customer extends Model
{
    use BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'phone',
        'birth_date',
        'gender',
        'status',
        'notes',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(CustomerDocument::class);
    }
}
