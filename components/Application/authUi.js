export const authInputClass =
  "h-12 rounded-2xl border-[#f1e3d4] bg-[#FFF8F2] px-4 text-[15px] font-medium text-[#3a2416] shadow-none placeholder:text-[#b7a498] focus-visible:border-[#E45700] focus-visible:ring-0";

export const authLabelClass =
  "text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]";

export const authButtonClass =
  "h-12 w-full cursor-pointer rounded-full bg-[#E45700] text-[15px] font-bold tracking-normal text-white shadow-[0_8px_18px_rgba(228,87,0,0.28)] hover:bg-[#cf4c00] disabled:opacity-60";

export const authLinkClass =
  "font-bold text-[#E45700] underline-offset-4 hover:text-[#c2410c] hover:underline";

export const authMessageClass = "text-[12.5px] font-semibold text-[#c2410c]";

export function AuthHeading({ eyebrow, title, text, align = "responsive" }) {
  const centered = align === "center";
  return (
    <div className={`mb-7 sm:mb-8 ${centered ? "text-center" : "text-center sm:text-left"}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#E45700]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#3a2416] sm:text-[2.3rem]">
        {title}
      </h1>
      {text ? (
        <p
          className={`mt-3 max-w-[36ch] text-[14.5px] leading-relaxed text-[#6b5142] ${
            centered ? "mx-auto" : "mx-auto sm:mx-0 sm:max-w-none"
          }`}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
