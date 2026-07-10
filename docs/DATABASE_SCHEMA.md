# DATABASE SCHEMA

Nguồn chân lý (source of truth) là file `prisma/schema.prisma` ở gốc dự án — file này
chỉ mô tả lại bằng lời để AI hiểu ý nghĩa từng bảng/field trước khi code phần dùng đến
chúng (API, form admin, trang public).

## AdminUser

Tài khoản đăng nhập trang quản trị. Không cần đăng ký công khai — tạo thủ công qua
`prisma db seed` hoặc script riêng.

| Field | Kiểu | Ghi chú |
|---|---|---|
| id | String (cuid) | |
| email | String, unique | |
| passwordHash | String | hash bằng bcrypt, không lưu password thô |
| createdAt | DateTime | |

## Page

Các trang nội dung tĩnh nhưng vẫn chỉnh sửa được qua admin: `trang-chu`, `gioi-thieu`,
`lien-he`. Mỗi slug là 1 record cố định, không cho thêm/xoá tự do trong admin.

| Field | Kiểu | Ghi chú |
|---|---|---|
| slug | String, unique | `trang-chu` \| `gioi-thieu` \| `lien-he` |
| title | String | |
| content | Text (HTML) | nội dung từ rich text editor |
| metaTitle / metaDescription / ogImage | String? | SEO override, nếu trống thì lấy default từ `SiteSettings` |

## Service (Dịch vụ)

Mỗi dịch vụ (trần nhựa nano, ốp tường nhựa nano, lát sàn nhựa giả gỗ, vách bàn thờ,
vách tủ tivi...) là 1 record, có trang riêng `/dich-vu/[slug]`.

| Field | Kiểu | Ghi chú |
|---|---|---|
| slug | String, unique | vd `tran-nhua-nano` |
| title | String | vd "Trần nhựa nano" |
| shortDescription | String? | dùng cho card/preview |
| content | Text (HTML) | mô tả chi tiết, ưu điểm, quy trình thi công |
| images | String[] | mảng URL Cloudinary, **thứ tự trong mảng = thứ tự hiển thị** |
| iconUrl | String? | icon minh hoạ (tuỳ chọn) |
| metaTitle / metaDescription / ogImage | String? | |
| order | Int | thứ tự hiển thị trong menu/danh sách dịch vụ |
| published | Boolean | false = nháp, không hiện public |
| faqs | relation → Faq[] | FAQ liên quan riêng cho dịch vụ này |
| priceItems | relation → PriceItem[] | các dòng giá liên quan |

## Location (Khu vực)

Trang landing riêng cho từng tỉnh: `ninh-binh`, `thanh-hoa`, `ha-nam`. **Bắt buộc nội
dung khác nhau giữa các khu vực** — không copy nguyên văn để tránh Google phạt trùng
lặp (xem `SEO_SPEC.md`).

| Field | Kiểu | Ghi chú |
|---|---|---|
| slug | String, unique | `ninh-binh` \| `thanh-hoa` \| `ha-nam` |
| title | String | vd "Ninh Bình" |
| content | Text (HTML) | nội dung riêng cho khu vực, có thể nhắc tên huyện/xã cụ thể |
| images | String[] | ảnh công trình đã làm tại khu vực này |
| metaTitle / metaDescription / ogImage | String? | |
| order | Int | |
| published | Boolean | |
| projects | relation → Project[] | các dự án đã làm tại khu vực này |

## Project (Dự án / công trình đã thi công)

Ảnh trước/sau, dùng để xây niềm tin. Có thể gắn với 1 `Location`.

| Field | Kiểu | Ghi chú |
|---|---|---|
| slug | String, unique | |
| title | String | vd "Thi công trần nhựa nano nhà anh Tuấn - TP Ninh Bình" |
| content | Text (HTML) | mô tả ngắn về công trình |
| images | String[] | album ảnh trước/sau, thứ tự = thứ tự hiển thị |
| projectDate | DateTime? | |
| locationId | String? (FK → Location) | |
| metaTitle / metaDescription / ogImage | String? | |
| published | Boolean | |

## BlogPost

Bài viết SEO dạng kiến thức/mẹo, kéo traffic tự nhiên qua từ khoá dài.

| Field | Kiểu | Ghi chú |
|---|---|---|
| slug | String, unique | |
| title | String | |
| excerpt | String? | tóm tắt hiển thị ở trang danh sách |
| content | Text (HTML) | |
| coverImage | String? | |
| category | String? | |
| metaTitle / metaDescription / ogImage | String? | |
| published | Boolean | |
| publishedAt | DateTime | |

## Faq

Câu hỏi thường gặp, có thể gắn với 1 `Service` cụ thể hoặc để trống (FAQ chung).

| Field | Kiểu | Ghi chú |
|---|---|---|
| question | String | |
| answer | Text (HTML) | |
| serviceId | String? (FK → Service) | |
| order | Int | |
| published | Boolean | |

## PriceItem

Dòng trong bảng giá tham khảo, có thể gắn với 1 `Service`.

| Field | Kiểu | Ghi chú |
|---|---|---|
| serviceId | String? (FK → Service) | |
| name | String | vd "Trần nhựa nano - tấm 200mm" |
| priceFrom | Int | đơn vị VNĐ |
| unit | String | mặc định `m2`, có thể là `md` (mét dài) hoặc `bo` (bộ) |
| note | String? | vd "Đã gồm nhân công" |
| order | Int | |

## SiteSettings

**Chỉ có đúng 1 record** (id cố định = `"singleton"`), lưu cấu hình chung toàn site.
Admin chỉ có 1 form sửa duy nhất, không có list/CRUD nhiều record.

| Field | Kiểu | Ghi chú |
|---|---|---|
| businessName | String | mặc định "Trần Nano" |
| phone | String | dùng cho nút gọi, NAP, JSON-LD |
| zaloUrl | String? | |
| address | String? | để trống nếu là service-area business không public địa chỉ nhà |
| workingHours | String | |
| serviceAreas | String | "Ninh Bình, Thanh Hoá, Hà Nam" |
| mapEmbedUrl | String? | |
| facebookUrl | String? | |
| googleBusinessUrl | String? | |
| defaultMetaTitle / defaultMetaDescription / defaultOgImage | String | fallback SEO khi trang cụ thể không set riêng |

## Quy ước chung

- Tất cả bảng có `slug` đều unique, dùng để build URL — xem `lib/slugify.ts` để bỏ dấu
  tiếng Việt khi tạo slug tự động từ `title`.
- Field `images: String[]` luôn là URL Cloudinary đầy đủ, **không** lưu public_id rời để
  đơn giản hoá việc render `next/image`.
- Field `published: Boolean` dùng để phân biệt Nháp/Đã đăng — trang public luôn query
  `where: { published: true }`.
