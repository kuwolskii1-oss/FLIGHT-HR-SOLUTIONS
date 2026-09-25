import type { Door } from "@/site/types";
import type { RouteKey } from "@/site/enquiry.functions";
import { site } from "@/site/data/site";
import { Accordion } from "./Accordion";
import { ClosingBand } from "./ClosingBand";
import { CtaLink, CtaTalk } from "./Cta";
import { DoorForm } from "./DoorForm";
import { LocalNav } from "./LocalNav";
import { MediaFrame } from "./MediaFrame";
import { DOOR_IMAGES } from "@/site/images";
import { Steps } from "./Steps";
import { SmartLink } from "./SmartLink";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";

/**
 * One door page. Order: what this is (intro with who, timing and what to bring), the sections
 * (four to six capabilities, each a screen), the door's process or verification, the full scope
 * for procurement readers, the form, the closing. One call to action per screen.
 */
export function DoorPage({ door, route, whatsappTemplate }: { door: Door; route: RouteKey; whatsappTemplate?: string }) {
  const nav = [...door.sections.map((s) => ({ label: s.title, href: `#${s.id}` })), ...(door.process ? [{ label: door.process.title, href: "#process" }] : []), ...(door.verify ? [{ label: door.verify.title, href: "#verify" }] : []), { label: door.form.title, href: "#form" }];
  return (
    <main id="main" tabIndex={-1}>
      <header data-theme="dark" className="c-page-intro c-door-intro" data-sc-act="flow">
        <div className="o-container">
          <div className="c-door-intro__grid" data-sc-in data-sc-stagger="70">
            <div>
              <span className="c-eyebrow">{door.name}</span>
              <h1 className="c-h1 c-h1--inner c-page-intro__title">{door.hero.headline}</h1>
              <p className="c-lead c-page-intro__lead">{door.hero.sub}</p>
              <div className="c-cta-row" style={{ marginTop: "var(--space-medium)" }}>
                <CtaTalk href={door.hero.cta.href} label={door.hero.cta.label} />
              </div>
            </div>
            <dl className="c-bring">
              <div>
                <dt>Who comes in</dt>
                <dd>{door.who.join(", ")}</dd>
              </div>
              <div>
                <dt>Typical timing</dt>
                <dd>{door.urgency}</dd>
              </div>
              <div>
                <dt>What to bring</dt>
                <dd>
                  <ul>
                    {door.bring.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
          <LocalNav items={nav} />
        </div>
      </header>

      {DOOR_IMAGES[door.slug] ? (
        <section data-theme="light" className="c-doorimg" data-sc-act="flow" aria-hidden="true">
          <div className="o-container">
            <MediaFrame image={door.image?.src ?? DOOR_IMAGES[door.slug]} alt="" ratio="16x9" reveal="up" sizes="100vw" />
          </div>
        </section>
      ) : null}

      {door.sections.map((s, i) => (
        <section key={s.id} id={s.id} data-theme={i % 2 ? "light" : "light"} className={`o-section c-doorsec${i % 2 ? " o-section--raised" : ""}`} data-sc-act="flow" aria-labelledby={`${s.id}-title`}>
          <div className="o-container c-doorsec__grid" data-sc-in data-sc-stagger="70">
            <div className="c-doorsec__head">
              <span className="c-doorsec__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 id={`${s.id}-title`} className="c-h2 c-doorsec__title">
                {s.title}
              </h2>
            </div>
            <div className="c-doorsec__body">
              <p className="c-lead">{s.text}</p>
              {s.bullets?.length ? (
                <ul className="c-doorsec__bullets">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
              {i === door.sections.length - 1 && s.href ? (
                <div style={{ marginTop: "var(--space-medium)" }}>
                  <CtaLink href={s.href} label={door.form.submitLabel} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      {door.process ? <Steps id="process" steps={door.process.steps} title={door.process.title} intro={door.process.intro} theme="dark" /> : null}

      {door.verify ? (
        <section id="verify" data-theme="light" className="o-section" data-sc-act="flow" aria-labelledby="verify-title">
          <div className="o-container">
            <div className="c-section-head">
              <div className="c-section-head__title">
                <h2 id="verify-title" className="c-h2">
                  {door.verify.title}
                </h2>
              </div>
              {door.verify.intro ? <p className="c-section-head__intro c-lead c-muted">{door.verify.intro}</p> : null}
            </div>
            <ul className="c-verify" data-sc-in data-sc-stagger="70">
              {door.verify.items.map((it) => (
                <li className="c-verify__item" key={it.title}>
                  <h3 className="c-verify__title">{it.title}</h3>
                  <p className="c-verify__text">{it.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {door.fullScope ? (
        <section id="scope" data-theme="light" className="o-section o-section--tight" data-sc-act="flow" aria-labelledby="scope-title">
          <div className="o-container c-scope">
            <h2 id="scope-title" className="c-h3">
              {door.fullScope.title}
            </h2>
            {door.fullScope.intro ? <p className="c-muted" style={{ marginTop: "var(--space-tiny)" }}>{door.fullScope.intro}</p> : null}
            <div className="c-scope__list">
              {door.fullScope.groups.map((g) => (
                <Accordion key={g.title} title={g.title}>
                  <ul className="c-scope__items">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Accordion>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {door.disclaimer ? (
        <section data-theme="light" className="o-section o-section--tight" aria-label="Operator disclaimer">
          <div className="o-container">
            <p className="c-callout">{door.disclaimer}</p>
          </div>
        </section>
      ) : null}

      <section id="form" data-theme="light" className="o-section o-section--raised c-formsec" data-sc-act="flow" aria-labelledby="form-title">
        <div className="o-container c-formsec__grid">
          <div className="c-formsec__aside">
            <h2 id="form-title" className="c-h2">
              {door.form.title}
            </h2>
            {door.form.responsePromise ? <p className="c-muted" style={{ marginTop: "var(--space-small)" }}>{door.form.responsePromise}</p> : null}
            <p className="c-muted" style={{ marginTop: "var(--space-small)" }}>
              Or write to <a href={`mailto:${site.company.emails[route]}`}>{site.company.emails[route]}</a>.
            </p>
            {door.related?.length ? (
              <ul className="c-related" aria-label="Related pages">
                <li className="c-related__head">Related</li>
                {door.related.map((r) => (
                  <li key={r.href}>
                    <SmartLink href={r.href}>{r.label}</SmartLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <DoorForm form={door.form} route={route} whatsappTemplate={whatsappTemplate} />
        </div>
      </section>

      <ClosingBand headline={site.cta.primary.label === "Get in touch" ? "Something else? Talk to us" : "Talk to us"} primary={site.cta.primary} urgent={site.cta.urgent} linkOnly />
      <ScrollCraftMount />
    </main>
  );
}
