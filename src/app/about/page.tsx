import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "About Senja | Technology Made Human",
  description:
    "Meet Senja, a technology integration team creating intuitive meeting rooms, learning spaces, digital signage, and connected environments.",
};

export default function About() {
  return (
    <>
      <Navigation />
      <main><AboutPage /></main>
      <Footer />
    </>
  );
}
