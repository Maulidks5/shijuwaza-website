<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/Partners/Index', [
            'partners' => Partner::ordered()
                ->get()
                ->map(fn (Partner $partner) => $this->payload($partner)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Partners/Form', ['partner' => null]);
    }

    public function store(PartnerRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('logo');
        $data['logo'] = $this->storeImage($request, 'logo', 'partners');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->boolean('is_active');

        Partner::create($data);

        return redirect()->route('admin.partners.index')->with('success', 'Partner created.');
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('Admin/Partners/Form', ['partner' => $this->payload($partner)]);
    }

    public function update(PartnerRequest $request, Partner $partner): RedirectResponse
    {
        $data = $request->safe()->except('logo');
        $data['logo'] = $this->replaceImage($request, $partner, 'logo', 'partners');
        $data['sort_order'] = $request->integer('sort_order');
        $data['is_active'] = $request->boolean('is_active');

        $partner->update($data);

        return redirect()->route('admin.partners.index')->with('success', 'Partner updated.');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $this->deletePublicUpload($partner->logo);
        $partner->delete();

        return back()->with('success', 'Partner deleted.');
    }

    public function toggleVisibility(Partner $partner): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $partner->update(['is_active' => ! $partner->is_active]);

        return back()->with('success', $partner->is_active ? 'Partner is visible.' : 'Partner is hidden.');
    }

    private function payload(Partner $partner): array
    {
        return [
            ...$partner->toArray(),
            'logo_url' => $this->publicUploadUrl($partner->logo),
        ];
    }
}
