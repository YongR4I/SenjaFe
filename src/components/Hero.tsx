"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SafeImage from "@/components/SafeImage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FALLBACK = {
  eyebrow: "Smart workplace solutions",
  titleLines: ["Technology that", "connects people,", "spaces & ideas"],
  copy: "We design, integrate, and support intelligent workplace solutions that enable collaboration, communication, and growth.",
  buttonLabel: "Explore our work",
  buttonLink: "#solutions",
  image: "/images/1.png",
  imageAlt: "Senja-enabled executive meeting room with integrated displays",
};

function splitTitle(title: string): string[] {
  const parts = title
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return [title];
  return parts.map((p, i) => (i < parts.length - 1 ? `${p},` : p));
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [copy, setCopy] = useState(FALLBACK);

  // BE-first content (GET /hero), static fallback keeps page alive offline.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchHero, unwrapItem } = await import("@/lib/api");
        const item = unwrapItem(await fetchHero()) as {
          eyebrow?: string;
          title?: string;
          subtitle?: string;
          button_label?: string;
          buttonLabel?: string;
          button_link?: string;
          buttonLink?: string;
          image_urls?: string[];
          images?: ({ src?: string; alt?: string } | string)[];
        } | null;
        if (!item || cancelled) return;
        const images = (item.images ?? []).map((img) =>
          typeof img === "string" ? { src: img } : img,
        );
        const first = images[0];
        setCopy({
          eyebrow: item.eyebrow || FALLBACK.eyebrow,
          titleLines: splitTitle(item.title || FALLBACK.titleLines.join(" ")),
          copy: item.subtitle || FALLBACK.copy,
          buttonLabel: item.buttonLabel || item.button_label || FALLBACK.buttonLabel,
          buttonLink: item.buttonLink || item.button_link || FALLBACK.buttonLink,
          image: first?.src || item.image_urls?.[0] || FALLBACK.image,
          imageAlt: first?.alt || FALLBACK.imageAlt,
        });
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
        <SafeImage
          src={copy.image}
          fallbackSrc="/images/1.png"
          alt={copy.imageAlt}
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
          {copy.eyebrow}
        </p>
        <h1 id="hero-title" data-hero-reveal>
          {copy.titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < copy.titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="hero__copy" data-hero-reveal>
          {copy.copy}
        </p>
        <a className="outline-button" href={copy.buttonLink} data-hero-reveal>
          {copy.buttonLabel} <span aria-hidden="true">↘</span>
        </a>
      </div>

      <a className="scroll-cue" href="#solutions" aria-label="Scroll to solutions">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
