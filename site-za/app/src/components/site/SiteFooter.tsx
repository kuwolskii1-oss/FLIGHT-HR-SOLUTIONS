import { useEffect, useRef } from "react";
import { site } from "@/site/data/site";
import { SmartLink } from "./SmartLink";

const YEAR = new Date().getFullYear();

/**
 * The footer lands the flight. A dusk horizon opens it and the tagline sits on solid ground below
 * (no text on the photograph). Parallax: --fp runs 0 to 1 as the footer comes into view; the sky
 * settles and the tagline rises on it. On wide screens whose viewport holds the whole footer, the
 * page lifts off it like a curtain (html.has-curtain: the footer sticks beneath the last section).
 * Reduced motion: no curtain, no parallax, the end state.
 */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const { company, footer, group, hours } = site;
  const held = footer.badges.filter((b) => b.status === "held");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const doc = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--fp", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight;
      const start = doc.scrollHeight - h;
      const p = Math.min(
        1,
        Math.max(0, (window.scrollY + window.innerHeight - start) / Math.max(h, 1)),
      );
      el.style.setProperty("--fp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const measure = () => {
      const fits = window.innerWidth >= 1000 && el.offsetHeight <= window.innerHeight - 24;
      doc.classList.toggle("has-curtain", fits);
      onScroll();
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
      doc.classList.remove("has-curtain");
    };
  }, []);

  return (
    <footer ref={ref} className="c-footer" data-theme="deep">
      <div className="c-footer__sky" aria-hidden="true">
        <img
          className="c-footer__skyimg"
          src="/assets/img/footer-horizon-900.webp"
          srcSet="/assets/img/footer-horizon-900.webp 900w, /assets/img/footer-horizon-1800.webp 1800w"
          sizes="100vw"
          width={1800}
          height={771}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="o-container c-footer__body">
        <p className="c-footer__tagline">{company.tagline}</p>
        <div className="c-footer__grid">
          <div className="c-footer__brand">
            <img
              src="/brand/logo-light.svg"
              alt={company.legalName}
              width={272}
              height={64}
              loading="lazy"
              decoding="async"
            />
            <address className="c-footer__address">
              {company.legalName}
              {company.address.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
              <br />
              {company.country}
            </address>
            <p className="c-footer__group">
              {group.line}.{" "}
              <a href={group.swiss.href} target="_blank" rel="noopener noreferrer">
                {group.swiss.label} site
              </a>
            </p>
          </div>
          {footer.groups.map((g) => (
            <div className="c-footer__col" key={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <SmartLink href={l.href}>{l.label}</SmartLink>
                    {l.note ? <span className="c-badge c-badge--quiet">{l.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="c-footer__col">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${company.emails.general}`}>{company.emails.general}</a>
              </li>
              {company.phone ? (
                <li>
                  <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
                </li>
              ) : null}
              {company.whatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {company.whatsappDisplay}
                  </a>
                </li>
              ) : null}
              {hours.aog ? <li>{hours.aog}</li> : null}
            </ul>
          </div>
        </div>
        {held.length ? (
          <ul className="c-footer__badges" aria-label="Accreditations">
            {held.map((b) => (
              <li key={b.name}>
                {b.name}
                {b.text ? `: ${b.text}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="c-footer__disclosure">{footer.disclaimer}</p>
        <div className="c-footer__legal">
          <span>
            © {YEAR} {footer.legalLine}
          </span>
          <SmartLink href="/privacy">Privacy notice</SmartLink>
          <SmartLink href="/legal">Legal</SmartLink>
          {/* Credit required by the Streamline Guidance licence on every page that shows the
              pictograms: the Streamline link (followed), the licence named and linked, and a note
              that the strokes are restyled (CC BY 4.0 asks for changes to be indicated). */}
          <span>
            <a href="https://streamlinehq.com" target="_blank" rel="noopener">
              Free icons from Streamline
            </a>
            ,{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
              CC BY 4.0
            </a>
            , restyled
          </span>
        </div>
      </div>
    </footer>
  );
}
