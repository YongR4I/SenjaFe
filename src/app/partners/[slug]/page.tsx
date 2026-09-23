import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PartnerDetail from "@/components/PartnerDetail";
import { getPartnerBySlug, technologyPartners } from "@/data/partners";

type PartnerPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return technologyPartners.map((partner) => ({ slug: partner.slug }));
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) return { title: "Partner not found | Senja" };

  return {
    title: `${partner.name} Partner & Products | Senja`,
    description: `${partner.relationship} Explore ${partner.name} products available through Senja.`,
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) notFound();

  const currentIndex = technologyPartners.findIndex((item) => item.slug === partner.slug);
  const nextPartner = technologyPartners[(currentIndex + 1) % technologyPartners.length];

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
