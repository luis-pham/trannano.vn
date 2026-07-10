"use client";

import { FormEvent, useState } from "react";
import { phoneTel } from "@/lib/seo";

type ContactFormProps = {
  phone: string;
};

export default function ContactForm({ phone }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    window.location.href = phoneTel(phone);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">Cảm ơn bạn đã liên hệ!</p>
        <p className="mt-2 text-green-700">Chúng tôi sẽ gọi lại trong thời gian sớm nhất.</p>
        <a
          href={phoneTel(phone)}
          className="mt-4 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-brand hover:bg-accent-light active:scale-[0.98]"
        >
          Gọi ngay {phone}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-gray-700">
          Họ tên
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          id="contact-phone"
          type="tel"
          required
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="09xx xxx xxx"
        />
      </div>
      <div>
        <label htmlFor="contact-note" className="mb-1 block text-sm font-medium text-gray-700">
          Ghi chú
        </label>
        <textarea
          id="contact-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="Địa chỉ công trình, hạng mục cần thi công..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-brand transition-colors hover:bg-accent-light active:scale-[0.98]"
      >
        Gửi yêu cầu báo giá
      </button>
    </form>
  );
}
