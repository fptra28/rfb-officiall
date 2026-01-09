import { useTranslation } from 'next-i18next';
import CardDetail from "../atoms/CardDetail";

interface NewsCardProps {
    title: string;
    date: string;
    content: string;
    slug: string;
    image?: string | null;
}

export default function NewsCard({
    title,
    date,
    content,
    slug,
    image = null,
}: NewsCardProps) {

    // Fungsi untuk memotong teks tanpa memotong di tengah kata
    function stripHtml(html: string = ""): string {
        if (typeof html !== "string") return "";
        return html.replace(/<[^>]*>/g, "").trim();
    }

    function trimText(text: string = "", maxChars: number) {
        const plainText = stripHtml(text);
        return plainText.length > maxChars ? plainText.slice(0, maxChars).trim() + "..." : plainText;
    }

    const trimmedExcerpt = trimText(content, 200);  // Ubah jadi 200 atau sesuai kebutuhan

    const { t, i18n } = useTranslation('common');
    const currentLanguage = i18n.language || 'id';

    const formatDate = (inputDate: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
        };
        const parsedDate = new Date(inputDate);
        if (Number.isNaN(parsedDate.getTime())) {
            return inputDate;
        }
        return parsedDate.toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-GB', options);
    };

    const fullLink = `/analisis/berita/${slug}`;

    const handleCardClick = (e: React.MouseEvent) => {
        // Hentikan event bubbling untuk mencegah konflik dengan event parent
        e.stopPropagation();
    };

    return (
        <div 
            className="rounded-lg h-full flex flex-col bg-white shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300"
            onClick={handleCardClick}
        >
            {image && (
                <div className="h-48 overflow-hidden">
                    <img 
                        src={image} 
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback jika gambar gagal dimuat
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-gray-500 mb-2">{formatDate(date)}</p>
                <h3 className="text-xl font-semibold text-green-600 mb-3 line-clamp-2">{title}</h3>
                <p className="text-gray-600 mb-4 text-base line-clamp-3 flex-1">{trimmedExcerpt}</p>
                <div className="mt-auto">
                    <CardDetail link={fullLink} />
                </div>
            </div>
        </div>
    );
}
