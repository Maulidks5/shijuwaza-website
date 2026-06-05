<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PartnershipRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $type = $request->query('type', 'all');

        return Inertia::render('Admin/PartnershipRequests/Index', [
            'requests' => PartnershipRequest::query()
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->when($type !== 'all', fn ($query) => $query->where('partnership_type', $type))
                ->latest()
                ->get(),
            'filters' => ['status' => $status, 'type' => $type],
        ]);
    }

    public function update(Request $request, PartnershipRequest $partnershipRequest): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['new', 'reviewed', 'contacted', 'archived'])],
        ]);

        $partnershipRequest->update($data);

        return back()->with('success', 'Partnership request status updated.');
    }

    public function show(PartnershipRequest $partnershipRequest): Response
    {
        if ($partnershipRequest->status === 'new') {
            $partnershipRequest->update(['status' => 'reviewed']);
            $partnershipRequest->refresh();
        }

        return Inertia::render('Admin/PartnershipRequests/Show', [
            'request' => $partnershipRequest,
        ]);
    }

    public function destroy(PartnershipRequest $partnershipRequest): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $partnershipRequest->delete();

        return back()->with('success', 'Partnership request deleted.');
    }
}
