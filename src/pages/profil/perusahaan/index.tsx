import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import CardVisiMisi from "@/components/atoms/CardVisiMisi";
import TitleH3 from "@/components/atoms/TitleH3";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'navbar',
        'footer',
        'perusahaan'
      ])),
    },
  };
};

export default function ProfilPerusahaan() {
  const { t } = useTranslation(['perusahaan', 'common', 'navbar', 'footer']);
  
  // Get translations with fallback to empty array if not available yet
  const getTranslatedArray = (key: string, fallback: any[] = []) => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? value : fallback;
  };

  const VisiItems = getTranslatedArray('perusahaan:visi', []) as string[];
  const MisiItems = getTranslatedArray('perusahaan:misi', []) as string[];
  const achievements = getTranslatedArray('perusahaan:achievements', []) as Array<{title: string, subtitle: string}>;
  const whyChooseUs = getTranslatedArray('perusahaan:whyChooseUs', []) as Array<{title: string, description: string}>;
  
  const keunggulanGrid = achievements.map((item, index) => ({
    image: [
      "/assets/penghargaan/RFB_Terbaik_ke-1_Ketaatan_Penempatan_Margin_2024.png",
      "/assets/penghargaan/3rd_Rifan_Financindo_Berjangka_-_highest_volume_broker.png",
      "/assets/penghargaan/RFB-PIALANG_TERBAIK_1_TAHUN_2017.png",
      "/assets/penghargaan/RFB-TOP_3RD_TRANSAKSI_MULTILATERAL_2017.png",
      "/assets/penghargaan/RFB-TOP_2ND_TRANSAKSI_BILATERAL_2017.png",
      "/assets/penghargaan/RFB-KBI_2014.png",
      "/assets/penghargaan/PIALANG_TERBAIK.png",
      "/assets/penghargaan/RFB-TOP_3RD_PIALANG_TRANSAKSI_BILATERAL_TERBANYAK_2013.png",
      "/assets/penghargaan/TRANSAKSI_BILATERAL_2011.png"
    ][index],
    ...item
  }));

  const anggotaLogos = [
    { src: "/assets/logo-jfx.png", alt: "JFX" },
    { src: "/assets/logo-kbi.png", alt: "KBI" },
    { src: "/assets/logo-aspebtindo.png", alt: "ASPEBTINDO" },
    { src: "/assets/logo-bappebti.png", alt: "BAPPEBTI" },
  ];

  return (
    <PageTemplate title={t('perusahaan:pageTitle')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('perusahaan:profilTitle')}>
          <div className="space-y-10">
            {/* Tentang Kami */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <TitleH3 className="text-green-700 mb-6 border-b pb-2">{t('perusahaan:tentangKamiTitle')}</TitleH3>
              <div className="space-y-4 text-gray-700">
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: t('perusahaan:aboutUs.p1') }} 
                />
                <div 
                  className="prose max-w-none mt-4" 
                  dangerouslySetInnerHTML={{ __html: t('perusahaan:aboutUs.p2') }} 
                />
                <div 
                  className="prose max-w-none mt-4" 
                  dangerouslySetInnerHTML={{ __html: t('perusahaan:aboutUs.p3') }} 
                />
              </div>
            </div>

            {/* Keunggulan */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <TitleH3 className="text-green-700 mb-6 border-b pb-2">{t('perusahaan:keunggulanTitle')}</TitleH3>
              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-green-700 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visi Misi Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Visi */}
              <div className="bg-white/80 rounded-xl shadow-md p-6 backdrop-blur-sm">
                <TitleH3 className="text-green-700 mb-6 text-center">{t('perusahaan:visiTitle')}</TitleH3>
                <div className="space-y-4">
                  {VisiItems.map((item, index) => (
                    <div 
                      key={`visi-${index}`}
                      className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Misi */}
              <div className="bg-white/80 rounded-xl shadow-md p-6 backdrop-blur-sm">
                <TitleH3 className="text-green-700 mb-6 text-center">{t('perusahaan:misiTitle')}</TitleH3>
                <div className="space-y-4">
                  {MisiItems.map((item, index) => (
                    <div 
                      key={`misi-${index}`}
                      className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anggota Dari */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <TitleH3 className="text-green-700 mb-6 border-b pb-2">
                {t('perusahaan:anggotaDari')}
              </TitleH3>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 py-4">
                {anggotaLogos.map((logo, index) => (
                  <div key={index} className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 bg-white">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-12 w-auto max-h-12 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
