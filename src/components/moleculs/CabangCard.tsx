import KontakCard from "../atoms/KontakCard";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState, type MouseEvent } from "react";

interface CabangCardProps {
    kota: string;
    alamat: string;
    telepon: string;
    fax: string;
    link: string;
}

export default function CabangCard({ kota, alamat, telepon, fax, link }: CabangCardProps) {
    const { t } = useTranslation("hubungi-kami");
    const [isCopied, setIsCopied] = useState(false);
    const resetTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        };
    }, []);

    const copyToClipboard = async (text: string) => {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    };

    const handleCopyAlamat = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const normalizedAlamat = alamat.replace(/\r\n/g, "\n").trim();
            await copyToClipboard(normalizedAlamat);
            setIsCopied(true);
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
            resetTimerRef.current = window.setTimeout(() => setIsCopied(false), 1600);
        } catch {
            // no-op: silently fail
        }
    };

    return (
        <a href={link} className="bg-white rounded-xl shadow hover:shadow-lg p-5 border border-zinc-200 hover:border-green-500 flex flex-col h-full transition-all duration-300">
            <div className="flex items-start justify-between gap-3 mb-2">
                <h5 className="text-lg uppercase font-bold text-zinc-700">{kota}</h5>
                <button
                    type="button"
                    onClick={handleCopyAlamat}
                    className={`shrink-0 rounded-md px-3 py-1 text-xs font-semibold transition-colors border ${
                        isCopied
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                    }`}
                    aria-label={t(isCopied ? "aksi.copiedAlamat" : "aksi.copyAlamat")}
                >
                    {t(isCopied ? "aksi.copiedAlamat" : "aksi.copyAlamat")}
                </button>
            </div>
            <p className="mb-4 whitespace-pre-line select-text cursor-text">
                {alamat}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
                <KontakCard type="telepon" content={telepon} />
                <KontakCard type="fax" content={fax} />
            </div>
        </a>
    );
}
