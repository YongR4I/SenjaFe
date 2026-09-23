"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const menuItems = [
  { label: "Home", href: "/#top" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Our Work", href: "/our-work" },
  { label: "About Senja", href: "/about" },
  { label: "Who We Serve", href: "/#who-we-serve" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(overlay, {
          autoAlpha: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
          clipPath: isOpen
            ? "circle(150% at calc(100% - 3.5rem) 3.5rem)"
            : "circle(0% at calc(100% - 3.5rem) 3.5rem)",
        });
        return;
      }

      if (isOpen) {
        const timeline = gsap.timeline();
        timeline
          .set(overlay, { visibility: "visible", pointerEvents: "auto" })
          .to(overlay, {
            autoAlpha: 1,
            clipPath: "circle(150% at calc(100% - 3.5rem) 3.5rem)",
            duration: 0.75,
            ease: "power3.inOut",
          })
          .fromTo(
            "[data-menu-link]",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              stagger: 0.07,
              ease: "power3.out",
            },
            "-=0.38",
          );
      } else {
        gsap.to(overlay, {
          autoAlpha: 0,
          clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)",
          duration: 0.55,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
          },
        });
      }
    },
    { scope: overlayRef, dependencies: [isOpen] },
  );

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`site-header ${isScrolled ? "is-scrolled" : ""} ${isOpen ? "is-menu-open" : ""}`}
      >
        <Link href="/#top" className="brand" aria-label="Senja home" onClick={closeMenu}>
          <Image src="/images/logo.png" alt="Senja" width={132} height={74} />
        </Link>

        <button
          type="button"
          className={`menu-button ${isOpen ? "is-open" : ""}`}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="fullscreen-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        ref={overlayRef}
        id="fullscreen-menu"
        className="fullscreen-menu"
        aria-hidden={!isOpen}
      >
        <div className="fullscreen-menu__glow" />
        <nav aria-label="Main navigation">
          <p className="fullscreen-menu__label">Navigate Senja</p>
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.label} data-menu-link>
                <span>0{index + 1}</span>
                <Link href={item.href} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="fullscreen-menu__footer">
          <p>Technology that connects people, spaces, and ideas.</p>
          <a href="mailto:renanda@utamavisual.com">renanda@utamavisual.com</a>
        </div>
      </div>
    </>
  );
}
