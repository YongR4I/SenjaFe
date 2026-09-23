"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    icon: "consultation",
    title: "Consultation",
    description: "Expert solutions tailored to your needs",
  },
  {
    icon: "planning",
    title: "Planning",
    description: "From concept to detailed implementation",
  },
  {
    icon: "support",
    title: "Support",
    description: "Reliable after-sales and ongoing support",
  },
] as const;

type ServiceIconName = (typeof services)[number]["icon"];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === "consultation") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 6.5h14v9H9l-4 3v-12Z" />
        <path d="M9 10h6M9 13h4" />
      </svg>
    );
  }

  if (name === "planning") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="6" width="14" height="13" rx="2" />
        <path d="M8 4v4M16 4v4M5 10h14M9 14h2M13 14h2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.5-2.8 7.3-7 9-4.2-1.7-7-4.5-7-9V6l7-3Z" />
      <path d="m9 11.5 2 2 4-4" />
    </svg>
  );
}

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-cta-reveal]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="contact" className="cta-section">
      <div className="cta-panel">
        <div className="cta-panel__content">
          <p className="cta-panel__eyebrow" data-cta-reveal>
            Let&apos;s build something great
          </p>
          <h2 data-cta-reveal>
            Ready to Transform
            <br />
            Your <span>Workspace?</span>
          </h2>
          <p className="cta-panel__description" data-cta-reveal>
            Let&apos;s discuss how Senja can help you create smarter, more
            connected spaces with the right technology.
          </p>
          <div className="cta-panel__actions" data-cta-reveal>
            <Link href="/contact">Schedule consultation</Link>
            <Link href="/our-work">View our works</Link>
          </div>
        </div>

        <div className="cta-panel__services">
          {services.map((service) => (
            <article key={service.title} data-cta-reveal>
              <span className="cta-panel__service-icon" aria-hidden="true">
                <ServiceIcon name={service.icon} />
              </span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
