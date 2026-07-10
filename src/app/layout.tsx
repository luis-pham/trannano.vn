import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import { getSiteSettings } from "@/lib/seo";
import { BRAND_LOGO } from "@/lib/brand";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const notoSerif = Noto_Serif({
  weight: ["500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.defaultMetaTitle,
      template: `%s | ${BRAND_LOGO}`,
    },
    description: settings.defaultMetaDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trannano.vn"),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-surface font-sans text-gray-900 antialiased">{children}</body>
    </html>
  );
}
