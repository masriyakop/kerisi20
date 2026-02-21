<script setup>
import { useMessageLog } from "~/composables/useMessageLog";

definePageMeta({
  title: "Budget Code",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Budget",
    "path": "/budget"
  },
  {
    "name": "Setup",
    "path": "/budget/setup"
  },
  {
    "name": "Budget Code",
    "path": "/budget/setup/budget-code"
  },
  {
    "name": "Budget Code",
    "path": "/budget/setup/budget-code/budgetcode"
  }
],
});

const { $swal } = useNuxtApp();
const route = useRoute();

const pageNameForLog = "Budget Code";
const moduleNameForLog = "Budget Code";
const pageBreadcrumbTextForLog = "Budget > Setup > Budget Code > Budget Code";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName: pageNameForLog,
  moduleName: moduleNameForLog,
  pageBreadcrumbText: pageBreadcrumbTextForLog,
});

// Table data
const budgetcodeList = ref([]);
const loading = ref(false);
const exportConfigRef = ref(null);
const datatableRef = ref(null);

// Collapse state for datatable


// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showBudgetcodeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({});
const originalFilter = ref({});

// Top Filter state
const topFilter = ref({});

// Smart Filter labels for export (field key -> display label)
// Smart Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
const smartFilterLabels = {"lbc_level_filter_filter":"Level","lbc_budget_code_filter_filter":"Budget Code","lbc_description_filter_filter":"Description","lbc_status_filter_filter":"Status"};
const smartFilterOptionsMap = {"lbc_level_filter_filter":"lbc_level_filterOptions","lbc_status_filter_filter":"lbc_status_filterOptions"};

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
// No top filter labels
// No top filter options mapping

// Form data
const budgetcodeForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const lbc_level_filterOptions = ref([]);
const lbc_status_filterOptions = ref([]);
const lbc_levelOptions = ref([]);
const lbc_budget_codeOptions = ref([]);
const lbc_statusOptions = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);

// Fetch dropdown options function (independent dropdowns)
const fetchDropdownOptions = async () => {
  try {
    // Fetch lbc_level_filter options
    const { data: lbc_level_filterData } = await useFetch("/api/page-generated/1475/lookups/lbc_level_filter", {
      method: "GET",
      initialCache: false,
    });
    if (lbc_level_filterData.value?.statusCode === 200 && lbc_level_filterData.value?.data) {
      lbc_level_filterOptions.value = lbc_level_filterData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    }

    // Fetch lbc_status_filter options
    const { data: lbc_status_filterData } = await useFetch("/api/page-generated/1475/lookups/lbc_status_filter", {
      method: "GET",
      initialCache: false,
    });
    if (lbc_status_filterData.value?.statusCode === 200 && lbc_status_filterData.value?.data) {
      lbc_status_filterOptions.value = lbc_status_filterData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    }

    // Fetch lbc_level options
    const { data: lbc_levelData } = await useFetch("/api/page-generated/1475/lookups/lbc_level", {
      method: "GET",
      initialCache: false,
    });
    if (lbc_levelData.value?.statusCode === 200 && lbc_levelData.value?.data) {
      lbc_levelOptions.value = lbc_levelData.value.data.map((item) => ({
        label: item.label || item.flc_name || item.acm_acct_level || "",
        value: item.value || item.flc_id || item.acm_acct_level || "",
      }));
    }

    // Fetch lbc_budget_code options
    const { data: lbc_budget_codeData } = await useFetch("/api/page-generated/1475/lookups/lbc_budget_code", {
      method: "GET",
      initialCache: false,
    });
    if (lbc_budget_codeData.value?.statusCode === 200 && lbc_budget_codeData.value?.data) {
      lbc_budget_codeOptions.value = lbc_budget_codeData.value.data.map((item) => ({
        label: item.label || item.lbc_budget_code || item.lbc_budget_code || "",
        value: item.value || item.lbc_budget_code || item.lbc_budget_code || "",
      }));
    }

  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};



// Helper function to get lookup label from options array
const getLookupLabel = (options, value) => {
  if (!options || !Array.isArray(options) || value === null || value === undefined || value === '') {
    return value || '';
  }
  const valueStr = String(value);
  const option = options.find(opt => String(opt.value) === valueStr || String(opt.label) === valueStr);
  return option ? option.label : value;
};

// Helper function to format date to DD/MM/YYYY
const formatDate = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format datetime to DD/MM/YYYY HH:MI:SS AM/PM
const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    return `${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format date to YYYY-MM-DD for HTML date input
const formatDateForInput = (value) => {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};


// Fetch data function - fetches all data, rs-table handles pagination client-side
const fetchData = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
    };

    // Remove empty values
    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null) {
        delete query[key];
      }
    });


    const { data: data0 } = await useFetch("/api/budget/setup/budget-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
        // Map database field names to display column headers (dt_key -> dt_bi)
        const fieldAliasMap = {
          "lbc_level": "Level",
          "lbc_budget_code": "Budget Code",
          "lbc_description": "Description",
          "lbc_status": "Status"
        };

      budgetcodeList.value = (data0.value.data || []).map((item, idx) => {
        const mappedItem = {
          no: idx + 1,
          Action: "",
        };
        // Map fields from API response
        Object.keys(item).forEach((key) => {
          mappedItem[key] = item[key];
        });
          // Apply field alias mapping (db field name -> display column name)
          Object.entries(fieldAliasMap).forEach(([dbField, displayName]) => {
            if (item[dbField] !== undefined) {
              mappedItem[displayName] = item[dbField];
            }
          });
        return mappedItem;
      });
      applyFilters();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Filtered data - using ref instead of computed for better reactivity
const filteredBudgetcodeList = ref([...budgetcodeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...budgetcodeList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return Object.keys(item).some((key) => {
        if (key === 'no' || key === 'Action') return false;
        const value = String(item[key] || "").toLowerCase();
        return value.includes(keyword);
      });
    });
  }

  // Apply smart filter
  // Build set of dropdown field names for exact matching (built at generation time)
  const dropdownFilterFields = ["Level","lbc_level_filter","Status","lbc_status_filter"];
  
  Object.keys(smartFilter.value).forEach((key) => {
    if (smartFilter.value[key]) {
      // Remove _filter suffix to get the actual field name
      const fieldName = key.replace(/_filter$/, "");
      
      filtered = filtered.filter((item) => {
        // Try both the field name and the original key (for backward compatibility)
        const itemValue = item[fieldName] || item[key];
        const filterValue = smartFilter.value[key];
        
        // For dropdown fields, use exact match (handle type conversion)
        if (dropdownFilterFields.includes(fieldName)) {
          // Convert both to strings for comparison (handles number/string mismatches)
          return String(itemValue) === String(filterValue);
        } else {
          // For text fields, use includes (substring match)
          const itemValueStr = String(itemValue || "").toLowerCase();
          const filterValueStr = String(filterValue).toLowerCase();
          return itemValueStr.includes(filterValueStr);
        }
      });
    }
  });

  // Update the filtered list - force reactivity by creating new array reference
  filteredBudgetcodeList.value = [];
  nextTick(() => {
    filteredBudgetcodeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredBudgetcodeList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Check if any smart filter is active
const hasActiveFilters = computed(() => {
  return Object.values(smartFilter.value).some((value) => {
    return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
  });
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {};
  originalFilter.value = {};
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

// 3-dot menu: Save Template, Load Template, Ungroup/Group List, Generate API
const templateFileInputRef = ref(null);

const handleSaveTemplate = async () => {
  const tableState = datatableRef.value?.getTemplateState?.();
  if (!tableState) return;

  const template = {
    version: 1,
    pageName: pageNameForLog,
    columnOrder: tableState.columnOrder,
    hiddenColumns: tableState.hiddenColumns,
    sortColumn: tableState.sortColumn,
    sortDirection: tableState.sortDirection,
    isGrouped: isGrouped.value,
    searchKeyword: searchKeyword.value || "",
    smartFilter: { ...smartFilter.value },
  };

  const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
  const suggestedName = `${pageNameForLog} Template.json`;

  if (typeof window.showSaveFilePicker === "function") {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description: "JSON Template", accept: { "application/json": [".json"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      if (err.name !== "AbortError") {
        $swal.fire({ title: "Error", text: err.message || "Failed to save template", icon: "error" });
      }
    }
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
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
      const template = JSON.parse(e.target?.result || "{}");
      if (!template.columnOrder || !Array.isArray(template.columnOrder)) {
        $swal.fire({ title: "Invalid Template", text: "Invalid template file format.", icon: "error" });
        return;
      }
      datatableRef.value?.applyTemplateState?.(template);
      if (template.searchKeyword !== undefined) searchKeyword.value = template.searchKeyword;
      if (template.smartFilter && typeof template.smartFilter === "object") {
        smartFilter.value = { ...template.smartFilter };
      }
      if (template.isGrouped !== undefined && typeof isGrouped !== 'undefined') isGrouped.value = !!template.isGrouped;
      applyFilters();
    } catch (err) {
      $swal.fire({ title: "Invalid Template", text: "Failed to parse template file.", icon: "error" });
    }
    event.target.value = "";
  };
  reader.readAsText(file);
};

const showGenerateApiModal = ref(false);
const apiOutputType = ref("JSON");
const generateApiLoading = ref(false);

const handleGenerateApi = () => {
  apiOutputType.value = "JSON";
  showGenerateApiModal.value = true;
};

const handleGenerateApiProceed = async () => {
  try {
    generateApiLoading.value = true;
    const tableState = datatableRef.value?.getTemplateState?.();
    const exportConfig = datatableRef.value?.getExportConfig?.();
    const templateDetails = tableState
      ? {
          columnOrder: tableState.columnOrder,
          hiddenColumns: tableState.hiddenColumns,
          sortColumn: tableState.sortColumn,
          sortDirection: tableState.sortDirection,
          isGrouped: isGrouped.value,
          searchKeyword: searchKeyword.value || "",
          smartFilter: { ...smartFilter.value },
          exportColumns: exportConfig?.columns ?? null,
        }
      : {};
    const apiDataPath = "/api/budget/setup/budget-code";
    const kerisiExportSlug = apiDataPath ? apiDataPath.replace(/^\/api\//, "").replace(/^\//, "") : "";
    const apiBaseUrl = ("undefined" !== "undefined" && window.location) ? `${window.location.origin}/api/kerisi-export/${kerisiExportSlug}` : "";
    const { data } = await useFetch("/api/api-gen-template", {
      method: "POST",
      body: {
        api_base_url: apiBaseUrl + (apiBaseUrl.includes("?") ? "" : "?"),
        api_data_path: apiDataPath || null,
        api_output_type: apiOutputType.value,
        api_gen_template_details: templateDetails,
      },
    });
    if (data.value?.statusCode === 200 && data.value?.data?.full_url) {
      const fullUrl = data.value.data.full_url;
      showGenerateApiModal.value = false;
      $swal.fire({
        title: "API Generated Successfully",
        html: `
          <p class="mb-4">Your API key has been created. Use the URL below to access your data:</p>
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
            <span class="flex-1 break-all">${fullUrl}</span>
            <button type="button" id="swal-copy-url-btn" class="shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Copy URL">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">JSON and PDF display in browser. CSV and Excel will download.</p>
        `,
        icon: "success",
        width: 600,
        didOpen: () => {
          const btn = document.getElementById("swal-copy-url-btn");
          if (btn) {
            btn.addEventListener("click", async () => {
              try {
                await navigator.clipboard.writeText(fullUrl);
                btn.title = "Copied!";
                const svg = btn.querySelector("svg");
                if (svg) svg.style.color = "var(--color-success, #22c55e)";
                setTimeout(() => {
                  btn.title = "Copy URL";
                  if (svg) svg.style.color = "";
                }, 1500);
              } catch {
                $swal.fire({ title: "Copy failed", text: "Please copy the URL manually.", icon: "warning", timer: 2000 });
              }
            });
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(fullUrl).catch(() => {});
        }
      });
    } else {
      const errMsg = data.value?.message || data.value?.error || "Failed to generate API";
      $swal.fire({
        title: "Error",
        text: errMsg,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Generate API error:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to generate API. Please try again.",
      icon: "error",
    });
  } finally {
    generateApiLoading.value = false;
  }
};

const handleCloseGenerateApiModal = () => {
  showGenerateApiModal.value = false;
};

const isGrouped = ref(false);
const handleUngroupList = () => { isGrouped.value = false; };
const handleGroupList = () => { isGrouped.value = true; };
// Download PDF function
const handleDownloadPDF = async () => {
  try {
    // Import jsPDF and jspdf-autotable dynamically
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    // Get export config from table (respects hidden, moved, grouped columns) or fallback to filtered list
    const exportConfig = datatableRef.value?.getExportConfig?.() ?? (typeof exportConfigRef.value === 'function' ? exportConfigRef.value() : null);
    const exportColumns = exportConfig ? exportConfig.columns : ["Level","Budget Code","Description","Status"];
    let dataToExport = exportConfig ? [...exportConfig.data] : [...filteredBudgetcodeList.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const logoSize = 12;
    const logoY = margin;
    const logoX = margin;
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = `Date : ${day}/${month}/${year} ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
    // Add logo on top left
    let logoHeight = 0;
    try {
      const logoUrl = '/img/logo/organization_logo.png';
      const response = await fetch(logoUrl);
      if (response.ok) {
        const blob = await response.blob();
        const logoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read logo file'));
          reader.readAsDataURL(blob);
        });
        
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = logoData;
        });
        
        const aspectRatio = img.width / img.height;
        logoHeight = logoSize;
        const logoWidth = logoSize * aspectRatio;
        doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
      logoHeight = 0;
    }
    
    // Add date and time at top right
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    const dateTimeWidth = doc.getTextWidth(formattedDateTime);
    const dateTimeX = pageWidth - margin - dateTimeWidth;
    const dateTimeY = margin + 8;
    doc.text(formattedDateTime, dateTimeX, dateTimeY);
    
    // Add title in the center
    const title = "Budget Code";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    doc.setFont(undefined, 'bold');
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, titleX, titleY);
    
    // Prepare table data (exportColumns already set above)
    const columnDateTypeMap = {};
    const columnOptionsLookup = {};
    columnOptionsLookup["Level"] = lbc_levelOptions.value;
    columnOptionsLookup["Budget Code"] = lbc_budget_codeOptions.value;
    columnOptionsLookup["Status"] = lbc_statusOptions.value;
    
    const formatCell = (item, col, val) => {
      const options = columnOptionsLookup[col];
      const dateType = columnDateTypeMap[col];
      const value = val !== undefined ? val : item[col];
      if (options) return (getLookupLabel(options, value) || '').toString();
      if (dateType === 'datetime') return formatDateTime(value);
      if (dateType === 'date') return formatDate(value);
      return (value || '').toString();
    };
    
    const { groupedInfo, columnTitleIndices } = exportConfig || {};
    const tableData = dataToExport.map((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col, colIdx) => {
        const titleIdx = columnTitleIndices?.[colIdx];
        const cellInfo = groupedInfo?.[index]?.[titleIdx];
        if (cellInfo?.rowspan > 0) {
          row.push({ content: formatCell(item, col, cellInfo.value), rowSpan: cellInfo.rowspan, styles: { valign: 'middle' } });
        } else if (cellInfo?.rowspan !== 0) {
          row.push(formatCell(item, col));
        }
        // rowspan === 0: omit cell (covered by rowspan above) - jspdf-autotable expects fewer cells
      });
      return row;
    });
    
    // Add table
    autoTable(doc, {
      head: [['No.', ...exportColumns]],
      body: tableData,
      startY: titleY + 8,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'left',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const dateTimeWidth = doc.getTextWidth(formattedDateTime);
        const dateTimeX = pageWidth - margin - dateTimeWidth;
        const dateTimeY = margin + 8;
        doc.text(formattedDateTime, dateTimeX, dateTimeY);
      },
    });
    
    // Save PDF
    const fileName = `Budget_Code_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    $swal.fire({
      title: "Success",
      text: "PDF downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to generate PDF. Please try again.",
      icon: "error",
    });
  }
};
// Download CSV function
const handleDownloadCSV = () => {
  try {
    // Get export config from table (respects hidden, moved, grouped columns) or fallback to filtered list
    const exportConfig = datatableRef.value?.getExportConfig?.() ?? (typeof exportConfigRef.value === 'function' ? exportConfigRef.value() : null);
    const exportColumns = exportConfig ? exportConfig.columns : ["Level","Budget Code","Description","Status"];
    let dataToExport = exportConfig ? [...exportConfig.data] : [...filteredBudgetcodeList.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = `Date : ${day}/${month}/${year} ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
    // Helper function to escape CSV field
    const escapeCSVField = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // CSV Headers (exportColumns already set above)
    const columnToOptionsMap = {"Level":"lbc_levelOptions","Budget Code":"lbc_budget_codeOptions","Status":"lbc_statusOptions"};
    const columnDateTypeMap = {};
    const headers = ['No.', ...exportColumns];
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Level"] = lbc_levelOptions.value;
    columnOptionsLookup["Budget Code"] = lbc_budget_codeOptions.value;
    columnOptionsLookup["Status"] = lbc_statusOptions.value;
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    if (typeof lbc_level_filterOptions !== 'undefined') smartFilterOptionsLookup["lbc_level_filter_filter"] = lbc_level_filterOptions.value;
    if (typeof lbc_status_filterOptions !== 'undefined') smartFilterOptionsLookup["lbc_status_filter_filter"] = lbc_status_filterOptions.value;
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    
    
    // Build CSV content
    let csvContent = '';
    csvContent += escapeCSVField(formattedDateTime) + '\n';
    csvContent += escapeCSVField("Budget Code") + '\n';
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      csvContent += escapeCSVField(`Search: ${searchKeyword.value.trim()}`) + '\n';
    }
    
    // Add top filter values if any
    const activeTopFilters = [];
    Object.keys(topFilter.value).forEach((key) => {
      if (topFilter.value[key] && String(topFilter.value[key]).trim() !== '') {
        // Use topFilterLabels for proper display label, fallback to key
        const displayLabel = (typeof topFilterLabels !== 'undefined' && topFilterLabels[key]) ? topFilterLabels[key] : key;
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(topFilter.value[key]).trim();
        if (topFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(topFilterOptionsLookup[key], displayValue);
        }
        activeTopFilters.push(`${displayLabel}: ${displayValue}`);
      }
    });
    
    if (activeTopFilters.length > 0) {
      activeTopFilters.forEach(filter => {
        csvContent += escapeCSVField(filter) + '\n';
      });
    }
    
    // Add smart filter values if any
    const activeFilters = [];
    Object.keys(smartFilter.value).forEach((key) => {
      if (smartFilter.value[key] && String(smartFilter.value[key]).trim() !== '') {
        // Use smartFilterLabels for proper display label, fallback to fieldName
        const displayLabel = (typeof smartFilterLabels !== 'undefined' && smartFilterLabels[key]) ? smartFilterLabels[key] : key.replace(/_filter$/, "");
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(smartFilter.value[key]).trim();
        if (smartFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(smartFilterOptionsLookup[key], displayValue);
        }
        activeFilters.push(`${displayLabel}: ${displayValue}`);
      }
    });
    
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        csvContent += escapeCSVField(filter) + '\n';
      });
    }
    
    // Add blank line if there are filters or search
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      csvContent += '\n';
    }
    
    // Add headers
    csvContent += headers.map(escapeCSVField).join(',') + '\n';
    
    const formatCell = (item, col, val) => {
      const options = columnOptionsLookup[col];
      const dateType = columnDateTypeMap[col];
      const value = val !== undefined ? val : item[col];
      if (options) return (getLookupLabel(options, value) || '').toString();
      if (dateType === 'datetime') return formatDateTime(value);
      if (dateType === 'date') return formatDate(value);
      return (value || '').toString();
    };
    
    const { groupedInfo, columnTitleIndices } = exportConfig || {};
    // Add data rows (with grouping like PDF - empty for rowspan 0 covered cells)
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col, colIdx) => {
        const titleIdx = columnTitleIndices?.[colIdx];
        const cellInfo = groupedInfo?.[index]?.[titleIdx];
        if (cellInfo?.rowspan > 0) {
          row.push(formatCell(item, col, cellInfo.value));
        } else if (cellInfo?.rowspan === 0) {
          row.push('');
        } else {
          row.push(formatCell(item, col));
        }
      });
      csvContent += row.map(escapeCSVField).join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Budget_Code_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    $swal.fire({
      title: "Success",
      text: "CSV downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating CSV:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to generate CSV. Please try again.",
      icon: "error",
    });
  }
};
// Download Excel function
const handleDownloadExcel = async () => {
  try {
    // Import ExcelJS dynamically for better styling support
    const ExcelJS = await import('exceljs');
    
    // Get export config from table (respects hidden, moved, grouped columns) or fallback to filtered list
    const exportConfig = datatableRef.value?.getExportConfig?.() ?? (typeof exportConfigRef.value === 'function' ? exportConfigRef.value() : null);
    const exportColumns = exportConfig ? exportConfig.columns : ["Level","Budget Code","Description","Status"];
    let dataToExport = exportConfig ? [...exportConfig.data] : [...filteredBudgetcodeList.value];
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Format current date and time: Date : 05/05/2025 11:25:02 AM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedDateTime = `Date : ${day}/${month}/${year} ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
    // Prepare worksheet data
    const worksheetData = [];
    
    // Add date/time (row 1)
    worksheetData.push([formattedDateTime]);
    
    // Add title (row 2)
    worksheetData.push(["Budget Code"]);
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      worksheetData.push([`Search: ${searchKeyword.value.trim()}`]);
    }
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    if (typeof lbc_level_filterOptions !== 'undefined') smartFilterOptionsLookup["lbc_level_filter_filter"] = lbc_level_filterOptions.value;
    if (typeof lbc_status_filterOptions !== 'undefined') smartFilterOptionsLookup["lbc_status_filter_filter"] = lbc_status_filterOptions.value;
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    
    
    // Add top filter values if any
    const activeTopFilters = [];
    Object.keys(topFilter.value).forEach((key) => {
      if (topFilter.value[key] && String(topFilter.value[key]).trim() !== '') {
        // Use topFilterLabels for proper display label, fallback to key
        const displayLabel = (typeof topFilterLabels !== 'undefined' && topFilterLabels[key]) ? topFilterLabels[key] : key;
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(topFilter.value[key]).trim();
        if (topFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(topFilterOptionsLookup[key], displayValue);
        }
        activeTopFilters.push(`${displayLabel}: ${displayValue}`);
      }
    });
    
    if (activeTopFilters.length > 0) {
      activeTopFilters.forEach(filter => {
        worksheetData.push([filter]);
      });
    }
    
    // Add smart filter values if any
    const activeFilters = [];
    Object.keys(smartFilter.value).forEach((key) => {
      if (smartFilter.value[key] && String(smartFilter.value[key]).trim() !== '') {
        // Use smartFilterLabels for proper display label, fallback to fieldName
        const displayLabel = (typeof smartFilterLabels !== 'undefined' && smartFilterLabels[key]) ? smartFilterLabels[key] : key.replace(/_filter$/, "");
        // For dropdown/radio/checkbox/listbox fields, convert value to label using options
        let displayValue = String(smartFilter.value[key]).trim();
        if (smartFilterOptionsLookup[key]) {
          displayValue = getLookupLabel(smartFilterOptionsLookup[key], displayValue);
        }
        activeFilters.push(`${displayLabel}: ${displayValue}`);
      }
    });
    
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        worksheetData.push([filter]);
      });
    }
    
    // Add blank row for spacing
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      worksheetData.push([]);
    }
    
    // Add headers (exportColumns already set above)
    const columnToOptionsMap = {"Level":"lbc_levelOptions","Budget Code":"lbc_budget_codeOptions","Status":"lbc_statusOptions"};
    const columnDateTypeMap = {};
    worksheetData.push(['No.', ...exportColumns]);
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Level"] = lbc_levelOptions.value;
    columnOptionsLookup["Budget Code"] = lbc_budget_codeOptions.value;
    columnOptionsLookup["Status"] = lbc_statusOptions.value;
    
    // Calculate header row index (0-based)
    let headerRowIndex = 2; // Start after date/time (0) and title (1), so headers are at index 2
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      headerRowIndex++; // Add search row
    }
    headerRowIndex += activeTopFilters.length; // Add top filter rows
    headerRowIndex += activeFilters.length; // Add smart filter rows
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeTopFilters.length > 0 || activeFilters.length > 0) {
      headerRowIndex++; // Add blank row
    }
    
    // Grouped merge support (from exportConfig)
    const groupedInfo = exportConfig?.groupedInfo ?? null;
    const columnTitleIndices = exportConfig?.columnTitleIndices ?? [];
    const columnTitleIndexToExportIndex = {};
    columnTitleIndices.forEach((ti, ei) => {
      if (ti >= 0) columnTitleIndexToExportIndex[ti] = ei;
    });
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col, colIdx) => {
        // For grouped columns with rowspan 0, use empty (merged with cell above)
        const colTitleIdx = columnTitleIndices[colIdx];
        const grp = groupedInfo?.[index]?.[colTitleIdx];
        if (grp && grp.rowspan === 0) {
          row.push('');
          return;
        }
        // Check if this column has a lookup (dropdown/radio/checkbox/listbox)
        const options = columnOptionsLookup[col];
        // Check if this column is a date/datetime column
        const dateType = columnDateTypeMap[col];
        
        if (options) {
          // Use getLookupLabel to convert value to label
          const label = getLookupLabel(options, item[col]);
          row.push(label || '');
        } else if (dateType === 'datetime') {
          // Format as datetime: DD/MM/YYYY HH:MI:SS AM/PM
          row.push(formatDateTime(item[col]));
        } else if (dateType === 'date') {
          // Format as date: DD/MM/YYYY
          row.push(formatDate(item[col]));
        } else {
          row.push(item[col] || '');
        }
      });
      worksheetData.push(row);
    });
    
    // Create workbook and worksheet using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Budget Code");
    
    // Add all rows to worksheet
    worksheetData.forEach((row, rowIndex) => {
      const worksheetRow = worksheet.addRow(row);
      
      // Style header row with light grey background and bold text
      if (rowIndex === headerRowIndex) {
        worksheetRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' } // Light grey background
          };
          cell.font = {
            bold: true
          };
          // Center align for No. column (colNumber 1)
          if (colNumber === 1) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
      }
    });
    
    // Set column widths
    worksheet.getColumn(1).width = 8;  // No.
    exportColumns.forEach((col, index) => {
      worksheet.getColumn(index + 2).width = 20; // Data columns
    });
    
    // Apply merged cells for grouped columns
    if (groupedInfo && columnTitleIndices.length > 0) {
      const firstDataRowExcel = headerRowIndex + 2; // 1-based Excel row
      for (let ri = 0; ri < dataToExport.length; ri++) {
        const grpRow = groupedInfo[ri];
        if (!grpRow) continue;
        for (const [colTitleIdxStr, info] of Object.entries(grpRow)) {
          const colTitleIdx = parseInt(colTitleIdxStr, 10);
          if (!info || info.rowspan <= 1) continue;
          const exportColIdx = columnTitleIndexToExportIndex[colTitleIdx];
          if (exportColIdx == null) continue;
          const excelCol = exportColIdx + 2; // +1 for 1-based, +1 for No. column
          const startRow = firstDataRowExcel + ri;
          const endRow = startRow + info.rowspan - 1;
          worksheet.mergeCells(startRow, excelCol, endRow, excelCol);
          // Center merged cell vertically
          const cell = worksheet.getCell(startRow, excelCol);
          if (cell.alignment) {
            cell.alignment.vertical = 'middle';
          } else {
            cell.alignment = { vertical: 'middle' };
          }
        }
      }
    }
    
    // Generate Excel file and download
    const fileName = `Budget_Code_${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    $swal.fire({
      title: "Success",
      text: "Excel file downloaded successfully",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    
    // Check if exceljs is not installed
    if (error.message && (error.message.includes('exceljs') || error.message.includes('Cannot find module'))) {
      $swal.fire({
        title: "Package Required",
        text: "Please install exceljs package: npm install exceljs or yarn add exceljs",
        icon: "warning",
      });
    } else {
      $swal.fire({
        title: "Error",
        text: "Failed to generate Excel file. Please try again.",
        icon: "error",
      });
    }
  }
};


// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  budgetcodeForm.value = { ...item };
  
  showBudgetcodeModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  // Copy only the aliased fields (form fields) to avoid sending stale original field values
  // This prevents original database fields (like lde_value) from overwriting edited alias values (like Code)
  // The PUT endpoint processes original fields LAST, so they would overwrite alias values if both are present
  // Only copy aliased fields (form fields) - exclude original database fields to prevent stale values
  const formFields = ["id","lbc_id","Level","Budget_Code","Description","Status","lbc_level","lbc_budget_code","lbc_description","lbc_status"];
  budgetcodeForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      budgetcodeForm.value[fieldName] = item[fieldName];
    }
  });
  showBudgetcodeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  budgetcodeForm.value = {};
  
  showBudgetcodeModal.value = true;
};

// Delete function
const handleDelete = async (item) => {
  const messageText = "Are you sure? Do you want to delete this record?";
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete this record?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  await updateMessageLogAction(logId, result.isConfirmed ? "Yes, delete it!" : "Cancel");

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const apiPath = "/api/budget/setup/budget-code";
      const response = await useFetch(`${apiPath}/${item.id || Object.values(item)[0]}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Record has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchData();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete record",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save function
const handleSaveBudgetcode = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/budget/setup/budget-code";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: budgetcodeForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: budgetcodeForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      const successMessage = isEditMode.value ? "Success. " + pageNameForLog + " updated successfully" : "Success. " + pageNameForLog + " is created successfully";
      $swal.fire({
        title: "Success",
        text: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (isEditMode.value) {
        await logUpdateSuccess(successMessage, pageNameForLog + " updated");
      } else {
        await logCreateSuccess(successMessage, pageNameForLog + " created");
      }
      
      // Refresh data from API
      await fetchData();
      
      // Reset form and close modal
      showBudgetcodeModal.value = false;
      budgetcodeForm.value = {};
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save record",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving record:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel form
const handleCancelBudgetcode = () => {
  showBudgetcodeModal.value = false;
  isViewMode.value = false;
  budgetcodeForm.value = {};
};



// Initialize on mount
onMounted(() => {
  const kerisiApiKey = route.query?.kerisiApiKey;
  if (kerisiApiKey) {
    const kerisiExportSlug = route.path.split("/").filter(Boolean).pop() || "export";
    window.location.href = `/api/kerisi-export/${kerisiExportSlug}?kerisiApiKey=${encodeURIComponent(kerisiApiKey)}`;
    return;
  }
  fetchDropdownOptions();
  fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <input
      ref="templateFileInputRef"
      type="file"
      accept=".json,application/json"
      class="hidden"
      @change="onTemplateFileChange"
    />
    
    <LayoutsBreadcrumb />
    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Budget Code</div>
          <rs-dropdown
            variant="secondary-text"
            size="sm"
            :hideChevron="true"
            position="bottom"
            textAlign="right"
            itemSize="11rem"
            class="[&_.button]:!h-8 [&_.button]:!min-h-8 [&_.button]:!p-1 [&_.button]:!border-0 [&_.button]:!min-w-0"
          >
            <template #title>
              <Icon name="mdi:dots-vertical" size="1rem" />
            </template>
            <rs-dropdown-item @click="handleSaveTemplate">Save Template</rs-dropdown-item>
            <rs-dropdown-item @click="handleLoadTemplate">Load Template</rs-dropdown-item>
            <rs-dropdown-item v-if="isGrouped" @click="handleUngroupList">Ungroup List</rs-dropdown-item>
            <rs-dropdown-item v-else @click="handleGroupList">Group List</rs-dropdown-item>
            <rs-dropdown-item @click="handleGenerateApi">Generate API</rs-dropdown-item>
          </rs-dropdown>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="budgetcode_pageSize">Display:</label>
              <FormKit
                id="budgetcode_pageSize"
                type="select"
                v-model="pageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
                outer-class="mb-0"
              />
            </div>

            <!-- Search on Right -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="budgetcode_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="budgetcode_searchKeyword"
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeyword"
                      type="button"
                      @click="searchKeyword = ''"
                      class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Icon
                        name="material-symbols:close"
                        class="!w-4 !h-4 text-gray-500"
                      />
                    </button>
                  </template>
                </FormKit>
                <rs-button
                  :variant="hasActiveFilters ? 'danger' : 'secondary'"
                  class="!px-3"
                  style="height: 40px; min-height: 40px;"
                  @click="handleFilter"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="budgetcode-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`budgetcode-table`"
              :data="filteredBudgetcodeList"
              :field='["no","Level","Budget Code","Description","Status","Action"]'
              :options="{
                variant: 'primary',
                striped: false,
                bordered: false,
                borderless: true,
                
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: false,
                outsideBorder: false,
              }"
              advanced
              :pageSize="pageSize"
              :hideTableSearch="true"
              :hideTablePageSize="true"
              
              
              
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="isGrouped"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Level="data">
                {{ getLookupLabel(lbc_levelOptions, data.value.Level) }}
              </template>
              <template v-slot:BudgetCode="data">
                {{ getLookupLabel(lbc_budget_codeOptions, data.value["Budget Code"]) }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ getLookupLabel(lbc_statusOptions, data.value.Status) }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-start">
                  <button
                    @click="handleView(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleEdit(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleDelete(data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon
                      name="material-symbols:delete"
                      class="text-red-600 dark:text-red-400"
                      size="20"
                    />
                  </button>
                </div>
              </template>

            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadExcel">
                <Icon name="material-symbols:table-chart" class="mr-2" size="1rem" />
                Download Excel
              </rs-button>
              <rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>


    <!-- Smart Filter Modal -->
    <rs-modal
      v-model="showSmartFilter"
      title="Smart Filter"
      size="md"
      dialog-class="smart-filter-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg smart-filter-modal-header">
          <h4 class="text-base font-semibold text-white">Smart Filter</h4>
          <Icon
            @click="handleFilterClose"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Level">Level:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Level"
                  v-model="smartFilter.Level_filter"
                  type="select"
                  :options="lbc_level_filterOptions"
                  placeholder="Select Level"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Level_filter"
                  type="button"
                  @click="smartFilter.Level_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Budget_Code">Budget Code:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Budget_Code"
                  v-model="smartFilter.Budget_Code_filter"
                  type="select"
                  :options="[]"
                  placeholder="Select Budget Code"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Budget_Code_filter"
                  type="button"
                  @click="smartFilter.Budget_Code_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Description">Description:</label>
              <div class="flex-1">
                <FormKit
                  id="smartFilter_Description"
                  v-model="smartFilter.Description_filter"
                  type="text"
                  
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
                
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Status">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Status"
                  v-model="smartFilter.Status_filter"
                  type="select"
                  :options="lbc_status_filterOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Status_filter"
                  type="button"
                  @click="smartFilter.Status_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="handleFilterReset">
            Reset
          </rs-button>
          <rs-button variant="primary" @click="handleFilterOk">
            Ok
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Modal -->
    <rs-modal
      v-model="showBudgetcodeModal"
      title="Budget Code"
      size="lg"
      dialog-class="budgetcode-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg budgetcode-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Budget Code' : (isEditMode ? 'Edit Budget Code' : 'Add Budget Code') }}
          </h4>
          <Icon
            @click="handleCancelBudgetcode"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveBudgetcode">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2 d-none">
              <label class="w-32 text-xs font-medium" for="budgetcodeForm_lbc_id">ID:</label>
              <div class="flex-1">
                <FormKit
                  id="budgetcodeForm_lbc_id"
                  v-model="budgetcodeForm.lbc_id"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter ID"
                  outer-class="mb-0"
                  
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="budgetcodeForm_lbc_level">Level<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="budgetcodeForm_lbc_level"
                  v-model="budgetcodeForm.lbc_level"
                  type="select"
                  :options="lbc_levelOptions"
                  :disabled="isViewMode"
                  placeholder="Select Level"
                  outer-class="mb-0"
                  
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="budgetcodeForm_lbc_budget_code">Budget Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="budgetcodeForm_lbc_budget_code"
                  v-model="budgetcodeForm.lbc_budget_code"
                  type="select"
                  :options="lbc_budget_codeOptions"
                  :disabled="isViewMode"
                  placeholder="Select Budget Code"
                  outer-class="mb-0"
                  
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2" for="budgetcodeForm_lbc_description">Description:</label>
              <div class="flex-1">
                <FormKit
                  id="budgetcodeForm_lbc_description"
                  v-model="budgetcodeForm.lbc_description"
                  type="textarea"
                  :disabled="isViewMode"
                  placeholder="Enter Description"
                  rows="3"
                  outer-class="mb-0"
                  
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="budgetcodeForm_lbc_status">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="budgetcodeForm_lbc_status"
                  v-model="budgetcodeForm.lbc_status"
                  type="select"
                  :options="lbc_statusOptions"
                  :disabled="isViewMode"
                  placeholder="Select Status"
                  outer-class="mb-0"
                  
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelBudgetcode">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveBudgetcode">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Generate API Modal -->
    <rs-modal
      v-model="showGenerateApiModal"
      title="Generate API"
      size="md"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Type</label>
            <FormKit
              v-model="apiOutputType"
              type="select"
              :options="[
                { label: 'JSON', value: 'JSON' },
                { label: 'PDF', value: 'PDF' },
                { label: 'CSV', value: 'CSV' },
                { label: 'EXCEL', value: 'EXCEL' },
              ]"
              outer-class="mb-0"
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            A unique API key will be generated. Use the URL to access data in the selected format. JSON and PDF display in browser; CSV and Excel download.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="handleCloseGenerateApiModal">Cancel</rs-button>
          <rs-button variant="primary" :disabled="generateApiLoading" @click="handleGenerateApiProceed">
            {{ generateApiLoading ? 'Generating...' : 'Proceed' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  
  </div>
</template>

<style scoped>
/* Compact radio/checkbox: horizontal layout, less spacing */
.compact-radio-checkbox :deep(ul),
.compact-radio-checkbox :deep([class*="options"]) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}
.compact-radio-checkbox :deep(li) {
  margin: 0;
  padding: 0;
}
.compact-radio-checkbox :deep(label) {
  margin-bottom: 0;
}
/* Text format from component item cssClass (format-uppercase, format-initcap, format-lowercase) */
.format-uppercase :deep(input),
.format-uppercase :deep(textarea) {
  text-transform: uppercase;
}
.format-lowercase :deep(input),
.format-lowercase :deep(textarea) {
  text-transform: lowercase;
}
.format-initcap :deep(input),
.format-initcap :deep(textarea) {
  text-transform: capitalize;
}
/* Hide default table header since we're using custom header */
.budgetcode-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.budgetcode-table-wrapper :deep(.rs-table thead th:last-child),
.budgetcode-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for Budget Code modal - 75% of lg size (800px * 0.75 = 600px) */
.budgetcode-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.budgetcode-modal-custom .modal-header > :last-child:not(.budgetcode-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.budgetcode-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.budgetcode-modal-custom .budgetcode-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Hide default close icon for Smart Filter modal */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure Smart Filter modal header matches Budget Code modal styling */
.smart-filter-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.smart-filter-modal-custom .smart-filter-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>