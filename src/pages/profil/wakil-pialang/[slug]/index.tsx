import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from 'next';
import PageTemplate from '@/components/templates/PageTemplate';
import ProfilContainer from '@/components/templates/PageContainer/Container';
import { getWakilPialangByKategori, WakilPialang } from '@/services/wakilPialangService';
import { getKategoriWakilPialang } from '@/services/wakilPialangService';

interface KategoriWakilPialang {
    id: number;
    slug: string;
    nama_kategori: string;
}

export const getStaticProps = async ({ locale = 'id' }: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'common',
      'navbar',
      'footer',
      'wakil-pialang'
    ])),
  },
});

export async function getStaticPaths() {
  // Avoid hard build-time dependency on external API/DNS.
  // Pages will be generated on-demand via `fallback: 'blocking'`.
  try {
    const kategoriList = await getKategoriWakilPialang();
    const paths = kategoriList.map((kategori: KategoriWakilPialang) => ({
      params: { slug: kategori.slug },
    }));

    return { paths, fallback: "blocking" };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
}

export default function WakilPialangDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [wakilPialangList, setWakilPialangList] = useState<WakilPialang[]>([]);
    const [kategori, setKategori] = useState<KategoriWakilPialang | null>(null);
    const { t } = useTranslation(['wakil-pialang']);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pastikan slug adalah string
    const slugString = Array.isArray(slug) ? slug[0] : slug || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!slugString) {
                    console.log('Slug tidak tersedia');
                    return;
                }
                
                setIsLoading(true);
                
                // Get all categories to find the current one by slug
                const kategoriList = await getKategoriWakilPialang();
                console.log('Mencari kategori dengan slug:', slugString);
                
                // Find category by slug
                const currentKategori = kategoriList.find(k => 
                    k.slug.toLowerCase() === slugString.toLowerCase() || 
                    k.nama_kategori.toLowerCase().replace(/\s+/g, '-') === slugString.toLowerCase()
                );
                
                console.log('Kategori ditemukan:', currentKategori);
                
                if (!currentKategori) {
                    setError('Kategori tidak ditemukan');
                    setIsLoading(false);
                    return;
                }
                
                setKategori(currentKategori);
                
                try {
                    // Get all wakil pialang
                    const allWakilPialang = await fetch('https://rfbdev.newsmaker.id/api/wakil-pialang');
                    if (!allWakilPialang.ok) {
                        throw new Error('Gagal mengambil data wakil pialang');
                    }
                    
                    const data = await allWakilPialang.json();
                    
                    // Filter by category name
                    const filteredData = data.filter((item: WakilPialang) => 
                        item.kategori_wakil_pialang?.nama_kategori?.toLowerCase() === currentKategori.nama_kategori.toLowerCase()
                    );
                    
                    console.log('Data wakil pialang yang difilter:', filteredData);
                    setWakilPialangList(filteredData);
                } catch (err) {
                    console.error('Error fetching wakil pialang:', err);
                    setError('Gagal memuat data wakil pialang');
                }
                
            } catch (err) {
                setError('Gagal memuat data wakil pialang');
                console.error('Error fetching wakil pialang:', err);
            } finally {
                setIsLoading(false);
            }
        };

        console.log('Router ready, slug:', slugString);
        if (slugString) {
            console.log('Memulai fetch data...');
            fetchData();
        } else {
            console.log('Menunggu slug...');
        }
    }, [slug, router.isReady]);

    if (isLoading) {
        return (
            <PageTemplate title="Memuat...">
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                    <ProfilContainer title="Memuat...">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    if (error) {
        return (
            <PageTemplate title={t('errors.error')}>
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                    <ProfilContainer title={t('errors.error')}>
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    return (
        <PageTemplate title={`${t('pageTitle')} - ${kategori?.nama_kategori || ''}`}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={`${t('pageTitle')} - ${kategori?.nama_kategori || ''}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('table.no')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('table.name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('table.licenseNumber')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('table.status')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {wakilPialangList.length > 0 ? (
                                    wakilPialangList.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nama}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nomor_izin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${item.status.toLowerCase() === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Tidak ada data wakil pialang yang tersedia
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
}
