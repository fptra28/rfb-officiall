import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import dynamic from 'next/dynamic';

// Dynamic import untuk komponen dengan SSR dinonaktifkan
const   NewsCard2 = dynamic(() => import("@/components/moleculs/NewsCard2"), { ssr: false });
const Header1 = dynamic(() => import("@/components/moleculs/Header1"), { ssr: false });

type Berita = {
    id: number;
    image?: string;
    kategori: string;
    status: string;
    judul: string;
    slug: string;
    isi: string;
    order?: number;
    created_at: string;
    updated_at: string;
};

type PengumumanHomeProps = {
    showHeader?: boolean;
    className?: string;
};

export default function PengumumanHome({ showHeader = true, className }: PengumumanHomeProps) {
    const { t } = useTranslation('pengumuman');
    const [pengumumanList, setPengumumanList] = useState<Berita[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchBerita() {
            try {
                const response = await fetch("/api/berita");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data: Berita[] = await response.json();

                const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://rfbdev.newsmaker.id").replace(/\/$/, "");

                // Mapping dan bentuk URL gambar dengan benar
                const processedData = data
                    .map((item) => {
                        let imageUrl: string | undefined = undefined;

                        if (item.image) {
                            imageUrl = `${baseUrl}/img/berita/${item.image}`;
                        }

                        return {
                            ...item,
                            image: imageUrl,
                            order: item.order || 0, // Default order 0 jika tidak ada
                        };
                    })
                    .sort((a, b) => (b.order || 0) - (a.order || 0)); // Urutkan dari order tertinggi ke terendah

                setPengumumanList(processedData);
            } catch (error) {
                console.error("Gagal memuat berita:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBerita();
    }, []);

    return (
        <div className={className}>
            {showHeader && (
                <div className="mb-6">
                    <Header1 title={t('title')} className="text-2xl md:text-3xl" />
                </div>
            )}

            {loading ? (
                <div className="text-center py-10">{t('loading')}</div>
            ) : pengumumanList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pengumumanList.map((item) => (
                        <NewsCard2
                            key={item.id}
                            title={item.judul}
                            date={item.created_at}
                            content={item.isi}
                            image={item.image}
                            category={item.kategori}
                            link={`/informasi/umum/${item.slug}`}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">{t('noAnnouncements')}</div>
            )}
        </div>
    );
}
