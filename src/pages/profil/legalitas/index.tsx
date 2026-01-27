
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import BusinessContainer from "@/components/templates/PageContainer/BusinessContainer";
import PageTemplate from "@/components/templates/PageTemplate";
import { useState } from "react";
import { useRouter } from "next/router";

export const getStaticProps = async ({ locale = 'id' }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'navbar',
      'footer',
      'legalitas'
    ])),
  },
});

interface LegalitasItem {
  id: string;
  name: string;
  image: string;
}

const LegalitasBisnisList: LegalitasItem[] = [
  {
    id: 'jakarta1',
    name: "cities.jakarta",
    image: "/assets/legalitas-bisnis/legalitasJKT-AXAtower.jpg"
  },
  {
    id: 'jakarta2',
    name: "cities.jakarta",
    image: "/assets/legalitas-bisnis/legalitasJKT-AXAtower(2).jpg"
  },
  {
    id: 'jakarta3',
    name: "cities.jakarta",
    image: "/assets/legalitas-bisnis/legalitasJKT-AXAtower(5).jpg"
  },
  {
    id: 'jakarta4',
    name: "cities.jakarta",
    image: "/assets/legalitas-bisnis/legalitasJKT-AXAtower(6).jpg"
  },
  {
    id: 'surabaya1',
    name: "cities.surabaya",
    image: "/assets/legalitas-bisnis/legalitasSBY.jpg"
  },
  {
    id: 'surabaya2',
    name: "cities.surabaya",
    image: "/assets/legalitas-bisnis/legalitasSURABAYA.jpg"
  },
  {
    id: 'medan',
    name: "cities.medan",
    image: "/assets/legalitas-bisnis/legalitasMEDAN.jpg"
  },
  {
    id: 'semarang',
    name: "cities.semarang",
    image: "/assets/legalitas-bisnis/legalitasSMG.jpg"
  },
  {
    id: 'yogyakarta',
    name: "cities.yogyakarta",
    image: "/assets/legalitas-bisnis/legalitasYOGYAKARTA.jpg"
  },
  {
    id: 'balikpapan',
    name: "cities.balikpapan",
    image: "/assets/legalitas-bisnis/legalitasBALIKPAPAN.jpeg"
  }
];

export default function LegalitasBisnis() {
  const { t, i18n } = useTranslation(['legalitas']);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const locale = (router.locale ?? i18n.language ?? 'id').toLowerCase();
  const lang = locale.startsWith('en') ? 'en' : 'id';

  const tOr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const fallbackCompanyName = "PT RIFAN FINANCINDO BERJANGKA";
  const fallbackMembership1Id = "Anggota Bursa Berjangka Jakarta (Jakarta Futures Exchange)";
  const fallbackMembership2Id = "Anggota Indonesian Derivatives Clearing House";
  const fallbackMembership1En = "Member of Jakarta Futures Exchange";
  const fallbackMembership2En = "Member of Indonesian Derivatives Clearing House";

  const fallbackLegalItemsId = [
    "Akta Perubahan Anggaran Dasar PT. Rifan Financindo Komoditas : No. 32 tanggal 7 Maret 2000 oleh Notaris Linda Ibrahim SH.",
    "Pengesahan Departemen Hukum dan Perundang - Undangan Republik Indonesia Nomor : C-21254 HT.01.04.TH.2000",
    "Surat Persetujuan Anggota (SPAB) di Bursa Berjangka Jakarta Nomor : SPAB-024/BBJ/09/00",
    "Izin Usaha Pialang Berjangka : Keputusan Kepala BAPPEBTI Nomor : 08/BAPPEBTI/SI/XII/2000",
    "Keanggotaan PT Kliring Berjangka Indonesia Nomor : 03/AK - KBI/XII 2000",
    "Perjanjian Kerjasama dengan Pedagang Penyelenggara sistem Perdagangan Alternatif PT. Royal Assetindo, Surat Perjanjian Kerjasama, Nomor : 017/KOM/RFB-RA/III/2006",
    "Pemberian persetujuan sebagai peserta Sistem Perdagangan Alternatif Nomor : 1162/BAPPEBTI/SP/5/2007",
    "Penetapan sebagai Pialang Berjangka yang Melakukan Kegiatan Penerimaan Nasabah secara Elektronik On-Line di Bidang Perdagangan Berjangka Komoditi kepada PT.Rifan Financindo Berjangka Nomor : 28/BAPPEBTI/KEP-PBK/09/2014",
    "Perantara Perdagangan Efek Derivatif Keuangan - OJK",
  ];

  const fallbackLegalItemsEn = [
    "Deed of Amendment to the Articles of Association of PT Rifan Financindo Komoditas: No. 32 dated 7 March 2000, before Notary Linda Ibrahim, SH.",
    "Ratification by the Ministry of Law and Legislation of the Republic of Indonesia No.: C-21254 HT.01.04.TH.2000",
    "Approval Letter as an Exchange Member (SPAB) at the Jakarta Futures Exchange No.: SPAB-024/BBJ/09/00",
    "Futures Broker Business License: Decree of the Head of BAPPEBTI No.: 08/BAPPEBTI/SI/XII/2000",
    "Membership of PT Kliring Berjangka Indonesia No.: 03/AK-KBI/XII/2000",
    "Cooperation Agreement with the Alternative Trading System Operator, PT Royal Assetindo: Agreement No.: 017/KOM/RFB-RA/III/2006",
    "Approval as a participant in the Alternative Trading System No.: 1162/BAPPEBTI/SP/5/2007",
    "Appointment as a Futures Broker authorized to onboard customers electronically (online) in commodity futures trading to PT Rifan Financindo Berjangka No.: 28/BAPPEBTI/KEP-PBK/09/2014",
    "Financial Derivatives Securities Trading Intermediary – OJK",
  ];

  const fallbackMembership1 = lang === 'en' ? fallbackMembership1En : fallbackMembership1Id;
  const fallbackMembership2 = lang === 'en' ? fallbackMembership2En : fallbackMembership2Id;
  const fallbackLegalItems = lang === 'en' ? fallbackLegalItemsEn : fallbackLegalItemsId;

  const isMostlyIndonesian = (items: string[]) => {
    const patterns = ["akta", "pengesahan", "surat", "izin", "keanggotaan", "perjanjian", "penetapan", "bursa", "berjangka"];
    const score = items.reduce((acc, item) => {
      const value = item.toLowerCase();
      return acc + (patterns.some((p) => value.includes(p)) ? 1 : 0);
    }, 0);
    return score >= 2;
  };

  const legalItemsRaw = t('businessContainer.legalItems', { returnObjects: true });
  const legalItemsFromT = Array.isArray(legalItemsRaw) ? (legalItemsRaw as string[]) : null;
  const legalItems =
    legalItemsFromT && legalItemsFromT.length
      ? lang === 'en'
        ? isMostlyIndonesian(legalItemsFromT)
          ? fallbackLegalItemsEn
          : legalItemsFromT
        : isMostlyIndonesian(legalItemsFromT)
          ? legalItemsFromT
          : fallbackLegalItemsId
      : fallbackLegalItems;

  const getLegalItemMeta = (text: string) => {
    const value = text.toLowerCase();

    if (
      value.includes("akta") ||
      value.includes("notaris") ||
      value.includes("deed") ||
      value.includes("articles of association") ||
      value.includes("notary")
    ) {
      return { icon: "fa-file-signature", color: "text-violet-700", bg: "bg-violet-50", ring: "ring-violet-200" };
    }
    if (
      value.includes("pengesahan") ||
      value.includes("departemen hukum") ||
      value.includes("ht.") ||
      value.includes("ratification") ||
      value.includes("ministry of law") ||
      value.includes("republic of indonesia")
    ) {
      return { icon: "fa-gavel", color: "text-slate-700", bg: "bg-slate-50", ring: "ring-slate-200" };
    }
    if (
      value.includes("spab") ||
      value.includes("bursa") ||
      value.includes("exchange member") ||
      value.includes("futures exchange")
    ) {
      return { icon: "fa-building-columns", color: "text-blue-700", bg: "bg-blue-50", ring: "ring-blue-200" };
    }
    if (
      value.includes("izin usaha") ||
      value.includes("bappebti") ||
      value.includes("license") ||
      value.includes("business license") ||
      value.includes("decree of the head")
    ) {
      return { icon: "fa-stamp", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" };
    }
    if (value.includes("ojk") || value.includes("efek derivatif") || value.includes("derivatives securities")) {
      return { icon: "fa-shield-halved", color: "text-indigo-700", bg: "bg-indigo-50", ring: "ring-indigo-200" };
    }
    if (
      value.includes("keanggotaan") ||
      value.includes("kliring") ||
      value.includes("kbi") ||
      value.includes("membership") ||
      value.includes("clearing")
    ) {
      return { icon: "fa-id-badge", color: "text-cyan-700", bg: "bg-cyan-50", ring: "ring-cyan-200" };
    }
    if (
      value.includes("perjanjian") ||
      value.includes("kerjasama") ||
      value.includes("cooperation agreement") ||
      value.includes("agreement") ||
      value.includes("alternative trading system operator")
    ) {
      return { icon: "fa-handshake", color: "text-orange-700", bg: "bg-orange-50", ring: "ring-orange-200" };
    }
    if (value.includes("persetujuan") || value.includes("approval as")) {
      return { icon: "fa-circle-check", color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" };
    }
    if (
      value.includes("penetapan") ||
      value.includes("elektronik") ||
      value.includes("on-line") ||
      value.includes("online") ||
      value.includes("appointment") ||
      value.includes("electronically") ||
      value.includes("onboard")
    ) {
      return { icon: "fa-laptop", color: "text-fuchsia-700", bg: "bg-fuchsia-50", ring: "ring-fuchsia-200" };
    }

    return { icon: "fa-file-lines", color: "text-amber-700", bg: "bg-white", ring: "ring-amber-200" };
  };
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <PageTemplate title={t('pageTitle')}>
      <div className="my-10 mx-10 md:mx-52">
        <BusinessContainer title={t('businessContainer.title')}>
          <div className="px-4 pb-6 text-left">
            <div className="mx-auto max-w-5xl rounded-lg border border-amber-200 bg-amber-50/40 p-6">
              <div className="space-y-1">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-900">
                      {tOr('businessContainer.companyName', fallbackCompanyName)}
                    </div>
                    <div className="mt-1 flex flex-col gap-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-emerald-600" aria-hidden="true" />
                        <span className="min-w-0 break-words">
                          {tOr('businessContainer.membership1', fallbackMembership1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-emerald-600" aria-hidden="true" />
                        <span className="min-w-0 break-words">
                          {tOr('businessContainer.membership2', fallbackMembership2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ol className="mt-5 space-y-2 text-sm leading-relaxed text-slate-700">
                {legalItems.map((item) => {
                  const meta = getLegalItemMeta(item);
                  return (
                  <li key={item} className="flex items-start gap-3 break-words">
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-md ${meta.bg} ${meta.color} shadow-sm ring-1 ${meta.ring}`}
                      aria-hidden="true"
                    >
                      <i className={`fa-solid ${meta.icon} text-[13px]`} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                )})}
              </ol>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto px-4 py-2">
            {LegalitasBisnisList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item.image)}
                className="relative cursor-pointer min-w-[250px] transition-transform duration-300 ease-in-out hover:scale-110"
              >
                <img
                  src={item.image}
                  alt={t(item.name)}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 text-sm uppercase transition-opacity duration-300 hover:opacity-0">
                  {t(item.name)}
                </div>
              </div>
            ))}
          </div>
        </BusinessContainer>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 text-white text-4xl px-4 py-2"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Zoomed Preview"
              className="w-full h-auto max-h-[80vh] object-contain transform scale-100 transition-transform duration-300"
            />
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
