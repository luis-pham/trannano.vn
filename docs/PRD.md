# PRD — Product Requirements Document

## 1. Bài toán

Chủ doanh nghiệp là thợ thi công (không phải công ty, không rành kỹ thuật), hiện
đang chạy quảng cáo Fanpage Facebook cho dịch vụ trần nhựa nano / sàn nhựa tại
Ninh Bình, Thanh Hoá. Muốn có thêm một website riêng để:

- Tăng độ tin cậy (khách tra Google trước khi gọi thợ).
- Lên top tìm kiếm địa phương ("trần nhựa nano Ninh Bình", "sàn nhựa Thanh Hoá"...).
- Tự cập nhật nội dung, ảnh công trình mới mà không phải thuê ai sửa web mỗi lần.

## 2. Đối tượng sử dụng

| Vai trò | Nhu cầu |
|---|---|
| Khách hàng cuối (chủ nhà, quán cafe, văn phòng tại Ninh Bình/Thanh Hoá/Hà Nam) | Tìm được thông tin dịch vụ, giá tham khảo, ảnh công trình thật, gọi/nhắn tin nhanh |
| Chủ doanh nghiệp (admin) | Đăng bài, sửa nội dung, upload nhiều ảnh công trình, không cần biết code |
| Google (SEO) | Đọc được nội dung có cấu trúc rõ ràng, structured data, tốc độ tải nhanh |

## 3. Phạm vi tính năng (Scope)

### Bắt buộc có (MVP)

- Trang công khai theo `SITEMAP_PAGES.md`: trang chủ, dịch vụ, khu vực, dự án,
  bảng giá, FAQ, blog, liên hệ.
- Trang quản trị `/admin` với đăng nhập, CRUD cho toàn bộ content type.
- Upload nhiều ảnh cùng lúc, sắp xếp lại thứ tự ảnh trong album (kéo-thả).
- SEO kỹ thuật đầy đủ theo `SEO_SPEC.md`.
- Responsive, tối ưu cho mobile.
- Nút gọi điện / nhắn Zalo nổi bật, luôn hiển thị (sticky).

### Không cần trong bản đầu (Out of scope)

- Thanh toán online / giỏ hàng.
- Đa ngôn ngữ.
- Tài khoản khách hàng, bình luận, đánh giá on-site (dùng Google review thay thế).
- Phân quyền nhiều cấp admin (chỉ cần 1-2 tài khoản ngang quyền).

## 4. Yêu cầu phi chức năng

- Tốc độ tải trang < 2.5s trên mobile 4G (ưu tiên SSG/ISR cho các trang ít đổi).
- Điểm Lighthouse SEO + Performance ≥ 90.
- Giao diện đơn giản, dễ dùng cho người không rành máy tính khi vào `/admin`.
- Không dùng thư viện quá phức tạp cho phần admin — ưu tiên form HTML chuẩn + 1 rich
  text editor, tránh over-engineering.

## 5. Tiêu chí hoàn thành (Definition of Done)

- Admin tự đăng được 1 bài dịch vụ mới kèm 5 ảnh, xuất hiện đúng trên trang công khai
  trong vòng vài giây (không cần rebuild thủ công — dùng ISR hoặc revalidate on-demand).
- Google Search Console nhận được sitemap.xml, không có lỗi crawl.
- Mỗi trang khu vực (Ninh Bình/Thanh Hoá) có nội dung khác nhau, không bị gắn cờ
  duplicate content.
- Kiểm tra bằng Rich Results Test của Google: JSON-LD LocalBusiness/Service/FAQPage
  không có lỗi.
