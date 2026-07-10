import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CallButton from "@/components/public/CallButton";
import JsonLd from "@/components/public/JsonLd";
import { getSiteSettings, getPublicNavData } from "@/lib/site-data";
import { buildLocalBusinessJsonLd } from "@/lib/jsonld";

/** Cache trang public 2 phút — nhanh hơn force-dynamic mỗi request */
export const revalidate = 120;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, nav] = await Promise.all([getSiteSettings(), getPublicNavData()]);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <JsonLd data={buildLocalBusinessJsonLd(settings)} />
      <Header phone={settings.phone} services={nav.services} locations={nav.locations} />
      <main className="flex-1 pb-24">{children}</main>
      <Footer settings={settings} locations={nav.locations} />
      <CallButton phone={settings.phone} zaloUrl={settings.zaloUrl} />
    </div>
  );
}
