import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";

type StepRow = {
  localDate: string;
  localTime: string;
  dst: string;
  utcOffset: string;
  timeZone: string;
};

type ScheduleRow = {
  year: string;
  start: string;
  end: string;
};

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="mt-10">
      <h2 className="text-sm md:text-base font-semibold text-gray-800">{label}</h2>
      <div className="mt-2 h-0.5 w-10 bg-orange-500" />
    </div>
  );
}

function InfoCard({
  title,
  imageSrc,
  description,
}: {
  title: string;
  imageSrc: string;
  description: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="px-4 py-3 font-semibold text-gray-700 text-xs md:text-sm">{title}</div>
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <div className="bg-amber-50 flex items-center justify-center p-4">
          <img src={imageSrc} alt={title} className="max-h-28 object-contain" />
        </div>
        <div className="p-4 text-xs md:text-sm text-gray-600 leading-relaxed">{description}</div>
      </div>
    </div>
  );
}

function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: StepRow[];
}) {
  return (
    <div className="mt-6">
      <div className="text-xs md:text-sm font-semibold text-gray-700 mb-3">{title}</div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold border-b border-gray-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r, idx) => (
              <tr key={idx} className={idx === 1 ? "bg-orange-50/60" : ""}>
                <td className="px-4 py-3 border-t border-gray-200">{r.localDate}</td>
                <td className="px-4 py-3 border-t border-gray-200">{r.localTime}</td>
                <td className="px-4 py-3 border-t border-gray-200">{r.dst}</td>
                <td className="px-4 py-3 border-t border-gray-200">{r.utcOffset}</td>
                <td className="px-4 py-3 border-t border-gray-200">{r.timeZone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScheduleTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: ScheduleRow[];
}) {
  return (
    <div className="mt-6">
      <div className="text-xs md:text-sm font-semibold text-gray-700 mb-3">{title}</div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-semibold border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="px-4 py-3">{r.year}</td>
                <td className="px-4 py-3">{r.start}</td>
                <td className="px-4 py-3">{r.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "navbar", "footer", "summer-winter"])),
    },
  };
};

export default function SummerWinterPage() {
  const { t } = useTranslation("summer-winter");

  const ukForwardRows = t("uk.forward.rows", { returnObjects: true }) as unknown as StepRow[];
  const ukBackwardRows = t("uk.backward.rows", { returnObjects: true }) as unknown as StepRow[];
  const ukScheduleRows = t("uk.schedule.rows", { returnObjects: true }) as unknown as ScheduleRow[];

  const usForwardRows = t("us.forward.rows", { returnObjects: true }) as unknown as StepRow[];
  const usBackwardRows = t("us.backward.rows", { returnObjects: true }) as unknown as StepRow[];
  const usScheduleRows = t("us.schedule.rows", { returnObjects: true }) as unknown as ScheduleRow[];

  return (
    <PageTemplate title={t("pageTitle")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer hideTitle>
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/60 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-4">
            <div className="bg-orange-500 text-white text-center font-semibold py-2 rounded-md">
              {t("pageTitle")}
            </div>

            <div className="bg-white rounded-md mt-4 p-5 md:p-6">
              {/* UK */}
              <SectionTitle label={t("uk.title")} />
              <p className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed">{t("uk.p1")}</p>
              <p className="mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">{t("uk.p2")}</p>

              <div className="mt-6 grid md:grid-cols-2 gap-5">
                <InfoCard
                  title={t("uk.cards.start.title")}
                  imageSrc="/assets/MUSIM-01.png"
                  description={t("uk.cards.start.description")}
                />
                <InfoCard
                  title={t("uk.cards.end.title")}
                  imageSrc="/assets/MUSIM-02.png"
                  description={t("uk.cards.end.description")}
                />
              </div>

              <DataTable
                title={t("uk.forward.title")}
                columns={t("tables.columns", { returnObjects: true }) as unknown as string[]}
                rows={ukForwardRows}
              />
              <DataTable
                title={t("uk.backward.title")}
                columns={t("tables.columns", { returnObjects: true }) as unknown as string[]}
                rows={ukBackwardRows}
              />

              <div className="mt-6 border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="text-xs md:text-sm font-semibold text-gray-700">
                  {t("uk.formula.title")}
                </div>
                <div className="mt-3 space-y-2 text-xs md:text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">{t("uk.formula.forwardLabel")}</span> {t("uk.formula.forward")}
                  </div>
                  <div>
                    <span className="font-semibold">{t("uk.formula.backwardLabel")}</span> {t("uk.formula.backward")}
                  </div>
                  <div className="pt-2 text-[11px] text-gray-500 italic">{t("uk.formula.note")}</div>
                </div>
              </div>

              <ScheduleTable
                title={t("uk.schedule.title")}
                headers={t("uk.schedule.headers", { returnObjects: true }) as unknown as string[]}
                rows={ukScheduleRows}
              />

              <hr className="my-10 border-gray-200" />

              {/* US */}
              <SectionTitle label={t("us.title")} />
              <p className="mt-4 text-xs md:text-sm text-gray-700 leading-relaxed">{t("us.p1")}</p>
              <p className="mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">{t("us.p2")}</p>

              <div className="mt-6 grid md:grid-cols-2 gap-5">
                <InfoCard
                  title={t("us.cards.start.title")}
                  imageSrc="/assets/MUSIM-01.png"
                  description={t("us.cards.start.description")}
                />
                <InfoCard
                  title={t("us.cards.end.title")}
                  imageSrc="/assets/MUSIM-02.png"
                  description={t("us.cards.end.description")}
                />
              </div>

              <DataTable
                title={t("us.forward.title")}
                columns={t("tables.columns", { returnObjects: true }) as unknown as string[]}
                rows={usForwardRows}
              />
              <DataTable
                title={t("us.backward.title")}
                columns={t("tables.columns", { returnObjects: true }) as unknown as string[]}
                rows={usBackwardRows}
              />

              <div className="mt-6 border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="text-xs md:text-sm font-semibold text-gray-700">
                  {t("us.formula.title")}
                </div>
                <div className="mt-3 space-y-2 text-xs md:text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">{t("us.formula.forwardLabel")}</span> {t("us.formula.forward")}
                  </div>
                  <div>
                    <span className="font-semibold">{t("us.formula.backwardLabel")}</span> {t("us.formula.backward")}
                  </div>
                </div>
              </div>

              <ScheduleTable
                title={t("us.schedule.title")}
                headers={t("us.schedule.headers", { returnObjects: true }) as unknown as string[]}
                rows={usScheduleRows}
              />
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}

