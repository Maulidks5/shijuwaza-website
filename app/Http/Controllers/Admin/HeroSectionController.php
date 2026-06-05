<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HeroSectionRequest;
use App\Models\HeroSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/HeroSection/Edit', [
            'hero' => $this->payload($this->hero()),
        ]);
    }

    public function update(HeroSectionRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $hero = $this->hero();
        $data['is_active'] = $request->boolean('is_active');
        $data['focus_items'] = $this->focusItems($data['focus_items'] ?? []);
        $data['slides'] = $this->slides($request, $hero->slides ?? []);

        $hero->update($data);

        return back()->with('success', 'Hero section updated.');
    }

    private function hero(): HeroSection
    {
        return HeroSection::query()->firstOrCreate([], $this->defaults());
    }

    private function payload(HeroSection $hero): array
    {
        return [
            ...$hero->toArray(),
            'slides' => collect($hero->slides ?? [])->map(fn (array $slide) => [
                ...$slide,
                'image_url' => $this->imageUrl($slide['image'] ?? null),
            ])->values()->all(),
        ];
    }

    private function focusItems(array $items): array
    {
        return collect($items)
            ->map(fn (array $item) => [
                'label' => $item['label'] ?? '',
                'icon' => $item['icon'] ?? 'Landmark',
            ])
            ->filter(fn (array $item) => filled($item['label']))
            ->take(3)
            ->values()
            ->all();
    }

    private function slides(HeroSectionRequest $request, array $currentSlides): array
    {
        return collect($request->input('slides', []))
            ->map(function (array $slide, int $index) use ($request, $currentSlides): array {
                $image = $slide['image'] ?? ($currentSlides[$index]['image'] ?? null);

                if ($request->hasFile("slides.{$index}.image_file")) {
                    if ($image && ! str_starts_with($image, '/')) {
                        Storage::disk('public')->delete($image);
                    }

                    $image = $request->file("slides.{$index}.image_file")->store('hero', 'public');
                }

                return [
                    'image' => $image,
                    'alt' => $slide['alt'] ?? '',
                    'label' => $slide['label'] ?? '',
                    'title' => $slide['title'] ?? '',
                ];
            })
            ->filter(fn (array $slide) => filled($slide['image']) || filled($slide['label']) || filled($slide['title']))
            ->take(4)
            ->values()
            ->all();
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : asset("storage/{$path}");
    }

    private function defaults(): array
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
                ['image' => '/images/activities/shijuwaza-training-08.jpeg', 'alt' => 'SHIJUWAZA representative speaking during an organizational meeting in Zanzibar', 'label' => 'Advocacy leadership', 'title' => 'OPD voices shaping public decisions'],
                ['image' => '/images/activities/shijuwaza-training-05.jpeg', 'alt' => 'SHIJUWAZA annual meeting with members and partners in Zanzibar', 'label' => 'Organizational accountability', 'title' => 'Partners and members working together for inclusion'],
                ['image' => '/images/activities/shijuwaza-training-06.jpeg', 'alt' => 'SHIJUWAZA staff participating in a capacity-building session', 'label' => 'Capacity building', 'title' => 'Strengthening skills for sustainable OPD leadership'],
                ['image' => '/images/activities/shijuwaza-training-01.jpeg', 'alt' => 'Participants in conversation during a SHIJUWAZA community dialogue', 'label' => 'Inclusive dialogue', 'title' => 'Creating space for participation and shared action'],
            ],
            'is_active' => true,
        ];
    }
}
