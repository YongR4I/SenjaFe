"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projectTypes = [
  "Meeting & collaboration",
  "Digital signage",
  "Learning space",
  "Network infrastructure",
  "Hospitality technology",
  "Other",
] as const;

const contactDetails = [
  { label: "Email", value: "renanda@utamavisual.com", href: "mailto:renanda@utamavisual.com" },
  { label: "Phone", value: "+62 896 8418 3510", href: "tel:+6289684183510" },
] as const;

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "error">("idle");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-contact-kicker]", { opacity: 0, y: 16, duration: 0.6 })
        .from("[data-contact-title] span", { yPercent: 115, duration: 1, stagger: 0.1 }, "-=0.25")
        .from("[data-contact-lead]", { opacity: 0, y: 22, duration: 0.7 }, "-=0.45")
        .from("[data-contact-detail]", { opacity: 0, y: 20, duration: 0.65, stagger: 0.08 }, "-=0.4");

      gsap.to("[data-contact-orbit]", {
        rotate: 18,
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-contact-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-contact-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.to("[data-contact-image] img", {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-contact-image]",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    },
    { scope: pageRef },
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Senja project inquiry — ${data.get("projectType") || "New project"}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name") || ""}`,
        `Company: ${data.get("company") || "-"}`,
        `Email: ${data.get("email") || ""}`,
        `Phone: ${data.get("phone") || "-"}`,
        `Project type: ${data.get("projectType") || "-"}`,
        `Timeline: ${data.get("timeline") || "-"}`,
        "",
        "Project brief:",
        `${data.get("message") || ""}`,
      ].join("\n"),
    );

    setSubmitStatus("submitting");

    try {
      const { submitContact } = await import("@/lib/api");
      await submitContact({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        company: String(data.get("company") ?? ""),
        phone: String(data.get("phone") ?? ""),
        project_type: String(data.get("projectType") ?? ""),
        timeline: String(data.get("timeline") ?? ""),
        message: String(data.get("message") ?? ""),
      });
    } catch {
      // Best-effort saving to backend; fall through to open mailto client
    } finally {
      setSubmitStatus("idle");
      window.location.href = `mailto:renanda@utamavisual.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div ref={pageRef} className="contact-page">
      <section className="contact-page__hero" data-contact-hero aria-labelledby="contact-page-title">
        <div className="contact-page__grid-lines" />
        <div className="contact-page__orbit" data-contact-orbit><span /><span /><span /></div>

        <div className="contact-page__hero-copy">
          <p data-contact-kicker>Start a conversation</p>
          <h1 id="contact-page-title" data-contact-title>
            <span>Let&apos;s create a</span>
            <span>space that works.</span>
          </h1>
          <p data-contact-lead>
            Tell us what you&apos;re planning. We&apos;ll help turn your needs into a
            clear, connected technology experience.
          </p>
        </div>

        <div className="contact-page__quick-contact">
          {contactDetails.map((detail) => (
            <a key={detail.label} href={detail.href} data-contact-detail>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
          <div data-contact-detail>
            <span>Office</span>
            <strong>Jakarta Barat, Indonesia</strong>
            <i aria-hidden="true">⌖</i>
          </div>
        </div>
      </section>

      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <div className="contact-form-section__intro" data-contact-reveal>
          <p>Project inquiry</p>
          <h2 id="contact-form-title">Tell us about<br /><em>your space.</em></h2>
          <p>
            Share a few details and your email application will open with a
            prepared inquiry addressed to our team.
          </p>
          <dl>
            <div><dt>Response time</dt><dd>Within 1–2 business days</dd></div>
            <div><dt>Consultation</dt><dd>Initial discussion at no cost</dd></div>
          </dl>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} data-contact-reveal>
          <div className="contact-form__row">
            <label>
              <span>Full name *</span>
              <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
            </label>
            <label>
              <span>Work email *</span>
              <input type="email" name="email" autoComplete="email" placeholder="name@company.com" required />
            </label>
          </div>

          <div className="contact-form__row">
            <label>
              <span>Company</span>
              <input type="text" name="company" autoComplete="organization" placeholder="Company name" />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" name="phone" autoComplete="tel" placeholder="+62" />
            </label>
          </div>

          <fieldset>
            <legend>What can we help with? *</legend>
            <div className="contact-form__options">
              {projectTypes.map((type, index) => (
                <label key={type}>
                  <input type="radio" name="projectType" value={type} defaultChecked={index === 0} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            <span>Target timeline</span>
            <select name="timeline" defaultValue="">
              <option value="" disabled>Select timeline</option>
              <option>As soon as possible</option>
              <option>Within 1–3 months</option>
              <option>Within 3–6 months</option>
              <option>More than 6 months</option>
              <option>Still exploring</option>
            </select>
          </label>

          <label>
            <span>Tell us about the project *</span>
            <textarea name="message" rows={5} placeholder="Space type, number of rooms, challenges, and what success looks like…" required />
          </label>

          <div className="contact-form__submit">
            <p>
              {submitStatus === "error"
                ? "Your inquiry could not be submitted. Make sure the CMS is online and try again."
                : "Your details are used only to respond to this inquiry."}
            </p>
            <button type="submit" disabled={submitStatus === "submitting"}>
              {submitStatus === "submitting" ? "Submitting…" : "Prepare email"} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      </section>

      <section className="contact-office" data-contact-reveal>
        <div className="contact-office__image" data-contact-image>
          <Image src="/images/4.png" alt="Senja team demonstrating a connected meeting space" fill sizes="(max-width: 820px) 100vw, 58vw" />
        </div>
        <div className="contact-office__copy">
          <p>Visit our office</p>
          <h2>Let&apos;s talk in<br /><em>the same room.</em></h2>
          <address>
            Pranoto Tower, Lantai 2 C9–C10<br />
            Jakarta Barat 11740<br />
            Indonesia
          </address>
          <a href="https://maps.google.com/?q=Pranoto+Tower+Jakarta+Barat" target="_blank" rel="noreferrer">
            Open in Google Maps <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="contact-next" data-contact-reveal>
        <p>Not ready to brief us yet?</p>
        <h2>Explore what&apos;s<br /><em>possible.</em></h2>
        <div>
          <Link href="/our-work">View our projects <span aria-hidden="true">↗</span></Link>
          <Link href="/partners">Meet our partners <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
