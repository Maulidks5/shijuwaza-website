<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhistleblowerReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WhistleblowerReportController extends Controller
{
    public function index(): Response
    {
        $status = request('status', 'all');

        return Inertia::render('Admin/WhistleblowerReports/Index', [
            'reports' => WhistleblowerReport::query()
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->latest()
                ->get(),
            'filters' => ['status' => $status],
        ]);
    }

    public function show(WhistleblowerReport $whistleblowerReport): Response
    {
        if ($whistleblowerReport->status === 'new') {
            $whistleblowerReport->update(['status' => 'reviewed']);
            $whistleblowerReport->refresh();
        }

        return Inertia::render('Admin/WhistleblowerReports/Show', [
            'report' => $whistleblowerReport,
        ]);
    }

    public function update(Request $request, WhistleblowerReport $whistleblowerReport): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['new', 'reviewed', 'closed', 'archived'])],
        ]);

        $whistleblowerReport->update($data);

        return back()->with('success', 'Confidential report status updated.');
    }

    public function destroy(WhistleblowerReport $whistleblowerReport): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $whistleblowerReport->delete();

        return back()->with('success', 'Confidential report deleted.');
    }
}
