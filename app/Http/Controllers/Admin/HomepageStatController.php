<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomepageStatRequest;
use App\Models\HomepageStat;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomepageStatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Stats/Index', [
            'stats' => HomepageStat::ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Stats/Form', [
            'stat' => null,
        ]);
    }

    public function store(HomepageStatRequest $request): RedirectResponse
    {
        HomepageStat::create([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.stats.index')->with('success', 'Homepage stat created.');
    }

    public function edit(HomepageStat $stat): Response
    {
        return Inertia::render('Admin/Stats/Form', [
            'stat' => $stat,
        ]);
    }

    public function update(HomepageStatRequest $request, HomepageStat $stat): RedirectResponse
    {
        $stat->update([
            ...$request->validated(),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.stats.index')->with('success', 'Homepage stat updated.');
    }

    public function destroy(HomepageStat $stat): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $stat->delete();

        return back()->with('success', 'Homepage stat deleted.');
    }

    public function toggleVisibility(HomepageStat $stat): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $stat->update(['is_active' => ! $stat->is_active]);

        return back()->with('success', $stat->is_active ? 'Homepage stat is visible.' : 'Homepage stat is hidden.');
    }
}
