import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";

type ComparisonRow = {
  multilateral: string;
  bilateral: string;
};

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "mekanisme-perdagangan",
      ])),
    },
  };
};

export default function MekanismePerdaganganPage() {
  const { t } = useTranslation("mekanisme-perdagangan");

  const comparisonRows = t("comparison.rows", {
    returnObjects: true,
  }) as unknown as ComparisonRow[];

  return (
    <PageTemplate title={t("pageTitle")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer hideTitle>
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/60 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-4">
            <div className="bg-orange-500 text-white text-center font-semibold py-2 rounded-md">
              {t("pageTitle")}
            </div>

            <div className="bg-white rounded-md mt-4 p-5 md:p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="font-bold text-gray-700">{t("cards.jfx.title")}</h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {t("cards.jfx.description")}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="font-bold text-gray-700">{t("cards.spa.title")}</h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {t("cards.spa.description")}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-sm font-semibold text-gray-700">{t("comparison.title")}</h3>
                <div className="mx-auto mt-2 h-0.5 w-10 bg-orange-500" />
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">
                        {t("comparison.columns.multilateral")}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase border-b border-gray-200">
                        {t("comparison.columns.bilateral")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {Array.isArray(comparisonRows) &&
                      comparisonRows.map((row, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                            {row.multilateral}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {row.bilateral}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}

