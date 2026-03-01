import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const port = Number(process.env.PORT || 3001);

const supportEmail = process.env.SUPPORT_EMAIL || 'support@factoresearch.com';
const fromName = process.env.SMTP_FROM_NAME || 'Facto Research';
const fromEmail = process.env.SMTP_FROM_EMAIL || supportEmail;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin || allowedOrigins.length === 0) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    try {
        const { hostname } = new URL(origin);
        return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.netlify.app');
    } catch {
        return false;
    }
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(null, false);
    },
    optionsSuccessStatus: 204,
};

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHtml = (value) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

const buildSubmission = (payload) => {
    const formType = normalizeText(payload.formType) || 'general';
    const name = normalizeText(payload.name);
    const email = normalizeText(payload.email).toLowerCase();
    const phone = normalizeText(payload.phone);
    const message = normalizeText(payload.message);
    const service = normalizeText(payload.service);
    const pageUrl = normalizeText(payload.pageUrl);

    if (!name || !email || !phone) {
        return { error: 'Name, email, and phone are required.' };
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
        return { error: 'Please provide a valid email address.' };
    }

    return {
        formType,
        name,
        email,
        phone,
        message,
        service,
        pageUrl,
    };
};

const buildSubject = (submission) => {
    switch (submission.formType) {
        case 'advice':
            return `Advice Request - ${submission.name}`;
        case 'chat':
            return `Chat Enquiry - ${submission.name}`;
        case 'contact':
            return `New Enquiry - ${submission.service || 'General'}`;
        default:
            return `Website Enquiry - ${submission.name}`;
    }
};

const buildTextBody = (submission) =>
    [
        `Form Type: ${submission.formType}`,
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        `Phone: ${submission.phone}`,
        submission.service ? `Service: ${submission.service}` : null,
        submission.pageUrl ? `Page URL: ${submission.pageUrl}` : null,
        '',
        'Message:',
        submission.message || 'No message provided.',
    ]
        .filter(Boolean)
        .join('\n');

const buildHtmlBody = (submission) => {
    const rows = [
        ['Form Type', submission.formType],
        ['Name', submission.name],
        ['Email', submission.email],
        ['Phone', submission.phone],
        submission.service ? ['Service', submission.service] : null,
        submission.pageUrl ? ['Page URL', submission.pageUrl] : null,
    ]
        .filter(Boolean)
        .map(
            ([label, value]) =>
                `<tr><td style="padding:8px 12px;font-weight:600;border:1px solid #dbe2ea;">${escapeHtml(
                    label
                )}</td><td style="padding:8px 12px;border:1px solid #dbe2ea;">${escapeHtml(value)}</td></tr>`
        )
        .join('');

    return `
        <div style="font-family:Arial,sans-serif;color:#0f172a;">
            <h2 style="margin-bottom:16px;">New website enquiry</h2>
            <table style="border-collapse:collapse;margin-bottom:16px;">${rows}</table>
            <h3 style="margin:0 0 8px;">Message</h3>
            <p style="margin:0;white-space:pre-wrap;">${escapeHtml(submission.message || 'No message provided.')}</p>
        </div>
    `;
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
    const submission = buildSubmission(req.body || {});

    if (submission.error) {
        res.status(400).json({ ok: false, error: submission.error });
        return;
    }

    try {
        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: supportEmail,
            replyTo: submission.email,
            subject: buildSubject(submission),
            text: buildTextBody(submission),
            html: buildHtmlBody(submission),
        });

        res.json({ ok: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Mail send failed', error);
        res.status(500).json({ ok: false, error: 'Unable to send email right now.' });
    }
});

app.listen(port, () => {
    console.log(`Mail API listening on port ${port}`);
});
