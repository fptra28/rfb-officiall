import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import ModalPopup from "@/components/moleculs/ModalPopup";

interface CalendarEvent {
  time: string;       // Format: HH:MM
  date?: string;      // Format: YYYY-MM-DD
  country: string;
  impact: string;     // Format: '★', '★★', '★★★'
  figures: string;
  previous: string;
  forecast: string;
  actual: string;
  details?: {
    sources?: string;
    measures?: string;
    usualEffect?: string;
    frequency?: string;
    nextReleased?: string;
    notes?: string;
    whyTraderCare?: string;
    history?: Array<{
      date: string;
      previous: string;
      forecast: string;
      actual: string;
    }>;
  };
}

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'economic-calendar'])),
    },
  };
};

export default function EconomicCalendar() {
  const { t } = useTranslation('economic-calendar');
  const [dataKalender, setDataKalender] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'today' | 'this-week' | 'previous-week' | 'next-week'>('today');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const fetchData = async (filter: string = 'today') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/economic-calendar?filter=${filter}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const data = await response.json();
      setDataKalender(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setDataKalender([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter]);

  const handleFilterClick = (filter: 'today' | 'this-week' | 'previous-week' | 'next-week') => {
    setActiveFilter(filter);
  };

  // Fungsi untuk menentukan kelas CSS berdasarkan impact
  const getImpactClass = (impact: string) => {
    if (impact === '★') return 'text-yellow-500 font-bold';
    if (impact === '★★') return 'text-orange-500 font-bold';
    if (impact === '★★★') return 'text-red-600 font-bold';
    return 'text-gray-500';
  };

  // Format tanggal menjadi DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Memisahkan tanggal dan waktu dari berbagai format
  const parseDateTime = (timeStr: string) => {
    // Jika formatnya 'HH:MM' atau 'HH.MM' (untuk today)
    if ((timeStr.includes(':') || timeStr.includes('.')) && !timeStr.includes('-')) {
      // Ganti titik dengan titik dua jika formatnya 'HH.MM'
      const formattedTime = timeStr.replace('.', ':');
      return {
        date: '',
        time: formattedTime
      };
    }
    
    // Jika formatnya 'YYYY-MM-DD HH.mm' (untuk this-week, previous-week, next-week)
    if (timeStr.includes(' ') && timeStr.includes('-')) {
      const [datePart, timePart] = timeStr.split(' ');
      return {
        date: datePart, // Format: YYYY-MM-DD
        time: timePart ? timePart.replace('.', ':') : '' // Ubah format waktu dari "13.00" menjadi "13:00"
      };
    }
    
    // Default return untuk format yang tidak dikenali
    return {
      date: '',
      time: timeStr
    };
  };

  // Cek apakah menampilkan kolom tanggal
  const showDateColumn = ['this-week', 'previous-week', 'next-week'].includes(activeFilter);

  const openDetail = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedEvent(null);
  };

  const displayValue = (value?: string) => {
    const trimmed = value?.toString?.().trim?.() ?? '';
    return trimmed.length ? trimmed : '-';
  };

  const selectedDateTime = selectedEvent ? parseDateTime(selectedEvent.time) : { date: '', time: '' };

  return (
    <PageTemplate title={t('title')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('title')}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500">{t('loading')}</div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => fetchData(activeFilter)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t('common:tryAgain', 'Coba Lagi')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Filter Button Section */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'today', label: t('filters.today') },
                    { key: 'this-week', label: t('filters.thisWeek') },
                    { key: 'next-week', label: t('filters.nextWeek') },
                    { key: 'previous-week', label: t('filters.previousWeek') }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => handleFilterClick(filter.key as any)}
                      className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                        activeFilter === filter.key
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
                {dataKalender.length > 0 ? (
                  <table className="w-full text-sm md:text-base min-w-[700px]">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        {showDateColumn && <th className="p-2 text-center whitespace-nowrap">{t('date')}</th>}
                        <th className="p-2 text-center whitespace-nowrap">{t('time')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('country')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('impact')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('figures')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('previous')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('forecast')}</th>
                        <th className="p-2 text-center whitespace-nowrap">{t('actual')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataKalender.map((row, index) => {
                        const currentDate = parseDateTime(row.time).date;
                        const prevDate = index > 0 ? parseDateTime(dataKalender[index - 1]?.time).date : null;
                        const showDateDivider = showDateColumn && currentDate && currentDate !== prevDate;
                        const isHighImpact = row.impact === '★★★';
                        
                        return (
                          <React.Fragment key={index}>
                            {showDateDivider && (
                              <tr className="bg-gray-100">
                                <td colSpan={showDateColumn ? 8 : 7} className="p-2 text-center font-medium text-gray-700">
                                  {new Date(currentDate).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </td>
                              </tr>
                            )}
                            <tr
                              role="button"
                              tabIndex={0}
                              title={t('detail.clickHint', 'Klik untuk lihat detail')}
                              onClick={() => openDetail(row)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') openDetail(row);
                              }}
                              className={`text-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                                isHighImpact 
                                  ? 'bg-green-100 hover:bg-green-100' 
                                  : index % 2 === 0 
                                    ? 'bg-white hover:bg-gray-50' 
                                    : 'bg-zinc-50 hover:bg-gray-50'
                              }`}
                            >
                              {showDateColumn && (
                                <td className="p-2 whitespace-nowrap border-t border-gray-100">
                                  {formatDate(parseDateTime(row.time).date)}
                                </td>
                              )}
                              <td className="p-2 whitespace-nowrap border-t border-gray-100">
                                {parseDateTime(row.time).time}
                              </td>
                              <td className="p-2 whitespace-nowrap border-t border-gray-100">
                                {row.country}
                              </td>
                              <td className="p-2 border-t border-gray-100">
                                <span className={getImpactClass(row.impact)}>
                                  {row.impact}
                                </span>
                              </td>
                              <td className="p-2 text-left border-t border-gray-100">
                                <div className="font-medium">{row.figures}</div>
                                {row.details?.sources && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {row.details.sources}
                                  </div>
                                )}
                              </td>
                              <td className="p-2 whitespace-nowrap border-t border-gray-100">
                                {row.previous}
                              </td>
                              <td className="p-2 whitespace-nowrap border-t border-gray-100">
                                {row.forecast}
                              </td>
                              <td 
                                className={`p-2 font-medium whitespace-nowrap border-t border-gray-100 ${
                                  row.actual === row.forecast 
                                    ? 'text-green-600' 
                                    : row.actual > row.forecast 
                                      ? 'text-blue-600' 
                                      : 'text-red-600'
                                }`}
                              >
                                {row.actual}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    {t('noData')}
                  </div>
                )}
              </div>
            </div>
          )}
        </ProfilContainer>

        <ModalPopup
          isOpen={isDetailOpen}
          onClose={closeDetail}
          title={t('detail.title', 'Detail Kalender Ekonomi')}
          panelClassName="max-w-3xl"
          watermarkSrc="/assets/logo-rfb.png"
          watermarkAlt="RFB"
        >
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">
                  {(selectedDateTime.date ? `${formatDate(selectedDateTime.date)} • ` : '') + displayValue(selectedDateTime.time)} • {displayValue(selectedEvent.country)} •{' '}
                  <span className={getImpactClass(selectedEvent.impact)}>{displayValue(selectedEvent.impact)}</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 mt-1">{displayValue(selectedEvent.figures)}</div>
                {selectedEvent.details?.sources && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">{t('detail.sources', 'Sumber')}:</span> {displayValue(selectedEvent.details.sources)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded border border-zinc-200 p-3">
                  <div className="text-gray-500">{t('previous')}</div>
                  <div className="font-semibold text-gray-900">{displayValue(selectedEvent.previous)}</div>
                </div>
                <div className="rounded border border-zinc-200 p-3">
                  <div className="text-gray-500">{t('forecast')}</div>
                  <div className="font-semibold text-gray-900">{displayValue(selectedEvent.forecast)}</div>
                </div>
                <div className="rounded border border-zinc-200 p-3">
                  <div className="text-gray-500">{t('actual')}</div>
                  <div className="font-semibold text-gray-900">{displayValue(selectedEvent.actual)}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {selectedEvent.details?.measures && (
                  <div>
                    <span className="font-medium">{t('detail.measures', 'Mengukur')}:</span> {displayValue(selectedEvent.details.measures)}
                  </div>
                )}
                {selectedEvent.details?.usualEffect && (
                  <div>
                    <span className="font-medium">{t('detail.usualEffect', 'Dampak Umum')}:</span> {displayValue(selectedEvent.details.usualEffect)}
                  </div>
                )}
                {selectedEvent.details?.frequency && (
                  <div>
                    <span className="font-medium">{t('detail.frequency', 'Frekuensi')}:</span> {displayValue(selectedEvent.details.frequency)}
                  </div>
                )}
                {selectedEvent.details?.nextReleased && (
                  <div>
                    <span className="font-medium">{t('detail.nextReleased', 'Rilis Berikutnya')}:</span> {displayValue(selectedEvent.details.nextReleased)}
                  </div>
                )}
                {selectedEvent.details?.notes && (
                  <div>
                    <span className="font-medium">{t('detail.notes', 'Catatan')}:</span> {displayValue(selectedEvent.details.notes)}
                  </div>
                )}
                {selectedEvent.details?.whyTraderCare && (
                  <div>
                    <span className="font-medium">{t('detail.whyTraderCare', 'Kenapa Penting')}:</span> {displayValue(selectedEvent.details.whyTraderCare)}
                  </div>
                )}
              </div>

              {Array.isArray(selectedEvent.details?.history) && selectedEvent.details!.history!.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-900 mb-2">{t('detail.history', 'History')}</div>
                  <div className="overflow-x-auto rounded border border-zinc-200">
                    <table className="w-full text-sm min-w-[520px]">
                      <thead className="bg-zinc-100 text-gray-700">
                        <tr>
                          <th className="p-2 text-left">{t('date')}</th>
                          <th className="p-2 text-left">{t('previous')}</th>
                          <th className="p-2 text-left">{t('forecast')}</th>
                          <th className="p-2 text-left">{t('actual')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.details!.history!.map((h, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                            <td className="p-2 border-t border-zinc-200 whitespace-nowrap">{displayValue(h.date)}</td>
                            <td className="p-2 border-t border-zinc-200 whitespace-nowrap">{displayValue(h.previous)}</td>
                            <td className="p-2 border-t border-zinc-200 whitespace-nowrap">{displayValue(h.forecast)}</td>
                            <td className="p-2 border-t border-zinc-200 whitespace-nowrap">{displayValue(h.actual)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!selectedEvent.details || Object.keys(selectedEvent.details).length === 0 ? (
                <div className="text-sm text-gray-500">{t('detail.noDetails', 'Detail belum tersedia dari API.')}</div>
              ) : null}
            </div>
          ) : null}
        </ModalPopup>
      </div>
    </PageTemplate>
  );
}
