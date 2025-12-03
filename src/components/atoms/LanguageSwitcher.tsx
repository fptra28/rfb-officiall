"use client";

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ReactCountryFlag from 'react-country-flag';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locale, asPath } = router;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(asPath, asPath, { locale: newLocale, scroll: false });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => router.push(asPath, asPath, { locale: 'id', scroll: false })}
        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${locale === 'id' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        aria-label="Switch to Indonesian"
      >
        <ReactCountryFlag
          countryCode="ID"
          svg
          style={{
            width: '1.2em',
            height: '1.2em',
            borderRadius: '2px',
          }}
          title="Indonesia"
        />
      </button>
      
      <button
        onClick={() => router.push(asPath, asPath, { locale: 'en', scroll: false })}
        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${locale === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        aria-label="Switch to English"
      >
        <ReactCountryFlag
          countryCode="US"
          svg
          style={{
            width: '1.2em',
            height: '1.2em',
            borderRadius: '2px',
          }}
          title="English"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
