import Link from "next/link";
import { BRAND_LOGO, BRAND_TAGLINE } from "@/lib/brand";
import HeaderNav from "./HeaderNav";

type HeaderProps = {
  phone: string;
  services: { slug: string; title: string }[];
  locations: { slug: string; title: string }[];
};

export default function Header({ phone, services, locations }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-brand">{BRAND_LOGO}</span>
          <span className="hidden text-[11px] font-medium text-gray-500 sm:block">
            {BRAND_TAGLINE}
          </span>
        </Link>
        <HeaderNav phone={phone} services={services} locations={locations} />
      </div>
    </header>
  );
}
