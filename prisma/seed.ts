import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const processHtml = (paragraphs: string[]) =>
  paragraphs.map((p) => `<p>${p}</p>`).join("");

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@trannano.vn";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      businessName: "Nội Thất Tài Đức",
      facebookUrl: "https://www.facebook.com/trannhuanano",
      googleBusinessUrl: "https://maps.app.goo.gl/WZ7Mh8CeyY5Frvxw6",
      mapEmbedUrl: "https://www.google.com/maps?q=19.9949165,105.485175&z=10&hl=vi&output=embed",
      workingHours: "Nhận điện thoại 24/7",
      serviceAreas: "Ninh Bình, Thanh Hoá, Hà Nam",
      defaultOgImage: "/images/hero.jpg",
      defaultMetaTitle:
        "Trannano.vn - Nội Thất Tài Đức | Chuyên Thi Công Trần Nano",
      defaultMetaDescription:
        "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn.",
    },
    create: {
      id: "singleton",
      businessName: "Nội Thất Tài Đức",
      phone: "0986.979.353",
      zaloUrl: "https://zalo.me/0986979353",
      facebookUrl: "https://www.facebook.com/trannhuanano",
      googleBusinessUrl: "https://maps.app.goo.gl/WZ7Mh8CeyY5Frvxw6",
      mapEmbedUrl: "https://www.google.com/maps?q=19.9949165,105.485175&z=10&hl=vi&output=embed",
      workingHours: "Nhận điện thoại 24/7",
      serviceAreas: "Ninh Bình, Thanh Hoá, Hà Nam",
      defaultMetaTitle:
        "Trannano.vn - Nội Thất Tài Đức | Chuyên Thi Công Trần Nano",
      defaultMetaDescription:
        "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành dài hạn.",
      defaultOgImage: "/images/hero.jpg",
    },
  });

  const pages = [
    {
      slug: "trang-chu",
      title: "Trannano.vn — Chuyên thi công trần nano Ninh Bình & Thanh Hoá",
      content: processHtml([
        "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, ốp tường nhựa, lát sàn nhựa giả gỗ và thiết kế vách bàn thờ, vách tủ tivi cao cấp tại Thanh Hóa, Ninh Bình, Hà Nam. Phương châm \"Làm đẹp - làm kỹ - đảm bảo chất lượng\", mang đến diện mạo mới sang trọng cho mọi ngôi nhà.",
        "Dịch vụ trọng tâm: thi công trần nhựa nano, tấm ốp lam sóng chịu nước, chống ẩm mốc; lát sàn nhựa giả gỗ, sàn nhựa hèm khóa cao cấp; thiết kế, thi công vách bàn thờ trang nghiêm, vách tủ tivi hiện đại; cải tạo nhà cũ xuống cấp, xử lý tường ẩm mốc, trang trí nội thất nhà mới.",
        "Đội thợ tay nghề cao, thi công nhanh, bảo hành dài hạn. Khảo sát, báo giá miễn phí tận nơi.",
      ]),
    },
    {
      slug: "gioi-thieu",
      title: "Giới thiệu Nội Thất Tài Đức",
      content: processHtml([
        "Nội Thất Tài Đức (Trannano.vn) chuyên thi công trần nhựa nano, lát sàn nhựa giả gỗ cho nhà ở, chung cư, quán cà phê, văn phòng tại khu vực Ninh Bình, Thanh Hoá, Hà Nam và vùng lân cận.",
        "Cam kết với khách hàng:",
      ]) +
        `<ul><li>Khảo sát, báo giá miễn phí tận nơi</li><li>Vật tư chính hãng, có xuất xứ rõ ràng</li><li>Thi công nhanh, gọn, sạch — nhà đang ở vẫn làm được</li><li>Bảo hành từ 3-5 năm tuỳ hạng mục</li><li>Giá thợ trực tiếp, không qua trung gian</li></ul>`,
    },
    {
      slug: "lien-he",
      title: "Liên hệ Trannano.vn",
      content: processHtml([
        "Gọi hoặc nhắn Zalo Nội Thất Tài Đức để được khảo sát, báo giá miễn phí tận nơi tại Ninh Bình, Thanh Hoá, Hà Nam.",
        "Hotline: 0986.979.353 — nhận điện thoại 24/7.",
      ]),
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content: page.content },
      create: page,
    });
  }

  const processSteps = `
<h3>Quy trình thi công</h3>
<ol>
<li>Khảo sát, đo đạc, báo giá</li>
<li>Chọn mẫu, màu sắc theo ý khách</li>
<li>Thi công (1 nhà thường xong trong 1 ngày)</li>
<li>Nghiệm thu, bảo hành</li>
</ol>
<p>Không phát sinh chi phí ngoài báo giá ban đầu.</p>`;

  const services = [
    {
      slug: "tran-nhua-nano",
      title: "Trần nhựa nano",
      shortDescription: "Chống ẩm, chống mối mọt, thi công nhanh trong ngày.",
      order: 1,
      content:
        processHtml([
          "Trần nhựa nano là giải pháp thay thế trần thạch cao truyền thống, phù hợp khí hậu nồm ẩm miền Bắc.",
          "3 lý do nên chọn trần nhựa nano:",
        ]) +
        `<ul><li>Chống nước, chống ẩm tốt hơn — hợp khí hậu nồm ẩm miền Bắc</li><li>Nhẹ, không lo sập trần khi thấm dột</li><li>Thi công nhanh, không bụi bặm, không cần sơn lại</li></ul>` +
        processSteps,
    },
    {
      slug: "op-tuong-nhua-nano",
      title: "Ốp tường nhựa nano",
      shortDescription: "Tấm ốp lam sóng chịu nước, chống ẩm mốc.",
      order: 2,
      content:
        processHtml([
          "Ốp tường nhựa nano (lam sóng) giúp tường nhà chống ẩm mốc, dễ vệ sinh, tạo điểm nhấn hiện đại cho phòng khách, phòng ngủ, quán cafe.",
        ]) + processSteps,
    },
    {
      slug: "lat-san-nhua-gia-go",
      title: "Lát sàn nhựa giả gỗ",
      shortDescription: "Sàn nhựa hèm khoá cao cấp, vân gỗ tự nhiên, cho mọi công trình.",
      order: 3,
      content:
        processHtml([
          "Sàn nhựa giả gỗ hèm khoá cao cấp mang vẻ đẹp vân gỗ tự nhiên, chống nước tốt, thi công nhanh, phù hợp nhà ở và không gian thương mại.",
        ]) + processSteps,
    },
    {
      slug: "vach-ban-tho",
      title: "Vách bàn thờ",
      shortDescription: "Thiết kế, thi công vách bàn thờ trang nghiêm.",
      order: 4,
      content:
        processHtml([
          "Thiết kế và thi công vách bàn thờ trang nghiêm, hài hoà phong thuỷ, dùng tấm nhựa nano / lam sóng bền đẹp, dễ vệ sinh.",
        ]) + processSteps,
    },
    {
      slug: "vach-tu-tivi",
      title: "Vách tủ tivi",
      shortDescription: "Thiết kế, thi công vách tủ tivi hiện đại.",
      order: 5,
      content:
        processHtml([
          "Vách tủ tivi hiện đại kết hợp tấm ốp nano, tạo điểm nhấn phòng khách sang trọng, tối ưu không gian lưu trữ.",
        ]) + processSteps,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        shortDescription: s.shortDescription,
        content: s.content,
        order: s.order,
        published: true,
      },
      create: {
        ...s,
        images: "[]",
        published: true,
      },
    });
  }

  const locations = [
    {
      slug: "ninh-binh",
      title: "Ninh Bình",
      order: 1,
      content: processHtml([
        "Nội Thất Tài Đức (Trannano.vn) nhận thi công trần nhựa nano, ốp tường và lát sàn nhựa tại <strong>TP Ninh Bình, Tam Điệp, Hoa Lư</strong> và các huyện Gia Viễn, Nho Quan, Yên Khánh, Yên Mô.",
        "Khí hậu nồm ẩm miền Bắc dễ làm trần thạch cao bị mốc — trần nhựa nano chống ẩm, thi công gọn trong ngày, nhà đang ở vẫn làm được.",
        "Nhiều công trình nhà ở, quán cafe đã hoàn thiện tại Ninh Bình. Khảo sát, báo giá miễn phí tận nơi trong ngày — gọi <a href=\"tel:0986979353\">0986.979.353</a>.",
        'Xem thêm: <a href="/dich-vu/tran-nhua-nano">thi công trần nhựa nano</a>, <a href="/blog/gia-thi-cong-tran-nhua-nano-tai-ninh-binh">bảng giá trần nano tại Ninh Bình</a>.',
      ]),
    },
    {
      slug: "thanh-hoa",
      title: "Thanh Hoá",
      order: 2,
      content: processHtml([
        "Đội thợ Nội Thất Tài Đức thi công thường xuyên tại <strong>TP Thanh Hoá, Sầm Sơn, Bỉm Sơn</strong> và các huyện Đông Sơn, Quảng Xương, Hoằng Hoá, Nga Sơn.",
        "Chuyên trần nhựa nano chống ẩm, sàn nhựa giả gỗ hèm khoá cho nhà phố, nhà cấp 4 và quán cafe / nhà nghỉ ven biển Sầm Sơn — chịu ẩm mặn tốt hơn gỗ tự nhiên.",
        "Tư vấn mẫu, màu sắc và báo giá thi công tại Thanh Hoá miễn phí. Hotline <a href=\"tel:0986979353\">0986.979.353</a> — nhận điện thoại 24/7.",
        'Xem thêm: <a href="/dich-vu/lat-san-nhua-gia-go">lát sàn nhựa giả gỗ</a>, <a href="/du-an?location=thanh-hoa">dự án đã làm tại Thanh Hoá</a>.',
      ]),
    },
    {
      slug: "ha-nam",
      title: "Hà Nam",
      order: 3,
      content: processHtml([
        "Trannano.vn phục vụ khách hàng tại <strong>TP Phủ Lý, Duy Tiên, Kim Bảng, Lý Nhân, Thanh Liêm, Bình Lục</strong> với trần nhựa nano, ốp tường, vách bàn thờ và vách tủ tivi.",
        "Nhà phố mới xây hoặc cải tạo nhà cũ tại Hà Nam thường gặp tường ẩm, trần cũ xuống cấp — chúng tôi khảo sát tận nơi, chọn vật tư phù hợp từng phòng.",
        "Cam kết vật tư rõ nguồn gốc, thi công gọn trong ngày, bảo hành 3–5 năm. Nhắn Zalo hoặc gọi <a href=\"tel:0986979353\">0986.979.353</a> để hẹn lịch miễn phí.",
        'Xem thêm: <a href="/dich-vu/tran-nhua-nano">trần nhựa nano</a>, <a href="/du-an?location=ha-nam">công trình tại Hà Nam</a>.',
      ]),
    },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {
        title: loc.title,
        content: loc.content,
        order: loc.order,
        published: true,
      },
      create: {
        ...loc,
        images: "[]",
        published: true,
      },
    });
  }

  const ninhBinh = await prisma.location.findUnique({ where: { slug: "ninh-binh" } });
  const thanhHoa = await prisma.location.findUnique({ where: { slug: "thanh-hoa" } });
  const haNam = await prisma.location.findUnique({ where: { slug: "ha-nam" } });

  const projects = [
    {
      slug: "tran-nhua-nano-nha-anh-tuan-ninh-binh",
      title: "Thi công trần nhựa nano nhà anh Tuấn - TP Ninh Bình",
      content: processHtml([
        "Thay trần cũ ẩm mốc bằng trần nhựa nano tấm 200mm, hoàn thiện trong 1 ngày tại TP Ninh Bình.",
        'Khách chọn màu trắng ngà, kết hợp <a href="/dich-vu/op-tuong-nhua-nano">ốp tường nhựa</a> phòng khách. Xem dịch vụ <a href="/dich-vu/tran-nhua-nano">trần nhựa nano</a> và khu vực <a href="/khu-vuc/ninh-binh">Ninh Bình</a>.',
      ]),
      locationId: ninhBinh?.id,
    },
    {
      slug: "san-nhua-quan-cafe-sam-son",
      title: "Lát sàn nhựa giả gỗ quán cafe - Sầm Sơn",
      content: processHtml([
        "Lát sàn nhựa hèm khoá chống nước cho quán cafe ven biển Sầm Sơn, Thanh Hoá.",
        'Vân gỗ sồi ấm, chịu ẩm mặn tốt. Xem <a href="/dich-vu/lat-san-nhua-gia-go">lát sàn nhựa giả gỗ</a> và khu vực <a href="/khu-vuc/thanh-hoa">Thanh Hoá</a>.',
      ]),
      locationId: thanhHoa?.id,
    },
    {
      slug: "tran-nano-nha-chi-hoa-phu-ly",
      title: "Thi công trần nano nhà chị Hoa - Phủ Lý, Hà Nam",
      content: processHtml([
        "Thi công trần nhựa nano toàn bộ tầng 1 nhà phố tại Phủ Lý: phòng khách, bếp, 2 phòng ngủ — xong trong 1 ngày.",
        "Nhà cũ trần thạch cao bị ố vàng do ẩm; thay bằng nano tấm 200mm màu trắng, không đục phá tường.",
        'Xem thêm dịch vụ <a href="/dich-vu/tran-nhua-nano">trần nhựa nano</a> và khu vực <a href="/khu-vuc/ha-nam">Hà Nam</a>.',
      ]),
      locationId: haNam?.id,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        content: p.content,
        locationId: p.locationId,
        published: true,
      },
      create: {
        ...p,
        images: "[]",
        published: true,
        projectDate: new Date(),
      },
    });
  }

  const faqs = [
    {
      question: "Trần nhựa nano có bền không?",
      answer:
        "<p>Trần nhựa nano chống ẩm, chống mối mọt tốt hơn trần thạch cao, tuổi thọ trung bình 10-15 năm nếu thi công đúng kỹ thuật, bảo hành 3-5 năm tuỳ hạng mục.</p>",
      order: 1,
      serviceSlug: "tran-nhua-nano",
    },
    {
      question: "Thi công trần nhựa nano mất bao lâu?",
      answer:
        "<p>Với nhà ở thông thường, thi công thường hoàn thành trong 1 ngày, không cần đục phá tường, nhà đang ở vẫn làm được.</p>",
      order: 2,
      serviceSlug: "tran-nhua-nano",
    },
    {
      question: "Sàn nhựa giả gỗ có chống nước không?",
      answer:
        "<p>Có, sàn nhựa hèm khoá cao cấp chống nước tốt, phù hợp cả khu vực ẩm ướt như nhà bếp, nhà vệ sinh (tuỳ dòng sản phẩm).</p>",
      order: 3,
      serviceSlug: "lat-san-nhua-gia-go",
    },
  ];

  const tranService = await prisma.service.findUnique({
    where: { slug: "tran-nhua-nano" },
  });
  const sanService = await prisma.service.findUnique({
    where: { slug: "lat-san-nhua-gia-go" },
  });

  const serviceBySlug: Record<string, string | undefined> = {
    "tran-nhua-nano": tranService?.id,
    "lat-san-nhua-gia-go": sanService?.id,
  };

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    const data = {
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      published: true,
      serviceId: serviceBySlug[faq.serviceSlug] ?? null,
    };
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data });
    } else {
      await prisma.faq.create({ data });
    }
  }

  // Enrich service meta descriptions for SERP
  if (tranService) {
    await prisma.service.update({
      where: { id: tranService.id },
      data: {
        metaDescription:
          "Thi công trần nhựa nano chống ẩm, chống mối mọt tại Ninh Bình, Thanh Hoá, Hà Nam. Báo giá miễn phí tận nơi, bảo hành 3-5 năm.",
      },
    });
  }
  if (sanService) {
    await prisma.service.update({
      where: { id: sanService.id },
      data: {
        metaDescription:
          "Lát sàn nhựa giả gỗ hèm khoá chống nước tại Ninh Bình, Thanh Hoá, Hà Nam. Vân gỗ tự nhiên, thi công nhanh, báo giá miễn phí.",
      },
    });
  }

  const priceCount = await prisma.priceItem.count();
  if (priceCount === 0) {
    await prisma.priceItem.createMany({
      data: [
        {
          name: "Trần nhựa nano - tấm 200mm",
          priceFrom: 180000,
          unit: "m2",
          note: "Đã gồm nhân công",
          serviceId: tranService?.id,
          order: 1,
        },
        {
          name: "Trần nhựa nano - tấm cao cấp",
          priceFrom: 250000,
          unit: "m2",
          note: "Đã gồm nhân công",
          serviceId: tranService?.id,
          order: 2,
        },
        {
          name: "Sàn nhựa giả gỗ hèm khoá",
          priceFrom: 220000,
          unit: "m2",
          note: "Tuỳ độ dày và thương hiệu",
          serviceId: sanService?.id,
          order: 3,
        },
      ],
    });
  }

  const blogs = [
    {
      slug: "nen-chon-tran-nhua-nano-hay-tran-thach-cao",
      title: "Nên chọn trần nhựa nano hay trần thạch cao?",
      excerpt:
        "So sánh ưu nhược điểm trần nhựa nano và trần thạch cao để chọn đúng cho nhà ở miền Bắc.",
      content: processHtml([
        "Trần thạch cao đẹp nhưng dễ ẩm mốc khi nhà bị thấm. Trần nhựa nano chống ẩm tốt hơn, thi công nhanh, phù hợp khí hậu nồm miền Bắc.",
        'Nếu nhà bạn từng bị thấm dột hoặc ở vùng ẩm, nên ưu tiên <a href="/dich-vu/tran-nhua-nano">trần nhựa nano</a>.',
        'Trannano.vn thi công tại <a href="/khu-vuc/ninh-binh">Ninh Bình</a>, <a href="/khu-vuc/thanh-hoa">Thanh Hoá</a>, <a href="/khu-vuc/ha-nam">Hà Nam</a> — khảo sát miễn phí.',
      ]),
      category: "Tư vấn",
    },
    {
      slug: "cach-ve-sinh-bao-quan-san-nhua-gia-go",
      title: "Cách vệ sinh, bảo quản sàn nhựa giả gỗ đúng cách",
      excerpt: "Hướng dẫn giữ sàn nhựa luôn đẹp, bền lâu.",
      content: processHtml([
        "Lau sàn bằng khăn ẩm, tránh hoá chất tẩy mạnh. Không để nước đọng lâu trên mạch nối.",
        "Đặt thảm ở cửa ra vào để giảm cát sỏi làm xước bề mặt.",
        'Cần lát mới? Xem dịch vụ <a href="/dich-vu/lat-san-nhua-gia-go">lát sàn nhựa giả gỗ</a> tại Ninh Bình, Thanh Hoá, Hà Nam.',
      ]),
      category: "Bảo quản",
    },
    {
      slug: "gia-thi-cong-tran-nhua-nano-tai-ninh-binh",
      title: "Giá thi công trần nhựa nano tại Ninh Bình 2026",
      excerpt:
        "Bảng giá tham khảo trần nhựa nano tại TP Ninh Bình, Tam Điệp, Hoa Lư — đã gồm nhân công, báo giá tận nơi miễn phí.",
      content: processHtml([
        "Giá thi công trần nhựa nano tại Ninh Bình thường dao động theo loại tấm (200mm / cao cấp), diện tích và độ phức tạp khung xương. Mức tham khảo phổ biến từ khoảng 180.000–250.000đ/m² đã gồm nhân công.",
        'Tại <a href="/khu-vuc/ninh-binh">Ninh Bình</a>, Nội Thất Tài Đức (Trannano.vn) khảo sát đo đạc tận nơi, báo giá rõ ràng trước khi làm — không phát sinh ngoài báo giá.',
        'Xem chi tiết dịch vụ <a href="/dich-vu/tran-nhua-nano">thi công trần nhựa nano</a>, bảng giá tổng hợp tại <a href="/bang-gia">/bang-gia</a>, hoặc gọi <a href="tel:0986979353">0986.979.353</a> để đặt lịch trong ngày.',
        'Công trình mẫu: <a href="/du-an/tran-nhua-nano-nha-anh-tuan-ninh-binh">nhà anh Tuấn – TP Ninh Bình</a>. Cũng phục vụ <a href="/khu-vuc/thanh-hoa">Thanh Hoá</a> và <a href="/khu-vuc/ha-nam">Hà Nam</a>.',
      ]),
      category: "Báo giá",
    },
  ];

  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        category: b.category,
        published: true,
      },
      create: {
        ...b,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed OK");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
