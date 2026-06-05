<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\MemberSubmission;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $member = request()->user()->memberOrganization;

        if (! $member) {
            return Inertia::render('Member/Dashboard', [
                'member' => null,
                'stats' => [
                    'total' => 0,
                    'pending' => 0,
                    'approved' => 0,
                    'rejected' => 0,
                    'archived' => 0,
                ],
                'recentSubmissions' => [],
                'setupRequired' => true,
            ]);
        }

        $submissions = MemberSubmission::query()
            ->where('member_organization_id', $member->id)
            ->latest()
            ->get();

        return Inertia::render('Member/Dashboard', [
            'member' => [
                'name' => $member->name,
                'acronym' => $member->acronym,
                'slug' => $member->slug,
                'public_url' => route('members.show', $member->slug),
                'description' => $member->description,
            ],
            'stats' => [
                'total' => $submissions->count(),
                'pending' => $submissions->where('status', 'pending')->count(),
                'approved' => $submissions->where('status', 'approved')->count(),
                'rejected' => $submissions->where('status', 'rejected')->count(),
                'archived' => $submissions->where('status', 'archived')->count(),
            ],
            'recentSubmissions' => $submissions->take(5)->values()->map(fn (MemberSubmission $submission) => $this->formatSubmission($submission)),
        ]);
    }

    private function formatSubmission(MemberSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'title' => $submission->title,
            'submission_type' => $submission->submission_type,
            'status' => $submission->status,
            'created_at' => $submission->created_at?->format('M d, Y'),
        ];
    }
}
