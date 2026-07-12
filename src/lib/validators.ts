import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Tiêu đề bắt buộc"),
  slug: z.string().optional(),
  shortDescription: z.string().optional().nullable(),
  content: z.string().default(""),
  images: z.array(z.string()).default([]),
  iconUrl: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const locationSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().default(""),
  images: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().default(""),
  images: z.array(z.string()).default([]),
  projectDate: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().default(""),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().default(""),
  serviceId: z.string().optional().nullable(),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const priceSchema = z.object({
  name: z.string().min(1),
  priceFrom: z.number().int().min(0),
  unit: z.string().default("m2"),
  note: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const pageSchema = z.object({
  title: z.string().min(1),
  content: z.string().default(""),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

export const settingsSchema = z.object({
  businessName: z.string().min(1),
  phone: z.string().min(1),
  zaloUrl: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  workingHours: z.string().min(1),
  serviceAreas: z.string().min(1),
  mapEmbedUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  googleBusinessUrl: z.string().optional().nullable(),
  heroImages: z.array(z.string()).optional().default([]),
  defaultMetaTitle: z.string().min(1),
  defaultMetaDescription: z.string().min(1),
  defaultOgImage: z.string().optional().nullable(),
});
