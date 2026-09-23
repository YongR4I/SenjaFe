import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import OurWork from "@/components/OurWork";
import Partners from "@/components/Partners";
import ScrollShowcase from "@/components/ScrollShowcase";
import WhoWeServe from "@/components/WhoWeServe";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ScrollShowcase />
        <OurWork />
        <About />
        <WhoWeServe />
        <Partners />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
