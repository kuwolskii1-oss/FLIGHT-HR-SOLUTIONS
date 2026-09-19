export function Steps({ steps }: { steps: { n: string; title: string; text: string }[] }) {
  return (
    <ol className="c-steps" data-progress>
      <span className="c-steps__rule" aria-hidden="true" />
      {steps.map((s) => (
        <li key={s.n + s.title} className="c-step" data-step>
          <span className="c-step__n">Step {s.n}</span>
          <h3 className="c-step__title">{s.title}</h3>
          <p className="c-step__text">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
