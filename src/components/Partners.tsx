"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { technologyPartners } from "@/data/partners";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);

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
        .from("[data-partner-heading]", {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          "[data-partner-card]",
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .from(
          "[data-partner-button]",
          {
            y: 22,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const track = trackRef.current;
      const firstGroup = firstGroupRef.current;

      if (!track || !firstGroup) return;

      const createMarquee = () => {
        marqueeTweenRef.current?.kill();
        gsap.set(track, { x: 0 });

        const trackStyles = window.getComputedStyle(track);
        const trackGap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
        const distance = firstGroup.getBoundingClientRect().width + trackGap;

        marqueeTweenRef.current = gsap.to(track, {
          x: -distance,
          duration: Math.max(22, distance / 45),
          ease: "none",
          repeat: -1,
        });
      };

      createMarquee();

      const resizeObserver = new ResizeObserver(createMarquee);
      resizeObserver.observe(firstGroup);

      return () => {
        resizeObserver.disconnect();
        marqueeTweenRef.current?.kill();
      };
    },
    { scope: sectionRef },
  );

  const pauseMarquee = () => marqueeTweenRef.current?.pause();
  const resumeMarquee = () => marqueeTweenRef.current?.play();

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="partners"
      aria-labelledby="partners-title"
    >
      <header className="partners__heading" data-partner-heading>
        <p>Trusted By</p>
        <span className="partners__heading-line" />
        <h2 id="partners-title">
          Trusted by Organizations
          <br />
          Building Smarter <strong>Spaces</strong>
        </h2>
        <p className="partners__description">
          Partnering with businesses, institutions, and brands to deliver
          seamless technology experiences.
        </p>
      </header>

      <div
        className="partners__carousel"
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
      >
        <div id="partners-list" className="partners__viewport">
          <div ref={trackRef} className="partners__track">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                ref={groupIndex === 0 ? firstGroupRef : undefined}
                className="partners__group"
                aria-hidden={groupIndex === 1}
              >
                {technologyPartners.map((partner) => (
                  <Link
                    key={`${groupIndex}-${partner.name}`}
                    href={`/partners/${partner.slug}`}
                    className="partner-card"
                    data-partner-card
                    tabIndex={groupIndex === 1 ? -1 : undefined}
                  >
                    <Image
                      src={partner.image}
                      alt={groupIndex === 0 ? `${partner.name} logo` : ""}
                      width={200}
                      height={122}
                      className="partner-card__logo"
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/partners"
        className="partners__button"
        data-partner-button
      >
        Lihat semua partner <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
