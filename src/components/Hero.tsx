"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.from("[data-hero-reveal]", {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.fromTo(
        "[data-hero-zoom]",
        { scale: 1.14 },
        {
          scale: 1.02,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to("[data-hero-parallax]", { yPercent: 10, ease: "none" }, 0)
        .to(
          "[data-hero-content]",
          { yPercent: 22, opacity: 0, ease: "none" },
          0,
        );
    },
    { scope: heroRef },
  );

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__media" data-hero-parallax>
        <Image
          src="/images/1.png"
          alt="Senja-enabled executive meeting room with integrated displays"
          fill
          preload
          sizes="100vw"
          className="hero__image"
          data-hero-zoom
        />
      </div>
      <div className="hero__overlay" />

      <div className="hero__content" data-hero-content id="top">
        <p className="eyebrow" data-hero-reveal>
          Smart workplace solutions
        </p>
        <h1 id="hero-title" data-hero-reveal>
          Technology that
          <br />
          connects people,
          <br />
          spaces <span>&amp;</span> ideas
        </h1>
        <p className="hero__copy" data-hero-reveal>
          We design, integrate, and support intelligent workplace solutions
          that enable collaboration, communication, and growth.
        </p>
        <a className="outline-button" href="#solutions" data-hero-reveal>
          Explore our work <span aria-hidden="true">↘</span>
        </a>
      </div>

      <a className="scroll-cue" href="#solutions" aria-label="Scroll to solutions">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
