"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
            src="/images/4.png"
            alt="People collaborating in a meeting room powered by Senja technology"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="about-page__hero-shade" />

        <div className="about-page__hero-copy">
          <p data-about-page-kicker>About Senja · Jakarta, Indonesia</p>
          <h1 id="about-page-title" data-about-page-title>
            <span>Technology,</span>
            <span>made to feel</span>
            <span><em>human.</em></span>
          </h1>
          <p data-about-page-lead>
            We design and integrate connected spaces where technology feels
            intuitive, purposeful, and quietly powerful.
          </p>
        </div>

        <div className="about-page__hero-scroll" data-about-page-scroll>
          <span>Our story</span><i /><span aria-hidden="true">↓</span>
        </div>
      </section>

      <section className="about-page__story" aria-labelledby="about-story-title">
        <div data-about-page-reveal>
          <p className="about-page__eyebrow">Why we exist</p>
          <h2 id="about-story-title">
            A better space doesn&apos;t ask people to understand the technology.
            <em> It understands them.</em>
          </h2>
        </div>
        <div className="about-page__story-copy" data-about-page-reveal>
          <p>
            Senja brings technology, spatial thinking, and human needs into one
            integrated experience. We work across the entire journey—from the
            first conversation and system design to installation and long-term support.
          </p>
          <p>
            The result is not a collection of devices. It is a space where ideas
            move more freely, teams collaborate naturally, and every interaction
            feels considered.
          </p>
        </div>
        <dl className="about-page__metrics" data-about-page-reveal>
          <div><dt>50+</dt><dd>Spaces transformed</dd></div>
          <div><dt>12</dt><dd>Technology partners</dd></div>
          <div><dt>04</dt><dd>Industries served</dd></div>
        </dl>
      </section>

      <section className="about-page__manifesto" data-about-page-reveal>
        <div className="about-page__manifesto-media">
          <Image src="/images/1.png" alt="Modern connected executive meeting space" fill sizes="100vw" />
        </div>
        <div className="about-page__manifesto-shade" />
        <p>Our point of view</p>
        <blockquote>
          The best technology doesn&apos;t take over the room.
          <span> It gives the room more possibility.</span>
        </blockquote>
      </section>

      <section className="about-page__principles" aria-labelledby="about-principles-title">
        <div className="about-page__section-head" data-about-page-reveal>
          <div>
            <p className="about-page__eyebrow">What guides us</p>
            <h2 id="about-principles-title">Our principles</h2>
          </div>
          <p>Simple ideas that shape every space we create.</p>
        </div>
        <div className="about-page__principles-grid">
          {principles.map((principle) => (
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
          <Image src="/images/3.png" alt="Integrated technology in a compact meeting room" fill sizes="(max-width: 820px) 100vw, 52vw" />
          <span>Spaces / systems / experiences</span>
        </div>
        <div className="about-page__capability-copy" data-about-page-reveal>
          <p className="about-page__eyebrow">What we connect</p>
          <h2 id="about-capabilities-title">One partner.<br /><em>Every layer.</em></h2>
          <p>
            From a single meeting room to an entire connected workplace, we make
            every layer work together as one clear experience.
          </p>
          <ul>
            {capabilities.map((capability, index) => (
              <li key={capability}><span>0{index + 1}</span>{capability}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-page__process" aria-labelledby="about-process-title">
        <div className="about-page__section-head" data-about-page-reveal>
          <div>
            <p className="about-page__eyebrow">How we work</p>
            <h2 id="about-process-title">From intent<br />to impact.</h2>
          </div>
          <p>A collaborative process with clarity at every step.</p>
        </div>
        <div className="about-page__process-grid" data-about-page-reveal>
          {process.map((step) => (
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
