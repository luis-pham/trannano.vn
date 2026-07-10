# DEPLOYMENT

## 1. Biến môi trường

Tạo `.env` (không commit) dựa theo `.env.example`:

```
# Vercel (serverless) — BẮT BUỘC dùng Transaction pooler + pgbouncer=true
# Supabase → Project Settings → Database → Connection string → Transaction (port 6543)
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Seed / migrate local → dùng Direct connection (port 5432, host db.xxx.supabase.co), KHÔNG dùng pooler
# DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require

JWT_SECRET=                # openssl rand -base64 32
R2_ACCOUNT_ID=             # Cloudflare dashboard → R2 → Overview
R2_ACCESS_KEY_ID=          # R2 → Manage R2 API Tokens
R2_SECRET_ACCESS_KEY=
R2_BUCKET=                 # tên bucket
R2_PUBLIC_URL=             # https://pub-xxxxx.r2.dev hoặc https://cdn.trannano.vn (không / cuối)
NEXT_PUBLIC_R2_PUBLIC_URL= # cùng giá trị R2_PUBLIC_URL (cho next/image lúc build)
NEXT_PUBLIC_SITE_URL=https://trannano.vn
```

> **Quan trọng:** Thiếu `?pgbouncer=true` trên pooler `:6543` → Prisma lỗi prepared statement → trang **lúc có data lúc trống**. Password có ký tự đặc biệt (`@`, `#`, `%`…) phải URL-encode.

## 2. Hạ tầng đề xuất

| Thành phần | Dịch vụ | Chi phí tham khảo |
|---|---|---|
| Database | Supabase (free tier đủ quy mô nhỏ) | 0đ khởi điểm |
| Ảnh | Cloudflare R2 (+ public URL / custom domain) | Free tier rộng |
| Hosting | Vercel | 0–500k/tháng |
| Domain | trannano.vn | ~750k–1.2tr/năm |

## 3. Các bước deploy lần đầu

1. Tạo project Supabase.
   - **Vercel:** Connection string → **Transaction** pooler (`:6543`) + `?pgbouncer=true&connection_limit=1`.
   - **Migrate/seed từ máy local:** Direct (`db.…supabase.co:5432`).
2. Chạy `npx prisma migrate deploy` (hoặc `db push`) trên DB production (Direct URL).
3. Chạy seed (`npx prisma db seed`) — tạo AdminUser đầu tiên (Direct URL).
4. Kiểm tra sau deploy: mở `/api/health/db` — cần `connected: true`, `hasPgBouncer: true`, `seedComplete: true`.
4. Tạo R2 bucket trên Cloudflare:
   - Bật **Public access** (R2.dev subdomain) **hoặc** gắn custom domain (vd. `cdn.trannano.vn`).
   - Tạo **R2 API Token** với quyền Object Read & Write cho bucket đó.
   - Điền toàn bộ `R2_*` + `NEXT_PUBLIC_R2_PUBLIC_URL` trên Vercel.
5. Push code lên GitHub, import repo vào Vercel; khai báo env ở mục 1.
6. Trỏ domain `trannano.vn` **và** `www.trannano.vn` về Vercel.
7. **Primary domain (bắt buộc):** Vercel → Project → Settings → Domains → đặt **`trannano.vn`** (không www) làm **Primary**.
   - Vercel sẽ 301/308 `www.trannano.vn` → `https://trannano.vn`.
   - Canonical / sitemap trong code cũng dùng `https://trannano.vn`.
   - Nếu Primary đang là `www`, apex sẽ redirect sang www trong khi canonical vẫn non-www → Google bị rối tín hiệu index.
8. Env `NEXT_PUBLIC_SITE_URL=https://trannano.vn` (không www).
9. Vào `/admin/login`, đổi mật khẩu sau lần đăng nhập đầu.
10. Submit `https://trannano.vn/sitemap.xml` vào Google Search Console (property non-www).

## 4. Quy trình cập nhật sau này

- Sửa nội dung hàng ngày: qua `/admin`, không cần deploy lại.
- Sửa code: push GitHub → Vercel auto deploy.
- Đổi schema DB: `prisma migrate` local rồi `migrate deploy` production trước khi deploy code mới.

## 5. Backup

- Supabase: bật backup theo gói.
- R2: ảnh nằm trên Cloudflare; có thể bật versioning / sao chép bucket nếu cần sau này.
