<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\LeadershipProfile;
use App\Models\MediaAlbum;
use App\Models\MediaItem;
use App\Models\MemberSubmission;
use App\Models\NewsPost;
use App\Models\Partner;
use App\Models\Program;
use App\Models\ResourceItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('Public/About', [
            'profileGroups' => $this->leadershipProfiles(),
        ]);
    }

    public function programs(): Response
    {
        return Inertia::render('Public/Programs', [
            'programs' => Program::active()->ordered()->get()->map(fn (Program $program) => $this->formatProgram($program)),
        ]);
    }

    public function programShow(Program $program): Response
    {
        abort_unless($program->is_active, 404);

        return Inertia::render('Public/ProgramShow', [
            'program' => $this->formatProgram($program),
            'relatedPrograms' => Program::active()
                ->whereKeyNot($program->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn (Program $item) => $this->formatProgram($item)),
        ]);
    }

    public function news(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $search = $request->string('search')->toString();

        $posts = NewsPost::published()
            ->when($category, fn ($query) => $query->where('category', $category))
            ->when($search, fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            }))
            ->ordered()
            ->paginate(9)
            ->through(fn (NewsPost $post) => $this->formatNewsPost($post))
            ->withQueryString();

        return Inertia::render('Public/News', [
            'posts' => $posts,
            'featuredPost' => $posts->items()[0] ?? null,
            'categories' => NewsPost::CATEGORIES,
            'filters' => [
                'category' => $category,
                'search' => $search,
            ],
        ]);
    }

    public function newsShow(NewsPost $newsPost): Response
    {
        abort_unless($newsPost->status === 'published', 404);

        return Inertia::render('Public/NewsShow', [
            'post' => [
                ...$this->formatNewsPost($newsPost),
            ],
            'relatedPosts' => NewsPost::published()
                ->whereKeyNot($newsPost->id)
                ->where('category', $newsPost->category)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn (NewsPost $post) => $this->formatNewsPost($post)),
        ]);
    }

    public function media(): Response
    {
        return Inertia::render('Public/Media', [
            'items' => MediaItem::active()->ordered()->get()->map(fn (MediaItem $item) => [
                ...$item->toArray(),
                'image_url' => $this->imageUrl($item->image),
            ]),
        ]);
    }

    public function gallery(): Response
    {
        $featured = MediaItem::active()
            ->where('type', 'image')
            ->whereNotNull('image')
            ->where('is_featured', true)
            ->ordered()
            ->first();

        return Inertia::render('Public/Gallery', [
            'featured' => $featured ? $this->formatGalleryImage($featured) : null,
            'albums' => $this->galleryAlbums(),
            'currentAlbum' => null,
            'images' => MediaItem::active()
                ->with('album')
                ->where('type', 'image')
                ->whereNotNull('image')
                ->ordered()
                ->paginate(12)
                ->through(fn (MediaItem $item) => $this->formatGalleryImage($item)),
        ]);
    }

    public function galleryAlbum(MediaAlbum $album): Response
    {
        abort_unless($album->is_active, 404);

        $featured = $album->mediaItems()
            ->active()
            ->where('type', 'image')
            ->whereNotNull('image')
            ->where('is_featured', true)
            ->ordered()
            ->first();

        $featured ??= $album->mediaItems()
            ->active()
            ->where('type', 'image')
            ->whereNotNull('image')
            ->ordered()
            ->first();

        return Inertia::render('Public/Gallery', [
            'featured' => $featured ? $this->formatGalleryImage($featured) : null,
            'albums' => $this->galleryAlbums(),
            'currentAlbum' => [
                'name' => $album->name,
                'slug' => $album->slug,
                'description' => $album->description,
            ],
            'images' => $album->mediaItems()
                ->active()
                ->with('album')
                ->where('type', 'image')
                ->whereNotNull('image')
                ->ordered()
                ->paginate(12)
                ->through(fn (MediaItem $item) => $this->formatGalleryImage($item)),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact');
    }

    public function whistleBlowers(): Response
    {
        return Inertia::render('Public/WhistleBlowers');
    }

    public function announcements(): Response
    {
        return Inertia::render('Public/Announcements', [
            'announcements' => Announcement::published()
                ->ordered()
                ->paginate(9)
                ->through(fn (Announcement $announcement) => $this->formatAnnouncement($announcement)),
        ]);
    }

    public function announcementShow(Announcement $announcement): Response
    {
        abort_unless($announcement->status === 'published' && $announcement->published_at && $announcement->published_at->isPast(), 404);

        return Inertia::render('Public/AnnouncementShow', [
            'announcement' => $this->formatAnnouncement($announcement),
            'relatedAnnouncements' => Announcement::published()
                ->whereKeyNot($announcement->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn (Announcement $item) => $this->formatAnnouncement($item)),
        ]);
    }

    public function reports(): Response
    {
        return $this->resourcePage('report', 'Reports', 'Organizational reports and program documents', 'Reports, accountability documents, and program summaries are organized here for partners, donors, and stakeholders.');
    }

    public function newsletters(): Response
    {
        return $this->resourcePage('newsletter', 'Quarterly Newsletters', 'Updates from SHIJUWAZA programs and members', 'Quarterly newsletters share highlights from advocacy, training, OPD collaboration, and organizational progress.');
    }

    public function strategicPlan(): Response
    {
        return $this->resourcePage('strategic_plan', 'Strategic Plan', 'SHIJUWAZA direction and priorities', 'Strategic documents explain SHIJUWAZA priorities, organizational direction, and long-term outcomes.');
    }

    public function articles(): Response
    {
        return $this->resourcePage('article_success_story', 'Articles & Success Stories', 'Stories of inclusion, leadership, and change', 'Read articles and success stories from SHIJUWAZA advocacy, capacity building, and inclusion work.');
    }

    public function resourceShow(ResourceItem $resourceItem): Response
    {
        abort_unless($resourceItem->status === 'published' && $resourceItem->published_at && $resourceItem->published_at->isPast(), 404);

        return Inertia::render('Public/ResourceShow', [
            'resource' => $this->formatResource($resourceItem),
            'relatedResources' => ResourceItem::published()
                ->category($resourceItem->category)
                ->whereKeyNot($resourceItem->id)
                ->ordered()
                ->take(3)
                ->get()
                ->map(fn (ResourceItem $resource) => $this->formatResource($resource)),
        ]);
    }

    public function membersPortal(): Response
    {
        return Inertia::render('Public/MembersPortal');
    }

    public function memberUpdates(): Response
    {
        return Inertia::render('Public/MemberUpdates', [
            'updates' => MemberSubmission::query()
                ->with('memberOrganization:id,name,acronym,slug')
                ->approvedPublic()
                ->latest('approved_at')
                ->paginate(12)
                ->through(fn (MemberSubmission $submission) => [
                    'id' => $submission->id,
                    'title' => $submission->title,
                    'type' => $submission->submission_type,
                    'body' => $submission->body,
                    'excerpt' => str($submission->body ?: $submission->original_filename ?: 'Approved member update')->limit(180)->toString(),
                    'document_url' => $this->imageUrl($submission->document_path),
                    'approved_at' => $submission->approved_at?->format('M d, Y'),
                    'member' => [
                        'name' => $submission->memberOrganization?->name,
                        'acronym' => $submission->memberOrganization?->acronym,
                        'slug' => $submission->memberOrganization?->slug,
                    ],
                ]),
        ]);
    }

    public function partners(): Response
    {
        return Inertia::render('Public/Partners', [
            'partners' => Partner::active()->ordered()->get(),
        ]);
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : asset("storage/{$path}");
    }

    private function resourcePage(string $category, string $eyebrow, string $title, string $copy): Response
    {
        return Inertia::render('Public/ResourcePage', [
            'eyebrow' => $eyebrow,
            'title' => $title,
            'copy' => $copy,
            'items' => ResourceItem::published()
                ->category($category)
                ->ordered()
                ->paginate(9)
                ->through(fn (ResourceItem $resource) => $this->formatResource($resource)),
        ]);
    }

    private function formatResource(ResourceItem $resource): array
    {
        return [
            ...$resource->toArray(),
            'category_label' => ResourceItem::CATEGORIES[$resource->category] ?? $resource->category,
            'description' => $resource->excerpt,
            'cover_image_url' => $this->imageUrl($resource->cover_image),
            'file_url' => $this->imageUrl($resource->file_path),
            'published_label' => $resource->published_at?->format('F j, Y'),
            'href' => $resource->file_path ? $this->imageUrl($resource->file_path) : route('resources.show', $resource->slug),
        ];
    }

    private function formatAnnouncement(Announcement $announcement): array
    {
        return [
            ...$announcement->toArray(),
            'description' => $announcement->excerpt,
            'document_url' => $this->imageUrl($announcement->document_path),
            'published_label' => $announcement->published_at?->format('F j, Y'),
            'href' => route('announcements.show', $announcement->slug),
        ];
    }

    private function formatProgram(Program $program): array
    {
        return [
            ...$program->toArray(),
            'image_url' => $this->imageUrl($program->image),
            'href' => route('programs.show', $program->slug),
        ];
    }

    private function formatGalleryImage(MediaItem $item): array
    {
        return [
            ...$item->toArray(),
            'image_url' => $this->imageUrl($item->image),
            'album' => $item->album ? [
                'name' => $item->album->name,
                'slug' => $item->album->slug,
            ] : null,
            'caption' => $item->description ?: 'SHIJUWAZA activity photo documenting inclusion, participation, and organizational work.',
        ];
    }

    private function formatNewsPost(NewsPost $post): array
    {
        return [
            ...$post->toArray(),
            'image_url' => $this->imageUrl($post->featured_image),
            'category_label' => NewsPost::CATEGORIES[$post->category] ?? $post->category,
            'date_label' => $post->activity_date?->format('F j, Y') ?: $post->published_at?->format('F j, Y'),
            'published_label' => $post->published_at?->format('F j, Y'),
        ];
    }

    private function galleryAlbums()
    {
        return MediaAlbum::active()
            ->withCount(['mediaItems' => fn ($query) => $query->active()->where('type', 'image')->whereNotNull('image')])
            ->ordered()
            ->get()
            ->map(fn (MediaAlbum $album) => [
                'id' => $album->id,
                'name' => $album->name,
                'slug' => $album->slug,
                'description' => $album->description,
                'count' => $album->media_items_count,
                'href' => route('gallery.album', $album->slug),
            ]);
    }

    private function leadershipProfiles(): array
    {
        try {
            $profiles = LeadershipProfile::active()
                ->ordered()
                ->get()
                ->map(fn (LeadershipProfile $profile) => [
                    ...$profile->toArray(),
                    'category_label' => LeadershipProfile::CATEGORIES[$profile->category] ?? $profile->category,
                    'photo_url' => $this->imageUrl($profile->photo),
                    'children' => [],
                ])
                ->groupBy('category');
        } catch (\Throwable) {
            $profiles = collect();
        }

        return collect(LeadershipProfile::CATEGORIES)
            ->map(fn (string $label, string $key) => [
                'key' => $key,
                'label' => $label,
                'profiles' => $this->profileTree($profiles->get($key, collect())),
            ])
            ->values()
            ->all();
    }

    private function profileTree($profiles): array
    {
        $items = collect($profiles)->map(fn (array $profile) => [
            ...$profile,
            'children' => [],
        ]);
        $byParent = $items->groupBy(fn (array $profile) => $profile['parent_profile_id'] ?: 'root');
        $ids = $items->pluck('id')->all();

        $build = function ($parentId, array $visited = []) use (&$build, $byParent): array {
            return collect($byParent->get($parentId, []))
                ->reject(fn (array $profile) => in_array($profile['id'], $visited, true))
                ->sortBy(fn (array $profile) => [
                    'left' => 0,
                    'down' => 1,
                    'right' => 2,
                ][$profile['tree_position'] ?? 'down'] ?? 1)
                ->map(fn (array $profile) => [
                    ...$profile,
                    'children' => $build($profile['id'], [...$visited, $profile['id']]),
                ])
                ->values()
                ->all();
        };

        $roots = $items
            ->filter(fn (array $profile) => ! $profile['parent_profile_id'] || ! in_array($profile['parent_profile_id'], $ids, true))
            ->pluck('id')
            ->all();

        return $items
            ->whereIn('id', $roots)
            ->sortBy(fn (array $profile) => [
                'left' => 0,
                'down' => 1,
                'right' => 2,
            ][$profile['tree_position'] ?? 'down'] ?? 1)
            ->map(fn (array $profile) => [
                ...$profile,
                'children' => $build($profile['id']),
            ])
            ->values()
            ->all();
    }
}
