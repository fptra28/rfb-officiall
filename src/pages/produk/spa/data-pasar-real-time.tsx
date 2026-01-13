import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import MarketTable from "@/components/organisms/MarketTable";
import TradingViewAdvancedChart from "@/components/moleculs/TradingViewAdvancedChart";

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "navbar", "footer", "market"])),
  },
});

export default function SpaRealtimeMarketPage() {
  const { t } = useTranslation("market");

  return (
    <PageTemplate title={t("title")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t("title")}>
          <MarketTable
            showHeader={false}
            symbols={[
              "XUL10",
              "BCO10_BBJ",
              "HKK50_BBJ",
              "JPK50_BBJ",
              "AU10F_BBJ",
              "EU10F_BBJ",
              "GU10F_BBJ",
              "UC10F_BBJ",
              "UJ10F_BBJ",
            ]}
          />

          <div className="mt-8 rounded-xl bg-[#0f172a] shadow-sm overflow-hidden">
            <div className="h-[520px] w-full">
              <TradingViewAdvancedChart symbol="OANDA:XAUUSD" theme="dark" />
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
