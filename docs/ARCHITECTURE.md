# ARCHITECTURE

## 1. Tổng quan

Monolith Next.js (App Router) — vừa render trang công khai (SSG/ISR) vừa chứa khu vực
admin (`/admin`) và API routes (`/api/*`) trong cùng 1 project. Không tách backend riêng
để giảm độ phức tạp vận hành cho 1 người tự code/tự bảo trì.

```
Browser (khách) ──> Next.js public pages (SSG/ISR) ──> Prisma ──> PostgreSQL
Browser (admin)  ──> /admin (client components) ──> /api/admin/* (Route Handlers)
                                                        │
                                                        ├──> Prisma ──> PostgreSQL
                                                        └──> Cloudinary (upload ảnh)
```

## 2. Cấu trúc thư mục đề xuất

```
trannano-website/
├── docs/                        # bộ tài liệu này
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # trang chủ
│   │   ├── globals.css
│   │   ├── sitemap.ts           # Next.js native sitemap
│   │   ├── robots.ts
│   │   ├── gioi-thieu/page.tsx
│   │   ├── lien-he/page.tsx
│   │   ├── dich-vu/
│   │   │   ├── page.tsx         # danh sách dịch vụ
│   │   │   └── [slug]/page.tsx  # chi tiết 1 dịch vụ
│   │   ├── khu-vuc/
│   │   │   └── [slug]/page.tsx  # ninh-binh | thanh-hoa | ha-nam
│   │   ├── du-an/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── bang-gia/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx       # kiểm tra session, redirect nếu chưa login
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx         # dashboard
│   │   │   ├── services/
│   │   │   ├── locations/
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   ├── faq/
│   │   │   ├── prices/
│   │   │   ├── pages/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       ├── upload/route.ts
│   │       └── admin/
│   │           ├── services/route.ts        # GET (list), POST (create)
│   │           ├── services/[id]/route.ts   # GET, PUT, DELETE
│   │           ├── locations/...
│   │           ├── projects/...
│   │           ├── blog/...
│   │           ├── faq/...
│   │           ├── prices/...
│   │           ├── pages/...
│   │           └── settings/route.ts
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminNav.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── DataTable.tsx
│   │   └── public/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Hero.tsx
│   │       ├── ServiceCard.tsx
│   │       ├── ProjectGallery.tsx
│   │       ├── FaqAccordion.tsx
│   │       ├── JsonLd.tsx
│   │       └── CallButton.tsx   # nút gọi/Zalo nổi luôn hiển thị
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   ├── seo.ts
│   │   └── slugify.ts
│   └── middleware.ts            # bảo vệ toàn bộ route /admin và /api/admin
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

## 3. Nguyên tắc kiến trúc quan trọng

1. **Mỗi content type có 1 CRUD pattern giống hệt nhau** (list → new → edit, cộng 2
   API route: `route.ts` cho list/create, `[id]/route.ts` cho get/update/delete).
   Chỉ cần code đúng 1 module (ví dụ `Service`) làm mẫu, các module còn lại copy
   theo đúng pattern, đổi tên field.

2. **Rendering strategy theo từng nhóm trang**:
   - Trang ít đổi (dịch vụ, khu vực, trang tĩnh) → `generateStaticParams` + revalidate
     dài (ví dụ 3600s) hoặc dùng on-demand revalidation khi admin lưu bài.
   - Trang hay đổi (blog, dự án) → ISR revalidate ngắn hơn (60-300s) hoặc on-demand
     revalidation gọi `revalidatePath()` ngay sau khi admin submit form.

3. **Không tách admin thành app riêng** — dùng chung Next.js project, chỉ cách ly bằng
   `middleware.ts` kiểm tra cookie session trước khi cho vào `/admin/*` và `/api/admin/*`.

4. **Ảnh không lưu trong DB dạng binary** — chỉ lưu URL Cloudinary dạng mảng string
   theo đúng thứ tự hiển thị (xem `DATABASE_SCHEMA.md`).

5. **SEO là trách nhiệm của tầng render, không phải tầng admin** — admin chỉ nhập dữ
   liệu (title, meta, ảnh...), còn việc sinh thẻ meta/JSON-LD/sitemap nằm ở
   `lib/seo.ts` và các file `page.tsx`/`sitemap.ts` (xem `SEO_SPEC.md`).
