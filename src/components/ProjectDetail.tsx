"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";
import { partnerLogoFallback } from "@/data/partners";
import SafeImage from "@/components/SafeImage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectDetailProps = {
  project: Project;
  nextProject: Project;
};

export default function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const pageRef = useRef<HTMLElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const galleryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTriggerIndexRef = useRef(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const galleryLength = project.gallery.length;
  const isLightboxOpen = activeGalleryIndex !== null;
  const activeGalleryImage = activeGalleryIndex === null ? null : project.gallery[activeGalleryIndex];

  const openLightbox = (index: number) => {
    lastTriggerIndexRef.current = index;
    setActiveGalleryIndex(index);
  };

  const showPreviousImage = () => {
    setActiveGalleryIndex((current) =>
      current === null ? null : (current - 1 + galleryLength) % galleryLength,
    );
  };

  const showNextImage = () => {
    setActiveGalleryIndex((current) =>
      current === null ? null : (current + 1) % galleryLength,
    );
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const triggerButton = galleryButtonRefs.current[lastTriggerIndexRef.current];
    const focusFrame = window.requestAnimationFrame(() => lightboxCloseRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGalleryIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveGalleryIndex((current) =>
          current === null ? null : (current - 1 + galleryLength) % galleryLength,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveGalleryIndex((current) =>
          current === null ? null : (current + 1) % galleryLength,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerButton?.focus();
    };
  }, [galleryLength, isLightboxOpen]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-detail-back]", { opacity: 0, y: 14, duration: 0.6 })
        .from("[data-detail-kicker]", { opacity: 0, y: 20, duration: 0.6 }, "-=0.25")
        .from("[data-detail-title] span", { yPercent: 115, duration: 1, stagger: 0.08 }, "-=0.3")
        .from("[data-detail-meta] > *", { opacity: 0, y: 20, duration: 0.6, stagger: 0.07 }, "-=0.45");

      gsap.to("[data-detail-hero-image]", {
        yPercent: 15,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-detail-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-detail-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 52,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-detail-image]").forEach((element) => {
        const image = element.querySelector("img");
        if (!image) return;
        gsap.fromTo(
          image,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.7 },
          },
        );
      });
    },
    { scope: pageRef },
  );

  return (
    <article ref={pageRef} className="project-detail">
      <section className="project-detail__hero" data-detail-hero aria-labelledby="project-title">
        <div className="project-detail__hero-media" data-detail-hero-image>
          <SafeImage src={project.image} fallbackSrc="/images/2.png" alt={project.title} fill priority sizes="100vw" />
        </div>
        <div className="project-detail__hero-shade" />

        <Link href="/our-work#projects" className="project-detail__back" data-detail-back>
          <span aria-hidden="true">←</span> All projects
        </Link>

        <div className="project-detail__hero-copy">
          <p data-detail-kicker>{project.category} · Project {project.number}</p>
          <h1 id="project-title" data-detail-title>
            {project.title.split(" ").map((word, index) => (
              <span key={`${word}-${index}`}>{word}</span>
            ))}
          </h1>
        </div>

        <dl className="project-detail__meta" data-detail-meta>
          <div><dt>Location</dt><dd>{project.location}</dd></div>
          <div><dt>Year</dt><dd>{project.year}</dd></div>
          <div><dt>Client</dt><dd>{project.client}</dd></div>
        </dl>
      </section>

      <section className="project-detail__overview">
        <div data-detail-reveal>
          <p className="project-detail__eyebrow">The overview</p>
          <h2>Technology designed<br />around <em>people.</em></h2>
        </div>
        <div className="project-detail__overview-copy" data-detail-reveal>
          <p>{project.overview}</p>
          <div>
            <span>Scope of work</span>
            <ul>
              {project.services.map((service) => <li key={service}>{service}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="project-detail__narrative">
        <div data-detail-reveal>
          <p className="project-detail__eyebrow">01 · The challenge</p>
          <h2>Making complexity<br />feel invisible.</h2>
        </div>
        <p data-detail-reveal>{project.challenge}</p>
      </section>

      <section className="project-detail__solution">
        <div data-detail-reveal>
          <p className="project-detail__eyebrow">02 · The solution</p>
          <h2>One seamless<br /><em>experience.</em></h2>
        </div>
        <p data-detail-reveal>{project.solution}</p>
      </section>

      <section className="project-detail__gallery" aria-labelledby="project-gallery-title">
        <header className="project-detail__gallery-heading" data-detail-reveal>
          <div>
            <p className="project-detail__eyebrow">Project gallery</p>
            <h2 id="project-gallery-title">The work,<br /><em>in detail.</em></h2>
          </div>
          <p>{project.gallery.length.toString().padStart(2, "0")} documented views</p>
        </header>

        <div className="project-detail__gallery-grid">
          {project.gallery.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className={index === 0 ? "is-featured" : ""}
              data-detail-image
              data-detail-reveal
            >
              <button
                ref={(element) => { galleryButtonRefs.current[index] = element; }}
                type="button"
                className="project-detail__gallery-open"
                onClick={() => openLightbox(index)}
                aria-label={`Open image ${index + 1}: ${image.alt}`}
              >
                <SafeImage
                  src={image.src}
                  fallbackSrc="/images/2.png"
                  alt=""
                  fill
                  sizes={index === 0 ? "(max-width: 820px) 100vw, 86vw" : "(max-width: 820px) 100vw, 43vw"}
                  style={{ objectPosition: image.position }}
                />
              </button>
              <figcaption>
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {activeGalleryImage && activeGalleryIndex !== null && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-lightbox-caption"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveGalleryIndex(null);
          }}
        >
          <button
            ref={lightboxCloseRef}
            type="button"
            className="project-lightbox__close"
            onClick={() => setActiveGalleryIndex(null)}
          >
            Close <span aria-hidden="true">×</span>
          </button>

          <button
            type="button"
            className="project-lightbox__navigation is-previous"
            onClick={showPreviousImage}
            aria-label="Show previous image"
          >
            ←
          </button>

          <div className="project-lightbox__media">
            <SafeImage
              src={activeGalleryImage.src}
              fallbackSrc="/images/2.png"
              alt=""
              fill
              sizes="100vw"
              style={{ objectPosition: activeGalleryImage.position }}
            />
          </div>

          <button
            type="button"
            className="project-lightbox__navigation is-next"
            onClick={showNextImage}
            aria-label="Show next image"
          >
            →
          </button>

          <p id="project-lightbox-caption" className="project-lightbox__caption">
            <span>
              {(activeGalleryIndex + 1).toString().padStart(2, "0")} / {galleryLength.toString().padStart(2, "0")}
            </span>
            {activeGalleryImage.alt}
          </p>
        </div>
      )}

      <section className="project-detail__partners" aria-labelledby="project-partners-title">
        <div className="project-detail__partners-heading" data-detail-reveal>
          <div>
            <p className="project-detail__eyebrow">Technology ecosystem</p>
            <h2 id="project-partners-title">Partners behind<br />the project.</h2>
          </div>
          <p>
            Selected technology partners that helped us deliver a reliable,
            integrated experience for this space.
          </p>
        </div>

        <div
          className="project-detail__partner-grid"
          data-partner-count={project.partners.length}
          data-detail-reveal
        >
          {project.partners.map((partner, index) => (
            <Link
              key={partner.name}
              href={`/partners/${partner.slug}`}
              className="project-partner-card"
            >
              <span>0{index + 1}</span>
              <SafeImage
                src={partner.image}
                fallbackSrc={partnerLogoFallback(partner.slug)}
                alt={`${partner.name} logo`}
                width={220}
                height={120}
              />
              <p>{partner.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <Link href={`/our-work/${nextProject.slug}`} className="next-project" data-detail-reveal>
        <div>
          <p>Next project · {nextProject.number}</p>
          <h2>{nextProject.title}</h2>
        </div>
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
