<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\PartnershipRequestFormRequest;
use App\Models\PartnershipRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipRequestController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/PartnerWithUs');
    }

    public function store(PartnershipRequestFormRequest $request): RedirectResponse
    {
        PartnershipRequest::create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return back()->with('success', 'Thank you. Your partnership request has been received for review.');
    }
}
