"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const slides = [
  {
    id: "meeting-rooms",
    image: "/images/3.png",
    kicker: "01 / Solutions",
    title: "Meeting Rooms",
    description:
      "Collaborative spaces equipped with the right technology for smarter meetings.",
  },
  {
    id: "digital-signage",
    image: "/images/5.png",
    kicker: "02 / Solutions",
    title: "Digital Signage",
    description:
      "Dynamic visual communication that engages your audience and elevates your brand.",
  },
  {
    id: "smart-classrooms",
    image: "/images/2.png",
    kicker: "03 / Solutions",
    title: "Smart Classrooms",
    description:
      "Interactive learning environments that inspire engagement and improve outcomes.",
  },
  {
    id: "workspace-technology",
    image: "/images/4.png",
    kicker: "04 / Solutions",
    title: "Workspace Technology",
    description:
      "Integrated technology solutions that enhance productivity and streamline operations.",
  },
] as const;

export default function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const nextSlide = Math.min(
              slides.length - 1,
              Math.floor(self.progress * slides.length),
            );

            if (nextSlide !== activeSlideRef.current) {
              activeSlideRef.current = nextSlide;
              setActiveSlide(nextSlide);
            }
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="showcase"
      aria-labelledby="showcase-title"
    >
      <div className="showcase__sticky">
        <div className="showcase__images" aria-live="polite">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`showcase__image-wrap ${index === activeSlide ? "is-active" : ""}`}
              aria-hidden={index !== activeSlide}
            >
              <Image
                src={slide.image}
                alt={index === activeSlide ? slide.title : ""}
                fill
                sizes="(max-width: 820px) 100vw, 56vw"
                className="showcase__image"
              />
            </div>
          ))}
          <span className="showcase__image-number">
            0{activeSlide + 1}
          </span>
        </div>

        <div className="showcase__content">
          <div className="showcase__heading">
            <p className="section-label">Explore Senja</p>
            <h2 id="showcase-title">Solutions that move with you.</h2>
          </div>

          <div className="showcase__copy-stack">
            {slides.map((slide, index) => (
              <article
                key={slide.title}
                className={`showcase__copy ${index === activeSlide ? "is-active" : ""}`}
                aria-hidden={index !== activeSlide}
              >
                <p className="showcase__kicker">{slide.kicker}</p>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </article>
            ))}
          </div>

          <nav className="showcase__nav" aria-label="Showcase progress">
            {slides.map((slide, index) => (
              <span
                key={slide.title}
                className={index === activeSlide ? "is-active" : ""}
              >
                <i /> 0{index + 1}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
