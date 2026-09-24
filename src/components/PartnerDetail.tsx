"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TechnologyPartner } from "@/data/partners";
import { partnerLogoFallback } from "@/data/partners";
import SafeImage from "@/components/SafeImage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PartnerDetailProps = {
  partner: TechnologyPartner;
  nextPartner: TechnologyPartner;
};

const integrationSteps = [
  { number: "01", title: "Consult", copy: "Understand the room, users, and operational requirements." },
  { number: "02", title: "Design", copy: "Select and coordinate the right technology into the space." },
  { number: "03", title: "Integrate", copy: "Install, configure, test, and hand over one complete system." },
  { number: "04", title: "Support", copy: "Keep the experience reliable with responsive after-sales support." },
] as const;

const maximumVisibleCategorySegments = 3;
const maximumVisibleSegments = maximumVisibleCategorySegments + 1;

export default function PartnerDetail({ partner, nextPartner }: PartnerDetailProps) {
  const pageRef = useRef<HTMLElement>(null);
  const segmentMenuRef = useRef<HTMLDivElement>(null);
  const [productSearch, setProductSearch] = useState("");
  const [segmentSearch, setSegmentSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState("All products");
  const [isSegmentMenuOpen, setIsSegmentMenuOpen] = useState(false);
  const productSegments = [
    { name: "All products", count: partner.products.length },
    ...Array.from(new Set(partner.products.map((product) => product.category))).map((category) => ({
      name: category,
      count: partner.products.filter((product) => product.category === category).length,
    })),
  ];
  const defaultVisibleSegments = productSegments.slice(0, maximumVisibleSegments);
  const activeSegmentData = productSegments.find((segment) => segment.name === activeSegment);
  const isActiveSegmentOverflow = !defaultVisibleSegments.some((segment) => segment.name === activeSegment);
  const visibleSegments =
    isActiveSegmentOverflow && activeSegmentData
      ? [...defaultVisibleSegments.slice(0, maximumVisibleSegments - 1), activeSegmentData]
      : defaultVisibleSegments;
  const overflowSegments = productSegments.filter(
    (segment) => !visibleSegments.some((visibleSegment) => visibleSegment.name === segment.name),
  );
  const normalizedSegmentSearch = segmentSearch.trim().toLocaleLowerCase();
  const filteredOverflowSegments = overflowSegments.filter((segment) =>
    segment.name.toLocaleLowerCase().includes(normalizedSegmentSearch),
  );
  const normalizedSearch = productSearch.trim().toLocaleLowerCase();
  const visibleProducts = partner.products.filter((product) => {
    const isInActiveSegment = activeSegment === "All products" || product.category === activeSegment;
    const matchesSearch = [product.name, product.category, product.description].some((value) =>
      value.toLocaleLowerCase().includes(normalizedSearch),
    );

    return isInActiveSegment && matchesSearch;
  });

  const handleSegmentKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % visibleSegments.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + visibleSegments.length) % visibleSegments.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = visibleSegments.length - 1;
    else return;

    event.preventDefault();
    setActiveSegment(visibleSegments[nextIndex].name);
    const tabList = event.currentTarget.parentElement;
    const tabs = tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextIndex].focus();
  };

  const selectSegment = (segmentName: string) => {
    setActiveSegment(segmentName);
    setIsSegmentMenuOpen(false);
    setSegmentSearch("");
  };

  useEffect(() => {
    if (!isSegmentMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!segmentMenuRef.current?.contains(event.target as Node)) {
        setIsSegmentMenuOpen(false);
        setSegmentSearch("");
      }
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSegmentMenuOpen(false);
        setSegmentSearch("");
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isSegmentMenuOpen]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-brand-back]", { opacity: 0, y: 14, duration: 0.6 })
        .from("[data-brand-logo]", { opacity: 0, scale: 0.88, duration: 0.7 }, "-=0.25")
        .from("[data-brand-kicker]", { opacity: 0, y: 18, duration: 0.55 }, "-=0.35")
        .from("[data-brand-title] span", { yPercent: 115, duration: 1, stagger: 0.1 }, "-=0.25")
        .from("[data-brand-lead]", { opacity: 0, y: 24, duration: 0.7 }, "-=0.5");

      gsap.to("[data-brand-hero-image]", {
        yPercent: 15,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-brand-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-brand-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-brand-image]").forEach((element) => {
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
    <article ref={pageRef} className="brand-detail">
      <section className="brand-detail__hero" data-brand-hero aria-labelledby="brand-detail-title">
        <div className="brand-detail__hero-media" data-brand-hero-image>
          <SafeImage src={partner.heroImage} fallbackSrc="/images/2.png" alt={`${partner.name} technology integrated by Senja`} fill priority sizes="100vw" />
        </div>
        <div className="brand-detail__hero-shade" />
        <Link href="/partners#partner-directory-list" className="brand-detail__back" data-brand-back>
          <span aria-hidden="true">←</span> All partners
        </Link>

        <div className="brand-detail__hero-copy">
          <div className="brand-detail__hero-logo" data-brand-logo>
            <SafeImage src={partner.image} fallbackSrc={partnerLogoFallback(partner.slug)} alt={`${partner.name} logo`} width={260} height={150} />
          </div>
          <p data-brand-kicker>{partner.category} partner · {partner.number}</p>
          <h1 id="brand-detail-title" data-brand-title>
            <span>{partner.name}</span>
            <span>× Senja</span>
          </h1>
          <p data-brand-lead>{partner.relationship}</p>
        </div>

        <div className="brand-detail__hero-index" data-brand-lead>
          <span>{partner.products.length.toString().padStart(2, "0")}</span>
          <p>Featured products</p>
        </div>
      </section>

      <section className="brand-detail__relationship">
        <div data-brand-reveal>
          <p className="brand-detail__eyebrow">Working together</p>
          <h2>Global technology.<br />Delivered with <em>local care.</em></h2>
        </div>
        <div className="brand-detail__relationship-copy" data-brand-reveal>
          <p>{partner.relationshipDetail}</p>
          <ul>
            {partner.capabilities.map((capability, index) => (
              <li key={capability}><span>0{index + 1}</span>{capability}</li>
            ))}
          </ul>
        </div>
      </section>

      <figure className="brand-detail__feature-image" data-brand-image>
        <SafeImage
          src={partner.gallery[0].src}
          fallbackSrc="/images/2.png"
          alt={partner.gallery[0].alt}
          fill
          sizes="100vw"
          style={{ objectPosition: partner.gallery[0].position }}
        />
        <figcaption>{partner.name} × Senja technology ecosystem</figcaption>
      </figure>

      <section id="products" className="brand-products" aria-labelledby="brand-products-title">
        <header className="brand-products__head" data-brand-reveal>
          <div>
            <p className="brand-detail__eyebrow">Available through Senja</p>
            <h2 id="brand-products-title">Featured products</h2>
          </div>
          <p>
            Product availability and exact configuration may vary. Contact our
            team for specification, pricing, and project-based recommendations.
          </p>
        </header>

        <div className="brand-products__segments" data-brand-reveal>
          <div className="brand-products__segments-heading">
            <div>
              <span>Product segmentation</span>
              <p>Choose a segment to explore the right products faster.</p>
            </div>
            <span aria-live="polite">
              {activeSegment === "All products" ? partner.name : activeSegment}
            </span>
          </div>
          <div className="brand-products__segment-controls">
            <div
              className="brand-products__segment-list"
              role="tablist"
              aria-label={`${partner.name} primary product segments`}
            >
              {visibleSegments.map((segment, index) => {
                const isActive = activeSegment === segment.name;
                const segmentIndex = productSegments.findIndex((item) => item.name === segment.name);

                return (
                  <button
                    key={segment.name}
                    id={`product-segment-${partner.slug}-${segmentIndex}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`product-panel-${partner.slug}`}
                    tabIndex={isActive ? 0 : -1}
                    className={isActive ? "is-active" : undefined}
                    onClick={() => selectSegment(segment.name)}
                    onKeyDown={(event) => handleSegmentKeyDown(event, index)}
                  >
                    <span>{segment.name}</span>
                    <small>{segment.count.toString().padStart(2, "0")}</small>
                  </button>
                );
              })}
            </div>

            {overflowSegments.length > 0 && (
              <div className="brand-products__more" ref={segmentMenuRef}>
                <button
                  type="button"
                  className="brand-products__more-trigger"
                  aria-expanded={isSegmentMenuOpen}
                  aria-controls={`product-segments-more-${partner.slug}`}
                  aria-haspopup="dialog"
                  onClick={() => setIsSegmentMenuOpen(true)}
                >
                  <span>More segments</span>
                  <small>+{overflowSegments.length}</small>
                  <i aria-hidden="true">{isSegmentMenuOpen ? "×" : "⌄"}</i>
                </button>

                {isSegmentMenuOpen && (
                  <div
                    id={`product-segments-more-${partner.slug}`}
                    className="brand-products__more-popover"
                    role="dialog"
                    aria-label={`More ${partner.name} product segments`}
                  >
                    <header>
                      <div>
                        <span>Browse segments</span>
                        <p>{overflowSegments.length} more available</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSegmentMenuOpen(false);
                          setSegmentSearch("");
                        }}
                        aria-label="Close segment browser"
                      >
                        ×
                      </button>
                    </header>

                    <label htmlFor={`segment-search-${partner.slug}`}>Find a segment</label>
                    <div className="brand-products__more-search">
                      <span aria-hidden="true">⌕</span>
                      <input
                        id={`segment-search-${partner.slug}`}
                        type="search"
                        value={segmentSearch}
                        onChange={(event) => setSegmentSearch(event.target.value)}
                        placeholder="Search segments"
                        autoComplete="off"
                      />
                    </div>

                    <div className="brand-products__more-list">
                      {filteredOverflowSegments.map((segment) => (
                        <button
                          key={segment.name}
                          type="button"
                          onClick={() => selectSegment(segment.name)}
                        >
                          <span>{segment.name}</span>
                          <small>
                            {segment.count} {segment.count === 1 ? "product" : "products"}
                          </small>
                          <i aria-hidden="true">→</i>
                        </button>
                      ))}
                      {filteredOverflowSegments.length === 0 && (
                        <p className="brand-products__more-empty">No matching segments.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <form
          className="brand-products__search"
          role="search"
          aria-label={`Search ${partner.name} products`}
          onSubmit={(event) => event.preventDefault()}
          data-brand-reveal
        >
          <label htmlFor={`product-search-${partner.slug}`}>Search products</label>
          <div>
            <span aria-hidden="true">⌕</span>
            <input
              id={`product-search-${partner.slug}`}
              type="search"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search by product name or category"
              autoComplete="off"
            />
            {productSearch && (
              <button type="button" onClick={() => setProductSearch("")} aria-label="Clear product search">
                Clear
              </button>
            )}
          </div>
          <p aria-live="polite">
            {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
          </p>
        </form>

        <div
          id={`product-panel-${partner.slug}`}
          className="brand-products__grid"
          role="tabpanel"
          aria-labelledby={`product-segment-${partner.slug}-${productSegments.findIndex((segment) => segment.name === activeSegment)}`}
        >
          {visibleProducts.map((product, index) => (
            <article key={`${activeSegment}-${product.name}`} className="brand-product-card" data-brand-reveal>
              <div className="brand-product-card__image" data-brand-image>
                <SafeImage src={product.image} fallbackSrc="/images/2.png" alt={`${product.name} application environment`} fill sizes="(max-width: 820px) 100vw, 34vw" />
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                <div className="brand-product-card__brand">
                  <SafeImage src={partner.image} fallbackSrc={partnerLogoFallback(partner.slug)} alt="" width={130} height={70} />
                </div>
              </div>
              <div className="brand-product-card__copy">
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <Link href="/contact">Ask about this product <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
          {visibleProducts.length === 0 && (
            <div className="brand-products__empty" role="status">
              <p>No products found</p>
              <span>Try another product name or choose a different segment.</span>
            </div>
          )}
        </div>
      </section>

      <section className="brand-detail__delivery">
        <header data-brand-reveal>
          <p className="brand-detail__eyebrow">More than distribution</p>
          <h2>From product to<br /><em>working solution.</em></h2>
        </header>
        <div className="brand-detail__steps">
          {integrationSteps.map((step) => (
            <article key={step.number} data-brand-reveal>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Link href={`/partners/${nextPartner.slug}`} className="next-brand" data-brand-reveal>
        <div>
          <p>Next partner · {nextPartner.number}</p>
          <h2>{nextPartner.name}</h2>
        </div>
        <div className="next-brand__logo">
          <SafeImage src={nextPartner.image} fallbackSrc={partnerLogoFallback(nextPartner.slug)} alt={`${nextPartner.name} logo`} width={180} height={100} />
        </div>
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
