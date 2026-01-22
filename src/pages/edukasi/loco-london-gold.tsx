import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";

type CardItem = { title: string; description: string };

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "loco-london-gold",
      ])),
    },
  };
};

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm md:text-base font-semibold text-gray-700">{label}</h2>
      <div className="mt-2 h-0.5 w-10 bg-orange-500" />
    </div>
  );
}

export default function LocoLondonGoldPage() {
  const { t } = useTranslation("loco-london-gold");

  const whyInvestBullets = t("sections.a.whyInvest.bullets", { returnObjects: true }) as unknown as string[];
  const mekanismeBullets = t("sections.b.bullets", { returnObjects: true }) as unknown as string[];
  const keuntunganBullets = t("sections.c.bullets", { returnObjects: true }) as unknown as string[];
  const risikoBullets = t("sections.d.bullets", { returnObjects: true }) as unknown as string[];
  const faktorCards = t("sections.e.cards", { returnObjects: true }) as unknown as CardItem[];

  return (
    <PageTemplate title={t("pageTitle")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer hideTitle>
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/60 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-4">
            <div className="bg-orange-500 text-white text-center font-semibold py-2 rounded-md">
              {t("pageTitle")}
            </div>

            <div className="bg-white rounded-md mt-4 p-5 md:p-6">
              {/* Intro */}
              <div className="border border-gray-200 rounded-md p-4 text-sm text-gray-700 leading-relaxed space-y-3">
                <p>{t("intro.p1")}</p>
                <p>{t("intro.p2")}</p>
              </div>

              {/* A */}
              <SectionTitle label={t("sections.a.title")} />
              <div className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed space-y-3">
                <p>{t("sections.a.p1")}</p>
                <p>{t("sections.a.p2")}</p>
              </div>

              <div className="mt-5 border border-gray-200 rounded-md p-4">
                <h3 className="text-xs md:text-sm font-semibold text-gray-700">
                  {t("sections.a.otc.title")}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-gray-700 leading-relaxed">
                  {t("sections.a.otc.description")}
                </p>
              </div>

              <div className="mt-5 border border-orange-200 bg-orange-50 rounded-md p-4">
                <h3 className="text-xs md:text-sm font-semibold text-gray-700">
                  {t("sections.a.whyInvest.title")}
                </h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-700">
                  {Array.isArray(whyInvestBullets) &&
                    whyInvestBullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              </div>

              {/* B */}
              <SectionTitle label={t("sections.b.title")} />
              <div className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed space-y-3">
                <p>{t("sections.b.p1")}</p>
                <p>{t("sections.b.p2")}</p>
              </div>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-700">
                {Array.isArray(mekanismeBullets) &&
                  mekanismeBullets.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>

              {/* C */}
              <SectionTitle label={t("sections.c.title")} />
              <ul className="mt-4 list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-700">
                {Array.isArray(keuntunganBullets) &&
                  keuntunganBullets.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>

              {/* D */}
              <SectionTitle label={t("sections.d.title")} />
              <p className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                {t("sections.d.p1")}
              </p>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-700">
                {Array.isArray(risikoBullets) &&
                  risikoBullets.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>

              {/* E */}
              <SectionTitle label={t("sections.e.title")} />
              <p className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                {t("sections.e.p1")}
              </p>
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {Array.isArray(faktorCards) &&
                  faktorCards.map((card, idx) => (
                    <div key={`${card.title}-${idx}`} className="border border-gray-200 rounded-md p-4">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-700">{card.title}</h3>
                      <p className="mt-2 text-xs text-gray-600 leading-relaxed">{card.description}</p>
                    </div>
                  ))}
              </div>

              {/* F */}
              <SectionTitle label={t("sections.f.title")} />
              <div className="mt-4 border border-gray-200 rounded-md p-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                {t("sections.f.p1")}
              </div>

              <div className="mt-8 text-center text-xs text-gray-400">{t("footnote")}</div>
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}

