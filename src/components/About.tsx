"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      timeline
        .from("[data-about-image]", {
          xPercent: -8,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
        .from(
          "[data-about-reveal]",
          {
            y: 30,
            opacity: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.55",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      aria-labelledby="about-title"
    >
      <div className="about-section__media" data-about-image>
        <Image
          src="/images/4.png"
          alt="Team collaborating in a meeting room powered by Senja technology"
          fill
          sizes="(max-width: 820px) 100vw, 56vw"
          className="about-section__image"
        />
        <div className="about-section__image-shade" />
      </div>

      <div className="about-section__content">
        <div>
          <p className="about-section__eyebrow" data-about-reveal>
            Discover our story
          </p>
          <h2 id="about-title" data-about-reveal>
            About Senja
          </h2>
          <span className="about-section__line" data-about-reveal />
          <p data-about-reveal>
            We design and integrate technology solutions that connect people,
            spaces, and ideas.
          </p>
          <Link href="/about" className="about-section__button" data-about-reveal>
            Learn more <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
