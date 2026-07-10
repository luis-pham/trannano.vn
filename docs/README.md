# Trần Nano — Website + CMS nội bộ

Website dịch vụ thi công trần nhựa nano, ốp tường nhựa nano, lát sàn nhựa giả gỗ,
vách bàn thờ, vách tủ tivi tại khu vực Ninh Bình, Thanh Hoá, Hà Nam.

Domain: `trannano.vn`
Hotline: `0986.979.353`

## Mục tiêu dự án

1. Website không tĩnh — chủ doanh nghiệp (không rành kỹ thuật) tự đăng bài, sửa nội
   dung, upload ảnh công trình qua trang quản trị riêng (`/admin`), không cần biết code.
2. Tối ưu Local SEO cho 2-3 khu vực (Ninh Bình, Thanh Hoá, Hà Nam) — mỗi khu vực có
   trang riêng, nội dung không trùng lặp.
3. Tốc độ tải nhanh, chuẩn mobile (đa số khách tìm dịch vụ thợ qua điện thoại).

## Tech stack

| Thành phần | Lựa chọn |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | PostgreSQL (khuyến nghị Supabase) |
| ORM | Prisma |
| Lưu trữ ảnh | Cloudflare R2 (S3-compatible + CDN) |
| Auth admin | Session JWT cookie tự viết (không cần NextAuth vì chỉ có 1-2 tài khoản) |
| Rich text editor | TipTap |
| Deploy | Vercel (frontend) + Supabase (DB + có thể dùng luôn storage) |

## Cách đọc bộ tài liệu này

Đọc theo thứ tự khi bắt đầu code:

1. `PRD.md` — hiểu bài toán, phạm vi
2. `ARCHITECTURE.md` — hiểu kiến trúc, cấu trúc thư mục
3. `DATABASE_SCHEMA.md` — hiểu dữ liệu
4. `AUTH_SPEC.md` — hiểu cơ chế đăng nhập admin
5. `API_SPEC.md` — hiểu các endpoint cần dựng
6. `ADMIN_CMS_SPEC.md` — hiểu chức năng trang quản trị
7. `SITEMAP_PAGES.md` — hiểu các trang công khai cần dựng
8. `SEO_SPEC.md` — yêu cầu SEO kỹ thuật bắt buộc
9. `CONTENT_SEED.md` — nội dung thật để seed vào DB lúc khởi tạo
10. `UI_DESIGN.md` — yêu cầu giao diện
11. `DEPLOYMENT.md` — biến môi trường, cách deploy
12. `TASKS_ROADMAP.md` — thứ tự thực hiện, làm theo checklist này

File `prisma/schema.prisma` ở thư mục gốc dự án đã có sẵn — dùng làm nguồn chân lý (source
of truth) cho database, không tự ý đổi cấu trúc field nếu không cần thiết.
