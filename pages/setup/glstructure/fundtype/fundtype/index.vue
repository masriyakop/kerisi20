<script setup>
definePageMeta({
  title: "Fund Type",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Setup",
    "path": "/setup"
  },
  {
    "name": "Glstructure",
    "path": "/setup/glstructure"
  },
  {
    "name": "Fundtype",
    "path": "/setup/glstructure/fundtype"
  },
  {
    "name": "Fund Type",
    "path": "/setup/glstructure/fundtype/fundtype"
  }
],
});

const { $swal } = useNuxtApp();

// Table data
const fundtypeList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showFundtypeModal = ref(false);
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
const smartFilterLabels = {"Fund_Type_filter":"Fund Type","Description_filter":"Description","Status_filter":"Status"};
const smartFilterOptionsMap = {"Status_filter":"StatusOptions"};

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
// No top filter labels
// No top filter options mapping

// Form data
const fundtypeForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const StatusOptions = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);



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

// Fetch data function
const fetchData = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
      page: 1,
      pageSize: pageSize.value,
    };

    // Remove empty values
    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null) {
        delete query[key];
      }
    });


    const { data: data0 } = await useFetch("/api/setup/glstructure/fund-type/fund-type", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      fundtypeList.value = (data0.value.data || []).map((item, idx) => {
        const mappedItem = {
          no: idx + 1,
          Action: "",
        };
        // Map fields from API response
        Object.keys(item).forEach((key) => {
          mappedItem[key] = item[key];
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
const filteredFundtypeList = ref([...fundtypeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...fundtypeList.value];

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
  const dropdownFilterFields = ["Status"];
  
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
  filteredFundtypeList.value = [];
  nextTick(() => {
    filteredFundtypeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredFundtypeList.value.length);

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

// Download PDF function
const handleDownloadPDF = async () => {
  try {
    // Import jsPDF and jspdf-autotable dynamically
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    // Get current filtered data
    let dataToExport = [...filteredFundtypeList.value];
    
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
    const title = "Fund Type";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    doc.setFont(undefined, 'bold');
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, titleX, titleY);
    
    // Prepare table data
    const exportColumns = ["Fund Type","Description","Type Basis","Remark","Status","Entry Date"];
    const columnToOptionsMap = {"Status":"StatusOptions"};
    const columnDateTypeMap = {"Entry Date":"date"};
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Status"] = StatusOptions.value;
    
    const tableData = dataToExport.map((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
        // Check if this column has a lookup (dropdown/radio/checkbox/listbox)
        const options = columnOptionsLookup[col];
        // Check if this column is a date/datetime column
        const dateType = columnDateTypeMap[col];
        
        if (options) {
          // Use getLookupLabel to convert value to label
          const label = getLookupLabel(options, item[col]);
          row.push((label || '').toString());
        } else if (dateType === 'datetime') {
          // Format as datetime: DD/MM/YYYY HH:MI:SS AM/PM
          row.push(formatDateTime(item[col]));
        } else if (dateType === 'date') {
          // Format as date: DD/MM/YYYY
          row.push(formatDate(item[col]));
        } else {
          row.push((item[col] || '').toString());
        }
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
    const fileName = `Fund_Type_${new Date().toISOString().split('T')[0]}.pdf`;
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
    // Get current filtered data
    let dataToExport = [...filteredFundtypeList.value];
    
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
    
    // CSV Headers
    const exportColumns = ["Fund Type","Description","Type Basis","Remark","Status","Entry Date"];
    const columnToOptionsMap = {"Status":"StatusOptions"};
    const columnDateTypeMap = {"Entry Date":"date"};
    const headers = ['No.', ...exportColumns];
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Status"] = StatusOptions.value;
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    if (typeof StatusOptions !== 'undefined') smartFilterOptionsLookup["Status_filter"] = StatusOptions.value;
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    
    
    // Build CSV content
    let csvContent = '';
    csvContent += escapeCSVField(formattedDateTime) + '\n';
    csvContent += escapeCSVField("Fund Type") + '\n';
    
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
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
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
      csvContent += row.map(escapeCSVField).join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Fund_Type_${new Date().toISOString().split('T')[0]}.csv`);
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
    
    // Get current filtered data
    let dataToExport = [...filteredFundtypeList.value];
    
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
    worksheetData.push(["Fund Type"]);
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      worksheetData.push([`Search: ${searchKeyword.value.trim()}`]);
    }
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    if (typeof StatusOptions !== 'undefined') smartFilterOptionsLookup["Status_filter"] = StatusOptions.value;
    
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
    
    // Add headers
    const exportColumns = ["Fund Type","Description","Type Basis","Remark","Status","Entry Date"];
    const columnToOptionsMap = {"Status":"StatusOptions"};
    const columnDateTypeMap = {"Entry Date":"date"};
    worksheetData.push(['No.', ...exportColumns]);
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Status"] = StatusOptions.value;
    
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
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [(index + 1).toString()];
      exportColumns.forEach((col) => {
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
    const worksheet = workbook.addWorksheet("Fund Type");
    
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
    
    // Generate Excel file and download
    const fileName = `Fund_Type_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  fundtypeForm.value = { ...item };
  // Map date fields and format for date input
  if (item["Entry Date"] !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item["Entry Date"]);
  } else if (item["Entry_Date"] !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item["Entry_Date"]);
  } else if (item.EntryDate !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item.EntryDate);
  }

  showFundtypeModal.value = true;
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
  const formFields = ["id","Fund_Type","Description","Type_Basis","Remark","Status","Entry_Date","fund_type","EntryDate"];
  fundtypeForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      fundtypeForm.value[fieldName] = item[fieldName];
    }
  });
  // Map date fields and format for date input
  if (item["Entry Date"] !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item["Entry Date"]);
  } else if (item["Entry_Date"] !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item["Entry_Date"]);
  } else if (item.EntryDate !== undefined) {
    fundtypeForm.value.EntryDate = formatDateForInput(item.EntryDate);
  }
  showFundtypeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  fundtypeForm.value = {};
  // Set default current date/datetime for audit date fields
  fundtypeForm.value.EntryDate = formatDateForInput(new Date());

  showFundtypeModal.value = true;
};

// Delete function
const handleDelete = async (item) => {
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

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const apiPath = "/api/setup/glstructure/fund-type/fund-type";
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
const handleSaveFundtype = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/setup/glstructure/fund-type/fund-type";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: fundtypeForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: fundtypeForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Record updated successfully" : "Record created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchData();
      
      // Reset form and close modal
      showFundtypeModal.value = false;
      fundtypeForm.value = {};
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
const handleCancelFundtype = () => {
  showFundtypeModal.value = false;
  isViewMode.value = false;
  fundtypeForm.value = {};
};



// Initialize on mount
onMounted(() => {
fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />
    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">List of Fund Type</div>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="fundtype_pageSize">Display:</label>
              <FormKit
                id="fundtype_pageSize"
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="fundtype_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="fundtype_searchKeyword"
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
          <div class="fundtype-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`fundtype-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredFundtypeList"
              :field='["no","Fund Type","Description","Type Basis","Remark","Status","Entry Date","Action"]'
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
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:FundType="data">
                {{ data.value["Fund Type"] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:TypeBasis="data">
                {{ data.value["Type Basis"] }}
              </template>
              <template v-slot:Remark="data">
                {{ data.value.Remark }}
              </template>
              <template v-slot:Status="data">
                {{ getLookupLabel(StatusOptions, data.value.Status) }}
              </template>
              <template v-slot:EntryDate="data">
                {{ formatDate(data.value["Entry Date"]) }}
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
              <label class="w-32 text-sm font-medium" for="smartFilter_Fund_Type">Fund Type:</label>
              <div class="flex-1">
                <FormKit
                  id="smartFilter_Fund_Type"
                  v-model="smartFilter.Fund_Type_filter"
                  type="text"
                  
                  placeholder="Enter Fund Type"
                  outer-class="mb-0"
                />
                
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
                  :options="StatusOptions"
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
      v-model="showFundtypeModal"
      title="View/Add/Edit Fund Type"
      size="lg"
      dialog-class="fundtype-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg fundtype-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View View/Add/Edit Fund Type' : (isEditMode ? 'Edit View/Add/Edit Fund Type' : 'Add View/Add/Edit Fund Type') }}
          </h4>
          <Icon
            @click="handleCancelFundtype"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveFundtype">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_fund_type">Fund Type:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_fund_type"
                  v-model="fundtypeForm.fund_type"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Fund Type"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_Description">Description:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_Description"
                  v-model="fundtypeForm.Description"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_Remark">Remark:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_Remark"
                  v-model="fundtypeForm.Remark"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Remark"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_Type_Basis">Type Basis:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_Type_Basis"
                  v-model="fundtypeForm.Type_Basis"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Type Basis"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_EntryDate">Entry Date:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_EntryDate"
                  v-model="fundtypeForm.EntryDate"
                  type="date"
                  
                  :disabled="true"
                  placeholder="Enter Entry Date"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="fundtypeForm_Status">Status:</label>
              <div class="flex-1">
                <FormKit
                  id="fundtypeForm_Status"
                  v-model="fundtypeForm.Status"
                  type="select"
                  :options="StatusOptions"
                  :disabled="isViewMode"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelFundtype">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveFundtype">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.fundtype-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.fundtype-table-wrapper :deep(.rs-table thead th:last-child),
.fundtype-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for List of Fund Type modal - 75% of lg size (800px * 0.75 = 600px) */
.fundtype-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.fundtype-modal-custom .modal-header > :last-child:not(.fundtype-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.fundtype-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.fundtype-modal-custom .fundtype-modal-header {
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

/* Ensure Smart Filter modal header matches List of Fund Type modal styling */
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