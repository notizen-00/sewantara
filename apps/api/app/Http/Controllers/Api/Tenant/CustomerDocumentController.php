<?php

namespace App\Http\Controllers\Api\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreCustomerDocumentRequest;
use App\Models\Customer;
use App\Models\CustomerDocument;
use App\Modules\Customers\Application\ManageCustomerDocuments;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerDocumentController extends Controller
{
    public function store(
        StoreCustomerDocumentRequest $request,
        Customer $customer,
        ManageCustomerDocuments $documents,
    ): JsonResponse {
        $document = $documents->create(
            $customer,
            $request->safe()->except(['front', 'back']),
            $request->file('front'),
            $request->file('back'),
        );

        return response()->json([
            'success' => true,
            'message' => 'Dokumen identitas berhasil ditambahkan.',
            'data' => $document,
        ], 201);
    }

    public function verify(
        Customer $customer,
        CustomerDocument $document,
        Request $request,
        ManageCustomerDocuments $documents,
    ): JsonResponse {
        $this->ensureOwnedBy($customer, $document);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil diverifikasi.',
            'data' => $documents->verify($document, $request->user()->id),
        ]);
    }

    public function destroy(
        Customer $customer,
        CustomerDocument $document,
        ManageCustomerDocuments $documents,
    ): JsonResponse {
        $documents->delete($customer, $document);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil dihapus.',
            'data' => null,
        ]);
    }

    private function ensureOwnedBy(Customer $customer, CustomerDocument $document): void
    {
        abort_unless((int) $document->customer_id === (int) $customer->getKey(), 404);
    }
}
