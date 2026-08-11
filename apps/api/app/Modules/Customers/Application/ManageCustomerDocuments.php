<?php

namespace App\Modules\Customers\Application;

use App\Models\Customer;
use App\Models\CustomerDocument;
use App\Support\TenantPrivateMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Throwable;

class ManageCustomerDocuments
{
    public function __construct(
        private readonly TenantPrivateMedia $media,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(
        Customer $customer,
        array $attributes,
        ?UploadedFile $front,
        ?UploadedFile $back,
    ): CustomerDocument {
        $frontPath = $front ? $this->media->store($front, "customers/{$customer->getKey()}") : null;
        $backPath = $back ? $this->media->store($back, "customers/{$customer->getKey()}") : null;

        try {
            return DB::transaction(fn (): CustomerDocument => $customer->documents()->create([
                'document_type' => $attributes['document_type'],
                'document_number' => $attributes['document_number'] ?? null,
                'front_path' => $frontPath,
                'back_path' => $backPath,
                'expired_at' => $attributes['expired_at'] ?? null,
            ]));
        } catch (Throwable $exception) {
            $this->media->delete($frontPath);
            $this->media->delete($backPath);

            throw $exception;
        }
    }

    public function verify(CustomerDocument $document, int $userId): CustomerDocument
    {
        $document->forceFill([
            'is_verified' => true,
            'verified_by' => $userId,
            'verified_at' => now(),
        ])->save();

        return $document->refresh();
    }

    public function delete(Customer $customer, CustomerDocument $document): void
    {
        $this->ensureOwnedBy($customer, $document);

        $frontPath = $document->front_path;
        $backPath = $document->back_path;

        $document->delete();

        $this->media->delete($frontPath);
        $this->media->delete($backPath);
    }

    private function ensureOwnedBy(Customer $customer, CustomerDocument $document): void
    {
        abort_unless(
            (int) $document->customer_id === (int) $customer->getKey(),
            404,
        );
    }
}
