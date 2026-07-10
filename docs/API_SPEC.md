# API SPEC

Toàn bộ API route nằm dưới `/api`. Route dưới `/api/admin/*` bắt buộc có session hợp lệ
(xem `AUTH_SPEC.md`). Response luôn dạng JSON, lỗi trả `{ error: string }` kèm status
code phù hợp (400/401/404/500).

## Auth

| Method | Path | Body | Ghi chú |
|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | set cookie session |
| POST | `/api/auth/logout` | - | xoá cookie |

## Upload ảnh

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/upload` | `multipart/form-data`, field `files` (nhiều file) | `{ urls: string[] }` — URL Cloudflare R2 (hoặc `/uploads/...` khi local chưa cấu hình R2) |

Chi tiết implement xem `ADMIN_CMS_SPEC.md` phần Upload ảnh.

## Pattern CRUD dùng chung cho mọi content type

Áp dụng giống hệt cho: `services`, `locations`, `projects`, `blog`, `faq`, `prices`,
`pages` (riêng `pages` không có DELETE vì slug cố định), và `settings` (chỉ có
GET/PUT vì là singleton).

| Method | Path | Ghi chú |
|---|---|---|
| GET | `/api/admin/{resource}` | Trả list đầy đủ (kể cả bản nháp), hỗ trợ query `?page=&limit=` nếu danh sách dài (blog, project) |
| POST | `/api/admin/{resource}` | Tạo mới, validate bằng `zod`, tự sinh `slug` nếu không truyền |
| GET | `/api/admin/{resource}/[id]` | Lấy 1 record theo id, dùng để load form edit |
| PUT | `/api/admin/{resource}/[id]` | Cập nhật, validate như POST |
| DELETE | `/api/admin/{resource}/[id]` | Xoá record |

### Ví dụ cụ thể — Service

```
GET    /api/admin/services            -> Service[]
POST   /api/admin/services            -> tạo mới, body: { title, slug?, shortDescription, content, images[], metaTitle?, metaDescription?, ogImage?, order?, published }
GET    /api/admin/services/:id        -> Service
PUT    /api/admin/services/:id        -> cập nhật
DELETE /api/admin/services/:id        -> xoá
```

Sau mỗi POST/PUT/DELETE thành công, gọi `revalidatePath()` cho các route public liên
quan (trang danh sách dịch vụ + trang chi tiết vừa sửa + trang chủ nếu có hiển thị) để
nội dung mới hiện ngay mà không cần đợi ISR hết hạn — xem `ARCHITECTURE.md` mục 3.2.

### Settings (singleton)

```
GET  /api/admin/settings  -> SiteSettings (tạo record mặc định nếu chưa có)
PUT  /api/admin/settings  -> cập nhật
```

## Validate dữ liệu

Dùng `zod` để định nghĩa schema cho từng resource, validate ở đầu mỗi route handler
trước khi gọi Prisma. Trả `400` kèm chi tiết lỗi field nếu validate fail — form admin sẽ
hiển thị lỗi tương ứng dưới từng ô nhập.

## Slug tự động

Nếu admin không nhập `slug` thủ công, tự sinh từ `title` qua `lib/slugify.ts` (bỏ dấu
tiếng Việt, thay khoảng trắng bằng `-`, viết thường). Nếu slug đã tồn tại, thêm hậu tố
số (`-2`, `-3`...).
