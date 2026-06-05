import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

import SectionHeading from './SectionHeading';

const faqs = [
    {
        question: 'What is SHIJUWAZA?',
        answer: 'SHIJUWAZA is the Zanzibar Organization of Persons with Disabilities Federation. It brings together Organizations of Persons with Disabilities (OPDs) across Zanzibar to promote, protect, and advocate for the rights, inclusion, dignity, and meaningful participation of persons with disabilities in all aspects of society.',
    },
    {
        question: 'What are the main areas of work for SHIJUWAZA?',
        answer: 'SHIJUWAZA works across disability rights advocacy, inclusive policy engagement, OPD capacity strengthening, research, community empowerment, media literacy, and stakeholder coordination.',
        points: [
            'Disability rights advocacy and inclusion',
            'Policy engagement and legal reforms',
            'Education and awareness raising',
            'Capacity strengthening for OPDs',
            'Data and research on disability inclusion',
            'Gender, youth, and community empowerment',
            'Media and digital literacy initiatives',
            'Partnership building and stakeholder coordination',
        ],
    },
    {
        question: 'How does SHIJUWAZA support persons with disabilities?',
        answer: 'SHIJUWAZA supports persons with disabilities by strengthening their voices, advocating for inclusive systems, improving access to information, and building collaboration between OPDs and stakeholders.',
        points: [
            'Amplifying voices in decision-making spaces',
            'Advocating for inclusive laws and policies',
            'Facilitating access to information and opportunities',
            'Promoting disability-inclusive development programs',
            'Strengthening collaboration between OPDs and stakeholders',
            'Encouraging public awareness and community engagement',
        ],
    },
    {
        question: 'How can organizations partner with SHIJUWAZA?',
        answer: 'Organizations, development partners, institutions, and individuals can collaborate with SHIJUWAZA through joint programs, advocacy, research, training, outreach, and technical or financial support.',
        points: [
            'Joint programs and advocacy campaigns',
            'Technical and financial support',
            'Research and innovation initiatives',
            'Community outreach and awareness activities',
            'Capacity-building and training opportunities',
        ],
    },
    {
        question: 'How are donations and support utilized?',
        answer: 'Support received by SHIJUWAZA contributes to disability inclusion initiatives, OPD strengthening, advocacy activities, research and data systems, and empowerment efforts for persons with disabilities throughout Zanzibar.',
    },
    {
        question: 'How can I contact SHIJUWAZA?',
        answer: 'Individuals and organizations can reach SHIJUWAZA through official communication channels, including email, phone contacts, social media platforms, and the official website for inquiries, partnerships, and engagement opportunities.',
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="bg-white py-14 lg:py-20">
            <div className="section-shell">
                <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
                    <div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9DD8EA] text-[#173B49]">
                            <HelpCircle aria-hidden="true" size={24} />
                        </div>
                        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions">
                            Clear answers about SHIJUWAZA, disability inclusion, partnerships, and support.
                        </SectionHeading>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            <FaqStat value="6" label="Key questions" />
                            <FaqStat value="OPDs" label="Membership focus" />
                            <FaqStat value="Unguja & Pemba" label="Community reach" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={faq.question}
                                    className="overflow-hidden rounded-xl border border-[#9DD8EA]/45 bg-[#F3FBFD] shadow-sm transition hover:border-[#7CC8DE] sm:rounded-2xl"
                                >
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-black text-[#173B49] sm:gap-4 sm:px-6 sm:text-base"
                                        aria-expanded={isOpen}
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                    >
                                        <span className="flex min-w-0 items-start gap-3">
                                            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-[#245E73] ring-1 ring-[#9DD8EA]/45">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="min-w-0">{faq.question}</span>
                                        </span>
                                        <ChevronDown
                                            aria-hidden="true"
                                            size={20}
                                            className={`shrink-0 text-[#245E73] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isOpen ? (
                                        <div className="border-t border-[#9DD8EA]/35 bg-white px-5 py-4 text-sm leading-7 text-slate-700 sm:px-6 sm:text-base">
                                            <p>{faq.answer}</p>
                                            {faq.points?.length ? (
                                                <ul className="mt-4 grid gap-2">
                                                    {faq.points.map((point) => (
                                                        <li key={point} className="flex gap-2">
                                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#5BAFCB]" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FaqStat({ value, label }) {
    return (
        <div className="rounded-2xl border border-[#9DD8EA]/35 bg-[#F3FBFD] p-4">
            <p className="text-lg font-black text-[#173B49]">{value}</p>
            <p className="mt-1 text-sm font-bold text-[#245E73]">{label}</p>
        </div>
    );
}
