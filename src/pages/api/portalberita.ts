import { NextApiRequest, NextApiResponse } from 'next';

interface BeritaResponse {
    status: string;
    data: Array<{
        id: number;
        title: string;
        titles: {
            default: string;
            rfb: string;
            [key: string]: string;
        };
        slug: string;
        content: string;
        images: string[];
        created_at: string;
        kategori?: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const portalApiUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://portalnews.newsmaker.id';
        const portalApiToken = process.env.NEXT_PUBLIC_PORTAL_API_TOKEN || 'RFB-115886a7f25067f3';
        const response = await fetch(`${portalApiUrl}/api/v1/berita`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${portalApiToken}`
            },
            cache: 'no-store' as RequestCache
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data: BeritaResponse = await response.json();
        
        if (data.status !== 'success' || !Array.isArray(data.data)) {
            throw new Error('Format respons API tidak valid');
        }
        
        // Format data sesuai dengan yang dibutuhkan komponen
        const formattedData = data.data.map((item) => {
            // Gunakan judul RFB jika ada, jika tidak gunakan default
            const judul = item.titles?.rfb || item.title;
            
            // Ambil gambar kedua jika ada, jika tidak ambil yang pertama
            const imageIndex = item.images?.length > 1 ? 1 : 0;
            const cleanImagePath = item.images?.[imageIndex]?.replace(/^uploads\//, '') || '';
            const imageUrl = cleanImagePath 
                ? `https://portalnews.newsmaker.id/uploads/${cleanImagePath}` 
                : null;
            
            return {
                id: item.id,
                judul,
                isi: item.content,
                slug: item.slug,
                gambar: imageUrl,
                created_at: item.created_at,
                kategori: item.kategori?.name || 'Umum'
            };
        });
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching berita:', error);
        res.status(500).json({ 
            error: 'Gagal mengambil data berita',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
