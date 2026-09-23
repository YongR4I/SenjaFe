"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type AboutLive = {
  hero?: { eyebrow?: string; title?: string; description?: string; image?: { src?: string; alt?: string } };
  story?: { eyebrow?: string; title?: string; paragraphs?: string[]; stats?: { value?: string; label?: string }[]; image?: { src?: string; alt?: string } };
  quote?: { eyebrow?: string; text?: string };
  principles?: { eyebrow?: string; title?: string; description?: string; items?: { title?: string; description?: string }[] };
  capabilities?: { eyebrow?: string; title?: string; description?: string; visualLabel?: string; services?: string[]; image?: { src?: string; alt?: string } };
  process?: { eyebrow?: string; title?: string; description?: string; steps?: { title?: string; description?: string }[] };
};

const principles = [
  {
    number: "01",
    title: "Human first",
    copy: "Technology should disappear into the experience. Every decision begins with the people who will use the space.",
  },
  {
    number: "02",
    title: "Built as one",
    copy: "Design, hardware, software, and support are considered together so every touchpoint feels clear and connected.",
  },
  {
    number: "03",
    title: "Ready for change",
    copy: "We create adaptable systems that can grow with new teams, new tools, and the next way of working.",
  },
] as const;

const capabilities = [
  "Workplace collaboration",
  "Digital signage",
  "Learning environments",
  "Network infrastructure",
  "Experience design",
  "Lifecycle support",
] as const;

const process = [
  { number: "01", title: "Listen", copy: "Understand the people, space, and real operational challenge." },
  { number: "02", title: "Imagine", copy: "Translate needs into one clear technology and experience concept." },
  { number: "03", title: "Integrate", copy: "Deliver every system as one reliable, carefully finished environment." },
  { number: "04", title: "Evolve", copy: "Support, measure, and improve the space as your needs change." },
] as const;

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<AboutLive | null>(null);

  // BE-first content (GET /about); hardcoded fallback = original content.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchAbout, unwrapItem } = await import("@/lib/api");
        const item = unwrapItem(await fetchAbout()) as AboutLive | null;
        if (item && !cancelled) setLive(item);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hero = {
    eyebrow: live?.hero?.eyebrow ?? "About Senja · Jakarta, Indonesia",
    title: live?.hero?.title ?? "Technology, made to feel human.",
    description:
      live?.hero?.description ??
      "We design and integrate connected spaces where technology feels intuitive, purposeful, and quietly powerful.",
    image: live?.hero?.image?.src ?? "/images/4.png",
    imageAlt: live?.hero?.image?.alt ?? "People collaborating in a meeting room powered by Senja technology",
  };
  const story = {
    eyebrow: live?.story?.eyebrow ?? "Why we exist",
    title:
      live?.story?.title ??
      "A better space doesn't ask people to understand the technology.",
    titleEm: "It understands them.",
    paragraphs: live?.story?.paragraphs ?? [
      "Senja brings technology, spatial thinking, and human needs into one integrated experience. We work across the entire journey—from the first conversation and system design to installation and long-term support.",
      "The result is not a collection of devices. It is a space where ideas move more freely, teams collaborate naturally, and every interaction feels considered.",
    ],
    stats: live?.story?.stats ?? [
      { value: "50+", label: "Spaces transformed" },
      { value: "12", label: "Technology partners" },
      { value: "04", label: "Industries served" },
    ],
  };
  const quote = {
    eyebrow: live?.quote?.eyebrow ?? "Our point of view",
    text:
      live?.quote?.text ??
      "The best technology doesn't take over the room. It gives the room more possibility.",
  };
  const principleSection = {
    eyebrow: live?.principles?.eyebrow ?? "What guides us",
    title: live?.principles?.title ?? "Our principles",
    description: live?.principles?.description ?? "Simple ideas that shape every space we create.",
  };
  const principleItems = (live?.principles?.items ?? []).length
    ? live!.principles!.items!.map((it, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: it.title ?? "",
        copy: it.description ?? "",
      }))
    : principles;
  const capabilitySection = {
    eyebrow: live?.capabilities?.eyebrow ?? "What we connect",
    title: live?.capabilities?.title ?? "One partner. Every layer.",
    description:
      live?.capabilities?.description ??
      "From a single meeting room to an entire connected workplace, we make every layer work together as one clear experience.",
    visualLabel: live?.capabilities?.visualLabel ?? "Spaces / systems / experiences",
    image: live?.capabilities?.image?.src ?? "/images/3.png",
    imageAlt: live?.capabilities?.image?.alt ?? "Integrated technology in a compact meeting room",
  };
  const capabilityItems = live?.capabilities?.services ?? [...capabilities];
  const processSection = {
    eyebrow: live?.process?.eyebrow ?? "How we work",
    title: live?.process?.title ?? "From intent to impact.",
    description: live?.process?.description ?? "A collaborative process with clarity at every step.",
  };
  const processItems = (live?.process?.steps ?? []).length
    ? live!.process!.steps!.map((st, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: st.title ?? "",
        copy: st.description ?? "",
      }))
    : process;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-about-page-kicker]", { opacity: 0, y: 16, duration: 0.6 })
        .from("[data-about-page-title] span", { yPercent: 115, duration: 1, stagger: 0.09 }, "-=0.25")
        .from("[data-about-page-lead]", { opacity: 0, y: 24, duration: 0.7 }, "-=0.45")
        .from("[data-about-page-scroll]", { opacity: 0, duration: 0.55 }, "-=0.25");

      gsap.to("[data-about-page-hero-image] img", {
        yPercent: 13,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-about-page-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-about-page-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 46,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.from("[data-about-principle]", {
        opacity: 0,
        y: 50,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-page__principles-grid",
          start: "top 82%",
          once: true,
        },
      });

      gsap.to("[data-about-capability-image] img", {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-about-capability-image]",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="about-page">
      <section className="about-page__hero" data-about-page-hero aria-labelledby="about-page-title">
        <div className="about-page__hero-media" data-about-page-hero-image>
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="about-page__hero-shade" />

        <div className="about-page__hero-copy">
          <p data-about-page-kicker>{hero.eyebrow}</p>
          <h1 id="about-page-title" data-about-page-title>
            {live?.hero?.title ? (
              hero.title.split(",").map((part, i, arr) => (
                <span key={i}>{i < arr.length - 1 ? `${part.trim()},` : part.trim()}</span>
              ))
            ) : (
              <>
                <span>Technology,</span>
                <span>made to feel</span>
                <span><em>human.</em></span>
              </>
            )}
          </h1>
          <p data-about-page-lead>
            {hero.description}
          </p>
        </div>

        <div className="about-page__hero-scroll" data-about-page-scroll>
          <span>Our story</span><i /><span aria-hidden="true">↓</span>
        </div>
      </section>

      <section className="about-page__story" aria-labelledby="about-story-title">
        <div data-about-page-reveal>
          <p className="about-page__eyebrow">{story.eyebrow}</p>
          <h2 id="about-story-title">
            {story.title}
            <em> {story.titleEm}</em>
          </h2>
        </div>
        <div className="about-page__story-copy" data-about-page-reveal>
          {story.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="about-page__metrics" data-about-page-reveal>
          {story.stats.map((s) => (
            <div key={s.label}><dt>{s.value}</dt><dd>{s.label}</dd></div>
          ))}
        </dl>
      </section>

      <section className="about-page__manifesto" data-about-page-reveal>
        <div className="about-page__manifesto-media">
          <Image src="/images/1.png" alt="Modern connected executive meeting space" fill sizes="100vw" />
        </div>
        <div className="about-page__manifesto-shade" />
        <p>{quote.eyebrow}</p>
        {live?.quote?.text ? (
          <blockquote>{quote.text}</blockquote>
        ) : (
          <blockquote>
            The best technology doesn&apos;t take over the room.
            <span> It gives the room more possibility.</span>
          </blockquote>
        )}
      </section>

      <section className="about-page__principles" aria-labelledby="about-principles-title">
        <div className="about-page__section-head" data-about-page-reveal>
          <div>
            <p className="about-page__eyebrow">{principleSection.eyebrow}</p>
            <h2 id="about-principles-title">{principleSection.title}</h2>
          </div>
          <p>{principleSection.description}</p>
        </div>
        <div className="about-page__principles-grid">
          {principleItems.map((principle) => (
            <article key={principle.number} data-about-principle>
              <span>{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page__capabilities" aria-labelledby="about-capabilities-title">
        <div className="about-page__capability-media" data-about-capability-image data-about-page-reveal>
          <Image src={capabilitySection.image} alt={capabilitySection.imageAlt} fill sizes="(max-width: 820px) 100vw, 52vw" />
          <span>{capabilitySection.visualLabel}</span>
        </div>
        <div className="about-page__capability-copy" data-about-page-reveal>
          <p className="about-page__eyebrow">{capabilitySection.eyebrow}</p>
          <h2 id="about-capabilities-title">One partner.<br /><em>Every layer.</em></h2>
          <p>
            {capabilitySection.description}
          </p>
          <ul>
            {capabilityItems.map((capability, index) => (
              <li key={capability}><span>0{index + 1}</span>{capability}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-page__process" aria-labelledby="about-process-title">
        <div className="about-page__section-head" data-about-page-reveal>
          <div>
            <p className="about-page__eyebrow">{processSection.eyebrow}</p>
            <h2 id="about-process-title">From intent<br />to impact.</h2>
          </div>
          <p>{processSection.description}</p>
        </div>
        <div className="about-page__process-grid" data-about-page-reveal>
          {processItems.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-page__closing" data-about-page-reveal>
        <p>Let&apos;s build what&apos;s next</p>
        <h2>A smarter space<br />starts with a <em>conversation.</em></h2>
        <div>
          <Link href="/contact">Talk to our team <span aria-hidden="true">↗</span></Link>
          <Link href="/our-work">Explore our work <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
