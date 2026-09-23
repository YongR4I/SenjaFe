"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProjects } from "@/hooks/use-cms";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FALLBACK_PROJECTS = [
  {
    image: "/images/2.png",
    title: "Digital Signage Installation",
    location: "Surabaya, 2025",
    slug: "digital-signage-installation",
  },
  {
    image: "/images/5.png",
    title: "Smart Meeting Ecosystem",
    location: "Jakarta, 2025",
    slug: "smart-meeting-ecosystem",
  },
  {
    image: "/images/3.png",
    title: "Immersive Learning Space",
    location: "Bandung, 2024",
    slug: "immersive-learning-space",
  },
];

const AUTOPLAY_DELAY = 4500;

export default function OurWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const live = useProjects();

  const projects = live.length > 0
    ? live.slice(0, 5).map((p) => ({
        image: p.image || "/images/2.png",
        title: p.title,
        location: [p.location, p.year].filter(Boolean).join(", ") || "-",
        slug: p.slug,
      }))
    : FALLBACK_PROJECTS;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isPaused || reduceMotion || projects.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % projects.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [isPaused, projects.length]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-work-reveal]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        y: 42,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="our-work"
      aria-labelledby="our-work-title"
    >
      <div className="our-work__intro">
        <div>
          <p className="our-work__label" data-work-reveal>
            Featured Works
          </p>
          <h2 id="our-work-title" data-work-reveal>
            Spaces we&apos;ve
            <br />
            transformed
          </h2>
          <p className="our-work__description" data-work-reveal>
            Explore a selection of projects where technology, design, and
            function come together.
          </p>
          <Link href="/our-work" className="our-work__all-link" data-work-reveal>
            See all projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div
        className="our-work__carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        data-work-reveal
      >
        <div className="our-work__slides" aria-live="polite">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={`our-work__slide ${index === activeProject ? "is-active" : ""}`}
              aria-hidden={index !== activeProject}
            >
              <Image
                src={project.image}
                alt={index === activeProject ? project.title : ""}
                fill
                sizes="(max-width: 820px) 100vw, 56vw"
                className="our-work__image"
              />
              <div className="our-work__project-copy">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
                <Link href={project.slug ? `/our-work/${project.slug}` : "/our-work#projects"}>
                  View project <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="our-work__dots" aria-label="Choose featured project">
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              className={index === activeProject ? "is-active" : ""}
              aria-label={`Show ${project.title}`}
              aria-pressed={index === activeProject}
              onClick={() => setActiveProject(index)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
