<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MemberOrganizationRequest;
use App\Models\MemberOrganization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MemberOrganizationController extends Controller
{
    use HandlesCmsUploads;

    public function index(): Response
    {
        return Inertia::render('Admin/Members/Index', [
            'members' => MemberOrganization::query()
                ->with(['user:id,name,email,is_blocked,last_seen_at', 'submissions:id,member_organization_id,status'])
                ->ordered()
                ->get()
                ->map(fn (MemberOrganization $member) => $this->payload($member)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Members/Form', ['member' => null]);
    }

    public function store(MemberOrganizationRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($request, $data): void {
            $user = User::create([
                'name' => $data['account_name'],
                'email' => $data['account_email'],
                'password' => $data['account_password'],
                'role' => 'member',
            ]);
            $user->syncRoles(['Member']);
            $user->syncPermissions([]);

            MemberOrganization::create([
                ...$this->memberData($request, $data),
                'user_id' => $user->id,
                'slug' => $this->uniqueSlug($data['acronym'] ?: $data['name']),
                'logo' => $this->storeImage($request, 'logo', 'members'),
            ]);
        });

        return redirect()->route('admin.members.index')->with('success', 'Member organization and login account created.');
    }

    public function edit(MemberOrganization $member): Response
    {
        $member->load('user:id,name,email,is_blocked,last_seen_at');

        return Inertia::render('Admin/Members/Form', [
            'member' => $this->payload($member),
        ]);
    }

    public function update(MemberOrganizationRequest $request, MemberOrganization $member): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($request, $member, $data): void {
            $user = $member->user ?: new User(['role' => 'member']);
            $user->fill([
                'name' => $data['account_name'],
                'email' => $data['account_email'],
                'role' => 'member',
            ]);

            if (filled($data['account_password'] ?? null)) {
                $user->password = $data['account_password'];
            }

            $user->save();
            $user->syncRoles(['Member']);
            $user->syncPermissions([]);

            $member->update([
                ...$this->memberData($request, $data),
                'user_id' => $user->id,
                'slug' => $member->slug ?: $this->uniqueSlug($data['acronym'] ?: $data['name'], $member->id),
                'logo' => $this->replaceImage($request, $member, 'logo', 'members'),
            ]);
        });

        return redirect()->route('admin.members.index')->with('success', 'Member organization updated.');
    }

    public function destroy(MemberOrganization $member): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        if ($member->logo && ! str_starts_with($member->logo, '/')) {
            Storage::disk('public')->delete($member->logo);
        }

        $member->delete();

        return back()->with('success', 'Member organization removed permanently.');
    }

    public function toggleVisibility(MemberOrganization $member): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $member->update(['is_active' => ! $member->is_active]);

        return back()->with('success', $member->is_active ? 'Member is visible.' : 'Member is hidden.');
    }

    public function toggleAccountBlock(MemberOrganization $member): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin') || request()->user()?->can('manage members'), 403);

        $user = $member->user;

        if (! $user) {
            return back()->with('error', 'This member does not have a linked login account.');
        }

        if ($user->is_blocked) {
            $user->forceFill([
                'is_blocked' => false,
                'blocked_at' => null,
                'blocked_by' => null,
                'blocked_reason' => null,
            ])->save();

            return back()->with('success', 'Member account unblocked.');
        }

        $user->forceFill([
            'is_blocked' => true,
            'blocked_at' => now(),
            'blocked_by' => request()->user()?->id,
            'blocked_reason' => 'Blocked from member management.',
        ])->save();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', request()->session()->getId())
            ->delete();

        return back()->with('success', 'Member account blocked and active sessions ended.');
    }

    private function memberData(MemberOrganizationRequest $request, array $data): array
    {
        return [
            'name' => $data['name'],
            'acronym' => $data['acronym'] ?? null,
            'description' => $data['description'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
            'website_url' => $data['website_url'] ?? null,
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ];
    }

    private function payload(MemberOrganization $member): array
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'slug' => $member->slug,
            'acronym' => $member->acronym,
            'description' => $member->description,
            'logo' => $member->logo,
            'logo_url' => $member->logo ? (str_starts_with($member->logo, '/') ? $member->logo : asset("storage/{$member->logo}")) : null,
            'email' => $member->email,
            'phone' => $member->phone,
            'location' => $member->location,
            'website_url' => $member->website_url,
            'sort_order' => $member->sort_order,
            'is_active' => $member->is_active,
            'account_name' => $member->user?->name,
            'account_email' => $member->user?->email,
            'account_blocked' => (bool) $member->user?->is_blocked,
            'account_last_seen_at' => $member->user?->last_seen_at,
            'submissions_count' => $member->submissions->count(),
            'pending_submissions_count' => $member->submissions->where('status', 'pending')->count(),
        ];
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'member';
        $slug = $base;
        $counter = 2;

        while (MemberOrganization::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
