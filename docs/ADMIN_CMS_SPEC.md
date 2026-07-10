# ADMIN CMS SPEC

Khu vực `/admin`, chỉ admin đã đăng nhập truy cập được (xem `AUTH_SPEC.md`).

## 1. Layout chung

- `AdminNav.tsx` — menu bên trái/trên: Dashboard, Dịch vụ, Khu vực, Dự án, Blog, FAQ,
  Bảng giá, Trang tĩnh, Cấu hình chung, Đăng xuất.
- Giao diện đơn giản, chữ to, nút rõ ràng — người dùng không rành máy tính vẫn thao
  tác được. Ưu tiên form 1 cột, không chia nhiều tab phức tạp.

## 2. Dashboard (`/admin`)

Trang tổng quan đơn giản: số lượng dịch vụ/dự án/bài blog đã đăng, vài shortcut
("+ Thêm dự án mới", "+ Viết bài blog mới").

## 3. Pattern màn hình cho mỗi content type

Áp dụng cho Dịch vụ, Khu vực, Dự án, Blog, FAQ, Bảng giá:

1. **Trang danh sách** (`/admin/{resource}`) — bảng hiển thị cột chính (tiêu đề, trạng
   thái published/nháp, ngày sửa), nút "+ Thêm mới", nút Sửa/Xoá từng dòng. Dùng
   component `DataTable.tsx` dùng chung.
2. **Trang thêm mới** (`/admin/{resource}/new`) — form rỗng.
3. **Trang sửa** (`/admin/{resource}/[id]`) — form load sẵn dữ liệu.

Form thêm/sửa dùng chung 1 component (ví dụ `ServiceForm.tsx`) cho cả 2 trường hợp
new/edit để tránh trùng code.

## 4. Rich text editor

- Dùng **TipTap**, toolbar tối giản: đậm, nghiêng, tiêu đề, danh sách, chèn ảnh, chèn
  link. Không cần toolbar đầy đủ như Word.
- Output lưu dạng HTML string vào field `content`.
- Áp dụng cho: `Service.content`, `Location.content`, `Project.content`,
  `BlogPost.content`, `Faq.answer`, `Page.content`.

## 5. Upload nhiều ảnh (Album) — quan trọng nhất

Component `ImageUploader.tsx`, dùng ở form của: Service, Location, Project (field
`images: string[]`).

Yêu cầu chức năng:

1. Cho chọn/kéo-thả **nhiều file cùng lúc** (input `multiple`).
2. Hiển thị preview dạng lưới ảnh ngay khi chọn (trước khi upload xong, hiện loading
   trên từng ảnh).
3. Gọi `POST /api/upload` (multipart form data), nhận về mảng URL Cloudflare R2.
4. Thêm URL mới vào cuối mảng `images` hiện tại của form (không ghi đè ảnh cũ).
5. **Kéo-thả để sắp xếp lại thứ tự ảnh** trong lưới preview — thứ tự này chính là thứ
   tự lưu vào mảng `images`, và cũng là thứ tự hiển thị ngoài trang public. Dùng thư
   viện kéo-thả nhẹ (ví dụ `@dnd-kit/core` hoặc tự viết bằng HTML5 drag events, không
   bắt buộc thư viện nặng).
6. Mỗi ảnh có nút "Xoá" riêng — xoá khỏi mảng `images` trong form (không nhất thiết
   phải xoá file trên Cloudinary ngay, có thể dọn định kỳ sau).
7. Giới hạn hợp lý: tối đa ~20 ảnh/album, cảnh báo nếu file > 5MB (để component tự
   nén nhẹ trước khi upload nếu cần, hoặc dựa vào Cloudinary transform).

## 6. Trạng thái Nháp / Đã đăng

Mọi content type (trừ `Page`, `SiteSettings`) có field `published: boolean`. Form có
toggle "Đăng công khai" — tắt = lưu nháp, không hiện ngoài site nhưng admin vẫn xem
được trong danh sách để sửa tiếp.

## 7. SEO fields trong form

Mỗi form content type có 1 khối riêng "Tối ưu SEO (tuỳ chọn)" thu gọn mặc định, gồm:
`Meta title`, `Meta description` (đếm ký tự, cảnh báo nếu > 160), `Ảnh chia sẻ mạng xã
hội (OG image)`. Nếu để trống, tầng render sẽ tự fallback theo `lib/seo.ts` (xem
`SEO_SPEC.md`).

## 8. Trang Cấu hình chung (`/admin/settings`)

Form 1 trang duy nhất sửa toàn bộ field của `SiteSettings` (số điện thoại, địa chỉ,
giờ làm việc, khu vực phục vụ, link Facebook/Zalo/Google Business, meta mặc định).

## 9. Sau khi lưu thành công

- Toast/thông báo "Đã lưu".
- Gọi `revalidatePath()` tương ứng để trang public cập nhật ngay (không bắt admin phải
  đợi hoặc tự deploy lại).
