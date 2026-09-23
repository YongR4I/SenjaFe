"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const sectors = [
  {
    title: "Corporate Office",
    image: "/images/1.png",
    position: "center",
  },
  {
    title: "Retail & F&B",
    image: "/images/3.png",
    position: "center",
  },
  {
    title: "Education",
    image: "/images/2.png",
    position: "center",
  },
  {
    title: "Hospitality",
    image: "/images/5.png",
    position: "center",
  },
] as const;

export default function WhoWeServe() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 76%",
          once: true,
        },
      });

      timeline
        .from("[data-serve-heading]", {
          y: 28,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
        })
        .from(
          "[data-serve-card]",
          {
            y: 55,
            opacity: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.35",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="who-we-serve"
      className="who-we-serve"
      aria-labelledby="who-we-serve-title"
    >
      <header className="who-we-serve__heading" data-serve-heading>
        <p>Industries</p>
        <h2 id="who-we-serve-title">Who We Serve</h2>
        <span />
      </header>

      <div className="who-we-serve__grid">
        {sectors.map((sector, index) => (
          <Link
            key={sector.title}
            href="/our-work#projects"
            className="serve-card"
            data-serve-card
          >
            <Image
              src={sector.image}
              alt={`${sector.title} technology environment`}
              fill
              sizes="(max-width: 820px) 78vw, 25vw"
              loading={index === sectors.length - 1 ? "eager" : "lazy"}
              className="serve-card__image"
              style={{ objectPosition: sector.position }}
            />
            <span className="serve-card__overlay" />
            <span className="serve-card__number">0{index + 1}</span>
            <h3>{sector.title}</h3>
            <span className="serve-card__arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
