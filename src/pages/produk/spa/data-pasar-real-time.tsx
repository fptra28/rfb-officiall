import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import MarketTable from "@/components/organisms/MarketTable";

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
              "AU1010_BBJ",
              "BCO10_BBJ",
              "EU1010_BBJ",
              "GU1010_BBJ",
              "HKK50_BBJ",
              "JPK50_BBJ",
              "UC1010_BBJ",
              "UJ1010_BBJ",
              "XUL10",
            ]}
          />
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
