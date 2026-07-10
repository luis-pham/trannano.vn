# SITEMAP — Trang công khai

| Route | Nguồn dữ liệu | Mục đích SEO |
|---|---|---|
| `/` | `Page(slug="trang-chu")` + top Service + top Project + `SiteSettings` | Trang chủ, USP, khu vực phục vụ, nút gọi ngay nổi bật |
| `/gioi-thieu` | `Page(slug="gioi-thieu")` | Kinh nghiệm, cam kết bảo hành, xây niềm tin |
| `/lien-he` | `Page(slug="lien-he")` + `SiteSettings` | SĐT, giờ làm việc, Google Map nhúng, form liên hệ. NAP phải khớp 100% với GBP + Fanpage |
| `/dich-vu` | `Service[]` (published) | Danh sách toàn bộ dịch vụ |
| `/dich-vu/[slug]` | `Service` theo slug | Trang riêng từng dịch vụ — từ khoá chính (vd "trần nhựa nano", "lát sàn nhựa giả gỗ") |
| `/khu-vuc/[slug]` | `Location` theo slug (`ninh-binh`, `thanh-hoa`, `ha-nam`) | **Quan trọng nhất cho local SEO** — nội dung riêng biệt từng tỉnh, không trùng lặp |
| `/du-an` | `Project[]` (published), lọc theo khu vực | Ảnh trước/sau, tín hiệu nội dung mới thường xuyên |
| `/du-an/[slug]` | `Project` theo slug | Chi tiết 1 công trình |
| `/bang-gia` | `PriceItem[]` group theo `Service` | Ăn từ khoá "giá trần nhựa nano", "giá sàn nhựa" |
| `/faq` | `Faq[]` (published) | Schema FAQPage, nhắm "People also ask" |
| `/blog` | `BlogPost[]` (published), phân trang | Danh sách bài viết kiến thức, từ khoá dài |
| `/blog/[slug]` | `BlogPost` theo slug | Chi tiết bài viết |
| `/admin/*` | — | Không thuộc sitemap.xml, chặn trong `robots.ts` |

## Quy tắc nội dung trang khu vực (`/khu-vuc/[slug]`)

- Mỗi khu vực (Ninh Bình, Thanh Hoá, Hà Nam) phải có đoạn mở đầu, danh sách công
  trình, và call-to-action **viết riêng**, không copy nguyên văn giữa các khu vực.
- Nên nhắc tên huyện/phường cụ thể mà admin hay nhận việc (ví dụ: "TP Ninh Bình,
  Tam Điệp, Hoa Lư" / "TP Thanh Hoá, Sầm Sơn").
- Liên kết tới các `Project` có `locationId` trùng khu vực này (bằng chứng thực tế
  đã làm tại đó).
- Liên kết chéo tới các trang `Service` liên quan (internal linking).

## Điều hướng (Header/Footer)

- Header: Trang chủ, Dịch vụ (dropdown ra từng Service), Khu vực (dropdown Ninh
  Bình/Thanh Hoá/Hà Nam), Dự án, Bảng giá, Blog, Liên hệ, số điện thoại nổi bật.
- Footer: NAP đầy đủ, giờ làm việc, khu vực phục vụ, link mạng xã hội, sitemap rút gọn.
- `CallButton.tsx`: nút nổi (sticky) góc dưới màn hình trên mọi trang, gồm 2 hành
  động — Gọi ngay / Nhắn Zalo.
