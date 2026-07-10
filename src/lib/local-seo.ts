/** Local SEO helpers — excerpts & related content maps */

export const LOCATION_EXCERPTS: Record<string, string> = {
  "ninh-binh":
    "Nhận thi công tại TP Ninh Bình, Tam Điệp, Hoa Lư — trần nano chống ẩm, báo giá trong ngày.",
  "thanh-hoa":
    "Đội thợ thường xuyên tại TP Thanh Hoá, Sầm Sơn — trần nano & sàn nhựa cho nhà phố, quán cafe.",
  "ha-nam":
    "Phục vụ Phủ Lý, Duy Tiên, Kim Bảng, Lý Nhân — thi công gọn, bảo hành dài hạn.",
};

/** Blog slug → related service + location slugs for internal linking */
export const BLOG_RELATED: Record<
  string,
  { services: string[]; locations: string[] }
> = {
  "nen-chon-tran-nhua-nano-hay-tran-thach-cao": {
    services: ["tran-nhua-nano"],
    locations: ["ninh-binh", "thanh-hoa", "ha-nam"],
  },
  "cach-ve-sinh-bao-quan-san-nhua-gia-go": {
    services: ["lat-san-nhua-gia-go"],
    locations: ["ninh-binh", "thanh-hoa", "ha-nam"],
  },
  "gia-thi-cong-tran-nhua-nano-tai-ninh-binh": {
    services: ["tran-nhua-nano"],
    locations: ["ninh-binh"],
  },
};

/** Location slug → related blog slugs */
export function relatedBlogSlugsForLocation(locationSlug: string): string[] {
  const matches: string[] = [];
  for (const [blogSlug, rel] of Object.entries(BLOG_RELATED)) {
    if (rel.locations.includes(locationSlug)) matches.push(blogSlug);
  }
  // Prefer geo-specific posts first
  return matches.sort((a, b) => {
    const aGeo = a.includes(locationSlug.replace(/-/g, "")) || a.includes(locationSlug);
    const bGeo = b.includes(locationSlug.replace(/-/g, "")) || b.includes(locationSlug);
    if (a.includes("ninh-binh") && locationSlug === "ninh-binh") return -1;
    if (b.includes("ninh-binh") && locationSlug === "ninh-binh") return 1;
    return Number(bGeo) - Number(aGeo);
  });
}

export function relatedForBlog(blogSlug: string) {
  return (
    BLOG_RELATED[blogSlug] || {
      services: ["tran-nhua-nano"],
      locations: ["ninh-binh", "thanh-hoa", "ha-nam"],
    }
  );
}
