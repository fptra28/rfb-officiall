import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";

type IndexSymbol = {
  code: string;
  name: string;
  note?: string;
};

type MonthSymbol = {
  code: string;
  month: string;
};

type ContractMonthGroup = {
  title: string;
  months: MonthSymbol[];
};

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "simbol-indeks",
      ])),
    },
  };
};

export default function SimbolIndeksPage() {
  const { t } = useTranslation("simbol-indeks");

  const indexSymbols = t("indexSymbols.items", { returnObjects: true }) as unknown as IndexSymbol[];
  const contractMonths = t("contractMonths.groups", { returnObjects: true }) as unknown as ContractMonthGroup[];

  return (
    <PageTemplate title={t("pageTitle")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer hideTitle>
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/60 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-4">
            <div className="bg-orange-500 text-white text-center font-semibold py-2 rounded-md">
              {t("pageTitle")}
            </div>

            <div className="bg-white rounded-md mt-4 p-5 md:p-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">{t("indexSymbols.title")}</h2>
                <p className="text-xs text-gray-500 mt-1">{t("indexSymbols.subtitle")}</p>

                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {Array.isArray(indexSymbols) &&
                      indexSymbols.map((item, idx) => (
                        <div
                          key={`${item.code}-${idx}`}
                          className="grid grid-cols-[80px_1fr] gap-3 px-4 py-2 text-xs md:text-sm"
                        >
                          <div className="font-semibold text-orange-600">{item.code}</div>
                          <div className="text-gray-700">
                            <span>{item.name}</span>
                            {item.note ? <span className="text-gray-500"> {item.note}</span> : null}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <hr className="my-8 border-gray-200" />

              <div>
                <h2 className="text-sm font-semibold text-gray-700">{t("contractMonths.title")}</h2>
                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  {Array.isArray(contractMonths) &&
                    contractMonths.map((group, idx) => (
                      <div key={`${group.title}-${idx}`} className="border border-gray-200 rounded-md">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <h3 className="text-xs font-semibold text-gray-700">{group.title}</h3>
                        </div>
                        <div className="p-4">
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-700">
                            {Array.isArray(group.months) &&
                              group.months.map((m, mIdx) => (
                                <li key={`${m.code}-${mIdx}`} className="flex items-center gap-2">
                                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                                  <span className="w-4 font-semibold text-orange-600">{m.code}</span>
                                  <span>{m.month}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}

