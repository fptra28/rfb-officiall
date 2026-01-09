import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import PageTemplate from '@/components/templates/PageTemplate';
import ProfilContainer from '@/components/templates/PageContainer/Container';
import CareerCard from '@/components/moleculs/CareerCard';
import { useCareers } from '@/hooks/useCareers';

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'navbar',
      'footer',
      'careers'
    ])),
  },
});

const CareersPage = () => {
  const { t } = useTranslation('careers');
  const { careers, loading, error } = useCareers();

  if (loading) {
    return (
      <PageTemplate title={t('pageTitle')}>
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
          <ProfilContainer>
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d22a27]"></div>
            </div>
          </ProfilContainer>
        </div>
      </PageTemplate>
    );
  }

  if (error) {
    return (
      <PageTemplate title={t('pageTitle')}>
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer>
          <div className="text-center py-10">
            <p className="text-red-500">{t('error.message')}: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#d22a27] text-white rounded hover:bg-[#b82421] transition-colors"
            >
              {t('error.retry')}
            </button>
          </div>
        </ProfilContainer>
      </div>
      </PageTemplate>
    );
  }

  if (careers.length === 0) {
    const emptyCards = [
      {
        icon: 'fa-bell',
        title: t('noJobsCards.alertTitle'),
        description: t('noJobsCards.alertDesc'),
      },
      {
        icon: 'fa-rocket',
        title: t('noJobsCards.growthTitle'),
        description: t('noJobsCards.growthDesc'),
      },
      {
        icon: 'fa-users',
        title: t('noJobsCards.cultureTitle'),
        description: t('noJobsCards.cultureDesc'),
      },
    ];

    return (
      <PageTemplate title={t('pageTitle')}>
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('joinTeam')}>
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-white via-[#fff5f4] to-white p-8 md:p-12">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#ffe7e6] blur-2xl opacity-70"></div>
            <div className="absolute -bottom-16 -left-20 h-44 w-44 rounded-full bg-[#ffecec] blur-2xl opacity-70"></div>
            <div className="relative">
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0f0] px-4 py-2 text-sm font-semibold text-[#d22a27]">
                  <i className="fa-solid fa-briefcase"></i>
                  <span>{t('noJobsBadge')}</span>
                </div>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
                  {t('noJobsTitle')}
                </h2>
                <p className="mt-2 text-gray-600">{t('noJobsDescription')}</p>
                <p className="mt-3 text-sm text-gray-500">{t('noJobs')}</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {emptyCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-gray-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d22a27] text-white">
                      <i className={`fa-solid ${card.icon}`}></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProfilContainer>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title={t('pageTitle')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('joinTeam')}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((job) => (
                <CareerCard 
                  key={job.id}
                  id={job.id}
                  city={job.nama_kota}
                  position={job.posisi}
                  slug={job.slug}
                />
              ))}
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
};

export default CareersPage;
