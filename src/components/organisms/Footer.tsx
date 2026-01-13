import React, { useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const Footer = () => {
    const router = useRouter();
    const { t } = useTranslation('footer');
    const currentYear = new Date().getFullYear();

    // Handle scroll to produk when landing on homepage with #produk hash
    useEffect(() => {
        const handleRouteChange = () => {
            if (window.location.pathname === '/' && window.location.hash === '#produk') {
                // Small timeout to ensure the page has fully rendered
                const timer = setTimeout(() => {
                    const produkSection = document.getElementById('produk');
                    if (produkSection) {
                        window.scrollTo({
                            top: produkSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
                return () => clearTimeout(timer);
            }
        };

        // Check on initial load
        handleRouteChange();

        // Check on route change
        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
    return (
        /* Footer */
        <footer className="flex flex-col justify-between items-center gap-10 bg-zinc-800 text-white px-10 md:px-10 lg-22 py-10">
            <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full">
                {/* Section 1 - Attention */}
                <div className="flex-1 text-center space-y-5">
                    <div className="w-full h-1 bg-green-500"></div>
                    <h1 className="text-3xl font-bold">{t('attention.title')}</h1>
                    <div className="md:hidden w-full h-1 bg-green-500"></div>
                    <p className="text-sm md:text-base">
                        {t('attention.description')}
                    </p>
                    <div className="md:hidden w-full h-1 bg-green-500"></div>
                </div>

                {/* Section 2 - Useful Links */}
                <div className="flex-1 space-y-5">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-bold">{t('quickLinks.title')}</h1>
                        <div className="flex flex-col gap-3 text-sm md:text-base">
                            <Link
                                href="/"
                                className="flex items-center gap-2 hover:text-green-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i> {t('quickLinks.home')}
                            </Link>
                            <Link
                                href="/produk/jfx"
                                className="flex items-center gap-2 hover:text-green-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i> {t('quickLinks.jfxProduct')}
                            </Link>
                            <Link
                                href="/produk/spa"
                                className="flex items-center gap-2 hover:text-green-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i> {t('quickLinks.spaProduct')}
                            </Link>
                            <Link
                                href="/hubungi-kami"
                                className="flex items-center gap-2 hover:text-green-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i> {t('quickLinks.contact')}
                            </Link>
                        </div>
                    </div>

                    {/* Section 3 - Download Links */}
                    {/* <div className="flex flex-col gap-5">
                        <h1 className="text-xl font-bold">{t('downloadApp.title')}</h1>
                        <div className="flex items-center gap-5">
                            <a href="https://apps.apple.com/id/app/pro-trader-royalassetindo/id6502900138?l=id" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/assets/download-on-the-app-store.svg"
                                    alt={t('downloadApp.appStore')}
                                    className="h-12 transition-transform duration-300 hover:scale-110"
                                />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.royalassetindo.protrader&hl=id" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/assets/en_badge_web_generic.png"
                                    alt={t('downloadApp.playStore')}
                                    className="h-18 transition-transform duration-300 hover:scale-110"
                                />
                            </a>
                        </div>
                    </div> */}
                </div>

                {/* Section 4 - Company Info */}
                <div className="flex-1 space-y-3">
                    <h1 className="font-bold">{t('company.title')}</h1>
                    <p className="text-sm md:text-base">
                        {t('company.address')}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>{t('company.email')}: </strong>
                        {t('company.emailValue')}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>{t('company.phone')}: </strong>
                        {t('company.phoneValue')}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>{t('company.fax')}: </strong>
                        {t('company.faxValue')}
                    </p>
                    <p className="text-sm md:text-base">
                        <strong>{t('company.complaint')}: </strong>
                        {t('company.emailValue')}
                    </p>
                    <div className="flex items-center gap-3">
                        <a href="https://www.komdigi.go.id/">
                            <div className="bg-gradient-to-br from-white via-zinc-100 to-zinc-200 p-3 rounded-2xl shadow-xl border border-zinc-300 w-fit hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out">
                                <img
                                    src="/assets/BrandLogo.org-KOMDIGI-Logo-2024.png"
                                    alt="Logo Komdigi"
                                    className="h-10 drop-shadow-lg"
                                />
                            </div>
                        </a>
                        <a>
                            <div className="bg-gradient-to-br from-white via-zinc-100 to-zinc-200 p-3 rounded-2xl shadow-xl border border-zinc-300 w-fit hover:scale-105 hover:shadow-2xl transition transform duration-300 ease-in-out">
                                <img
                                    src="/assets/web_iso_2025.png"
                                    alt="Logo ISO"
                                    className="h-10 drop-shadow-lg"
                                />
                            </div>
                        </a>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-200">
                        {t('company.supervisedByKomdigi')}
                    </p>
                </div>
            </div>

            {/* Footer Divider */}
            <div className="w-full h-1 bg-green-500"></div>

            <div className="text-center">
                {t('copyright', { year: currentYear })}
            </div>
        </footer >
    );
};

export default Footer;
