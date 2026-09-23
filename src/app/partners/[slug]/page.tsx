import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PartnerDetail from "@/components/PartnerDetail";
import { getPartnerBySlug, technologyPartners } from "@/data/partners";
import { fetchPartner } from "@/lib/api";
import { mapPartner } from "@/lib/mappers";

type PartnerPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return technologyPartners.map((partner) => ({ slug: partner.slug }));
}

async function getPartner(slug: string) {
  try {
    const item = await fetchPartner(slug);
    if (item && typeof item === "object") return mapPartner(item as Record<string, unknown>);
  } catch {
    // offline → static fallback below
  }
  return getPartnerBySlug(slug) ?? null;
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartner(slug);

  if (!partner) return { title: "Partner not found | Senja" };

  return {
    title: `${partner.name} Partner & Products | Senja`,
    description: `${partner.relationship} Explore ${partner.name} products available through Senja.`,
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { slug } = await params;
  const partner = await getPartner(slug);

  if (!partner) notFound();

  const pool = technologyPartners.some((item) => item.slug === partner.slug)
    ? technologyPartners
    : [partner, ...technologyPartners];
  const currentIndex = pool.findIndex((item) => item.slug === partner.slug);
  const nextPartner = pool[(currentIndex + 1) % pool.length];

  return (
    <>
      <Navigation />
      <main>
        <PartnerDetail partner={partner} nextPartner={nextPartner} />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
