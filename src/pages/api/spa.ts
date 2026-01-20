// pages/api/spa.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchJson } from "@/lib/server/upstreamFetch";

type Spa = {
    id: number;
    image: string;
    name: string;
    slug: string;
    deskripsi: string;
    specs: string;
    created_at: string;
    updated_at: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const apiUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://rfbdev.newsmaker.id").replace(/\/$/, "");
        const upstream = await fetchJson<Spa[]>(`${apiUrl}/api/spa`);

        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Failed to fetch SPA Product' });
        }

        res.status(200).json(upstream.data ?? []);
    } catch (error) {
        console.error("Error fetching SPA data:", error);
        res.status(502).json({
            error: "Upstream API unreachable",
            hint: "Check DNS/network or set API_URL / NEXT_PUBLIC_API_URL in .env.local",
        });
    }
}

