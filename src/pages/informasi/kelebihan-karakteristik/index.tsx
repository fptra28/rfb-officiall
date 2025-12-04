import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "navbar",
      "footer",
      "kelebihan-karakteristik",
    ])),
  },
});

export default function KelebihanKarakteristik() {
  const { t } = useTranslation("kelebihan-karakteristik");

  return (
    <PageTemplate title={t("title")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t("title")}>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("efisiensi_modal.title")}
              </h2>
              <p className="text-gray-700">
                {t("efisiensi_modal.content")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("fleksibilitas_transaksi.title")}
              </h2>
              <p className="text-gray-700">
                {t("fleksibilitas_transaksi.content")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("pergerakan_harga.title")}
              </h2>
              <p className="text-gray-700">
                {t("pergerakan_harga.content")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("likuiditas_tinggi.title")}
              </h2>
              <p className="text-gray-700">
                {t("likuiditas_tinggi.content")}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-2">
                {t("tanpa_batasan_waktu.title")}
              </h2>
              <p className="text-gray-700">
                {t("tanpa_batasan_waktu.content")}
              </p>
            </div>

            {/* 
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("jenis_investasi.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("jenis_investasi.content")}
              </p>
              <div className="ml-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    {t("jenis_investasi.fixed_rate.title")}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {t("jenis_investasi.fixed_rate.content")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    {t("jenis_investasi.floating_rate.title")}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {t("jenis_investasi.floating_rate.content")}
                  </p>
                </div>
              </div>
            </div> 
            */}
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
