import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const CardDetail = dynamic(() => import('../atoms/CardDetail'), { ssr: false });

interface NewsCard2Props {
    date: string;
    title: string;
    content: string;
    link: string;
    image?: string;
    category?: string;
    index?: number;
}

export default function NewsCard2({ date, title, content, link, image, category, index = 0 }: NewsCard2Props) {
    const { t, i18n } = useTranslation('pengumuman');
    const currentLanguage = i18n.language || 'id';
    // Format tanggal berdasarkan bahasa
    const displayCategory = category || t('announcement', 'Pengumuman');
    
    // Format date sederhana
    const formatDate = (inputDate: string) => {
        if (!inputDate) return '';
        
        try {
            const date = new Date(inputDate);
            if (isNaN(date.getTime())) return '';
            
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            
            return date.toLocaleDateString(currentLanguage, options);
        } catch (e) {
            console.error('Invalid date format:', inputDate, e);
            return '';
        }
    };

    // Truncate text
    const truncate = (text: string, maxLength: number) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    // Remove HTML tags
    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '');
    };

    // Format values
    const formattedDate = formatDate(date);
    const cleanContent = stripHtml(content);
    const truncatedContent = truncate(cleanContent, 150);
    const truncatedTitle = truncate(stripHtml(title), 70);

    // Define proper props type for Wrapper
    interface WrapperProps {
        children: React.ReactNode;
        onClick?: (e: React.MouseEvent) => void;
    }

    // Wrapper component with hover effect and proper link handling
    const Wrapper = ({ children, onClick }: WrapperProps) => (
        <div 
            className="group bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
            onClick={onClick}
        >
            {children}
        </div>
    );

    // Handle card click to prevent event bubbling
    const handleCardClick = (e: React.MouseEvent) => {
        // Stop propagation to prevent parent click handlers from interfering
        e.stopPropagation();
    };

    // Cek apakah URL gambar valid
    const getValidImageUrl = (url: string | undefined): string | null => {
        if (!url) return null;
        try {
            const portalBaseUrl =
                process.env.NEXT_PUBLIC_PORTAL_ASSET_URL ||
                process.env.NEXT_PUBLIC_PORTAL_API_URL ||
                "https://portalnews.newsmaker.id";

            // Perbaiki URL jika relatif
            let finalUrl = url;
            if (!url.startsWith('http') && !url.startsWith('data:')) {
                // Jika URL relatif, tambahkan base URL
                finalUrl = new URL(url.replace(/^\/+/, ""), `${portalBaseUrl.replace(/\/+$/, "")}/`).toString();
            }
            // Validasi URL
            new URL(finalUrl);
            return finalUrl;
        } catch (e) {
            console.warn('URL gambar tidak valid:', url);
            return null;
        }
    };

    const imageUrl = getValidImageUrl(image);

    return (
        <Wrapper onClick={handleCardClick}>
            {/* Image Container */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                {imageUrl ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={imageUrl}
                            alt={title || 'Gambar berita'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3}
                            unoptimized={process.env.NODE_ENV !== 'production'}
                            style={{
                                objectFit: 'cover',
                            }}
                            onError={(e) => {
                                console.error(t('readMore', 'Baca Selengkapnya'), 'Gagal memuat gambar:', imageUrl);
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22220%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23AAAAAA%22%3ETidak%20ada%20gambar%3C%2Ftext%3E%3C%2Fsvg%3E';
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {displayCategory}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formattedDate}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {truncatedTitle}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncatedContent}
                    </p>
                </div>
                <CardDetail link={link} />
            </div>
        </Wrapper>
    );
}
