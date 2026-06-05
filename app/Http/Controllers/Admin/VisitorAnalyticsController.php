<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VisitorAnalyticsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $period = $request->query('period', 'month');
        [$start, $label] = $this->periodStart($period);

        try {
            $periodQuery = VisitorLog::query()
                ->when($start, fn (Builder $query) => $query->where('visited_at', '>=', $start));

            return Inertia::render('Admin/Visitors/Index', [
                'filters' => [
                    'period' => $period,
                    'label' => $label,
                ],
                'summary' => [
                    'today' => $this->countSince(now()->startOfDay()),
                    'week' => $this->countSince(now()->startOfWeek()),
                    'month' => $this->countSince(now()->startOfMonth()),
                    'total' => VisitorLog::count(),
                    'unique_today' => $this->uniqueSince(now()->startOfDay()),
                    'unique_month' => $this->uniqueSince(now()->startOfMonth()),
                ],
                'deviceSummary' => (clone $periodQuery)
                    ->select('device_type', DB::raw('COUNT(*) as visits'))
                    ->groupBy('device_type')
                    ->orderByDesc('visits')
                    ->get(),
            ]);
        } catch (\Throwable) {
            return Inertia::render('Admin/Visitors/Index', [
                'filters' => ['period' => $period, 'label' => $label],
                'summary' => ['today' => 0, 'week' => 0, 'month' => 0, 'total' => 0, 'unique_today' => 0, 'unique_month' => 0],
                'deviceSummary' => [],
            ]);
        }
    }

    private function countSince(Carbon $date): int
    {
        return VisitorLog::where('visited_at', '>=', $date)->count();
    }

    private function uniqueSince(Carbon $date): int
    {
        return VisitorLog::where('visited_at', '>=', $date)->distinct('visitor_hash')->count('visitor_hash');
    }

    private function periodStart(string $period): array
    {
        return match ($period) {
            'today' => [now()->startOfDay(), 'Today'],
            'week' => [now()->startOfWeek(), 'This week'],
            'month' => [now()->startOfMonth(), 'This month'],
            'year' => [now()->startOfYear(), 'This year'],
            'all' => [null, 'All time'],
            default => [now()->startOfMonth(), 'This month'],
        };
    }
}
