# DEPLOYMENT

## 1. Biến môi trường

Tạo `.env` (không commit) dựa theo `.env.example`:

```
DATABASE_URL=              # PostgreSQL (Supabase: Project Settings > Database)
JWT_SECRET=                # openssl rand -base64 32
R2_ACCOUNT_ID=             # Cloudflare dashboard → R2 → Overview
R2_ACCESS_KEY_ID=          # R2 → Manage R2 API Tokens
R2_SECRET_ACCESS_KEY=
R2_BUCKET=                 # tên bucket
R2_PUBLIC_URL=             # https://pub-xxxxx.r2.dev hoặc https://cdn.trannano.vn (không / cuối)
NEXT_PUBLIC_R2_PUBLIC_URL= # cùng giá trị R2_PUBLIC_URL (cho next/image lúc build)
NEXT_PUBLIC_SITE_URL=https://trannano.vn
```

## 2. Hạ tầng đề xuất

| Thành phần | Dịch vụ | Chi phí tham khảo |
|---|---|---|
| Database | Supabase (free tier đủ quy mô nhỏ) | 0đ khởi điểm |
| Ảnh | Cloudflare R2 (+ public URL / custom domain) | Free tier rộng |
| Hosting | Vercel | 0–500k/tháng |
| Domain | trannano.vn | ~750k–1.2tr/năm |

## 3. Các bước deploy lần đầu

1. Tạo project Supabase, lấy `DATABASE_URL`.
2. Chạy `npx prisma migrate deploy` (hoặc `db push`) trên DB production.
3. Chạy seed (`npx prisma db seed`) — tạo AdminUser đầu tiên.
4. Tạo R2 bucket trên Cloudflare:
   - Bật **Public access** (R2.dev subdomain) **hoặc** gắn custom domain (vd. `cdn.trannano.vn`).
   - Tạo **R2 API Token** với quyền Object Read & Write cho bucket đó.
   - Điền toàn bộ `R2_*` + `NEXT_PUBLIC_R2_PUBLIC_URL` trên Vercel.
5. Push code lên GitHub, import repo vào Vercel; khai báo env ở mục 1.
6. Trỏ domain `trannano.vn` về Vercel.
7. Vào `/admin/login`, đổi mật khẩu sau lần đăng nhập đầu.
8. Submit `https://trannano.vn/sitemap.xml` vào Google Search Console.

## 4. Quy trình cập nhật sau này

- Sửa nội dung hàng ngày: qua `/admin`, không cần deploy lại.
- Sửa code: push GitHub → Vercel auto deploy.
- Đổi schema DB: `prisma migrate` local rồi `migrate deploy` production trước khi deploy code mới.

## 5. Backup

- Supabase: bật backup theo gói.
- R2: ảnh nằm trên Cloudflare; có thể bật versioning / sao chép bucket nếu cần sau này.
