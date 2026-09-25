import { imageSources } from "@/site/images";

/**
 * Engine 360 as an instrument: the engine face in a round frame, ringed by a dial whose arc is
 * drawn by the act's scroll progress (--sc-p). 360 degrees of ticks, a major tick every 45.
 * Decorative: the section's heading and text carry the meaning.
 */
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);

export function EngineDial() {
  const img = imageSources("hero-engine-stand");
  return (
    <div className="c-dial" aria-hidden="true">
      <svg className="c-dial__ring" viewBox="0 0 400 400" focusable="false">
        <circle className="c-dial__track" cx="200" cy="200" r="186" />
        <circle
          className="c-dial__arc"
          cx="200"
          cy="200"
          r="186"
          pathLength="1000"
          transform="rotate(-90 200 200)"
        />
        {TICKS.map((a) => (
          <line
            key={a}
            className={a % 45 === 0 ? "c-dial__tick c-dial__tick--major" : "c-dial__tick"}
            x1="200"
            y1={a % 45 === 0 ? 2 : 6}
            x2="200"
            y2="12"
            transform={`rotate(${a} 200 200)`}
          />
        ))}
      </svg>
      <div className="c-dial__face">
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(min-width: 900px) 34vw, 80vw"
          width={1800}
          height={1013}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
