<script setup>
definePageMeta({
  title: "Structure Budget List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Page Editor",
    "path": "/page-editor"
  },
  {
    "name": "Pengujianmuka",
    "path": "/page-editor/pengujianmuka"
  },
  {
    "name": "Structurebudgetlist",
    "path": "/page-editor/pengujianmuka/structurebudgetlist"
  },
  {
    "name": "Structure Budget List",
    "path": "/page-editor/pengujianmuka/structurebudgetlist/structurebudgetlist"
  }
],
});

const { $swal } = useNuxtApp();

// Table data
const structurebudgetlistList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showStructurebudgetlistModal = ref(false);
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
// No smart filter labels
// No smart filter options mapping

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
const topFilterLabels = {"Year":"Year","Fund":"Fund","PTJ":"PTJ","CostCentre":"Cost Centre","Activity":"Activity"};
const topFilterOptionsMap = {"Fund":"FundOptions","PTJ":"PTJOptions","CostCentre":"CostCentreOptions","Activity":"ActivityOptions"};

// Form data
const structurebudgetlistForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const PTJOptions = ref([]);
const CostCentreOptions = ref([]);
const ActivityOptions = ref([]);
const FundOptions = ref([]);
const BudgetCodeOptions = ref([]);
const deficit_budgetOptions = ref([{"label":"YES","value":"Y"},{"label":"NO","value":"N"}]);
const StatusOptions = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);

// Fetch PTJ options (depends on: Fund)
const fetchPTJOptions = async (params = {}) => {
  try {
    const queryParams = { Fund: params?.Fund || '' };
    const { data: PTJData } = await useFetch("/api/page-generated/1071/lookups/PTJ", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });
    if (PTJData.value?.statusCode === 200 && PTJData.value?.data) {
      PTJOptions.value = PTJData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    } else {
      PTJOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
    PTJOptions.value = [];
  }
};

// Fetch CostCentre options (depends on: Fund, PTJ)
const fetchCostCentreOptions = async (params = {}) => {
  try {
    const queryParams = { Fund: params?.Fund || '', PTJ: params?.PTJ || '' };
    const { data: CostCentreData } = await useFetch("/api/page-generated/1071/lookups/CostCentre", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });
    if (CostCentreData.value?.statusCode === 200 && CostCentreData.value?.data) {
      CostCentreOptions.value = CostCentreData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    } else {
      CostCentreOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching CostCentre options:", error);
    CostCentreOptions.value = [];
  }
};

// Fetch Activity options (depends on: Fund, PTJ, CostCentre)
const fetchActivityOptions = async (params = {}) => {
  try {
    const queryParams = { Fund: params?.Fund || '', PTJ: params?.PTJ || '', CostCentre: params?.CostCentre || '' };
    const { data: ActivityData } = await useFetch("/api/page-generated/1071/lookups/Activity", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });
    if (ActivityData.value?.statusCode === 200 && ActivityData.value?.data) {
      ActivityOptions.value = ActivityData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    } else {
      ActivityOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching Activity options:", error);
    ActivityOptions.value = [];
  }
};

// Fetch dropdown options function (independent dropdowns)
const fetchDropdownOptions = async () => {
  try {
    // Fetch Fund options
    const { data: FundData } = await useFetch("/api/page-generated/1071/lookups/Fund", {
      method: "GET",
      initialCache: false,
    });
    if (FundData.value?.statusCode === 200 && FundData.value?.data) {
      FundOptions.value = FundData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    }

    // Fetch BudgetCode options
    const { data: BudgetCodeData } = await useFetch("/api/page-generated/1071/lookups/BudgetCode", {
      method: "GET",
      initialCache: false,
    });
    if (BudgetCodeData.value?.statusCode === 200 && BudgetCodeData.value?.data) {
      BudgetCodeOptions.value = BudgetCodeData.value.data.map((item) => ({
        label: item.label || item.label || item.label || "",
        value: item.value || item.value || item.value || "",
      }));
    }

    // Fetch PTJ options (cascading dropdown - initial load)
    await fetchPTJOptions();

    // Fetch CostCentre options (cascading dropdown - initial load)
    await fetchCostCentreOptions();

    // Fetch Activity options (cascading dropdown - initial load)
    await fetchActivityOptions();

  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Watch Fund changes to update cascading dropdowns
watch(
  () => [structurebudgetlistForm.value.Fund, topFilter.value.Fund],
  async ([newFormValue, newFilterValue]) => {
    const newValue = newFormValue || newFilterValue;
    if (newValue !== undefined) {
  await fetchPTJOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '' });
  await fetchCostCentreOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '', PTJ: structurebudgetlistForm.value.PTJ || topFilter.value.PTJ || '' });
  await fetchActivityOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '', PTJ: structurebudgetlistForm.value.PTJ || topFilter.value.PTJ || '', CostCentre: structurebudgetlistForm.value.CostCentre || topFilter.value.CostCentre || '' });
    }
  },
  { deep: true }
);

// Watch PTJ changes to update cascading dropdowns
watch(
  () => [structurebudgetlistForm.value.PTJ, topFilter.value.PTJ],
  async ([newFormValue, newFilterValue]) => {
    const newValue = newFormValue || newFilterValue;
    if (newValue !== undefined) {
  await fetchCostCentreOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '', PTJ: structurebudgetlistForm.value.PTJ || topFilter.value.PTJ || '' });
  await fetchActivityOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '', PTJ: structurebudgetlistForm.value.PTJ || topFilter.value.PTJ || '', CostCentre: structurebudgetlistForm.value.CostCentre || topFilter.value.CostCentre || '' });
    }
  },
  { deep: true }
);

// Watch CostCentre changes to update cascading dropdowns
watch(
  () => [structurebudgetlistForm.value.CostCentre, topFilter.value.CostCentre],
  async ([newFormValue, newFilterValue]) => {
    const newValue = newFormValue || newFilterValue;
    if (newValue !== undefined) {
  await fetchActivityOptions({ Fund: structurebudgetlistForm.value.Fund || topFilter.value.Fund || '', PTJ: structurebudgetlistForm.value.PTJ || topFilter.value.PTJ || '', CostCentre: structurebudgetlistForm.value.CostCentre || topFilter.value.CostCentre || '' });
    }
  },
  { deep: true }
);



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


    const { data: data0 } = await useFetch("/api/page-editor/pengujianmuka/structurebudget-list", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      structurebudgetlistList.value = (data0.value.data || []).map((item, idx) => {
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
const filteredStructurebudgetlistList = ref([...structurebudgetlistList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...structurebudgetlistList.value];

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
  const dropdownFilterFields = [];
  
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
  filteredStructurebudgetlistList.value = [];
  nextTick(() => {
    filteredStructurebudgetlistList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredStructurebudgetlistList.value.length);

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
    let dataToExport = [...filteredStructurebudgetlistList.value];
    
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
    const title = "Structure Budget List";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    doc.setFont(undefined, 'bold');
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, titleX, titleY);
    
    // Prepare table data
    const exportColumns = ["ID","Fund","PTJ","Cost Centre","Activity","Activity Description","Budget Code","Budget Code Description","Deficit Budget","Status","Year"];
    const columnToOptionsMap = {"Fund":"FundOptions","PTJ":"FundOptions","Cost Centre":"CostCentreOptions","Activity":"ActivityOptions","Activity Description":"ActivityOptions","Budget Code":"BudgetCodeOptions","Budget Code Description":"BudgetCodeOptions","Deficit Budget":"deficit_budgetOptions","Status":"StatusOptions"};
    const columnDateTypeMap = {};
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Fund"] = FundOptions.value;
    columnOptionsLookup["PTJ"] = FundOptions.value;
    columnOptionsLookup["Cost Centre"] = CostCentreOptions.value;
    columnOptionsLookup["Activity"] = ActivityOptions.value;
    columnOptionsLookup["Activity Description"] = ActivityOptions.value;
    columnOptionsLookup["Budget Code"] = BudgetCodeOptions.value;
    columnOptionsLookup["Budget Code Description"] = BudgetCodeOptions.value;
    columnOptionsLookup["Deficit Budget"] = deficit_budgetOptions.value;
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
    const fileName = `Structure_Budget_List_${new Date().toISOString().split('T')[0]}.pdf`;
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
    let dataToExport = [...filteredStructurebudgetlistList.value];
    
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
    const exportColumns = ["ID","Fund","PTJ","Cost Centre","Activity","Activity Description","Budget Code","Budget Code Description","Deficit Budget","Status","Year"];
    const columnToOptionsMap = {"Fund":"FundOptions","PTJ":"FundOptions","Cost Centre":"CostCentreOptions","Activity":"ActivityOptions","Activity Description":"ActivityOptions","Budget Code":"BudgetCodeOptions","Budget Code Description":"BudgetCodeOptions","Deficit Budget":"deficit_budgetOptions","Status":"StatusOptions"};
    const columnDateTypeMap = {};
    const headers = ['No.', ...exportColumns];
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Fund"] = FundOptions.value;
    columnOptionsLookup["PTJ"] = FundOptions.value;
    columnOptionsLookup["Cost Centre"] = CostCentreOptions.value;
    columnOptionsLookup["Activity"] = ActivityOptions.value;
    columnOptionsLookup["Activity Description"] = ActivityOptions.value;
    columnOptionsLookup["Budget Code"] = BudgetCodeOptions.value;
    columnOptionsLookup["Budget Code Description"] = BudgetCodeOptions.value;
    columnOptionsLookup["Deficit Budget"] = deficit_budgetOptions.value;
    columnOptionsLookup["Status"] = StatusOptions.value;
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    
    
    // Build top filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const topFilterOptionsLookup = {};
    if (typeof FundOptions !== 'undefined') topFilterOptionsLookup["Fund"] = FundOptions.value;
    if (typeof PTJOptions !== 'undefined') topFilterOptionsLookup["PTJ"] = PTJOptions.value;
    if (typeof CostCentreOptions !== 'undefined') topFilterOptionsLookup["CostCentre"] = CostCentreOptions.value;
    if (typeof ActivityOptions !== 'undefined') topFilterOptionsLookup["Activity"] = ActivityOptions.value;
    
    // Build CSV content
    let csvContent = '';
    csvContent += escapeCSVField(formattedDateTime) + '\n';
    csvContent += escapeCSVField("Structure Budget List") + '\n';
    
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
    link.setAttribute('download', `Structure_Budget_List_${new Date().toISOString().split('T')[0]}.csv`);
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


// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  structurebudgetlistForm.value = { ...item };
  
  showStructurebudgetlistModal.value = true;
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
  const formFields = ["id","ID","Fund","PTJ","Cost_Centre","Activity","Activity_Description","Budget_Code","Budget_Code_Description","Deficit_Budget","Status","Year","CostCentre","BudgetCode","deficit_budget"];
  structurebudgetlistForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      structurebudgetlistForm.value[fieldName] = item[fieldName];
    }
  });
  showStructurebudgetlistModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  structurebudgetlistForm.value = {};
  // Set default current year for fields with defaultValue='currentYear'
  const currentYear = new Date().getFullYear();
  structurebudgetlistForm.value.Year = currentYear;

  showStructurebudgetlistModal.value = true;
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
      const apiPath = "/api/page-editor/pengujianmuka/structurebudget-list";
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
const handleSaveStructurebudgetlist = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/page-editor/pengujianmuka/structurebudget-list";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: structurebudgetlistForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: structurebudgetlistForm.value,
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
      showStructurebudgetlistModal.value = false;
      structurebudgetlistForm.value = {};
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
const handleCancelStructurebudgetlist = () => {
  showStructurebudgetlistModal.value = false;
  isViewMode.value = false;
  structurebudgetlistForm.value = {};
};



// Initialize on mount
onMounted(() => {
  fetchDropdownOptions();
  fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />
    <!-- Top Filter -->
    <rs-card>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <FormKit
              v-model="topFilter.Year"
              type="text"
              label="Year"
              outer-class="mb-0"
            >
              <template #suffix>
                <button
                  v-if="topFilter.Year"
                  type="button"
                  @click="topFilter.Year = ''"
                  class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Clear"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </template>
            </FormKit>
          </div>
          <div>
            <FormKit
              v-model="topFilter.Fund"
              type="select"
              label="Fund"
              :options="[{ label: '-- All --', value: '' }, ...FundOptions]"
              outer-class="mb-0"
            />
          </div>
          <div>
            <FormKit
              v-model="topFilter.PTJ"
              type="select"
              label="PTJ"
              :options="[{ label: '-- All --', value: '' }, ...PTJOptions]"
              outer-class="mb-0"
            />
          </div>
          <div>
            <FormKit
              v-model="topFilter.CostCentre"
              type="select"
              label="Cost Centre"
              :options="[{ label: '-- All --', value: '' }, ...CostCentreOptions]"
              outer-class="mb-0"
            />
          </div>
          <div>
            <FormKit
              v-model="topFilter.Activity"
              type="select"
              label="Activity"
              :options="[{ label: '-- All --', value: '' }, ...ActivityOptions]"
              outer-class="mb-0"
            />
          </div>
          <div class="flex flex-col justify-end">
            <label class="block text-sm font-medium text-transparent select-none">&nbsp;</label>
            <rs-button variant="primary" @click="fetchData" style="height: 40px;">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Filter
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Budget Structure List</div>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="structurebudgetlist_pageSize">Display:</label>
              <FormKit
                id="structurebudgetlist_pageSize"
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="structurebudgetlist_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="structurebudgetlist_searchKeyword"
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
                
              </div>
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="structurebudgetlist-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`structurebudgetlist-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredStructurebudgetlistList"
              :field='["no","ID","Fund","PTJ","Cost Centre","Activity","Activity Description","Budget Code","Budget Code Description","Deficit Budget","Status","Year","Action"]'
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
              <template v-slot:ID="data">
                {{ data.value.ID }}
              </template>
              <template v-slot:Fund="data">
                {{ getLookupLabel(FundOptions, data.value.Fund) }}
              </template>
              <template v-slot:PTJ="data">
                {{ getLookupLabel(PTJOptions, data.value.PTJ) }}
              </template>
              <template v-slot:CostCentre="data">
                {{ getLookupLabel(CostCentreOptions, data.value["Cost Centre"]) }}
              </template>
              <template v-slot:Activity="data">
                {{ getLookupLabel(ActivityOptions, data.value.Activity) }}
              </template>
              <template v-slot:ActivityDescription="data">
                {{ data.value["Activity Description"] }}
              </template>
              <template v-slot:BudgetCode="data">
                {{ getLookupLabel(BudgetCodeOptions, data.value["Budget Code"]) }}
              </template>
              <template v-slot:BudgetCodeDescription="data">
                {{ data.value["Budget Code Description"] }}
              </template>
              <template v-slot:DeficitBudget="data">
                {{ getLookupLabel(deficit_budgetOptions, data.value["Deficit Budget"]) }}
              </template>
              <template v-slot:Status="data">
                {{ getLookupLabel(StatusOptions, data.value.Status) }}
              </template>
              <template v-slot:Year="data">
                {{ data.value.Year }}
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
              
              <rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Add/Edit Modal -->
    <rs-modal
      v-model="showStructurebudgetlistModal"
      title="Structure Budget"
      size="lg"
      dialog-class="structurebudgetlist-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg structurebudgetlist-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Structure Budget' : (isEditMode ? 'Edit Structure Budget' : 'Add Structure Budget') }}
          </h4>
          <Icon
            @click="handleCancelStructurebudgetlist"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveStructurebudgetlist">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_Fund">Fund<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_Fund"
                  v-model="structurebudgetlistForm.Fund"
                  type="select"
                  :options="FundOptions"
                  :disabled="isViewMode"
                  placeholder="Select Fund"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_PTJ">PTJ<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_PTJ"
                  v-model="structurebudgetlistForm.PTJ"
                  type="select"
                  :options="PTJOptions"
                  :disabled="isViewMode"
                  placeholder="Select PTJ"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_CostCentre">Cost Centre<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_CostCentre"
                  v-model="structurebudgetlistForm.CostCentre"
                  type="select"
                  :options="CostCentreOptions"
                  :disabled="isViewMode"
                  placeholder="Select Cost Centre"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_Activity">Activity<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_Activity"
                  v-model="structurebudgetlistForm.Activity"
                  type="select"
                  :options="ActivityOptions"
                  :disabled="isViewMode"
                  placeholder="Select Activity"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_BudgetCode">Budget Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_BudgetCode"
                  v-model="structurebudgetlistForm.BudgetCode"
                  type="select"
                  :options="BudgetCodeOptions"
                  :disabled="isViewMode"
                  placeholder="Select Budget Code"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_Year">Year <span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_Year"
                  v-model="structurebudgetlistForm.Year"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Year "
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_Status">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_Status"
                  v-model="structurebudgetlistForm.Status"
                  type="select"
                  :options="StatusOptions"
                  :disabled="isViewMode"
                  placeholder="Select Status"
                  outer-class="mb-0"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="structurebudgetlistForm_deficit_budget">Deficit<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  id="structurebudgetlistForm_deficit_budget"
                  v-model="structurebudgetlistForm.deficit_budget"
                  type="select"
                  :options="deficit_budgetOptions"
                  :disabled="isViewMode"
                  placeholder="Select Deficit"
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
          <rs-button variant="danger" size="sm" @click="handleCancelStructurebudgetlist">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveStructurebudgetlist">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.structurebudgetlist-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.structurebudgetlist-table-wrapper :deep(.rs-table thead th:last-child),
.structurebudgetlist-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for Budget Structure List modal - 75% of lg size (800px * 0.75 = 600px) */
.structurebudgetlist-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.structurebudgetlist-modal-custom .modal-header > :last-child:not(.structurebudgetlist-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.structurebudgetlist-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.structurebudgetlist-modal-custom .structurebudgetlist-modal-header {
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

/* Ensure Smart Filter modal header matches Budget Structure List modal styling */
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