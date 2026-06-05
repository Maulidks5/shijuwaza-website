<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCmsUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResourceItemRequest;
use App\Models\ResourceItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\Process\Process;

class ResourceItemController extends Controller
{
    use HandlesCmsUploads;

    private const PDF_TARGET_BYTES = 2 * 1024 * 1024;

    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $status = $request->string('status')->toString();

        return Inertia::render('Admin/Resources/Index', [
            'resources' => ResourceItem::query()
                ->when($category, fn ($query) => $query->where('category', $category))
                ->when($status, fn ($query) => $query->where('status', $status))
                ->ordered()
                ->get()
                ->map(fn (ResourceItem $resource) => $this->formatResource($resource)),
            'categories' => ResourceItem::CATEGORIES,
            'filters' => [
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Resources/Form', [
            'resource' => null,
            'categories' => ResourceItem::CATEGORIES,
        ]);
    }

    public function store(ResourceItemRequest $request): RedirectResponse
    {
        $data = $this->payload($request);
        $data['cover_image'] = $this->storeImage($request, 'cover_image', 'resources/covers');
        $data['file_path'] = $this->storeFile($request, 'file_path', 'resources/documents');

        ResourceItem::create($data);

        return redirect()->route('admin.resources.index')->with('success', 'Resource created.');
    }

    public function edit(ResourceItem $resource): Response
    {
        return Inertia::render('Admin/Resources/Form', [
            'resource' => $this->formatResource($resource),
            'categories' => ResourceItem::CATEGORIES,
        ]);
    }

    public function update(ResourceItemRequest $request, ResourceItem $resource): RedirectResponse
    {
        $data = $this->payload($request, $resource);
        $data['cover_image'] = $this->replaceImage($request, $resource, 'cover_image', 'resources/covers');
        $data['file_path'] = $this->replaceFile($request, $resource, 'file_path', 'resources/documents');

        $resource->update($data);

        return redirect()->route('admin.resources.index')->with('success', 'Resource updated.');
    }

    public function destroy(ResourceItem $resource): RedirectResponse
    {
        abort_unless(request()->user()?->hasRole('Super Admin'), 403);

        $this->deleteStoredPath($resource->cover_image);
        $this->deleteStoredPath($resource->file_path);
        $resource->delete();

        return back()->with('success', 'Resource removed permanently.');
    }

    public function archive(ResourceItem $resource): RedirectResponse
    {
        abort_unless(request()->user()?->can('manage visibility'), 403);

        $resource->update(['status' => 'archived']);

        return back()->with('success', 'Resource archived.');
    }

    private function payload(ResourceItemRequest $request, ?ResourceItem $resource = null): array
    {
        $data = $request->safe()->except(['cover_image', 'file_path']);
        $slug = $data['slug'] ?: Str::slug($data['title']);

        if (($data['status'] ?? null) === 'archived' && ! $request->user()?->can('manage visibility')) {
            abort(403);
        }

        return [
            ...$data,
            'slug' => $this->uniqueSlug($slug, $resource?->id),
            'external_url' => null,
            'sort_order' => $request->integer('sort_order'),
            'is_featured' => $request->boolean('is_featured'),
        ];
    }

    private function storeFile(Request $request, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        $file = $request->file($field);

        if ($this->isPdf($file)) {
            return $this->storeCompressedPdf($file, $field, $directory);
        }

        return $file->store($directory, 'public');
    }

    private function replaceFile(Request $request, ResourceItem $resource, string $field, string $directory): ?string
    {
        if (! $request->hasFile($field)) {
            return $resource->{$field};
        }

        $path = $this->storeFile($request, $field, $directory);

        $this->deleteStoredPath($resource->{$field});

        return $path;
    }

    private function storeCompressedPdf(UploadedFile $file, string $field, string $directory): string
    {
        if ($file->getSize() <= self::PDF_TARGET_BYTES) {
            return $file->store($directory, 'public');
        }

        $ghostscript = $this->ghostscriptBinary();

        if (! $ghostscript) {
            throw ValidationException::withMessages([
                $field => 'PDF compression is not available on this server. Please install Ghostscript or upload a PDF smaller than 2MB.',
            ]);
        }

        $temporaryDirectory = storage_path('app/pdf-compression');
        File::ensureDirectoryExists($temporaryDirectory);

        $outputPath = $temporaryDirectory.'/'.Str::uuid().'.pdf';
        $settings = ['/ebook', '/screen'];
        $compressed = false;

        foreach ($settings as $setting) {
            File::delete($outputPath);

            $process = new Process([
                $ghostscript,
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.4',
                "-dPDFSETTINGS={$setting}",
                '-dNOPAUSE',
                '-dQUIET',
                '-dBATCH',
                "-sOutputFile={$outputPath}",
                $file->getRealPath(),
            ]);
            $process->setTimeout(90);
            $process->run();

            if ($process->isSuccessful() && File::exists($outputPath) && File::size($outputPath) <= self::PDF_TARGET_BYTES) {
                $compressed = true;
                break;
            }
        }

        if (! $compressed) {
            File::delete($outputPath);

            throw ValidationException::withMessages([
                $field => 'The PDF could not be compressed below 2MB. Please reduce image quality/pages and upload again.',
            ]);
        }

        Storage::disk('public')->makeDirectory($directory);

        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'document';
        $path = $directory.'/'.$filename.'-'.Str::random(10).'.pdf';
        File::copy($outputPath, Storage::disk('public')->path($path));
        File::delete($outputPath);

        return $path;
    }

    private function ghostscriptBinary(): ?string
    {
        foreach (['/usr/bin/gs', '/usr/local/bin/gs', '/opt/homebrew/bin/gs'] as $candidate) {
            if (is_executable($candidate)) {
                return $candidate;
            }
        }

        $process = new Process(['which', 'gs']);
        $process->run();

        if ($process->isSuccessful()) {
            $binary = trim($process->getOutput());

            return $binary !== '' ? $binary : null;
        }

        return null;
    }

    private function isPdf(UploadedFile $file): bool
    {
        return strtolower($file->getClientOriginalExtension()) === 'pdf'
            || $file->getMimeType() === 'application/pdf';
    }

    private function deleteStoredPath(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug ?: 'resource';
        $candidate = $base;
        $counter = 2;

        while (ResourceItem::where('slug', $candidate)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    private function formatResource(ResourceItem $resource): array
    {
        return [
            ...$resource->toArray(),
            'category_label' => ResourceItem::CATEGORIES[$resource->category] ?? $resource->category,
            'cover_image_url' => $this->assetUrl($resource->cover_image),
            'file_url' => $this->assetUrl($resource->file_path),
            'published_label' => $resource->published_at?->format('M d, Y'),
        ];
    }

    private function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : asset("storage/{$path}");
    }
}
