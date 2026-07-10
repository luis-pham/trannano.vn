/** Local fallback when album chưa có ảnh — tránh picsum/CDN ngoài */
export const DEFAULT_PLACEHOLDER = "/images/hero.jpg";

export function placeholderImage(_seed?: string, _width?: number, _height?: number) {
  return DEFAULT_PLACEHOLDER;
}

export function serviceImage(_slug: string, images: string[]) {
  return images[0] || DEFAULT_PLACEHOLDER;
}

export function projectImage(_slug: string, images: string[]) {
  return images[0] || DEFAULT_PLACEHOLDER;
}

export function locationImage(_slug: string, images: string[]) {
  return images[0] || DEFAULT_PLACEHOLDER;
}
