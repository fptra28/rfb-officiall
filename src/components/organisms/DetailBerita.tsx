import { useTranslation } from 'next-i18next';

interface DetailBeritaProps {
    date: string;
    title: string;
    kategori: string;
    img: string;
    content: string;
}

const formatDate = (inputDate: string, locale: string = 'id') => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    };
    const parsedDate = new Date(inputDate);
    if (Number.isNaN(parsedDate.getTime())) return inputDate;

    const datePart = parsedDate.toLocaleDateString(locale, options);
    const timePart = parsedDate.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${datePart} • ${timePart}`;
};

const getValidImageUrl = (url: string): string => {
    if (!url) return '';
    
    // Jika URL sudah lengkap, langsung kembalikan
    if (url.startsWith('http') || url.startsWith('data:')) {
        return url;
    }

    // Dapatkan nama file dari path
    const fileName = url.split('/').pop()?.split('?')[0] || '';
    const baseImagePath = '/img/berita/';
    
    // Format URL yang mungkin
    const possiblePaths = [
        `${baseImagePath}${fileName}`,  // Format: /img/berita/nama-file.jpg
        url.startsWith('storage/') ? `${baseImagePath}${url.replace('storage/', '')}` : null,
        `https://kpf-backpanel-production.up.railway.app/storage/${url.replace(/^\//, '')}`
    ].filter(Boolean) as string[];

    // Coba setiap kemungkinan path
    for (const path of possiblePaths) {
        try {
            // Jika path relatif, gabungkan dengan base URL
            if (path.startsWith('/')) {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kpf-backpanel-production.up.railway.app';
                const cleanPath = path.replace(/^\/+/, '');
                const fullUrl = new URL(cleanPath, baseUrl).toString();
                
                // Lakukan pengecekan apakah URL valid
                if (fullUrl) {
                    return fullUrl;
                }
            } else if (path.startsWith('http')) {
                // Jika sudah URL lengkap, langsung kembalikan
                return path;
            }
        } catch (e) {
            console.warn(`Invalid image path: ${path}`, e);
        }
    }
    
    return '';
};

export default function DetailBerita({ date, title, img, content, kategori }: DetailBeritaProps) {
    const { t, i18n } = useTranslation('berita');
    const imageUrl = getValidImageUrl(img);
    
    return (
        <div>
            {imageUrl ? (
                <div className="mb-6 flex justify-center">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full max-h-[500px] object-contain rounded-lg shadow"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22220%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23AAAAAA%22%3E' + t('noImage') + '%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                    />
                </div>
            ) : (
                <div className="mb-6 bg-gray-100 rounded-lg flex items-center justify-center h-64">
                    <p className="text-gray-400">{t('noImage')}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mb-4">
                <div className="bg-zinc-100 w-fit px-3 py-1 rounded" >
                    <p className="text-base text-gray-500">{t('publishedOn')} {formatDate(date, i18n.language)}</p>
                </div>
                <i className="fa-solid fa-grip-lines-vertical"></i>
                <div className="bg-zinc-100 w-fit px-3 py-1 rounded" >
                    <p className="text-base text-gray-500">{kategori}</p>
                </div>
            </div>

            <div
                className="text-gray-700 text-lg leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
        </div>
    );
}
