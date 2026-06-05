<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Models\Announcement;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\MemberSubmission;
use App\Models\PartnershipRequest;
use App\Models\WhistleblowerReport;
use App\Support\PublicUploads;
use App\Support\UiTranslations;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $roles = $user?->getRoleNames() ?? collect();

        if ($user?->isSuperAdmin() && ! $roles->contains('Super Admin')) {
            $roles = $roles->push('Super Admin');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'avatar_url' => PublicUploads::url($user->avatar),
                    'role' => $user->role,
                    'roles' => $roles->values(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'adminNotifications' => fn () => $this->adminNotifications($request),
            'siteSettings' => fn () => $this->siteSettings(),
            'siteAnnouncements' => fn () => $this->siteAnnouncements(),
            'i18n' => [
                'locale' => app()->getLocale(),
                'supported' => ['en', 'sw'],
                'messages' => UiTranslations::get(app()->getLocale()),
            ],
        ];
    }

    private function adminNotifications(Request $request): array
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            return ['total' => 0, 'items' => [], 'badges' => []];
        }

        $definitions = [
            [
                'permission' => 'manage contact messages',
                'key' => 'contact_messages',
                'label' => 'Unread contact messages',
                'href' => '/admin/contact-messages?status=unread',
                'badgeHref' => '/admin/contact-messages',
                'count' => fn () => ContactMessage::where('status', 'unread')->count(),
            ],
            [
                'permission' => 'manage donations',
                'key' => 'donations',
                'label' => 'Pending donations',
                'href' => '/admin/donations?status=pending',
                'badgeHref' => '/admin/donations',
                'count' => fn () => Donation::whereIn('status', ['pending', 'instructions_sent'])->count(),
            ],
            [
                'permission' => 'manage partnership requests',
                'key' => 'partnership_requests',
                'label' => 'New partnership requests',
                'href' => '/admin/partnership-requests?status=new',
                'badgeHref' => '/admin/partnership-requests',
                'count' => fn () => PartnershipRequest::where('status', 'new')->count(),
            ],
            [
                'permission' => 'manage whistleblower reports',
                'key' => 'whistleblower_reports',
                'label' => 'New confidential reports',
                'href' => '/admin/whistleblower-reports?status=new',
                'badgeHref' => '/admin/whistleblower-reports',
                'count' => fn () => WhistleblowerReport::where('status', 'new')->count(),
            ],
            [
                'permission' => 'manage member submissions',
                'key' => 'member_submissions',
                'label' => 'Pending member submissions',
                'href' => '/admin/member-submissions?status=pending',
                'badgeHref' => '/admin/member-submissions',
                'count' => fn () => MemberSubmission::where('status', 'pending')->count(),
            ],
        ];

        $items = collect($definitions)
            ->filter(fn (array $item) => $user->hasRole('Super Admin') || $user->can($item['permission']))
            ->map(function (array $item) {
                try {
                    $count = (int) $item['count']();
                } catch (\Throwable) {
                    $count = 0;
                }

                return [
                    'key' => $item['key'],
                    'label' => $item['label'],
                    'href' => $item['href'],
                    'badgeHref' => $item['badgeHref'],
                    'count' => $count,
                ];
            })
            ->filter(fn (array $item) => $item['count'] > 0)
            ->values();

        return [
            'total' => $items->sum('count'),
            'items' => $items->all(),
            'badges' => $items->mapWithKeys(fn (array $item) => [$item['badgeHref'] => $item['count']])->all(),
        ];
    }

    private function siteSettings(): array
    {
        $fallback = [
            'email' => 'info@shijuwaza.or.tz',
            'phone' => '+255 000 000 000',
            'whatsapp_number' => '+255 716 110 270',
            'location' => 'Zanzibar, Tanzania',
            'office_hours' => 'Monday to Friday, 9:00 AM - 5:00 PM',
            'facebook_url' => 'https://web.facebook.com/profile.php?id=100090167520147',
            'instagram_url' => 'https://www.instagram.com/shijuwaza_znz?igsh=cGE1NGVjZXNrM2F5',
            'linkedin_url' => 'https://www.linkedin.com/in/shijuwaza-znz-952712374/',
            'youtube_url' => 'https://www.youtube.com/@znz_shijuwaza',
        ];

        try {
            $settings = SiteSetting::pluck('value', 'key')->all();
        } catch (\Throwable) {
            return $fallback;
        }

        return [
            'email' => $settings['site_email'] ?? $fallback['email'],
            'phone' => $settings['site_phone'] ?? $fallback['phone'],
            'whatsapp_number' => $settings['whatsapp_number'] ?? $fallback['whatsapp_number'],
            'location' => $settings['site_location'] ?? $fallback['location'],
            'organization_email' => $settings['organization_email'] ?? $settings['site_email'] ?? $fallback['email'],
            'organization_phone' => $settings['organization_phone'] ?? $settings['site_phone'] ?? $fallback['phone'],
            'organization_location' => $settings['organization_location'] ?? $settings['site_location'] ?? $fallback['location'],
            'office_hours' => $settings['office_hours'] ?? $fallback['office_hours'],
            'facebook_url' => $settings['facebook_url'] ?? $fallback['facebook_url'],
            'instagram_url' => $settings['instagram_url'] ?? $fallback['instagram_url'],
            'linkedin_url' => $settings['linkedin_url'] ?? $fallback['linkedin_url'],
            'youtube_url' => $settings['youtube_url'] ?? $fallback['youtube_url'],
        ];
    }

    private function siteAnnouncements(): array
    {
        try {
            return Announcement::published()
                ->ordered()
                ->take(6)
                ->get()
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'excerpt' => $announcement->excerpt,
                    'href' => route('announcements.show', $announcement->slug),
                    'published_at' => $announcement->published_at?->format('M d, Y'),
                ])
                ->all();
        } catch (\Throwable) {
            return [];
        }
    }
}
