"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import MarketUpdate from "./MarketUpdate";
import LocaleLink from "@/components/common/LocaleLink";

type MenuItem = {
  key: string;
  label: string;
  href?: string;
  submenu?: MenuItem[];
};

const NavBar = () => {
  const router = useRouter();
  const { t } = useTranslation("navbar");
  const { locale } = router;

  const menuItems: MenuItem[] = [
    { key: 'home', label: t('menu.home'), href: "/" },
    {
      key: 'profile',
      label: t('menu.profile.label'),
      submenu: [
        { key: 'company-profile', label: t('menu.profile.submenu.companyProfile'), href: "/profil/perusahaan" },
        { key: 'legality', label: t('menu.profile.submenu.legality'), href: "/profil/legalitas" },
        { key: 'awards', label: t('menu.profile.submenu.awards'), href: "/profil/penghargaan" },
        { key: 'facilities-services', label: t('menu.profile.submenu.facilitiesServices'), href: "/informasi/fasilitas-layanan" },
        { key: 'broker-representative', label: t('menu.profile.submenu.brokerRepresentative'), href: "/profil/wakil-pialang" },
        { key: 'general-info', label: t('menu.profile.submenu.generalInfo'), href: "/informasi/umum" },
        { key: 'general-video', label: t('menu.profile.submenu.generalVideo'), href: "/informasi/video-umum" },
      ],
    },
    {
      key: 'products',
      label: t('menu.products.label'),
      submenu: [
        { key: 'jfx', label: t('menu.products.submenu.jfx'), href: "/produk/jfx" },
        { 
          key: 'spa',
          label: t('menu.products.submenu.spa'), 
          href: "/produk/spa",
          submenu: [
            { key: 'kelebihan-karakteristik', label: t('menu.products.submenu.kelebihanKarakteristik'), href: "/informasi/kelebihan-karakteristik" },
            { key: 'ilustrasi-transaksi', label: t('menu.products.submenu.ilustrasiTransaksi'), href: "/prosedur/ilustrasi-transaksi" },
          ]
        }
      ],
    },
    {
      key: 'prosedur',
      label: t('menu.prosedur'),
      submenu: [
        { key: 'registration-procedure', label: t('menu.products.submenu.registrationProcedure'), href: "/prosedur/registrasi-online" },
        { key: 'transaction-guide', label: t('menu.products.submenu.transactionGuide'), href: "/prosedur/petunjuk-transaksi" },
        { key: 'withdrawal-procedure', label: t('menu.products.submenu.withdrawalProcedure'), href: "/prosedur/penarikan" },
      ],
    },
    {
      key: 'analysis',
      label: t('menu.analysis.label'),
      submenu: [
        { key: 'news', label: t('menu.analysis.submenu.news'), href: "/analisis/berita" },
        { key: 'economic-calendar', label: t('menu.analysis.submenu.economicCalendar'), href: "/analisis/economic-calendar" },
        { key: 'historical-data', label: t('menu.analysis.submenu.historicalData'), href: "/analisis/historical-data" },
        { key: 'pivot-fibonacci', label: "Pivot & Fibonacci", href: "/analisis/pivot-fibonacci" },
      ],
    },
    { key: 'careers', label: t('menu.profile.submenu.careers'), href: "/careers" },
    { key: 'contact', label: t('menu.contact'), href: "/hubungi-kami" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleMouseEnter = (label: string) => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setOpenDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setOpenDropdown(null);
      }, 200); // delay close
    }
  };

  const closeAllMenus = () => {
    setOpenDropdown(null);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-zinc-800 text-white">
        <div className="flex justify-between items-center px-3 md:px-10 lg:px-22 py-3">
          {/* Logo */}
          <LocaleLink
            href="/"
            className="flex items-center gap-3 text-base sm:text-lg lg:text-xl font-bold"
          >
            <img
              src="/assets/logo-rfb.png"
              alt="Logo RFB"
              className="h-6 md:h-10"
            />
            <span>Rifan Financindo Berjangka</span>
          </LocaleLink>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6 text-base">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.submenu ? (
                  <>
                    <div className="flex items-center">
                      <span className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-default">
                        {item.label}
                      </span>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="px-1 focus:outline-none"
                        type="button"
                      >
                        <i className="fa-solid fa-chevron-down text-sm" />
                      </button>
                    </div>
                    {openDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 w-56 mt-2 z-50"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <ul className="bg-white text-black rounded shadow">
                          {item.submenu.map((sub) => (
                            <li key={sub.key} className="relative group">
                              <div className="flex justify-between items-center">
                                {sub.href ? (
                                  <LocaleLink 
                                    href={sub.href}
                                    className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${sub.submenu ? 'pr-8' : ''}`}
                                    onClick={closeAllMenus}
                                  >
                                    {sub.label}
                                  </LocaleLink>
                                ) : (
                                  <span className={`block w-full px-4 py-2 text-sm text-gray-700 ${sub.submenu ? 'pr-8' : ''}`}>
                                    {sub.label}
                                  </span>
                                )}
                                {sub.submenu && (
                                  <span className="px-2">
                                    <i className="fa-solid fa-chevron-right text-xs" />
                                  </span>
                                )}
                              </div>
                              {sub.submenu && (
                                <div 
                                  className="absolute left-full top-0 w-56 bg-white shadow-lg rounded ml-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                >
                                  <ul>
                                    {sub.submenu.map((nestedSub) => (
                                      <li key={nestedSub.key}>
                                        {nestedSub.href ? (
                                          <LocaleLink
                                            href={nestedSub.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeAllMenus}
                                          >
                                            {nestedSub.label}
                                          </LocaleLink>
                                        ) : (
                                          <span className="block px-4 py-2 text-sm text-gray-700">
                                            {nestedSub.label}
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : item.href ? (
                  <LocaleLink 
                    href={item.href}
                    className="text-center hover:border-b-2 border-green-700 transition text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium block"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </LocaleLink>
                ) : (
                  <span className="text-center hover:border-b-2 border-green-700 transition text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-default">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden px-6 pb-4 space-y-2 text-base bg-zinc-900">
            {menuItems.map((item) => (
              <div key={item.key} className="border-b border-gray-700 pb-2">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex justify-between items-center py-2 text-white"
                    >
                      {item.label}
                      <i
                        className={`fa-solid fa-chevron-down transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <ul className="pl-4">
                        {item.submenu.map((sub) => (
                          <li key={sub.key}>
                            {sub.href ? (
                              <LocaleLink
                                href={sub.href}
                                className="block py-2 text-white hover:text-green-400"
                                onClick={closeAllMenus}
                              >
                                {sub.label}
                              </LocaleLink>
                            ) : (
                              <span className="block py-2 text-white">
                                {sub.label}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : item.href ? (
                  <LocaleLink
                    href={item.href}
                    className="block py-2 text-white hover:text-green-400"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </LocaleLink>
                ) : (
                  <span className="block py-2 text-white">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
      <MarketUpdate />
    </header>
  );
};

export default NavBar;
