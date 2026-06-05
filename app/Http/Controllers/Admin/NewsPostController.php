<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsPostRequest;
use App\Models\NewsPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        ]);
    }

    public function store(NewsPostRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $data['featured_image'] = $this->storeImage($request, 'featured_image', 'news');

        NewsPost::create($data);

        return redirect()->route('admin.news.index')->with('success', 'Update created.');
    }

    public function edit(NewsPost $news): Response
    {
        return Inertia::render('Admin/News/Form', [
            'post' => $this->formatPost($news),
            'categories' => NewsPost::CATEGORIES,
        ]);
    }

    public function update(NewsPostRequest $request, NewsPost $news): RedirectResponse
    {
        $data = $this->payload($request, $news);
        $data['featured_image'] = $this->replaceImage($request, $news, 'featured_image', 'news');

        $news->update($data);

        return redirect()->route('admin.news.index')->with('success', 'Update saved.');
    }

    public function destroy(NewsPost $news): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $news->delete();

        return back()->with('success', 'Update deleted.');
    }

    public function archive(NewsPost $news): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $news->update(['status' => 'archived']);

        return back()->with('success', 'Update archived.');
    }

    private function payload(NewsPostRequest $request, ?NewsPost $post = null): array
    {
        $data = $request->safe()->except('featured_image');
        $slug = $data['slug'] ?: Str::slug($data['title']);

        if (($data['status'] ?? null) === 'archived' && ! $request->user()?->can('manage visibility')) {
            abort(403);
        }

        return [
            ...$data,
            'slug' => $this->uniqueSlug($slug, $post?->id),
            'sort_order' => $request->integer('sort_order'),
        ];
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
