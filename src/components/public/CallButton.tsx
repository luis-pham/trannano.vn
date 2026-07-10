import { getSiteSettings, phoneTel, zaloLink } from "@/lib/seo";

export default async function CallButton() {
  const settings = await getSiteSettings();

  return (
    <div className="call-button-fixed flex gap-2">
      <a
        href={phoneTel(settings.phone)}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-brand shadow-lg shadow-black/15 transition-colors hover:bg-accent-light active:scale-[0.98]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
        </svg>
        Gọi ngay
      </a>
      <a
        href={zaloLink(settings.phone, settings.zaloUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-colors hover:bg-brand-dark active:scale-[0.98]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.84 1.37 5.37 3.5 7.12V22l3.24-1.78c.87.24 1.79.37 2.76.37 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
        </svg>
        Zalo
      </a>
    </div>
  );
}
