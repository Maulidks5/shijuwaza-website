import SeoHead from '../../Components/Public/SeoHead';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Partners({ partners = [] }) {
    return (
        <PublicLayout>
            <SeoHead title="Partners" description="Explore SHIJUWAZA partner relationships supporting disability-inclusive development, accountability, and OPD-led action." />
            <section className="bg-white py-20">
                <div className="section-shell">
                    <p className="eyebrow">Partners</p>
                    <h1 className="section-title mt-3">Working with organizations that believe inclusion strengthens society</h1>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {partners.map((partner) => (
                            <article key={partner.id} className="surface-card rounded-2xl p-6">
                                <h2 className="text-xl font-black text-[#245E73]">{partner.name}</h2>
                                {partner.description ? <p className="mt-3 leading-7 text-slate-600">{partner.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
