import type { Metadata } from "next";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PartnerDirectory from "@/components/PartnerDirectory";

export const metadata: Metadata = {
  title: "Technology Partners | Senja",
  description: "Explore the trusted technology partners behind Senja's connected workplace, education, hospitality, and digital signage solutions.",
};

export default function PartnersPage() {
  return (
    <>
      <Navigation />
      <main>
        <PartnerDirectory />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
