<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\HeroSection;
use App\Models\HomepageStat;
use App\Models\MediaItem;
use App\Models\MemberSubmission;
use App\Models\NewsPost;
use App\Models\Partner;
use App\Models\Program;
use App\Models\ResourceItem;
use App\Models\SiteSetting;
use App\Models\VisitorLog;
use App\Support\PublicUploads;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'hero' => $this->hero(),
            'stats' => $this->stats(),
            'programs' => $this->programs(),
            'newsPosts' => $this->newsPosts(),
            'announcements' => $this->announcements(),
            'memberUpdates' => $this->memberUpdates(),
            'resources' => $this->resources(),
            'mediaItems' => $this->mediaItems(),
            'partners' => $this->partners(),
            'settings' => $this->settings(),
        ]);
    }

    private function hero(): array
    {
        try {
            $hero = HeroSection::query()->where('is_active', true)->first();
        } catch (\Throwable) {
            $hero = null;
        }

        if (! $hero) {
            return $this->fallbackHero();
        }

        return [
            ...$hero->toArray(),
            'slides' => collect($hero->slides ?? [])->map(fn (array $slide) => [
                ...$slide,
                'image_url' => $this->imageUrl($slide['image'] ?? null),
            ])->values()->all(),
        ];
    }

    private function stats(): Collection
    {
        try {
            $items = HomepageStat::active()->ordered()->take(4)->get();
        } catch (\Throwable) {
            $items = collect();
        }

        $stats = $items->isNotEmpty() ? $items : collect([
            ['label' => 'Member OPDs', 'value' => '20+', 'description' => 'Organizations represented', 'icon' => 'UsersRound'],
            ['label' => 'Trainings Conducted', 'value' => '45+', 'description' => 'Leadership and inclusion sessions', 'icon' => 'GraduationCap'],
            ['label' => 'Advocacy Engagements', 'value' => '80+', 'description' => 'Policy and community dialogues', 'icon' => 'Megaphone'],
            ['label' => 'Community Reach', 'value' => '12k+', 'description' => 'People reached through programs', 'icon' => 'BarChart3'],
        ]);

        $visitorStat = $this->visitorStat();

        return $visitorStat ? $stats->push($visitorStat) : $stats;
    }

    private function visitorStat(): ?array
    {
        try {
            $visits = VisitorLog::count();
        } catch (\Throwable) {
            return null;
        }

        if ($visits < 1) {
            return null;
        }

        return [
            'label' => 'People reached online',
            'value' => number_format($visits).'+',
            'description' => 'Website visits and digital engagement',
            'icon' => 'BarChart3',
        ];
    }

    private function programs(): Collection
    {
        try {
            $items = Program::active()->ordered()->take(4)->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return $items->isNotEmpty() ? $items : collect([
            ['title' => 'Advocacy & Rights Promotion', 'short_description' => 'Championing disability rights, inclusive policy dialogue, and stronger participation in public decision-making.', 'icon' => 'Landmark'],
            ['title' => 'Capacity Building & Training', 'short_description' => 'Strengthening OPD leadership, governance, communication, accountability, and organizational resilience.', 'icon' => 'Presentation'],
            ['title' => 'Inclusive Development', 'short_description' => 'Supporting organizations and communities to design programs that include persons with disabilities from the start.', 'icon' => 'Network'],
            ['title' => 'Partnerships & Collaboration', 'short_description' => 'Building trusted relationships with government, media, civil society, and development partners.', 'icon' => 'Handshake'],
        ]);
    }

    private function newsPosts(): Collection
    {
        try {
            $items = NewsPost::published()
                ->latest('published_at')
                ->take(6)
                ->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return ($items->isNotEmpty() ? $items : collect([
            ['date' => 'April 2026', 'title' => 'Staff capacity building strengthens accountable program delivery', 'excerpt' => 'A practical training session focused on inclusive planning, transparent reporting, and coordinated support for member OPDs.', 'featured_image' => '/images/activities/shijuwaza-training-06.jpeg'],
            ['date' => 'March 2026', 'title' => 'Dialogue advances accountability in disability-inclusive development', 'excerpt' => 'Stakeholders explored ways to make services, budgets, and community programs more responsive to persons with disabilities.', 'featured_image' => '/images/activities/shijuwaza-training-01.jpeg'],
            ['date' => 'February 2026', 'title' => 'Journalist engagement promotes respectful disability reporting', 'excerpt' => 'Media professionals joined OPD representatives to strengthen public communication on rights, dignity, and inclusion.', 'featured_image' => '/images/activities/shijuwaza-training-04.jpeg'],
        ]))->map(function ($post) {
            $data = is_array($post) ? $post : $post->toArray();

            return [
                ...$data,
                'image_url' => $this->imageUrl($data['featured_image'] ?? null),
                'category_label' => is_array($post) ? ($data['category_label'] ?? 'Activity') : (NewsPost::CATEGORIES[$post->category] ?? 'Activity'),
                'date_label' => $data['date'] ?? $post->activity_date?->format('F Y') ?? $post->published_at?->format('F Y'),
            ];
        });
    }

    private function announcements(): Collection
    {
        try {
            return Announcement::published()
                ->ordered()
                ->take(6)
                ->get()
                ->map(fn (Announcement $announcement) => $this->formatAnnouncement($announcement));
        } catch (\Throwable) {
            return collect();
        }
    }

    private function mediaItems(): Collection
    {
        try {
            $items = MediaItem::active()->ordered()->take(6)->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return ($items->isNotEmpty() ? $items : collect([
            ['title' => 'Training workshop', 'image' => '/images/activities/shijuwaza-training-02.jpeg', 'is_featured' => false],
            ['title' => 'Community dialogue', 'image' => '/images/activities/shijuwaza-training-07.jpeg', 'is_featured' => false],
            ['title' => 'Partner visit', 'image' => '/images/activities/shijuwaza-training-03.jpeg', 'is_featured' => false],
            ['title' => 'Advocacy forum', 'image' => '/images/activities/shijuwaza-training-04.jpeg', 'is_featured' => false],
            ['title' => 'Featured story', 'image' => '/images/activities/shijuwaza-training-08.jpeg', 'is_featured' => true],
        ]))->map(function ($item) {
            $data = is_array($item) ? $item : $item->toArray();

            return [
                ...$data,
                'image_url' => $this->imageUrl($data['image'] ?? null),
            ];
        });
    }

    private function memberUpdates(): Collection
    {
        try {
            return MemberSubmission::query()
                ->with('memberOrganization:id,name,acronym,slug')
                ->approvedPublic()
                ->latest('approved_at')
                ->take(6)
                ->get()
                ->map(fn (MemberSubmission $submission) => $this->formatMemberUpdate($submission));
        } catch (\Throwable) {
            return collect();
        }
    }

    private function resources(): Collection
    {
        try {
            $items = ResourceItem::published()
                ->ordered()
                ->take(8)
                ->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return $items->map(fn (ResourceItem $resource) => $this->formatResource($resource));
    }

    private function partners(): Collection
    {
        try {
            $items = Partner::active()->ordered()->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return ($items->isNotEmpty() ? $items : collect([
            ['name' => 'Government Institutions'],
            ['name' => 'Civil Society Organizations'],
            ['name' => 'Media Partners'],
            ['name' => 'Development Partners'],
            ['name' => 'OPD Network'],
            ['name' => 'Community Organizations'],
        ]))->map(function ($partner) {
            $data = is_array($partner) ? $partner : $partner->toArray();

            return [
                ...$data,
                'logo_url' => $this->imageUrl($data['logo'] ?? null),
                'website_url' => $data['website_url'] ?? null,
            ];
        });
    }

    private function settings(): array
    {
        try {
            $settings = SiteSetting::pluck('value', 'key')->all();
        } catch (\Throwable) {
            $settings = [];
        }

        return [
            'email' => $settings['site_email'] ?? 'info@shijuwaza.or.tz',
            'phone' => $settings['site_phone'] ?? '+255 000 000 000',
            'location' => $settings['site_location'] ?? 'Zanzibar, Tanzania',
            'organization_email' => $settings['organization_email'] ?? $settings['site_email'] ?? 'info@shijuwaza.or.tz',
            'organization_phone' => $settings['organization_phone'] ?? $settings['site_phone'] ?? '+255 000 000 000',
            'organization_location' => $settings['organization_location'] ?? $settings['site_location'] ?? 'Zanzibar, Tanzania',
            'office_hours' => $settings['office_hours'] ?? 'Monday to Friday, 9:00 AM - 5:00 PM',
            'facebook_url' => $settings['facebook_url'] ?? 'https://web.facebook.com/profile.php?id=100090167520147',
            'instagram_url' => $settings['instagram_url'] ?? 'https://www.instagram.com/shijuwaza_znz?igsh=cGE1NGVjZXNrM2F5',
            'linkedin_url' => $settings['linkedin_url'] ?? 'https://www.linkedin.com/in/shijuwaza-znz-952712374/',
            'youtube_url' => $settings['youtube_url'] ?? 'https://www.youtube.com/@znz_shijuwaza',
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return PublicUploads::url($path);
    }

    private function formatMemberUpdate(MemberSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'title' => $submission->title,
            'type' => $submission->submission_type,
            'body' => $submission->body,
            'excerpt' => str($submission->body ?: $submission->original_filename ?: 'Approved member update')->limit(150)->toString(),
            'document_url' => $this->imageUrl($submission->document_path),
            'approved_at' => $submission->approved_at?->format('M d, Y'),
            'member' => [
                'name' => $submission->memberOrganization?->name,
                'acronym' => $submission->memberOrganization?->acronym,
                'slug' => $submission->memberOrganization?->slug,
            ],
        ];
    }

    private function formatResource(ResourceItem $resource): array
    {
        return [
            'id' => $resource->id,
            'title' => $resource->title,
            'slug' => $resource->slug,
            'category' => $resource->category,
            'category_label' => ResourceItem::CATEGORIES[$resource->category] ?? $resource->category,
            'excerpt' => $resource->excerpt,
            'file_url' => $this->imageUrl($resource->file_path),
            'href' => $resource->file_path ? $this->imageUrl($resource->file_path) : route('resources.show', $resource->slug),
            'published_at' => $resource->published_at?->format('M d, Y'),
        ];
    }

    private function formatAnnouncement(Announcement $announcement): array
    {
        return [
            'id' => $announcement->id,
            'title' => $announcement->title,
            'excerpt' => $announcement->excerpt,
            'href' => route('announcements.show', $announcement->slug),
            'document_url' => $this->imageUrl($announcement->document_path),
            'published_at' => $announcement->published_at?->format('M d, Y'),
        ];
    }

    private function fallbackHero(): array
    {
        return [
            'eyebrow' => 'Uniting OPDs since 2014',
            'title' => 'Advancing Disability Rights and Inclusion in Zanzibar',
            'subtitle' => 'SHIJUWAZA is a federation of Disabled People Organizations empowering OPDs, promoting equal participation, and strengthening accountability for disability-inclusive development.',
            'primary_button_text' => 'Learn More',
            'primary_button_url' => '#about-us',
            'secondary_button_text' => 'Our Programs',
            'secondary_button_url' => '#programs',
            'quote' => 'Nothing About Us Without Us',
            'established_year' => '2014',
            'established_label' => 'Federation established',
            'focus_items' => [
                ['label' => 'OPD-led advocacy', 'icon' => 'Landmark'],
                ['label' => 'Capacity building', 'icon' => 'UsersRound'],
                ['label' => 'Inclusive partnerships', 'icon' => 'HandHeart'],
            ],
            'slides' => [
                ['image_url' => '/images/activities/shijuwaza-training-08.jpeg', 'alt' => 'SHIJUWAZA representative speaking during an organizational meeting in Zanzibar', 'label' => 'Advocacy leadership', 'title' => 'OPD voices shaping public decisions'],
                ['image_url' => '/images/activities/shijuwaza-training-05.jpeg', 'alt' => 'SHIJUWAZA annual meeting with members and partners in Zanzibar', 'label' => 'Organizational accountability', 'title' => 'Partners and members working together for inclusion'],
                ['image_url' => '/images/activities/shijuwaza-training-06.jpeg', 'alt' => 'SHIJUWAZA staff participating in a capacity-building session', 'label' => 'Capacity building', 'title' => 'Strengthening skills for sustainable OPD leadership'],
                ['image_url' => '/images/activities/shijuwaza-training-01.jpeg', 'alt' => 'Participants in conversation during a SHIJUWAZA community dialogue', 'label' => 'Inclusive dialogue', 'title' => 'Creating space for participation and shared action'],
            ],
        ];
    }
}
