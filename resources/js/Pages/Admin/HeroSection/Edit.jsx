import { useForm } from '@inertiajs/react';
import { ImagePlus, Sparkles } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Field, inputClass, Toggle } from '../../../Components/Admin/FormControls';

const icons = ['Landmark', 'UsersRound', 'HandHeart'];

const emptySlide = { image: '', image_url: '', alt: '', label: '', title: '', image_file: null };

export default function HeroSectionEdit({ hero = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        eyebrow: hero.eyebrow || '',
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        primary_button_text: hero.primary_button_text || '',
        primary_button_url: hero.primary_button_url || '',
        secondary_button_text: hero.secondary_button_text || '',
        secondary_button_url: hero.secondary_button_url || '',
        quote: hero.quote || '',
        established_year: hero.established_year || '',
        established_label: hero.established_label || '',
        is_active: hero.is_active ?? true,
        focus_items: normalizeFocus(hero.focus_items),
        slides: normalizeSlides(hero.slides),
        _method: 'patch',
    });

    const updateFocus = (index, key, value) => {
        const focusItems = [...data.focus_items];
        focusItems[index] = { ...focusItems[index], [key]: value };
        setData('focus_items', focusItems);
    };

    const updateSlide = (index, key, value) => {
        const slides = [...data.slides];
        slides[index] = { ...slides[index], [key]: value };
        setData('slides', slides);
    };

    const submit = (event) => {
        event.preventDefault();
        post('/admin/hero-section', { forceFormData: true });
    };

    return (
        <AdminLayout title="Hero Section">
            <form onSubmit={submit} className="grid gap-6">
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#9DD8EA]">
                            <Sparkles aria-hidden="true" size={21} />
                        </span>
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Homepage Hero</p>
                            <h2 className="mt-1 text-2xl font-black text-[#245E73]">Manage the first impression of the website</h2>
                            <p className="mt-2 max-w-3xl font-semibold leading-7 text-slate-600">
                                Keep the message clear, organizational, and action-focused. Changes appear on the homepage immediately after saving.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <Field label="Eyebrow / Badge Text" error={errors.eyebrow}>
                            <input className={inputClass} value={data.eyebrow} onChange={(event) => setData('eyebrow', event.target.value)} />
                        </Field>
                        <Field label="Main Title" error={errors.title}>
                            <input className={inputClass} value={data.title} onChange={(event) => setData('title', event.target.value)} />
                        </Field>
                        <Field label="Subtitle" error={errors.subtitle}>
                            <textarea className={`${inputClass} min-h-32`} value={data.subtitle} onChange={(event) => setData('subtitle', event.target.value)} />
                        </Field>
                        <div className="grid gap-5">
                            <Field label="Quote / Highlight" error={errors.quote}>
                                <input className={inputClass} value={data.quote} onChange={(event) => setData('quote', event.target.value)} />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Established Year" error={errors.established_year}>
                                    <input className={inputClass} value={data.established_year} onChange={(event) => setData('established_year', event.target.value)} />
                                </Field>
                                <Field label="Established Label" error={errors.established_label}>
                                    <input className={inputClass} value={data.established_label} onChange={(event) => setData('established_label', event.target.value)} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <Field label="Primary Button Text" error={errors.primary_button_text}>
                            <input className={inputClass} value={data.primary_button_text} onChange={(event) => setData('primary_button_text', event.target.value)} />
                        </Field>
                        <Field label="Primary Button URL" error={errors.primary_button_url}>
                            <input className={inputClass} value={data.primary_button_url} onChange={(event) => setData('primary_button_url', event.target.value)} />
                        </Field>
                        <Field label="Secondary Button Text" error={errors.secondary_button_text}>
                            <input className={inputClass} value={data.secondary_button_text} onChange={(event) => setData('secondary_button_text', event.target.value)} />
                        </Field>
                        <Field label="Secondary Button URL" error={errors.secondary_button_url}>
                            <input className={inputClass} value={data.secondary_button_url} onChange={(event) => setData('secondary_button_url', event.target.value)} />
                        </Field>
                    </div>

                    <div className="mt-6">
                        <Toggle label="Show this hero section on the homepage" checked={data.is_active} onChange={(value) => setData('is_active', value)} />
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Focus Cards</p>
                    <h2 className="mt-2 text-xl font-black text-[#245E73]">Three short proof points</h2>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        {data.focus_items.map((item, index) => (
                            <div key={index} className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <Field label={`Focus ${index + 1} Label`} error={errors[`focus_items.${index}.label`]}>
                                    <input className={inputClass} value={item.label} onChange={(event) => updateFocus(index, 'label', event.target.value)} />
                                </Field>
                                <Field label="Icon" error={errors[`focus_items.${index}.icon`]}>
                                    <select className={inputClass} value={item.icon} onChange={(event) => updateFocus(index, 'icon', event.target.value)}>
                                        {icons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                                    </select>
                                </Field>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#9DD8EA]">Hero Slides</p>
                    <h2 className="mt-2 text-xl font-black text-[#245E73]">Images and captions for the right-side slideshow</h2>
                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        {data.slides.map((slide, index) => (
                            <div key={index} className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="overflow-hidden rounded-xl bg-slate-200">
                                    {slide.image_url ? (
                                        <img src={slide.image_url} alt="" className="h-52 w-full object-cover" />
                                    ) : (
                                        <div className="grid h-52 place-items-center text-slate-500">
                                            <ImagePlus aria-hidden="true" size={32} />
                                        </div>
                                    )}
                                </div>
                                <Field label={`Slide ${index + 1} Image`} error={errors[`slides.${index}.image_file`]}>
                                    <input type="file" accept="image/*" className={inputClass} onChange={(event) => updateSlide(index, 'image_file', event.target.files?.[0] || null)} />
                                </Field>
                                <input type="hidden" value={slide.image || ''} />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Small Label" error={errors[`slides.${index}.label`]}>
                                        <input className={inputClass} value={slide.label} onChange={(event) => updateSlide(index, 'label', event.target.value)} />
                                    </Field>
                                    <Field label="Image Alt Text" error={errors[`slides.${index}.alt`]}>
                                        <input className={inputClass} value={slide.alt} onChange={(event) => updateSlide(index, 'alt', event.target.value)} />
                                    </Field>
                                </div>
                                <Field label="Slide Title" error={errors[`slides.${index}.title`]}>
                                    <input className={inputClass} value={slide.title} onChange={(event) => updateSlide(index, 'title', event.target.value)} />
                                </Field>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <button disabled={processing} className="rounded-lg bg-[#9DD8EA] px-6 py-3 font-black text-[#173B49] shadow-sm hover:bg-[#7CC8DE] disabled:opacity-60">
                        {processing ? 'Saving...' : 'Save Hero Section'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

function normalizeFocus(items = []) {
    const fallback = [
        { label: 'OPD-led advocacy', icon: 'Landmark' },
        { label: 'Capacity building', icon: 'UsersRound' },
        { label: 'Inclusive partnerships', icon: 'HandHeart' },
    ];

    return [...items, ...fallback].slice(0, 3).map((item) => ({
        label: item.label || '',
        icon: item.icon || 'Landmark',
    }));
}

function normalizeSlides(slides = []) {
    return [...slides, emptySlide, emptySlide, emptySlide, emptySlide].slice(0, 4).map((slide) => ({
        image: slide.image || '',
        image_url: slide.image_url || slide.image || '',
        alt: slide.alt || '',
        label: slide.label || '',
        title: slide.title || '',
        image_file: null,
    }));
}
