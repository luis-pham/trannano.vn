"use client";

import { useState } from "react";
import ProseContent from "./ProseContent";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 transition-colors hover:bg-surface"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span
                className={`shrink-0 text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="accordion-panel px-5 pb-4 text-gray-600">
                <ProseContent html={item.answer} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
