import type { Door } from "@/site/types";
import type { RouteKey } from "@/site/enquiry.functions";
import { site } from "@/site/data/site";
import { Accordion } from "./Accordion";
import { ClosingBand } from "./ClosingBand";
import { CtaLink, CtaTalk } from "./Cta";
import { DoorForm } from "./DoorForm";
import { InfoBoard } from "./InfoBoard";
import { IntroDither } from "./IntroDither";
import { DOOR_IMAGES } from "@/site/images";
import { Steps } from "./Steps";
import { SmartLink } from "./SmartLink";
import { ScrollCraftMount } from "@/components/site/ScrollCraftMount";
import { Pictogram, PictoTile } from "./Pictogram";
import { DOOR_PICTO, ITEM_PICTO, SECTION_PICTO } from "@/site/wayfinding";

/**
 * One door page. Order: what this is (intro with who, timing and what to bring), the capabilities
 * (two to six, one board with a row each), the door's process or verification, the full scope
 * for procurement readers, the form, the closing. One call to action per screen. Section links
 * live in the header's dropdowns only; the page repeats none of them.
 */
export function DoorPage({
  door,
  route,
  whatsappTemplate,
}: {
  door: Door;
  route: RouteKey;
  whatsappTemplate?: string;
}) {
  const image = DOOR_IMAGES[door.slug];
  return (
    <main id="main" tabIndex={-1}>
      {/* The door's photograph is the intro's background, as a light dither (IntroDither). */}
      <header
        data-theme="light"
        className={`c-page-intro c-door-intro${image ? " c-page-intro--dither" : ""}`}
        data-sc-act="flow"
      >
        {image ? <IntroDither image={image} /> : null}
        <div className="o-container">
          <div className="c-door-intro__grid" data-sc-in data-sc-stagger="70">
            <div>
              <span className="c-eyebrow">
                {DOOR_PICTO[door.slug] ? (
                  <PictoTile name={DOOR_PICTO[door.slug]} size="sm" />
                ) : null}
                {door.name}
              </span>
              <h1 className="c-h1 c-h1--inner c-page-intro__title">{door.hero.headline}</h1>
              <p className="c-lead c-page-intro__lead">{door.hero.sub}</p>
              <div className="c-cta-row" style={{ marginTop: "var(--space-medium)" }}>
                <CtaTalk href={door.hero.cta.href} label={door.hero.cta.label} />
              </div>
            </div>
            <div className="c-pass" data-theme="light">
              <div className="c-pass__head" aria-hidden="true">
                <img
                  className="c-pass__logo"
                  src="/brand/logo.svg"
                  alt=""
                  width={272}
                  height={64}
                  decoding="async"
                />
                {DOOR_PICTO[door.slug] ? (
                  <PictoTile name={DOOR_PICTO[door.slug]} size="sm" />
                ) : null}
              </div>
              <dl className="c-pass__fields">
                <div className="c-pass__field">
                  <dt>
                    <Pictogram name="meeting-point" size={18} />
                    Who comes in
                  </dt>
                  <dd>{door.who.join(", ")}</dd>
                </div>
                <div className="c-pass__field">
                  <dt>
                    <Pictogram name="clock" size={18} />
                    Typical timing
                  </dt>
                  <dd>{door.urgency}</dd>
                </div>
                <div className="c-pass__field c-pass__field--bring">
                  <dt>
                    <Pictogram name="luggage" size={18} />
                    What to bring
                  </dt>
                  <dd>
                    <ul>
                      {door.bring.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <div className="c-pass__stub" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* The capabilities as one board: each row keeps its section id, so the header's dropdown
          links still land on it. */}
      <div data-theme="light" className="o-section c-caps" data-sc-act="flow">
        <div className="o-container">
          <InfoBoard
            headingLevel={2}
            size="lg"
            rows={door.sections.map((s, i) => ({
              key: s.id,
              id: s.id,
              title: s.title,
              picto: SECTION_PICTO[s.id],
              text: s.text,
              list: s.bullets,
              after:
                i === door.sections.length - 1 && s.href ? (
                  <div className="c-board__cta">
                    <CtaLink href={s.href} label={door.form.submitLabel} />
                  </div>
                ) : null,
            }))}
          />
        </div>
      </div>

      {door.process ? (
        <Steps
          id="process"
          steps={door.process.steps}
          title={door.process.title}
          intro={door.process.intro}
          theme="light"
        />
      ) : null}

      {door.verify ? (
        <section
          id="verify"
          data-theme="light"
          className="o-section"
          data-sc-act="flow"
          aria-labelledby="verify-title"
        >
          <div className="o-container">
            <div className="c-stackhead">
              <h2 id="verify-title" className="c-h2 c-h2--xl">
                {door.verify.title}
              </h2>
              {door.verify.intro ? <p className="c-lead c-muted">{door.verify.intro}</p> : null}
            </div>
            <InfoBoard
              rows={door.verify.items.map((it) => ({
                key: it.title,
                title: it.title,
                picto: ITEM_PICTO[it.title],
                text: it.text,
              }))}
            />
          </div>
        </section>
      ) : null}

      {door.fullScope ? (
        <section
          id="scope"
          data-theme="light"
          className="o-section o-section--tight"
          data-sc-act="flow"
          aria-labelledby="scope-title"
        >
          <div className="o-container c-scope">
            <h2 id="scope-title" className="c-h3">
              {door.fullScope.title}
            </h2>
            {door.fullScope.intro ? (
              <p className="c-muted" style={{ marginTop: "var(--space-tiny)" }}>
                {door.fullScope.intro}
              </p>
            ) : null}
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
        <section
          data-theme="light"
          className="o-section o-section--tight"
          aria-label="Operator disclaimer"
        >
          <div className="o-container">
            <div className="c-sign" data-theme="light">
              <PictoTile name="information-desk-symbol" className="c-sign__tile" />
              <p className="c-sign__text">{door.disclaimer}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="form"
        data-theme="light"
        className="o-section o-section--raised c-formsec"
        data-sc-act="flow"
        aria-labelledby="form-title"
      >
        <div className="o-container c-formsec__grid">
          <div className="c-formsec__aside">
            <h2 id="form-title" className="c-h2">
              {door.form.title}
            </h2>
            {door.form.responsePromise ? (
              <p className="c-muted" style={{ marginTop: "var(--space-small)" }}>
                {door.form.responsePromise}
              </p>
            ) : null}
            <p className="c-muted" style={{ marginTop: "var(--space-small)" }}>
              Or write to{" "}
              <a href={`mailto:${site.company.emails[route]}`}>{site.company.emails[route]}</a>.
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

      <ClosingBand
        headline={
          site.cta.primary.label === "Get in touch" ? "Something else? Talk to us" : "Talk to us"
        }
        primary={site.cta.primary}
        urgent={site.cta.urgent}
        linkOnly
      />
      <ScrollCraftMount />
    </main>
  );
}
