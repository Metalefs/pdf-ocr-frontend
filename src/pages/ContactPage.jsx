import React from "react";
import { useI18n } from '../i18n';

export default function ContactPage() {
  const { t } = useI18n();
  const email = 'jackson.pires.rm@gmail.com';
  return (
    <main className="min-h-screen py-12" style={{ background: "var(--metro-bg)" }}>
      <div className="max-w-3xl mx-auto p-6 metro-surface my-8">
        <h1 className="metro-title text-4xl mb-4">Contact</h1>
      <p>If you need support or have questions, email us.</p>
      <p className="mt-4" dangerouslySetInnerHTML={{ __html: t('contact.partnerText', { email: `<a href=\"mailto:${email}\" class=\"text-sky-600 hover:underline\">${email}</a>` }) }} />
      </div>
    </main>
  );
}
