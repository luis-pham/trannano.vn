# SEO SPEC — yêu cầu kỹ thuật bắt buộc

## 1. Metadata mỗi trang

Dùng Next.js `generateMetadata()` cho mọi route động (`[slug]`). Helper dùng chung đặt
tại `lib/seo.ts`:

```ts
// lib/seo.ts (mô tả hành vi, không phải code đầy đủ)
buildMetadata({
  title,            // ưu tiên metaTitle riêng của record, fallback title thường, fallback SiteSettings.defaultMetaTitle
  description,      // tương tự, ưu tiên metaDescription riêng
  ogImage,          // ưu tiên ogImage riêng, fallback ảnh đầu tiên trong images[], fallback defaultOgImage
  path,             // để build canonical URL: https://trannano.vn + path
})
```

Quy tắc fallback: `metaTitle riêng` → `title record + " | Trần Nano"` → `SiteSettings.defaultMetaTitle`.

## 2. Structured Data (JSON-LD)

Component `components/public/JsonLd.tsx` nhận `data` (object) và render
`<script type="application/ld+json">`.

### LocalBusiness — đặt ở `layout.tsx` (toàn site) hoặc riêng trang `/` và `/lien-he`

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "SiteSettings.businessName",
  "telephone": "SiteSettings.phone",
  "areaServed": ["Ninh Bình", "Thanh Hoá", "Hà Nam"],
  "url": "https://trannano.vn",
  "image": "SiteSettings.defaultOgImage"
}
```
Nếu `SiteSettings.address` có giá trị thì thêm `address` dạng `PostalAddress`; nếu để
trống (service-area business) thì **không** thêm field `address` để tránh sai lệch với
khai báo trên Google Business Profile.

### Service — mỗi trang `/dich-vu/[slug]`

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Service.title",
  "areaServed": ["Ninh Bình", "Thanh Hoá", "Hà Nam"],
  "provider": { "@type": "HomeAndConstructionBusiness", "name": "SiteSettings.businessName" },
  "description": "Service.shortDescription"
}
```

### FAQPage — trang `/faq` và mỗi trang `/dich-vu/[slug]` có FAQ riêng

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Faq.question", "acceptedAnswer": { "@type": "Answer", "text": "Faq.answer" } }
  ]
}
```

### BreadcrumbList — mọi trang con (không phải trang chủ)

Sinh tự động từ path, ví dụ `Trang chủ > Dịch vụ > Trần nhựa nano`.

## 3. Sitemap & robots

Dùng Next.js native file convention, **không cần thêm package `next-sitemap`**:

- `src/app/sitemap.ts` — export function trả về mảng URL, query toàn bộ `Service`,
  `Location`, `Project`, `BlogPost` đang `published: true`, kèm `lastModified` lấy từ
  `updatedAt`.
- `src/app/robots.ts` — cho phép crawl toàn bộ trừ `/admin` và `/api`, trỏ tới
  `https://trannano.vn/sitemap.xml`.

## 4. Canonical & duplicate content

- Mỗi `generateMetadata()` set `alternates.canonical` = URL đầy đủ của chính trang đó.
- Trang khu vực (`/khu-vuc/ninh-binh`, `/khu-vuc/thanh-hoa`) **không được** canonical
  chéo lẫn nhau — mỗi trang tự canonical chính nó, nội dung phải khác nhau thật sự
  (xem quy tắc ở `SITEMAP_PAGES.md`).

## 5. Slug & URL

- Toàn bộ slug tiếng Việt không dấu, chữ thường, nối bằng `-` (`lib/slugify.ts`).
- URL chứa từ khoá: ví dụ `/dich-vu/tran-nhua-nano`, `/khu-vuc/ninh-binh`.

## 6. Ảnh

- Bắt buộc dùng `next/image` cho toàn bộ ảnh public (tự resize, lazy load, đúng định
  dạng WebP/AVIF).
- Ảnh Cloudinary nên upload qua transform tối ưu sẵn (`f_auto,q_auto`) — cấu hình ở
  `lib/cloudinary.ts`.
- Mọi thẻ `<Image>` phải có `alt` mô tả (lấy từ `title` của record + từ khoá địa danh
  khi phù hợp, ví dụ `alt="Thi công trần nhựa nano tại Ninh Bình"`).

## 7. Performance

- Trang `Service`, `Location`, `Page` (ít đổi): `generateStaticParams` + revalidate dài
  hoặc on-demand revalidation (gọi từ API admin sau khi lưu).
- Trang `BlogPost`, `Project` (hay đổi): ISR revalidate ngắn hoặc on-demand.
- Font: dùng `next/font` để tránh layout shift, không load font ngoài qua `<link>` thô.

## 8. Kiểm tra sau khi code xong

1. Chạy Lighthouse (Performance + SEO) trên trang chủ và 1 trang dịch vụ, mục tiêu ≥ 90.
2. Dán từng URL vào Google Rich Results Test — kiểm tra JSON-LD không lỗi.
3. Submit `sitemap.xml` vào Google Search Console sau khi deploy.
4. Kiểm tra `robots.txt` không chặn nhầm trang public.
