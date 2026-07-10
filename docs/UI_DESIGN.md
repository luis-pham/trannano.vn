# UI DESIGN

## 1. Nguyên tắc chung

- Mobile-first — đa số khách tìm dịch vụ thợ qua điện thoại, thiết kế cho màn hình nhỏ
  trước, mở rộng lên desktop sau.
- Đơn giản, rõ ràng, không cần hiệu ứng phức tạp — ưu tiên tốc độ tải và độ tin cậy
  (ảnh công trình thật) hơn là hoạt ảnh bắt mắt.
- Mọi trang đều phải có ít nhất 1 CTA gọi điện/nhắn Zalo trong tầm nhìn đầu tiên
  (above the fold).

## 2. Màu sắc gợi ý

- Màu chủ đạo: xanh dương đậm hoặc xanh navy (`#1F4E79` — đã dùng trong file Word
  fanpage trước đó) — gợi cảm giác chuyên nghiệp, tin cậy, hợp ngành xây dựng/nội thất.
  Nếu muốn ấm hơn nữa, cân nhắc thêm 1 màu nhấn cam/vàng gạch cho nút CTA.
- Nút CTA (Gọi ngay/Nhắn Zalo): màu tương phản mạnh (cam hoặc xanh lá), luôn nổi bật
  trên nền.
- Nền chủ đạo: trắng/xám nhạt, để ảnh công trình là điểm nhấn chính.

## 3. Typography

- Font sans-serif rõ ràng, dễ đọc trên mobile (ví dụ hệ font hệ thống hoặc 1 font
  Google Fonts tiếng Việt hỗ trợ đầy đủ dấu — dùng `next/font` để tối ưu tải).
- Cỡ chữ tối thiểu 16px cho nội dung, tiêu đề rõ cấp bậc (H1 > H2 > H3).

## 4. Bố cục trang chủ (thứ tự các block)

1. Header + nút gọi nổi bật ngay góc phải.
2. Hero: 1 câu định vị ngắn + ảnh công trình đẹp nhất + nút "Gọi ngay" / "Nhận báo giá".
3. Khối USP (3-4 điểm, dùng icon): chống ẩm, thi công nhanh, bảo hành dài hạn, giá thợ
   trực tiếp.
4. Danh sách dịch vụ (dạng card, link tới từng trang dịch vụ).
5. Dự án nổi bật (vài ảnh trước/sau, link "Xem thêm dự án").
6. Khu vực phục vụ (3 card Ninh Bình/Thanh Hoá/Hà Nam, link tới trang khu vực).
7. Feedback khách hàng (nếu có).
8. FAQ rút gọn (3-5 câu, link "Xem thêm").
9. CTA cuối trang + form liên hệ ngắn.
10. Footer với NAP đầy đủ.

## 5. Trang dịch vụ / khu vực

- Ảnh đại diện lớn ở đầu trang.
- Nội dung chia đoạn ngắn, có heading phụ (H2/H3) chứa từ khoá.
- Album ảnh dạng lưới, bấm vào phóng to (lightbox đơn giản).
- Cuối trang: bảng giá liên quan (nếu có) + FAQ liên quan + CTA.

## 6. Component nút gọi nổi (CallButton)

- Cố định ở góc dưới màn hình (mobile) hoặc góc dưới phải (desktop), luôn hiển thị khi
  cuộn trang.
- 2 nút: "Gọi ngay [SĐT]" và "Nhắn Zalo" — không che nội dung quan trọng, có thể thu
  gọn thành 1 nút tròn nếu cần tiết kiệm diện tích trên mobile.

## 7. Trang Admin

- Không cần đẹp bằng trang public — ưu tiên rõ ràng, dễ thao tác.
- Layout 2 cột: menu trái cố định + nội dung form/bảng bên phải.
- Form 1 cột dọc, nhãn rõ ràng bằng tiếng Việt, nút "Lưu" luôn ở vị trí dễ thấy
  (thường là cuối form + sticky khi cuộn dài).
