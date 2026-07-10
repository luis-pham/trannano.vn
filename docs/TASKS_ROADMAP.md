# TASKS ROADMAP — thứ tự AI cần code theo

Làm tuần tự từng bước, không nhảy cóc. Mỗi bước xong nên chạy thử trước khi qua bước
tiếp theo.

## Bước 0 — Khởi tạo project

- [ ] `npx create-next-app@latest` (TypeScript, App Router, Tailwind nếu muốn dùng để
      style nhanh — không bắt buộc, có thể dùng CSS thường).
- [ ] Cài dependencies chính: `prisma`, `@prisma/client`, `bcryptjs`, `jose`,
      `zod`, `cloudinary`, `@tiptap/react` + các extension TipTap cần dùng.
- [ ] Copy `prisma/schema.prisma` đã có sẵn vào project, chạy `npx prisma migrate dev`.
- [ ] Setup `.env` theo `DEPLOYMENT.md`.

## Bước 1 — Auth

- [ ] `lib/auth.ts`: hàm sign/verify JWT, hàm hash/compare password.
- [ ] `api/auth/login/route.ts`, `api/auth/logout/route.ts`.
- [ ] `middleware.ts` bảo vệ `/admin/*` và `/api/admin/*` (xem `AUTH_SPEC.md`).
- [ ] `admin/login/page.tsx`.
- [ ] Script tạo `AdminUser` đầu tiên (seed hoặc script riêng chạy tay 1 lần).
- [ ] Test: đăng nhập sai → báo lỗi; đăng nhập đúng → vào được `/admin`; vào `/admin`
      khi chưa login → bị redirect.

## Bước 2 — Upload ảnh

- [ ] `lib/cloudinary.ts` cấu hình SDK.
- [ ] `api/upload/route.ts` nhận multipart, upload lên Cloudinary, trả về mảng URL.
- [ ] `components/admin/ImageUploader.tsx` theo đúng yêu cầu ở `ADMIN_CMS_SPEC.md`
      mục 5 (multi-select, preview, kéo-thả sắp xếp, xoá ảnh).
- [ ] Test: upload 5 ảnh cùng lúc, sắp xếp lại thứ tự, xoá 1 ảnh — đúng như mong đợi.

## Bước 3 — CRUD mẫu: Service (làm khuôn cho các module còn lại)

- [ ] `api/admin/services/route.ts` (GET list, POST create, validate bằng zod).
- [ ] `api/admin/services/[id]/route.ts` (GET, PUT, DELETE).
- [ ] `admin/services/page.tsx` (danh sách, dùng `DataTable.tsx`).
- [ ] `admin/services/new/page.tsx` + `admin/services/[id]/page.tsx` dùng chung
      `ServiceForm.tsx` (gồm rich text editor + ImageUploader + SEO fields + toggle
      published).
- [ ] Test đầy đủ: tạo, sửa, xoá, upload ảnh, lưu nháp/đăng công khai.

## Bước 4 — Nhân bản CRUD cho các module còn lại

Copy chính xác pattern ở Bước 3, đổi tên field theo `DATABASE_SCHEMA.md`:

- [ ] Location (`admin/locations`)
- [ ] Project (`admin/projects`, có thêm chọn `locationId`)
- [ ] BlogPost (`admin/blog`)
- [ ] Faq (`admin/faq`, có chọn `serviceId` tuỳ chọn)
- [ ] PriceItem (`admin/prices`, có chọn `serviceId` tuỳ chọn)
- [ ] Page (`admin/pages`, chỉ sửa 3 record cố định, không có nút Thêm/Xoá)
- [ ] SiteSettings (`admin/settings`, form đơn, không có danh sách)

## Bước 5 — Trang public

- [ ] `layout.tsx`, `Header.tsx`, `Footer.tsx`, `CallButton.tsx`.
- [ ] Trang chủ `/`.
- [ ] `/dich-vu`, `/dich-vu/[slug]`.
- [ ] `/khu-vuc/[slug]`.
- [ ] `/du-an`, `/du-an/[slug]`.
- [ ] `/bang-gia`.
- [ ] `/faq` (+ `FaqAccordion.tsx`).
- [ ] `/blog`, `/blog/[slug]`.
- [ ] `/gioi-thieu`, `/lien-he`.
- [ ] Áp `generateMetadata()` cho toàn bộ trang trên theo `SEO_SPEC.md`.

## Bước 6 — SEO kỹ thuật

- [ ] `lib/seo.ts` (helper build metadata dùng chung).
- [ ] `components/public/JsonLd.tsx` + gắn LocalBusiness/Service/FAQPage/Breadcrumb
      đúng từng trang.
- [ ] `app/sitemap.ts`, `app/robots.ts`.
- [ ] Revalidate on-demand: gọi `revalidatePath()` trong mọi API admin sau khi
      POST/PUT/DELETE thành công.
- [ ] Kiểm tra Lighthouse + Rich Results Test theo `SEO_SPEC.md` mục 8.

## Bước 7 — Seed dữ liệu thật

- [ ] `prisma/seed.ts` nhập toàn bộ nội dung từ `CONTENT_SEED.md`.
- [ ] Chạy seed trên DB local để test giao diện với dữ liệu thật trước khi deploy.

## Bước 8 — Deploy

- [ ] Theo đúng `DEPLOYMENT.md` từ đầu đến cuối.
- [ ] Submit sitemap Google Search Console.
- [ ] Test lại toàn bộ luồng admin trên production (login, thêm bài, upload ảnh).

## Bước 9 — Sau khi launch (không bắt buộc ngay)

- [ ] Thêm rate limit cho `/api/auth/login`.
- [ ] Thêm trang 404/500 tuỳ chỉnh.
- [ ] Thêm Google Analytics / Search Console verification tag.
- [ ] Nếu cần mở rộng khu vực phục vụ, thêm `Location` mới qua `/admin`, không cần
      sửa code.
