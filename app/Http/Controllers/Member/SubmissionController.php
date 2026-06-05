<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\MemberSubmissionRequest;
use App\Models\MemberSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $member = $request->user()->memberOrganization;
        if (! $member) {
            return Inertia::render('Member/Submissions/Index', [
                'member' => null,
                'submissions' => [],
                'setupRequired' => true,
            ]);
        }

        return Inertia::render('Member/Submissions/Index', [
            'member' => ['name' => $member->name, 'acronym' => $member->acronym],
            'submissions' => MemberSubmission::query()
                ->where('member_organization_id', $member->id)
                ->latest()
                ->get()
                ->map(fn (MemberSubmission $submission) => $this->formatSubmission($submission)),
        ]);
    }

    public function create(Request $request): Response
    {
        $member = $request->user()->memberOrganization;
        abort_unless($member, 403, 'This member account is not linked to an organization profile yet.');

        return Inertia::render('Member/Submissions/Create', [
            'member' => ['name' => $member->name, 'acronym' => $member->acronym],
        ]);
    }

    public function store(MemberSubmissionRequest $request): RedirectResponse
    {
        $member = $request->user()->memberOrganization;
        $data = $request->validated();
        $documentPath = null;
        $originalFilename = null;

        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('member-submissions', 'public');
            $originalFilename = $request->file('document')->getClientOriginalName();
        }

        MemberSubmission::create([
            'member_organization_id' => $member->id,
            'submitted_by' => $request->user()->id,
            'title' => $data['title'],
            'submission_type' => $data['submission_type'],
            'body' => $data['body'] ?? null,
            'document_path' => $documentPath,
            'original_filename' => $originalFilename,
            'status' => 'pending',
            'is_public' => false,
        ]);

        return redirect()->route('member.submissions.index')->with('success', 'Submission sent for admin approval.');
    }

    public function edit(Request $request, MemberSubmission $submission): Response
    {
        $member = $request->user()->memberOrganization;
        abort_unless($member && $submission->member_organization_id === $member->id, 404);

        return Inertia::render('Member/Submissions/Create', [
            'member' => ['name' => $member->name, 'acronym' => $member->acronym],
            'submission' => $this->formatSubmission($submission),
        ]);
    }

    public function update(MemberSubmissionRequest $request, MemberSubmission $submission): RedirectResponse
    {
        $member = $request->user()->memberOrganization;
        abort_unless($member && $submission->member_organization_id === $member->id, 404);

        $data = $request->validated();
        $documentPath = $submission->document_path;
        $originalFilename = $submission->original_filename;

        if (($data['submission_type'] ?? null) === 'text') {
            $this->deleteDocument($submission);
            $documentPath = null;
            $originalFilename = null;
        }

        if ($request->hasFile('document')) {
            $this->deleteDocument($submission);
            $documentPath = $request->file('document')->store('member-submissions', 'public');
            $originalFilename = $request->file('document')->getClientOriginalName();
        }

        $submission->update([
            'title' => $data['title'],
            'submission_type' => $data['submission_type'],
            'body' => $data['submission_type'] === 'text' ? ($data['body'] ?? null) : null,
            'document_path' => $documentPath,
            'original_filename' => $originalFilename,
            'status' => 'pending',
            'admin_note' => null,
            'is_public' => false,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        return redirect()->route('member.submissions.index')->with('success', 'Submission updated and sent for admin approval.');
    }

    public function destroy(Request $request, MemberSubmission $submission): RedirectResponse
    {
        $member = $request->user()->memberOrganization;
        abort_unless($member && $submission->member_organization_id === $member->id, 404);

        $this->deleteDocument($submission);
        $submission->delete();

        return redirect()->route('member.submissions.index')->with('success', 'Submission deleted.');
    }

    private function formatSubmission(MemberSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'title' => $submission->title,
            'submission_type' => $submission->submission_type,
            'status' => $submission->status,
            'admin_note' => $submission->admin_note,
            'is_public' => $submission->is_public,
            'body' => $submission->body,
            'document_url' => $submission->document_path ? asset("storage/{$submission->document_path}") : null,
            'original_filename' => $submission->original_filename,
            'created_at' => $submission->created_at?->format('M d, Y'),
            'approved_at' => $submission->approved_at?->format('M d, Y'),
        ];
    }

    private function deleteDocument(MemberSubmission $submission): void
    {
        if ($submission->document_path) {
            Storage::disk('public')->delete($submission->document_path);
        }
    }
}
