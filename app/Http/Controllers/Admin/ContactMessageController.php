<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        $status = request('status', 'all');

        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => ContactMessage::query()
                ->when($status !== 'all', fn ($query) => $query->where('status', $status))
                ->latest()
                ->get(),
            'filters' => ['status' => $status],
        ]);
    }

    public function update(Request $request, ContactMessage $contactMessage): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['unread', 'read', 'replied', 'archived'])],
        ]);

        $contactMessage->update($data);

        return back()->with('success', 'Message status updated.');
    }

    public function show(ContactMessage $contactMessage): Response
    {
        if ($contactMessage->status === 'unread') {
            $contactMessage->update(['status' => 'read']);
            $contactMessage->refresh();
        }

        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $contactMessage->delete();

        return back()->with('success', 'Message deleted.');
    }
}
