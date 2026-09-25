import Link from "next/link";

export default function DirectAnswer({
  question,
  answer,
  more,
  href,
  linkLabel,
  tone = "light",
}) {
  const isDark = tone === "dark";

  return (
    <section
      className={
        isDark
          ? "bg-[var(--si-deep-brown)] px-6 py-16 text-[var(--si-cream)] sm:px-10 sm:py-20 lg:px-28"
          : "bg-[var(--si-cream)] px-6 py-16 text-[var(--si-deep-brown)] sm:px-10 sm:py-20 lg:px-28"
      }
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className={`nn-display text-2xl font-light leading-snug sm:text-3xl ${
            isDark ? "text-[var(--si-cream)]" : "text-[var(--si-deep-brown)]"
          }`}
        >
          {question}
        </h2>
        <p
          className={`mt-5 text-sm font-light leading-[1.95] sm:text-[0.95rem] ${
            isDark ? "text-[var(--si-cream)]/65" : "text-[var(--si-muted)]"
          }`}
        >
          {answer}
        </p>
        {more ? (
          <p
            className={`mt-4 text-sm font-light leading-[1.95] ${
              isDark ? "text-[var(--si-cream)]/50" : "text-[var(--si-muted)]"
            }`}
          >
            {more}
          </p>
        ) : null}
        {href && linkLabel ? (
          <Link
            href={href}
            className={
              isDark
                ? "nn-link-quiet mt-8 inline-block !text-[var(--si-cream)]"
                : "nn-link-quiet mt-8 inline-block"
            }
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
