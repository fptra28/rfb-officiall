import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KontakCard from "@/components/atoms/KontakCard";
import CabangCard from "@/components/moleculs/CabangCard";
import Header2 from "@/components/moleculs/Header2";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'footer',
                'hubungi-kami'
            ])),
        },
    };
};

export default function HubungiKami() {
    const { t } = useTranslation(['hubungi-kami', 'common', 'navbar', 'footer']);
    const kantorCabang = [
        {
            kota: "JAKARTA",
            alamat: "DBS Bank Tower LT. 14 & 20, CIPUTRA WORLD I\nJl. Prof. DR. Satrio Kav. 3-5, Jakarta Selatan 12940",
            telepon: "(021) 2988 8700",
            fax: "(021) 2988 8701",
            link: "https://maps.google.com/?q=DBS+Bank+Tower+Jakarta"
        },
        {
            kota: "BANDUNG",
            alamat: "Jl. Pajajaran No. 94 Rt.02 RW. 02\n\nKel. Pamoyanan, Kec. Cicendo - Bandung Jawa Barat 40173",
            telepon: "(022) 20599899",
            fax: "(022) 20599919",
            link: "https://maps.google.com/?q=Jl.+Pajajaran+No.+94,+Bandung"
        },
        {
            kota: "SEMARANG",
            alamat: "Ruko S. Parman Corner Unit 5 & 6\nJl. S. Parman No. 47A, Semarang 50231",
            telepon: "(024) 850 8868 (Hunting)",
            fax: "(024) 850 8869",
            link: "https://maps.google.com/?q=Jl.+S.+Parman+No.+47A,+Semarang"
        },
        {
            kota: "SOLO",
            alamat: "Jl. Adisucipto No. 86 RT 01 RW 07\nKelurahan Jajar, Kecamatan Laweyan, Kota Surakarta\nProvinsi Jawa Tengah Kodepos 57144",
            telepon: "(0271) 738 111 (Hunting)",
            fax: "(0271) 738 222",
            link: "https://maps.google.com/?q=Jl.+Adisucipto+No.+86,+Surakarta"
        },
        {
            kota: "YOGYAKARTA",
            alamat: "Ruko B1, B2, B3, dan B5 Malioboro City\nJl. Laksda Adisucipto KM.8 Tambakbayan, Caturtunggal,\nDepok Sleman - Yogyakarta 55281",
            telepon: "(0274) 280 3111 (Hunting)",
            fax: "(0274) 280 3222",
            link: "https://maps.google.com/?q=Malioboro+City+Yogyakarta"
        },
        {
            kota: "SURABAYA",
            alamat: "Ciputra World Office Tower - Lantai 32\nKawasan Ciputra World,\nJl. Mayjen Sungkono 89, RT 008/RW 006\n\nKel. Gunungsari, Kec. Dukuh Pakis, Surabaya 60224",
            telepon: "(031) 6000 9800 (Hunting)",
            fax: "(031) 6000 7800",
            link: "https://maps.google.com/?q=Jl.+Mayjen+Sungkono+89,+Surabaya"
        },
         {
            kota: "SURABAYA II",
            alamat: "Pakuwon Tower - Lantai 26\nJl. Embong Malang No. 21 - 31,Kel. Kedungdoro\nKec. Tegalsari, Surabaya 60261",
            telepon: "(031) 992 54889 (Hunting)",
            fax: "(031) 992 49600",
            link: "https://maps.google.com/?q=Pakuwon+Tower+Embong+Malang,+Surabaya"
        },
        {
            kota: "MEDAN",
            alamat: "Best & Grow Tower (J.W.MARRIOT) Lt. 12, Unit # 1205 - 1209\nJl. Putri Hijau No. 10, Medan 20111",
            telepon: "(061) 414 0575 (Hunting)",
            fax: "(061) 414 0576",
            link: "https://maps.google.com/?q=Best+%26+Grow+Tower+Medan"
        },
        {
            kota: "PEKANBARU",
            alamat: "Jl. Jend. Sudirman No. 453,\nKel. Simpang Empat, Kec. Pekanbaru Kota\nKota Pekanbaru - Riau 28116",
            telepon: "(0761) 7870018",
            fax: "(0761) 7870019",
            link: "https://maps.google.com/?q=Jl.+Jend.+Sudirman+No.+453,+Pekanbaru"
        },
        {
            kota: "PALEMBANG",
            alamat: "Kompleks Pertokoan Palembang Square Unit 112.113.115\nJl. Kampus POM IX, Palembang 30137",
            telepon: "(0711) 380 555 (Hunting)",
            fax: "(0711) 380 666",
            link: "https://maps.google.com/?q=Palembang+Square+Kompleks+Pertokoan"
        },
        {
            kota: "BALIKPAPAN",
            alamat: "Jl. Jend. Sudirman No. 47\nKomp. Balikpapan Super Block/BSB B 35-37\nKel. Gunung Bahagia, Kec. Balikpapan Selatan\nKota Balikpapan - Kalimantan Timur 76114",
            telepon: "(0542) 731 627 (Hunting)",
            fax: "(0542) 731 513",
            link: "https://maps.google.com/?q=Jl.+Jend.+Sudirman+No.+47,+Balikpapan"
        }
    ];

    return (
        <PageTemplate title={t('title')}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={t('title')}>
                    <div className="space-y-5 text-left">
                        <h3 className="text-2xl font-bold my-6">{t('kantorPusat.judul')}</h3>
                        <div className="">
                            <h5 className="text-lg uppercase font-medium">{t('kantorPusat.jakarta')}</h5>
                            <p className="whitespace-pre-line">{t('kantorPusat.alamat1')}</p>
                            <p className="whitespace-pre-line">{t('kantorPusat.alamat2')}</p>
                            <p><strong>{t('kantorPusat.telepon')}:</strong> (021) 30056300, <strong>{t('kantorPusat.fax')}:</strong> (021) 30056200</p>
                            <p><strong>{t('kantorPusat.email')}:</strong> <a href="mailto:corporate@rifan-financindo-berjangka.co.id" className="hover:underline hover:text-green-500">corporate@rifan-financindo-berjangka.co.id</a></p>
                        </div>

                        <hr className="border-zinc-300" />

                        <div className="flex flex-col gap-3">
                            <a href="https://penggaduan.bappebti.go.id/" className="uppercase font-bold text-lg md:text-xl text-green-500 hover:text-green-600">{t('tombol.pengajuan')}</a>
                            <div className="w-full border-t border-dashed border-gray-400 my-2"></div>
                            <a
                                href="mailto:corporate@rifan-financindo-berjangka.co.id"
                                className="hidden uppercase font-bold text-lg md:text-xl text-green-500 hover:text-green-600"
                            >
                                {t('tombol.keluhan')}
                            </a>
                        </div>

                        <div className="space-y-4">
                            <Header2 title={t('kantorCabang')} className="font-bold text-zinc-700" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {kantorCabang.map((cabang, index) => (
                                    <CabangCard
                                        key={index}
                                        kota={cabang.kota}
                                        alamat={cabang.alamat}
                                        telepon={cabang.telepon}
                                        fax={cabang.fax}
                                        link={cabang.link}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </ProfilContainer>
            </div>
        </PageTemplate >
    );
}
