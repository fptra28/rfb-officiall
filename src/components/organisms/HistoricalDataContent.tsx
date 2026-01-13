import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';

interface HistoricalDataItem {
  id: number;
  symbol: string;
  date: string;
  event: string | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  change: string | null;
  volume: number | null;
  openInterest: number | null;
  createdAt: string;
  updatedAt: string;
}

interface SymbolData {
  symbol: string;
  data: HistoricalDataItem[];
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  totalSymbols: number;
  data: SymbolData[];
}

// Format tanggal dari 'DD MMM YYYY' ke 'YYYY-MM-DD'
const formatDateToISO = (dateStr: string): string => {
  if (!dateStr) return '';

  // Coba format 'DD MMM YYYY' (e.g., '30 Sep 2025')
  const parts = dateStr.match(/^(\d{1,2})\s(\w{3})\s(\d{4})$/);
  if (parts) {
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    const day = parseInt(parts[1], 10);
    const month = months[parts[2]];
    const year = parseInt(parts[3], 10);

    if (!isNaN(day) && !isNaN(year) && month !== undefined) {
      // Gunakan UTC untuk menghindari masalah zona waktu
      const date = new Date(Date.UTC(year, month, day));
      return date.toISOString().split('T')[0];
    }
  }

  // Jika format tidak dikenali, kembalikan aslinya
  return dateStr;
};

export default function HistoricalDataContent() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [symbols, setSymbols] = useState<{ value: string; label: string }[]>([]);
  const [apiData, setApiData] = useState<SymbolData[]>([]);
  const [filteredData, setFilteredData] = useState<HistoricalDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { t, i18n } = useTranslation('historical-data');
  const { t: commonT } = useTranslation('common');

  // Hitung data yang akan ditampilkan di halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ambil data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/historical-data');

        if (!response.ok) {
          throw new Error(t('error.fetch'));
        }

        const data: ApiResponse = await response.json();
        const visibleData = data.data.filter((item) => item.symbol !== 'LSI Daily');
        setApiData(visibleData);

        // Daftar simbol untuk dropdown
        const symbolOptions = visibleData.map(item => ({
          value: item.symbol,
          label: item.symbol
        }));

        setSymbols(symbolOptions);

        // Set default symbol jika belum ada
        if (symbolOptions.length > 0 && !selectedSymbol) {
          const defaultSymbol = symbolOptions.find(s => s.value === 'LGD Daily') || symbolOptions[0];
          setSelectedSymbol(defaultSymbol.value);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('error.loading'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data saat simbol atau tanggal berubah
  useEffect(() => {
    if (!selectedSymbol || !apiData.length) return;

    const filterAndSortData = () => {
      try {
        setIsLoading(true);

        // Cari data untuk simbol yang dipilih
        const selectedData = apiData.find(item => item.symbol === selectedSymbol);

        if (!selectedData) {
          setFilteredData([]);
          return;
        }

        // Filter berdasarkan tanggal jika ada
        let result = [...selectedData.data];

        if (fromDate || toDate) {
          const from = fromDate ? new Date(fromDate) : null;
          const to = toDate ? new Date(toDate) : null;

          if (from) from.setHours(0, 0, 0, 0);
          if (to) to.setHours(23, 59, 59, 999);

          result = result.filter(item => {
            const itemDate = new Date(formatDateToISO(item.date));
            return (!from || itemDate >= from) &&
              (!to || itemDate <= to);
          });
        }

        // Urutkan dari tanggal terbaru
        result.sort((a, b) => {
          const dateA = new Date(formatDateToISO(a.date));
          const dateB = new Date(formatDateToISO(b.date));
          return dateB.getTime() - dateA.getTime();
        });

        setFilteredData(result);
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
        setError(null);

      } catch (err) {
        console.error('Error filtering data:', err);
        setError(t('error.filter'));
      } finally {
        setIsLoading(false);
      }
    };

    filterAndSortData();
  }, [selectedSymbol, fromDate, toDate, apiData]);

  const handleDownload = () => {
    if (filteredData.length === 0) return;

    try {
      const header = "Date,Open,High,Low,Close,Change,Volume,Event\n";
      const rows = filteredData.map(row => {
        const formatValue = (val: any) => val !== null && val !== undefined ? val : '';
        return [
          `"${row.date}"`,
          formatValue(row.open),
          formatValue(row.high),
          formatValue(row.low),
          formatValue(row.close),
          formatValue(row.change),
          formatValue(row.volume),
          `"${row.event || ''}"`
        ].join(',');
      }).join("\n");

      const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `historical-data-${selectedSymbol || 'all'}-${fromDate || 'start'}-to-${toDate || 'end'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating CSV:', err);
      setError(t('error.download'));
    }
  };

  // Return value as is without formatting
  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return '-';
    return value.toString();
  };

  // Format tanggal untuk tampilan
  const formatDisplayDate = (dateStr: string) => {
    try {
      // Parse tanggal dari format asli (DD MMM YYYY)
      const parts = dateStr.match(/^(\d{1,2})\s(\w{3})\s(\d{4})$/);
      if (!parts) return dateStr; // Kembalikan aslinya jika format tidak sesuai
      
      const months: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const day = parseInt(parts[1], 10);
      const month = months[parts[2]];
      const year = parseInt(parts[3], 10);
      
      if (isNaN(day) || isNaN(year) || month === undefined) return dateStr;
      
      // Buat tanggal dengan zona waktu UTC untuk konsistensi
      const date = new Date(Date.UTC(year, month, day));
      
      const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC' // Pastikan menggunakan UTC
      };
      
      return date.toLocaleDateString(locale, options);
    } catch (e) {
      return dateStr;
    }
  };

  // Handler untuk ganti halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handler untuk halaman sebelumnya
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handler untuk halaman selanjutnya
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">{t('loading')}</div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Symbol Selector */}
            <div className="w-full sm:w-auto flex-1 min-w-[120px] max-w-[200px]">
              <select
                id="symbol"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isLoading || symbols.length === 0}
              >
                {symbols.length === 0 ? (
                  <option value="" disabled>{t('loadingSymbols')}</option>
                ) : (
                  symbols.map((symbol) => (
                    <option key={symbol.value} value={symbol.value}>
                      {symbol.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                type="date"
                id="from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-28"
                disabled={isLoading}
              />
              <span className="text-gray-500 whitespace-nowrap text-xs">{t('dateRangeSeparator')}</span>
              <input
                type="date"
                id="to"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-28"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setSelectedSymbol('');
                }}
                disabled={isLoading || (!fromDate && !toDate && !selectedSymbol)}
                className="px-2.5 py-1.5 bg-white text-green-600 border border-green-600 rounded-md hover:bg-gray-50 transition-colors text-xs whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t('reset')}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isLoading || filteredData.length === 0}
                className="px-2.5 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs whitespace-nowrap flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t('download')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      {!isLoading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url(/assets/logo-rfb.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '30%',
              opacity: 0.1
            }}
          ></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-zinc-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Open
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t('high')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t('low')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    {t('close')}
                  </th>
                  {selectedSymbol.includes('SNI') && (
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t('change')}
                    </th>
                  )}
                  {selectedSymbol.includes('SNI') && (
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      {t('volume')}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {currentItems.map((item: HistoricalDataItem, index: number) => (
                  <tr key={`${item.symbol}-${item.date}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB] hover:bg-[#FFF9F5]'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C]">
                      {formatDisplayDate(item.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C] text-center">
                      {formatNumber(item.open)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C] text-center">
                      {formatNumber(item.high)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C] text-center">
                      {formatNumber(item.low)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C] text-center">
                      {formatNumber(item.close)}
                    </td>
                    {selectedSymbol.includes('SNI') && (
                      <td className={`px-4 py-3 whitespace-nowrap text-sm text-center ${item.change && parseFloat(item.change) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.change || '-'}
                      </td>
                    )}
                    {selectedSymbol.includes('SNI') && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#4C4C4C] text-center">
                        {item.volume ? formatNumber(item.volume) : '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {t('pagination.previous')}
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {t('pagination.next')}
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {t('pagination.showing', {
                      from: indexOfFirstItem + 1,
                      to: Math.min(indexOfLastItem, filteredData.length),
                      total: filteredData.length
                    })}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Sebelumnya</span>
                      &larr;
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Selanjutnya</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
