import React from "react";
import { useI18n } from "../i18n";

export default function PrivacyPolicy() {
  const { t } = useI18n();
  return (
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow my-8">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">This Privacy Policy explains how {t("header.brand")} collects, uses, and discloses information when you use our website.</p>

      <h2 className="font-semibold mt-4">Information We Collect</h2>
      <p>We may collect files you upload for processing. Uploaded files are processed securely and may be stored temporarily to perform the requested service.</p>

      <h2 className="font-semibold mt-4">Third-Party Services and Ads</h2>
      <p className="mb-4">We may use third-party services, including advertising networks such as Google AdSense, which may use cookies and similar technologies to display ads relevant to your interests. These third parties may collect information about your use of the site. For information about opting out of personalized advertising, please refer to the advertising network's privacy controls.</p>

      <h2 className="font-semibold mt-4">Cookies</h2>
      <p>We use cookies for analytics and to improve the user experience. You can manage cookie preferences through your browser settings.</p>

      <h2 className="font-semibold mt-4">Data Retention</h2>
      <p>Files uploaded for processing are retained only as necessary to complete processing and are removed according to our retention policy.</p>

      <h2 className="font-semibold mt-4">Contact</h2>
      <p>If you have questions about this policy, please contact us via the contact page.</p>
    </main>
  );
}
