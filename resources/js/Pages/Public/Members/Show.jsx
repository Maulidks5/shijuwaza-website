import { useState } from 'react';
import { Link } from '@inertiajs/react';
import SeoHead from '../../../Components/Public/SeoHead';
import { ArrowLeft, Building2, Download, FileText, Globe2, Mail, MapPin, Phone } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';
import PageHero from '../../../Components/Public/PageHero';
import PortalLoginButton from '../../../Components/Public/PortalLoginButton';
import MemberUpdateTextModal from '../../../Components/Public/MemberUpdateTextModal';

export default function MembersShow({ member, updates = [] }) {
    const updateItems = updates.data || updates;
    const [openUpdate, setOpenUpdate] = useState(null);

    return (
        <PublicLayout>
            <SeoHead title={member.name} description={member.description || 'SHIJUWAZA member OPD profile and approved updates.'} image={member.logo_url} />
            <PageHero eyebrow={member.acronym || 'Member OPD'} title={member.name} />

            <section className="bg-white py-16 lg:py-20">
                <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                    <aside className="self-start rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            {member.logo_url ? (
                                <img src={member.logo_url} alt={`${member.name} logo`} className="h-16 w-16 rounded-2xl border border-[#5BAFCB]/10 object-cover" />
                            ) : (
                                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F3FBFD] text-[#5BAFCB]">
                                    <Building2 aria-hidden="true" size={28} />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5BAFCB]">{member.acronym || 'Member OPD'}</p>
                                <h2 className="mt-1 text-xl font-black text-[#245E73]">Member profile</h2>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 text-slate-700">
                            {member.location ? <InfoRow icon={MapPin} value={member.location} /> : null}
                            {member.email ? <InfoRow icon={Mail} value={member.email} href={`mailto:${member.email}`} /> : null}
                            {member.phone ? <InfoRow icon={Phone} value={member.phone} href={`tel:${member.phone.replaceAll(' ', '')}`} /> : null}
                            {member.website_url ? <InfoRow icon={Globe2} value={formatWebsiteLabel(member.website_url)} href={member.website_url} external /> : null}
                        </div>

                        <Link href="/members" className="mt-7 inline-flex items-center gap-2 font-black text-[#5BAFCB]">
                            <ArrowLeft aria-hidden="true" size={17} />
                            Back to members
                        </Link>
                    </aside>

                    <div className="grid gap-8">
                        <article className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="eyebrow">About the member</p>
                                    <h2 className="mt-3 text-3xl font-black text-[#245E73]">Organization profile</h2>
                                </div>
                                {member.acronym ? (
                                    <span className="inline-flex self-start rounded-full bg-[#F3FBFD] px-4 py-2 text-sm font-black text-[#245E73]">
                                        {member.acronym}
                                    </span>
                                ) : null}
                            </div>
                            <div className="mt-6 border-l-4 border-[#9DD8EA] pl-5">
                                <p className="text-lg leading-8 text-slate-600">
                                    {member.description || 'This member profile will be updated with approved organization information.'}
                                </p>
                            </div>
                        </article>

                        <article className="rounded-2xl border border-[#5BAFCB]/10 bg-[#F8FAFC] p-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                                <div>
                                    <p className="eyebrow">Approved updates</p>
                                    <h2 className="mt-3 text-3xl font-black text-[#245E73]">Documents and text updates</h2>
                                </div>
                                <PortalLoginButton className="btn-secondary">Member Portal</PortalLoginButton>
                            </div>

                            <div className="mt-8 grid gap-4">
                                {updateItems.length ? updateItems.map((update) => (
                                    <article key={update.id} className="rounded-2xl border border-[#5BAFCB]/10 bg-white p-5 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3FBFD] text-[#5BAFCB]">
                                                {update.document_url ? <Download aria-hidden="true" size={21} /> : <FileText aria-hidden="true" size={21} />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-[#245E73]">{update.title}</h3>
                                                <p className="mt-2 leading-7 text-slate-600">{update.excerpt}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            {update.document_url ? (
                                                <a href={update.document_url} target="_blank" rel="noreferrer" className="font-black text-[#5BAFCB]">Open Document</a>
                                            ) : update.body ? (
                                                <button type="button" onClick={() => setOpenUpdate(update)} className="font-black text-[#5BAFCB]">Read Text</button>
                                            ) : null}
                                        </div>
                                    </article>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-[#5BAFCB]/20 bg-white p-6">
                                        <h3 className="text-xl font-black text-[#245E73]">No approved updates yet</h3>
                                        <p className="mt-3 leading-7 text-slate-600">
                                            Documents and text updates submitted by this member will appear here after admin approval.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {updates.links?.length > 3 ? (
                                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[#5BAFCB]/10 pt-6">
                                    {updates.links.map((link, index) => (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                                                link.active
                                                    ? 'bg-[#5BAFCB] text-white shadow-sm'
                                                    : 'bg-white text-slate-700 hover:bg-[#F3FBFD] hover:text-[#245E73]'
                                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </article>
                    </div>
                </div>
            </section>
            <MemberUpdateTextModal update={openUpdate} onClose={() => setOpenUpdate(null)} />
        </PublicLayout>
    );
}

function InfoRow({ icon: Icon, value, href, external = false }) {
    const content = (
        <>
            <Icon aria-hidden="true" size={18} className="shrink-0 text-[#5BAFCB]" />
            <span className="min-w-0 break-words">{value}</span>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="flex items-center gap-3 hover:text-[#5BAFCB]"
            >
                {content}
            </a>
        );
    }

    return <p className="flex items-center gap-3">{content}</p>;
}

function formatWebsiteLabel(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}
