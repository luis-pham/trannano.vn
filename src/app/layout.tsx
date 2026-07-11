import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import { BRAND_LOGO } from "@/lib/brand";
import { CANONICAL_ORIGIN } from "@/lib/seo";
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

/** Metadata mặc định — không gọi DB lúc build (Vercel). Trang cụ thể override qua generateMetadata riêng. */
export const metadata: Metadata = {
  title: {
    default: "Trannano.vn - Nội Thất Tài Đức | Chuyên Thi Công Trần Nano",
    template: `%s | ${BRAND_LOGO}`,
  },
  description:
    "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn.",
  metadataBase: new URL(CANONICAL_ORIGIN),
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-surface font-sans text-gray-900 antialiased">{children}</body>
    </html>
  );
}
