# Trần Nano — Website + CMS

Website dịch vụ thi công trần nhựa nano tại Ninh Bình, Thanh Hoá, Hà Nam.

- Domain: `trannano.vn`
- Hotline: `0986.979.353`

## Chạy local

```bash
docker compose up -d          # Postgres local
npm install
npm run db:setup              # prisma db push + seed
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Tài khoản mặc định: `admin@trannano.vn` / `admin123456`

## Tech stack

Next.js 14 (App Router) · Prisma · PostgreSQL (Docker local / Supabase production) · Cloudflare R2 (ảnh) · TipTap · JWT cookie auth

## Biến môi trường

Xem `.env.example`. Local: `docker compose` + `DATABASE_URL` Postgres. Production: Supabase + Cloudflare R2 trên Vercel.

Khi chưa cấu hình R2, ảnh upload lưu tạm vào `public/uploads/` (chỉ phù hợp local).

## Tài liệu

Chi tiết trong thư mục [`docs/`](./docs/).
