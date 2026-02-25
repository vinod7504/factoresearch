import React from 'react';
import { complaintBoardData, sebiRiskDisclosure } from '../../data/legalData';

const ComplaintBoardPage = () => {
    const renderTable = (tableData) => (
        <div className="legal-table-wrapper">
            <table className="legal-table">
                <thead>
                    <tr>
                        {tableData.headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                        <tr key={`${row.join('-')}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                                <td key={`${cell}-${cellIndex}`}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="inner-page legal-page">
            <section className="page-header legal-header">
                <div className="container">
                    <div className="page-header-card glass-card">
                        <span className="page-header-eyebrow">Legal</span>
                        <h1 className="page-header-title">{complaintBoardData.title}</h1>
                        <p className="page-header-subtitle">Data for the month ending: {complaintBoardData.monthEnding}</p>
                    </div>
                </div>
            </section>

            <section className="section-padding legal-section">
                <div className="container legal-container">
                    <article className="glass-card legal-card legal-download-card">
                        <h3>Download</h3>
                        <p>Download the complaint board data file.</p>
                        <a className="btn-primary legal-download-btn" href="/documents/complaint-board-january-2026.csv" download>
                            Download
                        </a>
                    </article>

                    <article className="glass-card legal-card">
                        <h3>Data for the Month Ending: {complaintBoardData.monthEnding}</h3>
                        {renderTable(complaintBoardData.sourceTable)}
                    </article>

                    <article className="glass-card legal-card">
                        <h3>Trend of Monthly Disposal of Complaints</h3>
                        {renderTable(complaintBoardData.monthlyTrendTable)}
                    </article>

                    <article className="glass-card legal-card">
                        <h3>Trend of Annual Disposal of Complaints</h3>
                        {renderTable(complaintBoardData.annualTrendTable)}
                    </article>

                    <article className="glass-card legal-card legal-risk-card">
                        <h3>SEBI Investment Risk Disclosure</h3>
                        <p>{sebiRiskDisclosure}</p>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default ComplaintBoardPage;
