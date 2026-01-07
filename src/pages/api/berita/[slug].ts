import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug tidak valid" });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rfbdev.newsmaker.id";
    const response = await fetch(
      `${apiUrl}/api/berita/${encodeURIComponent(slug)}`
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }

    const data: Berita = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching berita detail:", error.message);
    return res.status(500).json({
      error: "Gagal memuat detail berita",
      details: error.message,
    });
  }
}
