<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', Rule::in(['ktp', 'sim', 'passport', 'other'])],
            'document_number' => ['nullable', 'string', 'max:100'],
            'front' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'back' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'expired_at' => ['nullable', 'date'],
        ];
    }
}
