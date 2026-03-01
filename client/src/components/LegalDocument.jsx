import React from 'react';
import { legalDocuments, sebiRiskDisclosure } from '../data/legalData';

const renderParagraphs = (paragraphs) => (
    paragraphs?.map((paragraph) => (
        <p key={paragraph} className="legal-paragraph">{paragraph}</p>
    ))
);

const renderBullets = (bullets) => (
    bullets?.length ? (
        <ul className="legal-list">
            {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
            ))}
        </ul>
    ) : null
);

const renderNumbered = (items) => (
    items?.length ? (
        <ol className="legal-list legal-list-ordered">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ol>
    ) : null
);

const LegalDocument = ({ documentKey }) => {
    const documentData = legalDocuments[documentKey];

    if (!documentData) {
        return null;
    }

    return (
        <div className="inner-page legal-page">
            <section className="page-header legal-header">
                <div className="container">
                    <div className="page-header-card glass-card">
                        <span className="page-header-eyebrow">Legal</span>
                        <h1 className="page-header-title">{documentData.title}</h1>
                        <p className="page-header-subtitle">{documentData.subtitle}</p>
                    </div>
                </div>
            </section>

            <section className="section-padding legal-section">
                <div className="container legal-container">
                    {documentData.warning && (
                        <article className="glass-card legal-card legal-warning-card">
                            <h3>Investment Risk Warning</h3>
                            <p>{documentData.warning}</p>
                        </article>
                    )}

                    {documentData.sections.map((section, sectionIndex) => (
                        <article
                            key={`${documentData.title}-${section.heading || sectionIndex}`}
                            className="glass-card legal-card"
                        >
                            {section.heading && <h3>{section.heading}</h3>}
                            {renderParagraphs(section.paragraphs)}
                            {renderBullets(section.bullets)}
                            {renderNumbered(section.numbered)}

                            {section.subSections?.map((subSection) => (
                                <div key={subSection.heading} className="legal-subsection">
                                    <h4>{subSection.heading}</h4>
                                    {renderParagraphs(subSection.paragraphs)}
                                    {renderBullets(subSection.bullets)}
                                    {renderNumbered(subSection.numbered)}
                                </div>
                            ))}
                        </article>
                    ))}

                    {documentData.contact && (
                        <article className="glass-card legal-card legal-contact-card">
                            <h3>{documentData.contact.title}</h3>
                            {documentData.contact.lines.map((line) => (
                                <p key={line} className="legal-paragraph">{line}</p>
                            ))}
                        </article>
                    )}

                    <article className="glass-card legal-card legal-risk-card">
                        <h3>SEBI Investment Risk Disclosure</h3>
                        <p>{sebiRiskDisclosure}</p>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default LegalDocument;
