import { memo, useEffect, useId, useRef } from "react";
import { site } from "@/site/data/site";
import { Close } from "./Icons";
import { Pictogram } from "./Pictogram";

/**
 * The header search: SSR markup only. The behaviour is the plain module search/ui.ts, mounted in
 * an effect (and by the no-login preview on the same markup), which loads the index
 * (search/entries.ts) as its own chunk on the first open. See ui.ts for the pattern.
 *
 * The button sits in the header's actions; its panel is positioned by ui.ts over the navigation
 * (desktop) or the whole header row (phones), so the header row is its positioning context.
 */
export const SiteSearch = memo(function SiteSearch() {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const { search, nav } = site;
  const partsDoor = nav.doors.find((d) => d.href === "/parts");
  const config = {
    strings: {
      label: search.label,
      close: search.close,
      suggestions: search.suggestions,
      noResults: search.noResults,
      requestPart: search.requestPart,
    },
    request: {
      href: partsDoor?.items.find((i) => i.href.endsWith("#form"))?.href ?? "/parts#form",
      page: partsDoor?.label ?? "",
    },
  };

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void import("@/site/search/ui").then((m) => {
      if (cancelled) return;
      cleanup = m.mountSiteSearch(root, {
        loadEntries: () => import("@/site/search/entries").then((e) => e.buildSearchEntries()),
      });
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const id = (s: string) => `${uid}-search-${s}`;
  return (
    <div ref={ref} className="c-search" data-search data-search-config={JSON.stringify(config)}>
      <button
        type="button"
        className="c-search__toggle"
        data-search-toggle
        aria-expanded="false"
        aria-controls={id("panel")}
        aria-label={search.label}
      >
        <Pictogram name="search" size={19} />
      </button>
      <div
        className="c-search__panel"
        id={id("panel")}
        role="search"
        aria-labelledby={id("label")}
        data-search-panel
        hidden
      >
        <div className="c-search__clip">
          <form className="c-search__bar" data-search-form noValidate>
            <div className="c-search__row">
              <Pictogram name="search" size={18} className="c-search__glyph" />
              <label className="u-visually-hidden" id={id("label")} htmlFor={id("input")} data-search-label>
                {search.label}
              </label>
              <input
                id={id("input")}
                className="c-search__input"
                data-search-input
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded="false"
                aria-controls={id("list")}
                placeholder={search.placeholder}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
              />
              <button type="submit" className="c-search__submit">
                <span className="c-search__face">
                  <Pictogram name="search" size={16} className="c-search__submit-icon" />
                  <span className="c-search__submit-label">{search.button}</span>
                </span>
              </button>
            </div>
          </form>
        </div>
        <button type="button" className="c-search__close" data-search-close aria-label={search.close}>
          {/* The button's magnifier turns into the cross (the burger's icon swap). */}
          <span className="t-icon-swap" data-state="a" data-search-swap>
            <span className="t-icon" data-icon="a">
              <Pictogram name="search" size={19} />
            </span>
            <span className="t-icon" data-icon="b">
              <Close width={20} height={20} />
            </span>
          </span>
        </button>
        <div className="c-search__results" data-search-results hidden>
          <p className="c-search__empty" data-search-empty hidden>
            <Pictogram name="information-desk-symbol" size={18} className="c-search__empty-icon" />
            <span>{search.noResults}</span>
          </p>
          <p className="c-search__head" id={id("head")} data-search-head>
            {search.suggestions}
          </p>
          <div
            className="c-search__list"
            id={id("list")}
            role="listbox"
            aria-labelledby={id("head")}
            data-search-list
          />
        </div>
      </div>
      <p className="u-visually-hidden" aria-live="polite" data-search-live />
    </div>
  );
});
