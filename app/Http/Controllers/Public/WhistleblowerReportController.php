<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\WhistleblowerReportRequest;
use App\Models\WhistleblowerReport;
use Illuminate\Http\RedirectResponse;

class WhistleblowerReportController extends Controller
{
    public function store(WhistleblowerReportRequest $request): RedirectResponse
    {
        WhistleblowerReport::create($request->validated());

        return back()->with('success', 'Thank you. Your confidential report has been received and will be handled with care.');
    }
}
