# CONTENT SEED — nội dung thật để seed vào DB

Dùng nội dung này viết script `prisma/seed.ts` (hoặc nhập tay qua `/admin` sau khi
build xong) để site có sẵn dữ liệu thật ngay từ đầu, không phải "Lorem ipsum".

Thông tin cần điền thêm trước khi seed: `[SỐ ĐIỆN THOẠI]` đã có sẵn `0986.979.353`,
`[ĐỊA CHỈ]` — điền nếu muốn công khai, để trống nếu chọn service-area business.

## SiteSettings

```
businessName: "Trần Nano"
phone: "0986.979.353"
serviceAreas: "Thanh Hoá, Ninh Bình, Hà Nam"
workingHours: "7:00 - 18:00, tất cả các ngày trong tuần"
defaultMetaTitle: "Trần Nano - Thi công trần nhựa nano, sàn nhựa tại Ninh Bình, Thanh Hoá"
defaultMetaDescription: "Thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Thanh Hoá, Ninh Bình, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn."
```

## Page: trang-chu (đoạn giới thiệu ngắn)

```
Trần Nano chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ và thiết
kế vách bàn thờ, vách tủ tivi cao cấp tại Thanh Hóa, Ninh Bình, Hà Nam. Phương châm
"Làm đẹp - làm kỹ - đảm bảo chất lượng", mang đến diện mạo mới sang trọng cho mọi
ngôi nhà.

Dịch vụ trọng tâm:
- Thi công trần nhựa nano, tấm ốp lam sóng chịu nước, chống ẩm mốc
- Lát sàn nhựa giả gỗ, sàn nhựa hèm khóa cao cấp
- Thiết kế, thi công vách bàn thờ trang nghiêm, vách tủ tivi hiện đại
- Cải tạo nhà cũ xuống cấp, xử lý tường ẩm mốc, trang trí nội thất nhà mới

Đội thợ tay nghề cao, thi công nhanh, bảo hành dài hạn. Khảo sát, báo giá miễn phí
tận nơi.
```

## Page: gioi-thieu

```
Trần Nano chuyên thi công trần nhựa nano, lát sàn nhựa giả gỗ cho nhà ở, chung cư,
quán cà phê, văn phòng tại khu vực Ninh Bình, Thanh Hoá, Hà Nam và vùng lân cận.

Cam kết với khách hàng:
- Khảo sát, báo giá miễn phí tận nơi
- Vật tư chính hãng, có xuất xứ rõ ràng
- Thi công nhanh, gọn, sạch — nhà đang ở vẫn làm được
- Bảo hành từ 3-5 năm tuỳ hạng mục
- Giá thợ trực tiếp, không qua trung gian
```

## Services (5 dịch vụ khởi điểm)

1. **slug: `tran-nhua-nano`** — "Trần nhựa nano"
   shortDescription: "Chống ẩm, chống mối mọt, thi công nhanh trong ngày."
   3 lý do nên chọn (dùng trong content):
   - Chống nước, chống ẩm tốt hơn — hợp khí hậu nồm ẩm miền Bắc
   - Nhẹ, không lo sập trần khi thấm dột
   - Thi công nhanh, không bụi bặm, không cần sơn lại

2. **slug: `op-tuong-nhua-nano`** — "Ốp tường nhựa nano"
   shortDescription: "Tấm ốp lam sóng chịu nước, chống ẩm mốc."

3. **slug: `lat-san-nhua-gia-go`** — "Lát sàn nhựa giả gỗ"
   shortDescription: "Sàn nhựa hèm khoá cao cấp, vân gỗ tự nhiên, cho mọi công trình."

4. **slug: `vach-ban-tho`** — "Vách bàn thờ"
   shortDescription: "Thiết kế, thi công vách bàn thờ trang nghiêm."

5. **slug: `vach-tu-tivi`** — "Vách tủ tivi"
   shortDescription: "Thiết kế, thi công vách tủ tivi hiện đại."

## Quy trình thi công (dùng chung, chèn vào content của Service hoặc trang riêng)

```
1. Khảo sát, đo đạc, báo giá
2. Chọn mẫu, màu sắc theo ý khách
3. Thi công (1 nhà thường xong trong 1 ngày)
4. Nghiệm thu, bảo hành
Không phát sinh chi phí ngoài báo giá ban đầu.
```

## Locations (3 khu vực)

- **slug: `ninh-binh`** — "Ninh Bình" — nội dung riêng, nhắc TP Ninh Bình, Tam Điệp,
  Hoa Lư.
- **slug: `thanh-hoa`** — "Thanh Hoá" — nội dung riêng, nhắc TP Thanh Hoá, Sầm Sơn.
- **slug: `ha-nam`** — "Hà Nam" — nội dung riêng.

(Viết nội dung chi tiết từng khu vực sau khi có ảnh công trình thật tại từng nơi —
không seed nội dung trùng lặp giữa 3 khu vực.)

## FAQ mẫu

1. Q: "Trần nhựa nano có bền không?"
   A: "Trần nhựa nano chống ẩm, chống mối mọt tốt hơn trần thạch cao, tuổi thọ trung
   bình 10-15 năm nếu thi công đúng kỹ thuật, bảo hành 3-5 năm tuỳ hạng mục."

2. Q: "Thi công trần nhựa nano mất bao lâu?"
   A: "Với nhà ở thông thường, thi công thường hoàn thành trong 1 ngày, không cần đục
   phá tường, nhà đang ở vẫn làm được."

3. Q: "Sàn nhựa giả gỗ có chống nước không?"
   A: "Có, sàn nhựa hèm khoá cao cấp chống nước tốt, phù hợp cả khu vực ẩm ướt như
   nhà bếp, nhà vệ sinh (tuỳ dòng sản phẩm)."

## Bài blog gợi ý (viết dần, mỗi bài nhắm 1 từ khoá dài)

- "Nên chọn trần nhựa nano hay trần thạch cao?"
- "Cách vệ sinh, bảo quản sàn nhựa giả gỗ đúng cách"
- "3 dấu hiệu cho thấy nên thay trần cũ sang trần nhựa nano"
- "Giá thi công trần nhựa nano tại Ninh Bình mới nhất"
- "Kinh nghiệm chọn vách tủ tivi hợp phong thuỷ"

## Nội dung quảng cáo tham khảo (đã dùng chạy Fanpage, có thể tái dùng làm banner trang chủ)

```
Trần nhà bạn đang cũ, ẩm mốc, cong vênh?
Đổi ngay sang trần nhựa nano — chống ẩm, chống mối mọt, thi công gọn trong 1 ngày.
Nhận thi công tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí — Inbox ngay!
```
