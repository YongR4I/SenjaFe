"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { technologyPartners as fallbackPartners } from "@/data/partners";
import { usePartners } from "@/hooks/use-cms";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PartnerDirectory() {
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [partnerSearch, setPartnerSearch] = useState("");
  const normalizedSearch = partnerSearch.trim().toLocaleLowerCase();
  const livePartners = usePartners();
  const source = livePartners.length > 0 ? livePartners : fallbackPartners;

  const visiblePartners = source.filter((partner) =>
    [partner.name, partner.category ?? "", partner.description, ...(partner.capabilities ?? [])].some(
      (value) => String(value).toLocaleLowerCase().includes(normalizedSearch),
    ),
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-partners-kicker]", { opacity: 0, y: 18, duration: 0.6 })
        .from("[data-partners-title] span", { yPercent: 115, duration: 1, stagger: 0.1 }, "-=0.25")
        .from("[data-partners-lead]", { opacity: 0, y: 24, duration: 0.7 }, "-=0.45")
        .from("[data-floating-logo]", { opacity: 0, scale: 0.82, duration: 0.8, stagger: 0.1 }, "-=0.55");

      gsap.to("[data-partners-orbit]", {
        rotate: 22,
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-partners-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-partners-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-directory-card]",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" },
      );
    },
    { scope: gridRef, dependencies: [partnerSearch], revertOnUpdate: true },
  );

  return (
    <div ref={pageRef} className="partner-directory">
      <section className="partner-directory__hero" data-partners-hero aria-labelledby="partner-directory-title">
        <div className="partner-directory__grid-lines" />
        <div className="partner-directory__orbit" data-partners-orbit>
          <span /><span /><span />
        </div>

        <div className="partner-directory__hero-copy">
          <p data-partners-kicker>Senja technology ecosystem</p>
          <h1 id="partner-directory-title" data-partners-title>
            <span>Better together.</span>
            <span>Built to perform.</span>
          </h1>
          <p data-partners-lead>
            We work with trusted global technology brands to build connected
            spaces that remain intuitive, reliable, and ready for what comes next.
          </p>
        </div>

        <div className="partner-directory__floating-logos" aria-hidden="true">
          {source.slice(0, 3).map((partner) => (
            <div key={partner.name} data-floating-logo>
              <Image src={typeof partner.image === "string" ? partner.image : "/images/partners-1.png"} alt="" width={180} height={100} />
            </div>
          ))}
        </div>

        <a href="#partner-directory-list" className="partner-directory__scroll" data-partners-lead>
          Explore partners <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="partner-directory__intro" aria-label="Partner ecosystem statistics">
        <p data-partners-reveal>
          Great spaces are not created by one product. They emerge when the
          <span> right technologies work as one.</span>
        </p>
        <dl data-partners-reveal>
          <div><dt>05</dt><dd>Global technology partners</dd></div>
          <div><dt>04</dt><dd>Connected industries</dd></div>
          <div><dt>01</dt><dd>Integrated experience</dd></div>
        </dl>
      </section>

      <section id="partner-directory-list" className="partner-directory__list" aria-labelledby="all-partners-title">
        <header className="partner-directory__list-head" data-partners-reveal>
          <div>
            <p>Partner directory</p>
            <h2 id="all-partners-title">Our ecosystem</h2>
          </div>
          <p>{visiblePartners.length.toString().padStart(2, "0")} partners</p>
        </header>

        <form
          className="partner-directory__search"
          role="search"
          aria-label="Search technology partners"
          onSubmit={(event) => event.preventDefault()}
          data-partners-reveal
        >
          <label htmlFor="partner-search">Search partners</label>
          <div>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              id="partner-search"
              type="search"
              value={partnerSearch}
              onChange={(event) => setPartnerSearch(event.target.value)}
              placeholder="Search by name, category, or capability"
              autoComplete="off"
            />
            {partnerSearch && (
              <button type="button" onClick={() => setPartnerSearch("")} aria-label="Clear partner search">
                Clear
              </button>
            )}
          </div>
        </form>

        <div ref={gridRef} className="partner-directory__cards">
          {visiblePartners.map((partner) => (
            <Link
              key={partner.name}
              href={`/partners/${partner.slug}`}
              className="partner-directory-card"
              data-directory-card
            >
              <div className="partner-directory-card__top">
                <span>{partner.number}</span>
                <span>{partner.category}</span>
              </div>
              <div className="partner-directory-card__logo">
                <Image src={typeof partner.image === "string" ? partner.image : "/images/partners-1.png"} alt={`${partner.name} logo`} width={260} height={150} />
              </div>
              <div className="partner-directory-card__copy">
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <ul>
                  {(partner.capabilities ?? []).map((capability) => <li key={String(capability)}>{String(capability)}</li>)}
                </ul>
              </div>
            </Link>
          ))}
          {visiblePartners.length === 0 && (
            <div className="partner-directory__empty" role="status">
              <p>No partners found</p>
              <span>Try another keyword.</span>
            </div>
          )}
        </div>
      </section>

      <section className="partner-directory__promise" data-partners-reveal>
        <p>One accountable integration partner</p>
        <h2>Many technologies.<br /><em>One experience.</em></h2>
        <div>
          <p>
            From specification and procurement to configuration and long-term
            support, Senja brings every layer together into a solution that simply works.
          </p>
          <Link href="/our-work">See our projects <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
