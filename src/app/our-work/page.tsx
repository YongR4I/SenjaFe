import type { Metadata } from "next";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import WorkArchive from "@/components/WorkArchive";

export const metadata: Metadata = {
  title: "Our Work | Senja",
  description: "Explore workplace, education, hospitality, and F&B technology projects designed and integrated by Senja.",
};

export default function OurWorkPage() {
  return (
    <>
      <Navigation />
      <main>
        <WorkArchive />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
