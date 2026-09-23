"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  projectCategories,
  projects as fallbackProjects,
  type ProjectCategory,
} from "@/data/projects";
import { useProjects } from "@/hooks/use-cms";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectCardSpan = 5 | 6 | 7 | 12;

const fiveCardComposition: ProjectCardSpan[] = [7, 5, 5, 7, 12];
const remainderCompositions: Record<number, ProjectCardSpan[]> = {
  0: [],
  1: [12],
  2: [6, 6],
  3: [7, 5, 12],
  4: [7, 5, 5, 7],
};

function createProjectComposition(total: number): ProjectCardSpan[] {
  if (total === 0) return [];

  const completeGroups = Math.floor(total / fiveCardComposition.length);
  const remainder = total % fiveCardComposition.length;
  const composition = Array.from(
    { length: completeGroups },
    () => fiveCardComposition,
  ).flat();

  return [...composition, ...remainderCompositions[remainder]];
}

export default function WorkArchive() {
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const liveProjects = useProjects();

  const source = liveProjects.length > 0 ? liveProjects : fallbackProjects;
  const visibleProjects = source.filter(
    (project) => activeCategory === "All" || project.category === activeCategory,
  );
  const projectComposition = createProjectComposition(visibleProjects.length);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-work-hero-kicker]", { y: 18, opacity: 0, duration: 0.65 })
        .from("[data-work-hero-title] span", { yPercent: 115, duration: 1, stagger: 0.09 }, "-=0.3")
        .from("[data-work-hero-copy]", { y: 24, opacity: 0, duration: 0.75 }, "-=0.55")
        .from("[data-work-hero-meta]", { opacity: 0, duration: 0.6 }, "-=0.35");

      gsap.to("[data-work-hero-image]", {
        yPercent: 14,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-work-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-archive-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 48,
          opacity: 0,
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
        "[data-project-card]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" },
      );
    },
    { scope: gridRef, dependencies: [activeCategory], revertOnUpdate: true },
  );

  return (
    <div ref={pageRef} className="work-archive">
      <section className="work-archive__hero" data-work-hero aria-labelledby="work-archive-title">
        <div className="work-archive__hero-media" data-work-hero-image>
          <Image
            src="/images/5.png"
            alt="Executive boardroom with integrated collaboration technology"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="work-archive__hero-shade" />

        <div className="work-archive__hero-content">
          <p className="work-archive__kicker" data-work-hero-kicker>
            Selected projects · 2024—2025
          </p>
          <h1 id="work-archive-title" data-work-hero-title>
            <span>Spaces with</span>
            <span>purpose. Built for</span>
            <span><em>connection.</em></span>
          </h1>
          <p className="work-archive__lead" data-work-hero-copy>
            We unite technology, space, and human needs to create environments
            that feel intuitive from the very first interaction.
          </p>
        </div>

        <div className="work-archive__hero-meta" data-work-hero-meta>
          <span>Explore the archive</span>
          <span aria-hidden="true">↓</span>
        </div>
      </section>

      <section className="work-archive__statement" aria-label="Our impact">
        <p data-archive-reveal>
          From a single room to a connected campus, every project begins with
          one question: <span>how should this space make people feel?</span>
        </p>
        <dl data-archive-reveal>
          <div><dt>50+</dt><dd>Spaces transformed</dd></div>
          <div><dt>12</dt><dd>Technology partners</dd></div>
          <div><dt>04</dt><dd>Core industries</dd></div>
        </dl>
      </section>

      <section id="projects" className="work-archive__projects" aria-labelledby="project-list-title">
        <div className="work-archive__projects-head" data-archive-reveal>
          <div>
            <p>Project archive</p>
            <h2 id="project-list-title">Explore our work</h2>
          </div>
          <p>{visibleProjects.length.toString().padStart(2, "0")} projects</p>
        </div>

        <div className="work-filter" role="group" aria-label="Filter projects" data-archive-reveal>
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "is-active" : ""}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="work-grid"
          data-project-count={visibleProjects.length}
        >
          {visibleProjects.map((project, index) => {
            const span = projectComposition[index];

            return (
              <Link
                key={project.title}
                href={`/our-work/${project.slug}`}
                className={`work-card work-card--span-${span}`}
                data-project-card
              >
                <div className="work-card__media">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={
                      span === 12
                        ? "(max-width: 820px) 100vw, 90vw"
                        : span >= 7
                          ? "(max-width: 820px) 100vw, 56vw"
                          : "(max-width: 820px) 100vw, 44vw"
                    }
                  />
                  <span className="work-card__veil" />
                  <span className="work-card__number">{project.number}</span>
                  <span className="work-card__arrow" aria-hidden="true">↗</span>
                </div>
                <div className="work-card__content">
                  <div>
                    <p>{project.category} · {project.location}, {project.year}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="work-archive__closing" data-archive-reveal>
        <p>Have a space in mind?</p>
        <h2>Let&apos;s make it<br /><span>work smarter.</span></h2>
        <Link href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
