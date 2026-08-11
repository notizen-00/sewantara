<?php

namespace App\Modules\Payments\Application;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RecordBookingPayment
{
    public function execute(string $tenantId, Booking $booking, array $attributes): Payment
    {
        return DB::transaction(function () use ($attributes, $booking, $tenantId): Payment {
            $payment = Payment::create([
                'tenant_id' => $tenantId,
                'booking_id' => $booking->id,
                'payment_number' => 'PAY-'.now()->format('ymd').'-'.strtoupper(Str::random(6)),
                'type' => $attributes['type'],
                'method' => $attributes['method'],
                'amount' => $attributes['amount'],
                'status' => $attributes['status'] ?? 'paid',
                'paid_at' => $attributes['paid_at'] ?? now(),
                'notes' => $attributes['notes'] ?? null,
            ]);

            if ($payment->status === 'paid' && $payment->type !== 'deposit') {
                $paidAmount = (float) $booking->paid_amount + (float) $payment->amount;
                $remainingAmount = max(0, (float) $booking->total_amount - $paidAmount);

                $booking->update([
                    'paid_amount' => $paidAmount,
                    'remaining_amount' => $remainingAmount,
                    'payment_status' => $remainingAmount <= 0 ? 'paid' : 'partial',
                ]);
            }

            return $payment;
        });
    }
}
