/**
 * Map Senja-BE resource JSON to FE component shapes.
 * Every mapper tolerates missing fields (BE returns nulls for drafts).
 */
import type { Project } from "@/data/projects";
import type { TechnologyPartner } from "@/data/partners";

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function img(v: unknown, fallback = "/images/2.png"): string {
  if (typeof v === "string" && v) return v;
  if (v && typeof v === "object") {
    const src = (v as { src?: unknown }).src;
    if (typeof src === "string" && src) return src;
  }
  return fallback;
}

export function mapProject(p: Record<string, unknown>): Project {
  const cover = p.cover_image as { src?: string } | undefined;
  return {
    slug: str(p.slug),
    number: str(p.number, "00"),
    title: str(p.title, "Untitled project"),
    category: (p.category as Project["category"]) ?? "Workplace",
    location: str(p.location, "-"),
    year: str(p.year, "-"),
    client: str(p.client, "-"),
    image: str(p.image, cover?.src ?? "/images/2.png"),
    description: str(p.description ?? p.summary),
    overview: str(p.overview ?? p.content),
    challenge: str(p.challenge),
    solution: str(p.solution),
    services: Array.isArray(p.services) ? (p.services as string[]).map(String) : [],
    stats: Array.isArray(p.stats)
      ? (p.stats as { value?: unknown; label?: unknown }[]).map((s) => ({
          value: str(s.value),
          label: str(s.label),
        }))
      : [],
    partners: Array.isArray(p.partners)
      ? (p.partners as Record<string, unknown>[]).map((x) => ({
          name: str(x.name),
          image: img(x.image ?? x.logo, "/images/partners-1.png"),
          slug: str(x.slug),
        }))
      : [],
    gallery: Array.isArray(p.gallery)
      ? (p.gallery as Record<string, unknown>[]).map((g) => ({
          src: img(g.src ?? g.path, "/images/2.png"),
          alt: str(g.alt),
          position: typeof g.position === "string" ? (g.position as string) : undefined,
        }))
      : [],
    featured: Boolean(p.featured),
  };
}

export function mapPartner(p: Record<string, unknown>): TechnologyPartner {
  return {
    slug: str(p.slug),
    number: str(p.number, "00"),
    name: str(p.name, "Partner"),
    image: img(p.image ?? p.logo, "/images/partners-1.png"),
    category: (p.category as TechnologyPartner["category"]) ?? "Display",
    description: str(p.description),
    capabilities: Array.isArray(p.capabilities) ? (p.capabilities as unknown[]).map(String) : [],
    relationship: str(p.relationship),
    relationshipDetail: str(p.relationshipDetail ?? p.relationship_detail),
    heroImage: img(p.heroImage ?? p.hero_image, "/images/2.png"),
    gallery: Array.isArray(p.gallery)
      ? (p.gallery as Record<string, unknown>[]).map((g) => ({
          src: img(g.src ?? g.path, "/images/2.png"),
          alt: str(g.alt),
          position: typeof g.position === "string" ? (g.position as string) : undefined,
        }))
      : [],
    products: Array.isArray(p.products)
      ? (p.products as Record<string, unknown>[]).map((x) => ({
          name: str(x.name),
          category: str(x.category),
          description: str(x.description),
          image: img(x.image, "/images/2.png"),
        }))
      : [],
  };
}
