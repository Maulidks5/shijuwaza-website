<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MemberOrganization;
use App\Models\MemberSubmission;
use App\Support\PublicUploads;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $members = MemberOrganization::active()
            ->ordered()
            ->paginate(6)
            ->through(fn (MemberOrganization $member) => $this->formatMember($member))
            ->withQueryString();

        return Inertia::render('Public/Members/Index', [
            'members' => $members,
        ]);
    }

    public function show(MemberOrganization $memberOrganization): Response
    {
        abort_unless($memberOrganization->is_active, 404);

        $updates = $memberOrganization->submissions()
            ->approvedPublic()
            ->latest('approved_at')
            ->paginate(3)
            ->through(fn (MemberSubmission $submission) => $this->formatSubmission($submission))
            ->withQueryString();

        return Inertia::render('Public/Members/Show', [
            'member' => $this->formatMember($memberOrganization),
            'updates' => $updates,
        ]);
    }

    private function formatMember(MemberOrganization $member): array
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'slug' => $member->slug,
            'acronym' => $member->acronym,
            'description' => $member->description,
            'logo_url' => $this->assetUrl($member->logo),
            'email' => $member->email,
            'phone' => $member->phone,
            'location' => $member->location,
            'website_url' => $member->website_url,
            'created_at' => $member->created_at?->format('M d, Y'),
        ];
    }

    private function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return PublicUploads::url($path);
    }

    private function formatSubmission(MemberSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'title' => $submission->title,
            'body' => $submission->body,
            'excerpt' => str($submission->body ?: $submission->original_filename ?: 'Approved member document')->limit(160)->toString(),
            'submission_type' => $submission->submission_type,
            'document_url' => $this->assetUrl($submission->document_path),
            'approved_at' => $submission->approved_at?->format('M d, Y'),
        ];
    }
}
