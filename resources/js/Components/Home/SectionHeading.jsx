export default function SectionHeading({ eyebrow, title, children, align = 'left' }) {
    return (
        <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title mt-3">{title}</h2>
            {children ? <p className="section-copy mt-5">{children}</p> : null}
        </div>
    );
}
