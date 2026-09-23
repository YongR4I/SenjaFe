import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Contact Senja | Start Your Project",
  description: "Talk to Senja about meeting rooms, digital signage, learning spaces, network infrastructure, and connected technology experiences.",
};

export default function Contact() {
  return (
    <>
      <Navigation />
      <main><ContactPage /></main>
      <Footer />
    </>
  );
}
