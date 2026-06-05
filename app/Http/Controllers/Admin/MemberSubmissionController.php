<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MemberSubmissionStatusRequest;
use App\Models\MemberSubmission;
use App\Support\PublicUploads;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberSubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');

        return Inertia::render('Admin/MemberSubmissions/Index', [
            'submissions' => MemberSubmission::query()
                ->with(['memberOrganization:id,name,acronym,slug', 'submitter:id,name,email'])
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->latest()
                ->get()
                ->map(fn (MemberSubmission $submission) => $this->formatSubmission($submission)),
            'filters' => ['status' => $status],
        ]);
    }

    public function show(MemberSubmission $memberSubmission): Response
    {
        $memberSubmission->load(['memberOrganization:id,name,acronym,slug,email,phone,location', 'submitter:id,name,email', 'approver:id,name']);

        return Inertia::render('Admin/MemberSubmissions/Show', [
            'submission' => $this->formatSubmission($memberSubmission, detailed: true),
        ]);
    }

    public function update(MemberSubmissionStatusRequest $request, MemberSubmission $memberSubmission): RedirectResponse
    {
        $data = $request->validated();
        $status = $data['status'];

        $memberSubmission->update([
            'status' => $status,
            'admin_note' => $data['admin_note'] ?? $memberSubmission->admin_note,
            'is_public' => $status === 'approved' ? (bool) ($data['is_public'] ?? true) : false,
            'approved_at' => $status === 'approved' ? now() : null,
            'approved_by' => $status === 'approved' ? $request->user()->id : null,
        ]);

        return back()->with('success', 'Member submission updated.');
    }

    public function destroy(MemberSubmission $memberSubmission): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        PublicUploads::delete($memberSubmission->document_path);

        $memberSubmission->delete();

        return redirect()->route('admin.member-submissions.index')->with('success', 'Member submission removed permanently.');
    }

    private function formatSubmission(MemberSubmission $submission, bool $detailed = false): array
    {
        $data = [
            'id' => $submission->id,
            'title' => $submission->title,
            'submission_type' => $submission->submission_type,
            'status' => $submission->status,
            'is_public' => $submission->is_public,
            'admin_note' => $submission->admin_note,
            'member' => [
                'name' => $submission->memberOrganization?->name,
                'acronym' => $submission->memberOrganization?->acronym,
                'slug' => $submission->memberOrganization?->slug,
            ],
            'submitter' => [
                'name' => $submission->submitter?->name,
                'email' => $submission->submitter?->email,
            ],
            'created_at' => $submission->created_at?->format('M d, Y'),
            'approved_at' => $submission->approved_at?->format('M d, Y'),
        ];

        if (! $detailed) {
            return $data;
        }

        return [
            ...$data,
            'body' => $submission->body,
            'original_filename' => $submission->original_filename,
            'document_url' => PublicUploads::url($submission->document_path),
            'approver' => $submission->approver?->name,
        ];
    }
}
