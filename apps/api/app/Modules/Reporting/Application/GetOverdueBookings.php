<?php

namespace App\Modules\Reporting\Application;

use App\Models\Booking;
use Illuminate\Support\Collection;

class GetOverdueBookings
{
    /**
     * Booking yang statusnya masih "ongoing" tapi tanggal pengembalian
     * (end_at) sudah lewat dan belum ada actual_end_at — dipakai untuk
     * reminder keterlambatan customer di dashboard.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function execute(int $branchId, int $limit = 10): Collection
    {
        return Booking::query()
            ->with(['customer:id,name,phone', 'items:id,booking_id,product_name,quantity'])
            ->where('branch_id', $branchId)
            ->where('status', 'ongoing')
            ->where('end_at', '<', now())
            ->whereNull('actual_end_at')
            ->orderBy('end_at')
            ->limit($limit)
            ->get()
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'customer_id' => $booking->customer_id,
                'customer_name' => $booking->customer?->name,
                'customer_phone' => $booking->customer?->phone,
                'end_at' => optional($booking->end_at)->toIso8601String(),
                'days_late' => max(0, (int) $booking->end_at->diffInDays(now())),
                'items' => $booking->items
                    ->map(fn ($item) => [
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                    ])
                    ->values(),
            ])
            ->values();
    }
}
