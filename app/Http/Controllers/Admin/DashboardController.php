<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\HeroSection;
use App\Models\HomepageStat;
use App\Models\LeadershipProfile;
use App\Models\MediaAlbum;
use App\Models\MediaItem;
use App\Models\MemberOrganization;
use App\Models\NewsPost;
use App\Models\Partner;
use App\Models\PartnershipRequest;
use App\Models\Program;
use App\Models\ResourceItem;
use App\Models\User;
use App\Models\VisitorLog;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = request()->user();

        return Inertia::render('Admin/Dashboard/Index', [
            'cards' => $this->cards($user),
            'quickActions' => $this->quickActions($user),
            'sections' => $this->sections($user),
        ]);
    }

    private function cards(User $user): array
    {
        return collect([
            ['permission' => 'manage hero section', 'label' => 'Hero', 'value' => HeroSection::query()->exists() ? 'Ready' : 'Draft', 'href' => '/admin/hero-section', 'icon' => 'Sparkles', 'meta' => 'Homepage lead'],
            ['permission' => 'manage homepage stats', 'label' => 'Stats', 'value' => HomepageStat::count(), 'href' => '/admin/stats', 'icon' => 'BarChart3', 'meta' => 'Impact numbers'],
            ['permission' => 'manage programs', 'label' => 'Programs', 'value' => Program::count(), 'href' => '/admin/programs', 'icon' => 'BriefcaseBusiness', 'meta' => 'Public programs'],
            ['permission' => 'manage news', 'label' => 'Updates', 'value' => NewsPost::count(), 'href' => '/admin/news', 'icon' => 'Newspaper', 'meta' => 'Activities'],
            ['permission' => 'manage announcements', 'label' => 'Announcements', 'value' => Announcement::count(), 'href' => '/admin/announcements', 'icon' => 'Megaphone', 'meta' => 'Public notices'],
            ['permission' => 'manage resources', 'label' => 'Publications', 'value' => ResourceItem::count(), 'href' => '/admin/resources', 'icon' => 'LibraryBig', 'meta' => 'Reports and documents'],
            ['permission' => 'manage media', 'label' => 'Gallery', 'value' => MediaItem::count(), 'href' => '/admin/media', 'icon' => 'Images', 'meta' => MediaAlbum::count().' albums'],
            ['permission' => 'manage members', 'label' => 'Members', 'value' => MemberOrganization::count(), 'href' => '/admin/members', 'icon' => 'UsersRound', 'meta' => 'OPD profiles'],
            ['permission' => 'manage leadership profiles', 'label' => 'Leadership', 'value' => $this->leadershipProfileCount(), 'href' => '/admin/leadership-profiles', 'icon' => 'UsersRound', 'meta' => 'Profiles'],
            ['permission' => 'manage partners', 'label' => 'Partners', 'value' => Partner::count(), 'href' => '/admin/partners', 'icon' => 'Handshake', 'meta' => 'Organizations'],
            ['permission' => 'manage contact messages', 'label' => 'Messages', 'value' => ContactMessage::count(), 'href' => '/admin/contact-messages', 'icon' => 'Inbox', 'meta' => 'Contact inbox'],
            ['permission' => 'manage donations', 'label' => 'Donations', 'value' => Donation::count(), 'href' => '/admin/donations', 'icon' => 'HeartHandshake', 'meta' => 'Support requests'],
            ['permission' => 'manage partnership requests', 'label' => 'Requests', 'value' => PartnershipRequest::count(), 'href' => '/admin/partnership-requests', 'icon' => 'FileCheck2', 'meta' => 'Partnership leads'],
            ['permission' => 'manage visitor analytics', 'label' => 'Visitors', 'value' => $this->visitorMonthCount(), 'href' => '/admin/visitors', 'icon' => 'BarChart3', 'meta' => 'This month'],
            ['permission' => 'manage users', 'label' => 'Users', 'value' => User::where('role', '!=', 'member')->count(), 'href' => '/admin/users', 'icon' => 'ShieldCheck', 'meta' => 'Team access'],
        ])->filter(fn (array $card) => $user->can($card['permission']))->values()->all();
    }

    private function quickActions(User $user): array
    {
        return collect([
            ['permission' => 'manage news', 'label' => 'Add Update', 'href' => '/admin/news/create', 'icon' => 'Newspaper'],
            ['permission' => 'manage announcements', 'label' => 'Add Announcement', 'href' => '/admin/announcements/create', 'icon' => 'Megaphone'],
            ['permission' => 'manage resources', 'label' => 'Add Publication', 'href' => '/admin/resources/create', 'icon' => 'LibraryBig'],
            ['permission' => 'manage media', 'label' => 'Add Photo/Video', 'href' => '/admin/media/create', 'icon' => 'ImagePlus'],
            ['permission' => 'manage media', 'label' => 'Create Album', 'href' => '/admin/media-albums/create', 'icon' => 'FolderPlus'],
            ['permission' => 'manage programs', 'label' => 'Add Program', 'href' => '/admin/programs/create', 'icon' => 'BriefcaseBusiness'],
            ['permission' => 'manage members', 'label' => 'Add Member', 'href' => '/admin/members/create', 'icon' => 'UserPlus'],
            ['permission' => 'manage leadership profiles', 'label' => 'Add Profile', 'href' => '/admin/leadership-profiles/create', 'icon' => 'UsersRound'],
            ['permission' => 'manage contact messages', 'label' => 'Open Messages', 'href' => '/admin/contact-messages', 'icon' => 'Inbox'],
            ['permission' => 'manage visitor analytics', 'label' => 'View Visitors', 'href' => '/admin/visitors', 'icon' => 'BarChart3'],
        ])->filter(fn (array $action) => $user->can($action['permission']))->take(6)->values()->all();
    }

    private function sections(User $user): array
    {
        return collect([
            $user->can('manage homepage stats') ? [
                'title' => 'Active Homepage Stats',
                'href' => '/admin/stats',
                'items' => HomepageStat::active()->ordered()->take(5)->get()->map(fn (HomepageStat $stat) => [
                    'id' => $stat->id,
                    'title' => $stat->label,
                    'meta' => $stat->value,
                ]),
            ] : null,
            $user->can('manage news') ? [
                'title' => 'Latest Updates',
                'href' => '/admin/news',
                'items' => NewsPost::latest('published_at')->take(5)->get()->map(fn (NewsPost $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'meta' => $post->status,
                ]),
            ] : null,
            $user->can('manage announcements') ? [
                'title' => 'Announcements',
                'href' => '/admin/announcements',
                'items' => Announcement::ordered()->take(5)->get()->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'meta' => $announcement->status,
                ]),
            ] : null,
            $user->can('manage resources') ? [
                'title' => 'Knowledge & Resources',
                'href' => '/admin/resources',
                'items' => ResourceItem::ordered()->take(5)->get()->map(fn (ResourceItem $resource) => [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'meta' => (ResourceItem::CATEGORIES[$resource->category] ?? $resource->category).' · '.$resource->status,
                ]),
            ] : null,
            $user->can('manage programs') ? [
                'title' => 'Programs',
                'href' => '/admin/programs',
                'items' => Program::ordered()->take(5)->get()->map(fn (Program $program) => [
                    'id' => $program->id,
                    'title' => $program->title,
                    'meta' => $program->is_active ? 'active' : 'hidden',
                ]),
            ] : null,
            $user->can('manage contact messages') ? [
                'title' => 'Recent Contact Messages',
                'href' => '/admin/contact-messages',
                'items' => ContactMessage::latest()->take(5)->get()->map(fn (ContactMessage $message) => [
                    'id' => $message->id,
                    'title' => $message->name,
                    'meta' => $message->subject ?: $message->email,
                ]),
            ] : null,
            $user->can('manage donations') ? [
                'title' => 'Recent Donations',
                'href' => '/admin/donations',
                'items' => Donation::latest()->take(5)->get()->map(fn (Donation $donation) => [
                    'id' => $donation->id,
                    'title' => $donation->donor_name,
                    'meta' => "{$donation->currency} {$donation->amount} · {$donation->status}",
                ]),
            ] : null,
            $user->can('manage partnership requests') ? [
                'title' => 'Recent Partnerships',
                'href' => '/admin/partnership-requests',
                'items' => PartnershipRequest::latest()->take(5)->get()->map(fn (PartnershipRequest $request) => [
                    'id' => $request->id,
                    'title' => $request->organization_name,
                    'meta' => str_replace('_', ' ', "{$request->partnership_type} · {$request->status}"),
                ]),
            ] : null,
            $user->can('manage visitor analytics') ? [
                'title' => 'Recent Website Visits',
                'href' => '/admin/visitors',
                'items' => $this->recentVisitorLogs()->map(fn (VisitorLog $visit) => [
                    'id' => $visit->id,
                    'title' => $visit->path,
                    'meta' => ($visit->device_type ?: 'unknown').' · '.$visit->visited_at?->diffForHumans(),
                ]),
            ] : null,
        ])->filter()->values()->all();
    }

    private function visitorMonthCount(): int
    {
        try {
            return VisitorLog::where('visited_at', '>=', now()->startOfMonth())->count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function leadershipProfileCount(): int
    {
        try {
            return LeadershipProfile::count();
        } catch (\Throwable) {
            return 0;
        }
    }

    private function recentVisitorLogs()
    {
        try {
            return VisitorLog::latest('visited_at')->take(5)->get();
        } catch (\Throwable) {
            return collect();
        }
    }
}
