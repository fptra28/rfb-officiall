import { useTranslation } from "next-i18next";
import LocaleLink from "@/components/common/LocaleLink";

type LiveQuotesCtaProps = {
  href?: string;
  className?: string;
};

export default function LiveQuotesCta({ href = "/produk/spa/data-pasar-real-time", className }: LiveQuotesCtaProps) {
  const { t } = useTranslation("market");

  return (
    <section className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.25em] font-semibold text-green-700 uppercase mb-3">
              {t("cta.kicker")}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-green-700 leading-tight">
              {t("cta.headline")}
            </h2>
          </div>

          <LocaleLink
            href={href}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-zinc-900 px-6 py-3 text-white font-semibold shadow hover:bg-zinc-800 transition whitespace-nowrap"
          >
            <span>{t("cta.button")}</span>
            <i className="fa-solid fa-arrow-right" />
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
