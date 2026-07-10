# Trần Nano — Website + CMS

Website dịch vụ thi công trần nhựa nano tại Ninh Bình, Thanh Hoá, Hà Nam.

- Domain: `trannano.vn`
- Hotline: `0986.979.353`

## Chạy local

```bash
npm install
npm run db:setup   # tạo DB SQLite + seed dữ liệu
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Tài khoản mặc định: `admin@trannano.vn` / `admin123456`

## Tech stack

Next.js 14 (App Router) · Prisma · SQLite (local) / PostgreSQL Supabase (production) · Cloudflare R2 (ảnh) · TipTap · JWT cookie auth

## Biến môi trường

Xem `.env.example`. Local dùng SQLite (`DATABASE_URL="file:./dev.db"`). Production: PostgreSQL (Supabase) + Cloudflare R2.

Khi chưa cấu hình R2, ảnh upload lưu tạm vào `public/uploads/` (chỉ phù hợp local).

## Tài liệu

Chi tiết trong thư mục [`docs/`](./docs/).
