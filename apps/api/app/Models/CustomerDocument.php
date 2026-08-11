<?php

namespace App\Models;

use App\Support\TenantPrivateMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class CustomerDocument extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'customer_id',
        'document_type',
        'document_number',
        'front_path',
        'back_path',
        'expired_at',
        'is_verified',
        'verified_by',
        'verified_at',
    ];

    protected $appends = [
        'front_url',
        'back_url',
    ];

    protected function casts(): array
    {
        return [
            'expired_at' => 'date',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function getFrontUrlAttribute(): ?string
    {
        return app(TenantPrivateMedia::class)->url($this->front_path);
    }

    public function getBackUrlAttribute(): ?string
    {
        return app(TenantPrivateMedia::class)->url($this->back_path);
    }
}
