# AUTH SPEC

## Yêu cầu

- Chỉ 1-2 tài khoản admin, không cần đăng ký công khai, không cần quên mật khẩu qua
  email (có thể reset thủ công qua script/DB nếu cần).
- Không dùng NextAuth / Auth0 — quá dư thừa cho quy mô 1-2 user. Tự viết session đơn
  giản bằng JWT + cookie httpOnly.

## Luồng đăng nhập

1. Admin vào `/admin/login`, nhập email + password.
2. Gọi `POST /api/auth/login` với `{ email, password }`.
3. Server tra `AdminUser` theo email, so sánh `passwordHash` bằng `bcrypt.compare`.
4. Nếu đúng: sinh JWT (thư viện `jose`) chứa `{ sub: user.id, email }`, hạn 7 ngày,
   set vào cookie `httpOnly`, `secure` (production), `sameSite: "lax"`.
5. Redirect về `/admin`.
6. `POST /api/auth/logout` — xoá cookie.

## Bảo vệ route

Dùng `middleware.ts` ở gốc `src/`, áp dụng cho matcher `/admin/:path*` và
`/api/admin/:path*`:

- Đọc cookie session, verify JWT bằng `jose`.
- Nếu không hợp lệ và path không phải `/admin/login` → redirect `/admin/login`
  (với route trang) hoặc trả `401 Unauthorized` (với API route).
- Nếu hợp lệ → cho qua.

## Biến môi trường liên quan

```
JWT_SECRET=          # chuỗi random dài, dùng ký/verify JWT
```

## Lưu ý bảo mật tối thiểu

- Rate limit đơn giản cho `/api/auth/login` (ví dụ giới hạn 5 lần/phút/IP) để chặn brute
  force — có thể dùng middleware đếm request trong bộ nhớ hoặc Upstash Redis nếu deploy
  Vercel (tuỳ mức độ cần thiết, không bắt buộc ở bản MVP).
- Không log password ra console/log file.
- `passwordHash` luôn dùng `bcrypt` với salt rounds ≥ 10.
