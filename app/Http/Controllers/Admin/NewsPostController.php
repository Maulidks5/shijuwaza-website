<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsPostRequest;
use App\Models\MediaAlbum;
use App\Models\MediaItem;
use App\Models\NewsPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsPostController extends Controller
{
    use HandlesCmsUploads;

    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/News/Index', [
            'posts' => NewsPost::query()
                ->when($category, fn ($query) => $query->where('category', $category))
                ->when($status, fn ($query) => $query->where('status', $status))
                ->orderBy('sort_order')
                ->latest('created_at')
                ->get()
                ->map(fn (NewsPost $post) => $this->formatPost($post)),
            'categories' => NewsPost::CATEGORIES,
            'filters' => [
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/News/Form', [
            'post' => null,
            'categories' => NewsPost::CATEGORIES,
            'relatedLinkTypes' => NewsPost::RELATED_LINK_TYPES,
        ]);
    }

    public function store(NewsPostRequest $request): RedirectResponse
    {
        $this->ensureRelatedLinkColumns();
        $this->ensureMediaGalleryColumns();

        $data = $this->payload($request);
        $data['featured_image'] = $this->storeImage($request, 'featured_image', 'news');

        $news = NewsPost::create($data);

        $this->syncGalleryImages($request, $news);

        return redirect()->route('admin.news.index')->with('success', 'Update created.');
    }

    public function edit(NewsPost $news): Response
    {
        return Inertia::render('Admin/News/Form', [
            'post' => $this->formatPost($news),
            'categories' => NewsPost::CATEGORIES,
            'relatedLinkTypes' => NewsPost::RELATED_LINK_TYPES,
        ]);
    }

    public function update(NewsPostRequest $request, NewsPost $news): RedirectResponse
    {
        $this->ensureRelatedLinkColumns();
        $this->ensureMediaGalleryColumns();

        $data = $this->payload($request, $news);
        $previousFeaturedImage = $news->featured_image;
        $data['featured_image'] = $this->replaceImage($request, $news, 'featured_image', 'news');

        $news->update($data);

        $this->syncGalleryImages($request, $news->fresh(), $previousFeaturedImage);

        return redirect()->route('admin.news.index')->with('success', 'Update saved.');
    }

    public function destroy(NewsPost $news): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $this->deletePublicUpload($news->featured_image);
        $news->galleryItems()->get()->each(function (MediaItem $item): void {
            $this->deletePublicUpload($item->image);
            $item->delete();
        });
        $news->delete();

        return back()->with('success', 'Update deleted.');
    }

    public function archive(NewsPost $news): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $news->update(['status' => 'archived']);
        MediaItem::where('news_post_id', $news->id)->update(['is_active' => false]);
        MediaAlbum::where('slug', 'update-'.$news->id)->update(['is_active' => false]);

        return back()->with('success', 'Update archived.');
    }

    private function payload(NewsPostRequest $request, ?NewsPost $post = null): array
    {
        $data = $request->safe()->except(['featured_image', 'gallery_photos']);
        $slug = $data['slug'] ?: Str::slug($data['title']);

        if (($data['status'] ?? null) === 'archived' && ! $request->user()?->can('manage visibility')) {
            abort(403);
        }

        if (($data['status'] ?? null) === 'published' && blank($data['published_at'] ?? null)) {
            $data['published_at'] = now();
        }

        if (blank($data['related_link_url'] ?? null)) {
            $data['related_link_type'] = null;
            $data['related_link_url'] = null;
            $data['related_link_label'] = null;
        } elseif (blank($data['related_link_type'] ?? null)) {
            $data['related_link_type'] = 'external';
        }

        return [
            ...$data,
            'slug' => $this->uniqueSlug($slug, $post?->id),
            'sort_order' => $request->integer('sort_order'),
        ];
    }

    private function ensureRelatedLinkColumns(): void
    {
        if (! Schema::hasTable('news_posts')) {
            return;
        }

        if (! Schema::hasColumn('news_posts', 'related_link_type')) {
            Schema::table('news_posts', function (Blueprint $table): void {
                $table->string('related_link_type')->nullable()->after('sort_order');
            });
        }

        if (! Schema::hasColumn('news_posts', 'related_link_url')) {
            Schema::table('news_posts', function (Blueprint $table): void {
                $table->string('related_link_url', 2048)->nullable()->after('related_link_type');
            });
        }

        if (! Schema::hasColumn('news_posts', 'related_link_label')) {
            Schema::table('news_posts', function (Blueprint $table): void {
                $table->string('related_link_label')->nullable()->after('related_link_url');
            });
        }
    }

    private function ensureMediaGalleryColumns(): void
    {
        if (! Schema::hasTable('media_items')) {
            return;
        }

        if (! Schema::hasColumn('media_items', 'news_post_id')) {
            Schema::table('media_items', function (Blueprint $table): void {
                $table->unsignedBigInteger('news_post_id')->nullable()->after('media_album_id');
            });
        }
    }

    private function syncGalleryImages(NewsPostRequest $request, NewsPost $news, ?string $previousFeaturedImage = null): void
    {
        $album = $this->galleryAlbumForUpdate($news);
        $isActive = $news->status === 'published';

        if ($previousFeaturedImage && $previousFeaturedImage !== $news->featured_image) {
            MediaItem::where('news_post_id', $news->id)
                ->where('image', $previousFeaturedImage)
                ->delete();
        }

        if ($news->featured_image) {
            MediaItem::updateOrCreate(
                [
                    'news_post_id' => $news->id,
                    'image' => $news->featured_image,
                ],
                [
                    'media_album_id' => $album->id,
                    'title' => $news->title,
                    'type' => 'image',
                    'video_url' => null,
                    'description' => $news->excerpt,
                    'sort_order' => 0,
                    'is_featured' => true,
                    'is_active' => $isActive,
                ]
            );
        }

        foreach ($request->file('gallery_photos', []) as $index => $photo) {
            $image = $this->storeImageFromFile($photo, 'media');

            MediaItem::create([
                'media_album_id' => $album->id,
                'news_post_id' => $news->id,
                'title' => $news->title.' Photo '.($index + 1),
                'type' => 'image',
                'image' => $image,
                'video_url' => null,
                'description' => $news->excerpt,
                'sort_order' => $index + 1,
                'is_featured' => false,
                'is_active' => $isActive,
            ]);
        }

        MediaItem::where('news_post_id', $news->id)->update([
            'media_album_id' => $album->id,
            'is_active' => $isActive,
        ]);
    }

    private function galleryAlbumForUpdate(NewsPost $news): MediaAlbum
    {
        return MediaAlbum::updateOrCreate(
            ['slug' => 'update-'.$news->id],
            [
                'name' => $news->title,
                'description' => $news->excerpt,
                'sort_order' => $news->sort_order,
                'is_active' => $news->status === 'published',
            ]
        );
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug ?: 'news-post';
        $candidate = $base;
        $counter = 2;

        while (NewsPost::where('slug', $candidate)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    private function formatPost(NewsPost $post): array
    {
        return [
            ...$post->toArray(),
            'category_label' => NewsPost::CATEGORIES[$post->category] ?? $post->category,
            'activity_date_value' => $post->activity_date?->format('Y-m-d'),
            'activity_date_label' => $post->activity_date?->format('M d, Y'),
            'published_label' => $post->published_at?->format('M d, Y'),
        ];
    }
}
