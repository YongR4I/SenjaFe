import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { label: "Home", href: "/#top" },
  { label: "About Us", href: "/about" },
  { label: "Our Works", href: "/our-work" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <Link href="/#top" aria-label="Senja home">
            <Image src="/images/logo.png" alt="Senja" width={160} height={90} />
          </Link>
          <p>
            Technology That Connects
            <br />
            People, Spaces, &amp; Ideas.
          </p>
        </div>

        <nav className="site-footer__column" aria-label="Company links">
          <h2>Company</h2>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__column site-footer__contact">
          <h2>Contact</h2>
          <address>
            <a href="mailto:renanda@utamavisual.com">
              <span aria-hidden="true">✉</span> renanda@utamavisual.com
            </a>
            <a href="tel:+6289684183510">
              <span aria-hidden="true">⌕</span> +62 896 8418 3510
            </a>
            <p>
              <span aria-hidden="true">⌖</span>
              <span className="site-footer__address-text">
                Pranoto Tower, Lantai 2 C9–C10,
                <br />
                Jakarta Barat 11740
              </span>
            </p>
          </address>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Senja. All rights reserved.</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
