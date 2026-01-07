import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import PageTemplate from '@/components/templates/PageTemplate';
import ProfilContainer from '@/components/templates/PageContainer/Container';
import DetailBerita from '@/components/organisms/DetailBerita';

type Berita = {
    id: number;
    image: string;
    kategori: string;
    status: string;
    judul: string;
    slug: string;
    isi: string;
    created_at: string;
    updated_at: string;
};

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'navbar',
      'footer',
      'pengumuman'
    ])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  // We'll pre-render nothing at build time, and handle paths at request time
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default function BeritaDetail() {
    const { t } = useTranslation('pengumuman');
    const router = useRouter();
    const { slug } = router.query;
    const [berita, setBerita] = useState<Berita | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState(false);

    // Pastikan slug adalah string
    const slugString = Array.isArray(slug) ? slug[0] : slug || '';

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (!router.isReady || !slugString) return;

        async function fetchBerita() {
            try {
                setLoading(true);
                const response = await fetch(`/api/berita/${encodeURIComponent(slugString)}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Gagal memuat data berita');
                }

                const data: Berita = await response.json();
                if (isMounted) {
                    setBerita(data);
                }
            } catch (error) {
                console.error('Gagal memuat berita:', error);
                if (isMounted) {
                    setBerita(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchBerita();
    }, [router.isReady, slug, isMounted]);

    const formatDate = (inputDate: string) => {
        if (!inputDate) return '';
        try {
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            };
            const parsedDate = new Date(inputDate);
            return parsedDate.toLocaleDateString('id-ID', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return inputDate;
        }
    };

    if (!isMounted) {
        return null;
    }

    if (loading) {
        return (
            <PageTemplate title="Memuat...">
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                    <ProfilContainer title="Memuat Informasi...">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-pulse text-gray-500">Memuat informasi...</div>
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    if (!berita) {
        return (
            <PageTemplate title={t('notFound.title')}>
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                    <ProfilContainer title={t('notFound.title')}>
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('notFound.title')}</h2>
                            <p className="text-gray-600 mb-6">{t('notFound.description')}</p>
                            <a
                                href="/informasi/umum"
                                className='bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition-all duration-300 inline-block'
                            >
                                &#129032; {t('backToList')}
                            </a>
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    return (
        <PageTemplate title={berita.judul}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={berita.judul}>
                    <DetailBerita
                        date={formatDate(berita.created_at)}
                        title={berita.judul}
                        img={`http://rfb-backend.test/img/berita/${berita.image}`}
                        content={berita.isi}
                        kategori={berita.kategori || "Informasi Umum"}
                    />
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
}
