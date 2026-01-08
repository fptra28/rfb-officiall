import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

// Dynamic import untuk komponen dengan SSR dinonaktifkan
const NewsCard = dynamic(() => import("@/components/moleculs/Newscard"), { ssr: false });
const Header2 = dynamic(() => import("@/components/moleculs/Header2"), { ssr: false });

interface Berita {
    id: number;
    judul: string;
    isi: string;
    gambar: string;
    created_at: string;
    slug: string;
}

interface BeritaSectionProps {
    limit?: number;
    showHeader?: boolean;
    className?: string;
}

export default function BeritaSection({ className, limit = 6, showHeader = true }: BeritaSectionProps) {
    const { t } = useTranslation('berita');
    const [berita, setBerita] = useState<Berita[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/portalberita');
                if (!response.ok) {
                    throw new Error('Gagal mengambil data berita');
                }
                const data = await response.json();
                // Urutkan berita berdasarkan created_at (dari yang terbaru)
                const sortedBerita = [...data].sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                
                setBerita(Array.isArray(sortedBerita) ? sortedBerita : []);
            } catch (err) {
                setError('Gagal memuat data berita. Silakan coba lagi nanti.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const data = limit ? berita.slice(0, limit) : berita;

    return (
        <div className={`${className}`}>
            {showHeader && (
                <Header2 
                    title={t('title')} 
                    showViewAll 
                    viewAllHref="/analisis/berita"
                    viewAllKey="viewAll"
                    className={className}
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p>Memuat berita...</p>
                ) : error ? (
                    <div className="text-center py-10 text-red-600">{t('error.loading')}: {error}</div>
                ) : berita.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} onClick={(e) => e.stopPropagation()}>
                            <NewsCard
                                title={item.judul}
                                date={new Date(item.created_at).toLocaleDateString()}
                                content={item.isi}
                                slug={item.slug}
                                image={item.gambar}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">{t('noNews')}</div>
                )}
            </div>
        </div>
    );
}
