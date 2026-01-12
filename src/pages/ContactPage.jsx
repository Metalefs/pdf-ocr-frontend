import React from "react";

export default function ContactPage() {
  return (
    <main className="min-h-screen  bg-slate-100 py-12">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow my-8">
        <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <p>If you need support or have questions, email us at <a href="mailto:jackson.pires.rm@gmail.com" className="text-sky-600 hover:underline">jackson.pires.rm@gmail.com</a>.</p>
      <p className="mt-4">You can also use this page to describe partnership or enterprise inquiries.</p>
      </div>
    </main>
  );
}
