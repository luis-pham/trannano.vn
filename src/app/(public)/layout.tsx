import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CallButton from "@/components/public/CallButton";
import JsonLd from "@/components/public/JsonLd";
import { getSiteSettings } from "@/lib/seo";
import { buildLocalBusinessJsonLd } from "@/lib/jsonld";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* LocalBusiness site-wide — SEO_SPEC: layout hoặc / + /lien-he */}
      <JsonLd data={buildLocalBusinessJsonLd(settings)} />
      <Header />
      <main className="flex-1 pb-24">{children}</main>
      <Footer />
      <CallButton />
    </div>
  );
}
