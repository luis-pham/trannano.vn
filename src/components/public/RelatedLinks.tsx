import Link from "next/link";

type Item = { slug: string; title: string; href: string };

type RelatedLinksProps = {
  title: string;
  items: Item[];
  className?: string;
};

export default function RelatedLinks({ title, items, className = "" }: RelatedLinksProps) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-accent hover:bg-accent hover:text-brand"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
