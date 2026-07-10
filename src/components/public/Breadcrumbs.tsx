import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/jsonld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import JsonLd from "./JsonLd";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  light?: boolean;
};

export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  const textClass = light ? "text-white/70" : "text-gray-600";
  const activeClass = light ? "text-white" : "text-gray-900";
  const linkClass = light ? "hover:text-accent" : "hover:text-brand";
  const sepClass = light ? "text-white/40" : "text-gray-400";

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={`mb-6 text-sm ${textClass}`}>
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className={sepClass}>/</span>}
              {item.href ? (
                <Link href={item.href} className={linkClass}>
                  {item.name}
                </Link>
              ) : (
                <span className={`font-medium ${activeClass}`}>{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
