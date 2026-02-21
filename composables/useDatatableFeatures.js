import { unref } from 'vue';

/**
 * Composable for datatable features: Save/Load Template, Ungroup/Group List,
 * Generate API, Download PDF, Download CSV.
 * Use with rs-table that has columnMovable, columnHideShow, columnGroupingList.
 */
export function useDatatableFeatures(options) {
  const {
    pageName,
    apiDataPath,
    defaultExportColumns,
    getFilteredList,
    datatableRef,
    searchKeyword,
    smartFilter = ref({}),
    topFilter = ref({}),
    applyFilters = () => {},
    getLookupLabel = (opts, val) => val ?? '',
    formatDate = (v) => (v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/') : '-'),
    formatDateTime = (v) => (v ? new Date(v).toLocaleString() : '-'),
    columnOptionsLookup = {},
    columnDateTypeMap = {},
    smartFilterLabels = {},
    topFilterLabels = {},
    smartFilterOptionsLookup = {},
    topFilterOptionsLookup = {},
  } = options;

  const $swal = useNuxtApp().$swal;
  const templateFileInputRef = ref(null);
  const exportConfigRef = ref(null);
  const isGrouped = ref(false);
  const showGenerateApiModal = ref(false);
  const apiOutputType = ref('JSON');
  const generateApiLoading = ref(false);

  const formatCell = (item, col, val, opts = columnOptionsLookup, dateMap = columnDateTypeMap) => {
    const options = unref(opts[col]);
    const dateType = dateMap[col];
    const value = val !== undefined ? val : item[col];
    if (options) return (getLookupLabel(options, value) || '').toString();
    if (dateType === 'datetime') return formatDateTime(value);
    if (dateType === 'date') return formatDate(value);
    return (value || '').toString();
  };

  const handleSaveTemplate = async () => {
    const tableState = datatableRef.value?.getTemplateState?.();
    if (!tableState) return;
    const template = {
      version: 1,
      pageName,
      columnOrder: tableState.columnOrder,
      hiddenColumns: tableState.hiddenColumns,
      sortColumn: tableState.sortColumn,
      sortDirection: tableState.sortDirection,
      isGrouped: isGrouped.value,
      searchKeyword: searchKeyword.value || '',
      smartFilter: { ...smartFilter.value },
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const suggestedName = `${pageName} Template.json`;
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName, types: [{ description: 'JSON Template', accept: { 'application/json': ['.json'] } }] });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (err) {
        if (err.name !== 'AbortError') $swal.fire({ title: 'Error', text: err.message || 'Failed to save template', icon: 'error' });
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadTemplate = () => {
    templateFileInputRef.value?.click();
  };

  const onTemplateFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result || '{}');
        if (!template.columnOrder || !Array.isArray(template.columnOrder)) {
          $swal.fire({ title: 'Invalid Template', text: 'Invalid template file format.', icon: 'error' });
          return;
        }
        datatableRef.value?.applyTemplateState?.(template);
        if (template.searchKeyword !== undefined) searchKeyword.value = template.searchKeyword;
        if (template.smartFilter && typeof template.smartFilter === 'object') smartFilter.value = { ...template.smartFilter };
        if (template.isGrouped !== undefined) isGrouped.value = !!template.isGrouped;
        applyFilters();
      } catch (err) {
        $swal.fire({ title: 'Invalid Template', text: 'Failed to parse template file.', icon: 'error' });
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleGenerateApi = () => {
    apiOutputType.value = 'JSON';
    showGenerateApiModal.value = true;
  };

  const handleGenerateApiProceed = async () => {
    try {
      generateApiLoading.value = true;
      const tableState = datatableRef.value?.getTemplateState?.();
      const exportConfig = datatableRef.value?.getExportConfig?.();
      const templateDetails = tableState ? {
        columnOrder: tableState.columnOrder,
        hiddenColumns: tableState.hiddenColumns,
        sortColumn: tableState.sortColumn,
        sortDirection: tableState.sortDirection,
        isGrouped: isGrouped.value,
        searchKeyword: searchKeyword.value || '',
        smartFilter: { ...smartFilter.value },
        exportColumns: exportConfig?.columns ?? null,
      } : {};
      const kerisiExportSlug = apiDataPath ? apiDataPath.replace(/^\/api\//, '').replace(/^\//, '') : '';
      const apiBaseUrl = (typeof window !== 'undefined' && window.location) ? `${window.location.origin}/api/kerisi-export/${kerisiExportSlug}` : '';
      const { data } = await useFetch('/api/api-gen-template', {
        method: 'POST',
        body: {
          api_base_url: apiBaseUrl + (apiBaseUrl.includes('?') ? '' : '?'),
          api_data_path: apiDataPath || null,
          api_output_type: apiOutputType.value,
          api_gen_template_details: templateDetails,
        },
      });
      if (data.value?.statusCode === 200 && data.value?.data?.full_url) {
        const fullUrl = data.value.data.full_url;
        showGenerateApiModal.value = false;
        $swal.fire({
          title: 'API Generated Successfully',
          html: `<p class="mb-4">Your API key has been created. Use the URL below to access your data:</p>
            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
              <span class="flex-1 break-all">${fullUrl}</span>
              <button type="button" id="swal-copy-url-btn" class="shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Copy URL">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">JSON and PDF display in browser. CSV and Excel will download.</p>`,
          icon: 'success',
          width: 600,
          didOpen: () => {
            const btn = document.getElementById('swal-copy-url-btn');
            if (btn) btn.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(fullUrl);
                btn.title = 'Copied!';
              } catch { $swal.fire({ title: 'Copy failed', text: 'Please copy the URL manually.', icon: 'warning', timer: 2000 }); }
            });
          },
        });
      } else {
        $swal.fire({ title: 'Error', text: data.value?.message || data.value?.error || 'Failed to generate API', icon: 'error' });
      }
    } catch (error) {
      console.error('Generate API error:', error);
      $swal.fire({ title: 'Error', text: 'Failed to generate API. Please try again.', icon: 'error' });
    } finally {
      generateApiLoading.value = false;
    }
  };

  const handleCloseGenerateApiModal = () => {
    showGenerateApiModal.value = false;
  };

  const handleUngroupList = () => { isGrouped.value = false; };
  const handleGroupList = () => { isGrouped.value = true; };

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const exportConfig = datatableRef.value?.getExportConfig?.() ?? (typeof exportConfigRef.value === 'function' ? exportConfigRef.value() : null);
      const exportColumns = exportConfig ? exportConfig.columns : defaultExportColumns;
      const dataToExport = exportConfig ? [...exportConfig.data] : [...(getFilteredList() || [])];
      if (dataToExport.length === 0) {
        $swal.fire({ title: 'No Data', text: 'There is no data to export', icon: 'warning' });
        return;
      }
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const now = new Date();
      const formattedDateTime = `Date : ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
      doc.setFontSize(10);
      doc.text(formattedDateTime, pageWidth - margin - doc.getTextWidth(formattedDateTime), margin + 8);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(pageName, (pageWidth - doc.getTextWidth(pageName)) / 2, margin + 10);
      const { groupedInfo, columnTitleIndices } = exportConfig || {};
      const tableData = dataToExport.map((item, index) => {
        const row = [(index + 1).toString()];
        exportColumns.forEach((col, colIdx) => {
          const titleIdx = columnTitleIndices?.[colIdx];
          const cellInfo = groupedInfo?.[index]?.[titleIdx];
          if (cellInfo?.rowspan > 0) row.push({ content: formatCell(item, col, cellInfo.value), rowSpan: cellInfo.rowspan, styles: { valign: 'middle' } });
          else if (cellInfo?.rowspan !== 0) row.push(formatCell(item, col));
        });
        return row;
      });
      autoTable(doc, {
        head: [['No.', ...exportColumns]],
        body: tableData,
        startY: margin + 18,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { halign: 'center', cellWidth: 15 } },
      });
      doc.save(`${pageName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      $swal.fire({ title: 'Success', text: 'PDF downloaded successfully', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (error) {
      console.error('Error generating PDF:', error);
      $swal.fire({ title: 'Error', text: 'Failed to generate PDF. Please try again.', icon: 'error' });
    }
  };

  const handleDownloadCSV = () => {
    try {
      const exportConfig = datatableRef.value?.getExportConfig?.() ?? (typeof exportConfigRef.value === 'function' ? exportConfigRef.value() : null);
      const exportColumns = exportConfig ? exportConfig.columns : defaultExportColumns;
      const dataToExport = exportConfig ? [...exportConfig.data] : [...(getFilteredList() || [])];
      if (dataToExport.length === 0) {
        $swal.fire({ title: 'No Data', text: 'There is no data to export', icon: 'warning' });
        return;
      }
      const escapeCSVField = (field) => {
        if (field === null || field === undefined) return '';
        const str = String(field);
        return (str.includes(',') || str.includes('"') || str.includes('\n')) ? `"${str.replace(/"/g, '""')}"` : str;
      };
      const now = new Date();
      const formattedDateTime = `Date : ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
      let csvContent = escapeCSVField(formattedDateTime) + '\n' + escapeCSVField(pageName) + '\n';
      if (searchKeyword.value?.trim()) csvContent += escapeCSVField(`Search: ${searchKeyword.value.trim()}`) + '\n';
      Object.keys(smartFilter.value || {}).forEach((key) => {
        if (smartFilter.value[key]?.toString().trim()) {
          const label = smartFilterLabels[key] || key.replace(/_filter$/, '');
          const opts = unref(smartFilterOptionsLookup[key]);
          const val = opts ? getLookupLabel(opts, smartFilter.value[key]) : smartFilter.value[key];
          csvContent += escapeCSVField(`${label}: ${val}`) + '\n';
        }
      });
      if (Object.keys(smartFilter.value || {}).some(k => smartFilter.value[k]?.toString().trim()) || searchKeyword.value?.trim()) csvContent += '\n';
      csvContent += ['No.', ...exportColumns].map(escapeCSVField).join(',') + '\n';
      const { groupedInfo, columnTitleIndices } = exportConfig || {};
      dataToExport.forEach((item, index) => {
        const row = [(index + 1).toString()];
        exportColumns.forEach((col, colIdx) => {
          const titleIdx = columnTitleIndices?.[colIdx];
          const cellInfo = groupedInfo?.[index]?.[titleIdx];
          if (cellInfo?.rowspan > 0) row.push(formatCell(item, col, cellInfo.value));
          else if (cellInfo?.rowspan === 0) row.push('');
          else row.push(formatCell(item, col));
        });
        csvContent += row.map(escapeCSVField).join(',') + '\n';
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${pageName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      $swal.fire({ title: 'Success', text: 'CSV downloaded successfully', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (error) {
      console.error('Error generating CSV:', error);
      $swal.fire({ title: 'Error', text: 'Failed to generate CSV. Please try again.', icon: 'error' });
    }
  };

  return {
    templateFileInputRef,
    exportConfigRef,
    isGrouped,
    showGenerateApiModal,
    apiOutputType,
    generateApiLoading,
    handleSaveTemplate,
    handleLoadTemplate,
    onTemplateFileChange,
    handleGenerateApi,
    handleGenerateApiProceed,
    handleCloseGenerateApiModal,
    handleUngroupList,
    handleGroupList,
    handleDownloadPDF,
    handleDownloadCSV,
  };
}
