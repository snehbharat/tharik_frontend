import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calendar, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { apiClient } from '../../services/ApiClient';

const AttendanceReportGenerator = () => {
  const [selectedMonth, setSelectedMonth] = useState('NOVEMBER');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isArabic, setIsArabic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const monthsArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Create worksheet for a single "project/month" (API data)
  const createAttendanceSheet = (data, monthLabel, year) => {
    const {
      employees = [],
      daysInMonth = 30,
      summary = {},
      projectId,
    } = data || {};

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const titleRow = [
      `MONTHLY ATTENDANCE SHEET FOR THE MONTH OF: ${monthLabel} - ${year}`
    ];

    const companyRow = [
      `Company: ALDOSSARY | Project: ${projectId || 'YA SREF Project'}`
    ];

    const contractorRow = [
      'Contractor: AHMAD MOHAMED OAID AL JOHANI FOR GENERAL CONTRACTING (AMOAGC)'
    ];

    const headerRow = [
      'S/N',
      'Name',
      'ID & Iqama',
      'Trade',
      ...daysArray.map(d => d.toString()),
      'Total'
    ];

    const dataRows = employees.map((employee, index) => [
      index + 1,
      employee.name,
      employee.employeeCode,
      employee.position,
      ...(employee.dailyHours || []).map(h => (h > 0 ? h : '')),
      employee.totalHours
    ]);

    const grandTotalRow = [
      '',
      'GRAND TOTAL',
      '',
      '',
      ...Array(daysInMonth).fill(''),
      summary.grandTotalHours || 0
    ];

    const allRows = [
      titleRow,
      [],
      companyRow,
      contractorRow,
      [],
      headerRow,
      ...dataRows,
      [],
      grandTotalRow
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(allRows);

    const colWidths = [
      { wch: 6 },   // S/N
      { wch: 25 },  // Name
      { wch: 15 },  // ID
      { wch: 12 },  // Trade
      ...Array(daysInMonth).fill({ wch: 4 }),
      { wch: 10 }   // Total
    ];
    worksheet['!cols'] = colWidths;

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 + daysInMonth } }
    ];

    return worksheet;
  };

  // Create workbook from API data (single sheet)
  const createAttendanceWorkbook = (data, monthLabel, year) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = createAttendanceSheet(data, monthLabel, year);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    return workbook;
  };

  const generateMonthlyAttendanceExcel = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert month name to number (1-12)
      const monthIndex = months.indexOf(selectedMonth) + 1;
      if (monthIndex <= 0) {
        throw new Error('Invalid month selected');
      }

      const params = new URLSearchParams({
        month: String(monthIndex),
        year: String(selectedYear),
        // projectId optional, abhi nahi bhej rahe
      });

      const response = await apiClient.getCC(`/employees/attendance/monthly-sheet?${params.toString()}`);
      const result = response;

      if (!result.success || !result.data) {
        console.log("problem is here");
        throw new Error(result.message || 'Failed to fetch attendance data');
      }

      const apiData = result.data;

      // Month label from API month (ensure correct)
      const monthIdxFromApi = (apiData.month ?? monthIndex) - 1;
      const monthLabel = isArabic
        ? monthsArabic[monthIdxFromApi]
        : months[monthIdxFromApi];

      const workbook = createAttendanceWorkbook(
        apiData,
        monthLabel,
        apiData.year || selectedYear
      );

      const fileName = `Attendance_${selectedMonth}_${selectedYear}_${Date.now()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      const successMsg = isArabic
        ? 'تم تنزيل التقرير بنجاح'
        : 'Report downloaded successfully!';
      alert(successMsg);
    } catch (err) {
      console.error('Error generating Excel:', err);
      const errorMsg = isArabic
        ? `خطأ في إنشاء التقرير: ${err.message}`
        : `Error generating report: ${err.message}`;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="text-green-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">
            {isArabic ? 'مولد تقرير الحضور' : 'Attendance Report Generator'}
          </h2>
        </div>

        <button
          onClick={() => setIsArabic(!isArabic)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          {isArabic ? 'EN' : 'ع'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filters (Month & Year only) */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              {isArabic ? 'الشهر' : 'Month'}
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {months.map((month, idx) => (
                <option key={month} value={month}>
                  {isArabic ? monthsArabic[idx] : month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'السنة' : 'Year'}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {[2023, 2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateMonthlyAttendanceExcel}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {isArabic ? 'جاري الإنشاء...' : 'Generating...'}
          </>
        ) : (
          <>
            <Download size={20} />
            {isArabic ? 'إنشاء التقرير' : 'Generate Report'}
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {isArabic
            ? '💡 سيتم تنزيل ملف Excel يحتوي على كشف الحضور الشهري.'
            : '💡 An Excel file will be downloaded containing the monthly attendance sheet.'}
        </p>
      </div>
    </div>
  );
};

export default AttendanceReportGenerator;