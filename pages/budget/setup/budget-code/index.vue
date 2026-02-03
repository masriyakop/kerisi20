<script setup>
definePageMeta({
  title: "Budget Code",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Setup",
      path: "/budget/setup",
    },
    {
      name: "Budget Code",
      path: "/budget/setup/budget-code",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const budgetCodeList = ref([]);
const loading = ref(false);

// Table reference to access sort state
const tableRef = ref(null);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit Budget Code modal state
const showBudgetCodeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({
  lbc_level_filter: "",
  lbc_budget_code_filter: "",
  lbc_description_filter: "",
  lbc_status_filter: "",
});

// Store original filter values for reset
const originalFilter = ref({
  lbc_level_filter: "",
  lbc_budget_code_filter: "",
  lbc_description_filter: "",
  lbc_status_filter: "",
});

// Dropdown options
const levelOptions = ref([
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
]);

const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Budget Code form data
const budgetCodeForm = ref({
  lbc_id: "",
  lbc_level: "",
  lbc_budget_code: "",
  lbc_description: "",
  lbc_status: "ACTIVE",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredBudgetCodeList = ref([...budgetCodeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...budgetCodeList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const level = (item.Level || "").toString().toLowerCase();
      const budgetCode = (item["Budget Code"] || "").toLowerCase();
      const description = (item.Description || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        level.includes(keyword) ||
        budgetCode.includes(keyword) ||
        description.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.lbc_level_filter) {
    filtered = filtered.filter((item) => item.Level === smartFilter.value.lbc_level_filter);
  }

  if (smartFilter.value.lbc_budget_code_filter) {
    const filterCode = smartFilter.value.lbc_budget_code_filter.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemCode = (item["Budget Code"] || "").toLowerCase();
      return itemCode.includes(filterCode);
    });
  }

  if (smartFilter.value.lbc_description_filter) {
    const filterDesc = smartFilter.value.lbc_description_filter.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemDesc = (item.Description || "").toLowerCase();
      return itemDesc.includes(filterDesc);
    });
  }

  if (smartFilter.value.lbc_status_filter) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.lbc_status_filter);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredBudgetCodeList.value = [];
  nextTick(() => {
    filteredBudgetCodeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredBudgetCodeList.value.length);

// Check if any smart filter is active
const hasActiveFilters = computed(() => {
  return !!(
    smartFilter.value.lbc_level_filter ||
    smartFilter.value.lbc_budget_code_filter ||
    smartFilter.value.lbc_description_filter ||
    smartFilter.value.lbc_status_filter
  );
});

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch budget codes from API
const fetchBudgetCodes = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/setup/budget-code", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      budgetCodeList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Level: item.lbc_level,
        "Budget Code": item.lbc_budget_code,
        Description: item.lbc_description,
        Status: item.lbc_status,
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        lbc_id: item.lbc_id,
        lbc_level: item.lbc_level,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description,
        lbc_status: item.lbc_status,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget codes",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget codes",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchBudgetCodes();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    lbc_level_filter: smartFilter.value.lbc_level_filter,
    lbc_budget_code_filter: smartFilter.value.lbc_budget_code_filter,
    lbc_description_filter: smartFilter.value.lbc_description_filter,
    lbc_status_filter: smartFilter.value.lbc_status_filter,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    lbc_level_filter: "",
    lbc_budget_code_filter: "",
    lbc_description_filter: "",
    lbc_status_filter: "",
  };
  originalFilter.value = {
    lbc_level_filter: "",
    lbc_budget_code_filter: "",
    lbc_description_filter: "",
    lbc_status_filter: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    lbc_level_filter: originalFilter.value.lbc_level_filter,
    lbc_budget_code_filter: originalFilter.value.lbc_budget_code_filter,
    lbc_description_filter: originalFilter.value.lbc_description_filter,
    lbc_status_filter: originalFilter.value.lbc_status_filter,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.lbc_id;
  budgetCodeForm.value = {
    lbc_id: item.lbc_id.toString(),
    lbc_level: item.lbc_level.toString(),
    lbc_budget_code: item["Budget Code"],
    lbc_description: item.Description || "",
    lbc_status: item.Status,
  };
  showBudgetCodeModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.lbc_id;
  budgetCodeForm.value = {
    lbc_id: item.lbc_id.toString(),
    lbc_level: item.lbc_level.toString(),
    lbc_budget_code: item["Budget Code"],
    lbc_description: item.Description || "",
    lbc_status: item.Status,
  };
  showBudgetCodeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  budgetCodeForm.value = {
    lbc_id: "",
    lbc_level: "",
    lbc_budget_code: "",
    lbc_description: "",
    lbc_status: "ACTIVE",
  };
  showBudgetCodeModal.value = true;
};

// Download PDF function
const handleDownloadPDF = async () => {
  try {
    // Import jsPDF and jspdf-autotable dynamically
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    // Use organization logo
    const logoPath = '/img/logo/organization_logo.png';
    
    // Get current filtered data
    let dataToExport = [...filteredBudgetCodeList.value];
    
    // Apply current sort from table if available
    if (tableRef.value && tableRef.value.currentSort !== undefined && tableRef.value.currentSort !== null) {
      const sortIndex = tableRef.value.currentSort;
      const sortDir = tableRef.value.currentSortDir || 'asc';
      const columnTitles = tableRef.value.columnTitle || [];
      
      if (columnTitles.length > 0 && sortIndex >= 0 && sortIndex < columnTitles.length) {
        const columnTitle = columnTitles[sortIndex];
        
        // Skip sorting for 'No' and 'Action' columns
        if (columnTitle && columnTitle !== 'no' && columnTitle !== 'No' && columnTitle !== 'action' && columnTitle !== 'Action') {
          // Map column titles to actual field names in the data
          // The table uses field names as defined in :field prop
          // Handle both exact matches and camelCase conversions
          let fieldName = columnTitle;
          
          // If columnTitle is camelCase, try to find the matching field
          // The actual data uses: 'Level', 'Budget Code', 'Description', 'Status'
          if (columnTitle === 'Level' || columnTitle === 'level') {
            fieldName = 'Level';
          } else if (columnTitle === 'Budget Code' || columnTitle === 'budgetCode' || columnTitle === 'BudgetCode') {
            fieldName = 'Budget Code';
          } else if (columnTitle === 'Description' || columnTitle === 'description') {
            fieldName = 'Description';
          } else if (columnTitle === 'Status' || columnTitle === 'status') {
            fieldName = 'Status';
          }
          
          // Apply sorting based on table's current sort state (matching table's sorting logic)
          dataToExport = [...dataToExport].sort((a, b) => {
            // Get values using the field name
            let aVal = a[fieldName];
            let bVal = b[fieldName];
            
            // Handle null/undefined values (table shows '-' for these)
            if (aVal === null || aVal === undefined || aVal === '') aVal = '-';
            if (bVal === null || bVal === undefined || bVal === '') bVal = '-';
            
            // Convert to string and lowercase for comparison (matching table logic)
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            
            // Try to convert to number if numeric (matching table logic)
            const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
            if (isNumeric(aVal)) aVal = parseFloat(aVal);
            if (isNumeric(bVal)) bVal = parseFloat(bVal);
            
            // Apply sort direction
            let modifier = sortDir === 'desc' ? -1 : 1;
            if (aVal < bVal) return -1 * modifier;
            if (aVal > bVal) return 1 * modifier;
            return 0;
          });
        }
      }
    }
    
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
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const logoSize = 12; // Logo height in mm
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
    
    // Add logo on top left - wait for logo to load before continuing
    let logoHeight = 0;
    try {
      const logoUrl = '/img/logo/organization_logo.png';
      console.log('Loading logo from:', logoUrl);
      
      // Fetch and load logo image
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Logo blob loaded, size:', blob.size);
      
      const logoData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log('Logo data read successfully');
          resolve(reader.result);
        };
        reader.onerror = () => {
          console.error('Failed to read logo file');
          reject(new Error('Failed to read logo file'));
        };
        reader.readAsDataURL(blob);
      });
      
      // Load image to get dimensions
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          console.log('Image loaded, dimensions:', image.width, 'x', image.height);
          resolve(image);
        };
        image.onerror = (e) => {
          console.error('Failed to load image:', e);
          reject(new Error('Failed to load image'));
        };
        image.src = logoData;
      });
      
      // Calculate aspect ratio to maintain logo proportions
      const aspectRatio = img.width / img.height;
      logoHeight = logoSize;
      const logoWidth = logoSize * aspectRatio;
      
      console.log('Adding logo to PDF at position:', logoX, logoY, 'size:', logoWidth, 'x', logoHeight);
      
      // Add logo to PDF
      doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
      console.log('Logo added successfully to PDF');
    } catch (error) {
      console.error('Error loading logo:', error);
      // Continue without logo - don't block PDF generation
      logoHeight = 0;
    }
    
    // Add date and time at top right
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0); // Ensure text is black
    const dateTimeWidth = doc.getTextWidth(formattedDateTime);
    const dateTimeX = pageWidth - margin - dateTimeWidth;
    const dateTimeY = margin + 8; // Position at top right
    doc.text(formattedDateTime, dateTimeX, dateTimeY);
    
    // Add title in the center
    // Adjust title Y position based on logo height
    const title = "Budget Code List";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    doc.setFont(undefined, 'bold');
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, titleX, titleY);
    
    // Prepare table data
    const tableData = dataToExport.map((item, index) => [
      (index + 1).toString(),
      (item.Level || '').toString(),
      (item['Budget Code'] || '').toString(),
      (item.Description || '').toString(),
      (item.Status || '').toString(),
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['No.', 'Level', 'Budget Code', 'Description', 'Status']],
      body: tableData,
      startY: titleY + 8,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color for header
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'left',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 }, // No. column - center aligned
        1: { halign: 'center', cellWidth: 20 }, // Level
        2: { cellWidth: 30 }, // Budget Code
        3: { cellWidth: 80 }, // Description
        4: { halign: 'center', cellWidth: 25 }, // Status
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        // Add date and time at top right on each page
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0); // Ensure text is black
        const dateTimeWidth = doc.getTextWidth(formattedDateTime);
        const dateTimeX = pageWidth - margin - dateTimeWidth;
        const dateTimeY = margin + 8; // Position at top right
        doc.text(formattedDateTime, dateTimeX, dateTimeY);
      },
    });
    
    // Save PDF
    const fileName = `Budget_Code_List_${new Date().toISOString().split('T')[0]}.pdf`;
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
    let dataToExport = [...filteredBudgetCodeList.value];
    
    // Apply current sort from table if available (same logic as PDF)
    if (tableRef.value && tableRef.value.currentSort !== undefined && tableRef.value.currentSort !== null) {
      const sortIndex = tableRef.value.currentSort;
      const sortDir = tableRef.value.currentSortDir || 'asc';
      const columnTitles = tableRef.value.columnTitle || [];
      
      if (columnTitles.length > 0 && sortIndex >= 0 && sortIndex < columnTitles.length) {
        const columnTitle = columnTitles[sortIndex];
        
        // Skip sorting for 'No' and 'Action' columns
        if (columnTitle && columnTitle !== 'no' && columnTitle !== 'No' && columnTitle !== 'action' && columnTitle !== 'Action') {
          // Map column titles to actual field names in the data
          let fieldName = columnTitle;
          
          // If columnTitle is camelCase, try to find the matching field
          // The actual data uses: 'Level', 'Budget Code', 'Description', 'Status'
          if (columnTitle === 'Level' || columnTitle === 'level') {
            fieldName = 'Level';
          } else if (columnTitle === 'Budget Code' || columnTitle === 'budgetCode' || columnTitle === 'BudgetCode') {
            fieldName = 'Budget Code';
          } else if (columnTitle === 'Description' || columnTitle === 'description') {
            fieldName = 'Description';
          } else if (columnTitle === 'Status' || columnTitle === 'status') {
            fieldName = 'Status';
          }
          
          // Apply sorting based on table's current sort state (matching table's sorting logic)
          dataToExport = [...dataToExport].sort((a, b) => {
            // Get values using the field name
            let aVal = a[fieldName];
            let bVal = b[fieldName];
            
            // Handle null/undefined values (table shows '-' for these)
            if (aVal === null || aVal === undefined || aVal === '') aVal = '-';
            if (bVal === null || bVal === undefined || bVal === '') bVal = '-';
            
            // Convert to string and lowercase for comparison (matching table logic)
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            
            // Try to convert to number if numeric (matching table logic)
            const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
            if (isNumeric(aVal)) aVal = parseFloat(aVal);
            if (isNumeric(bVal)) bVal = parseFloat(bVal);
            
            // Apply sort direction
            let modifier = sortDir === 'desc' ? -1 : 1;
            if (aVal < bVal) return -1 * modifier;
            if (aVal > bVal) return 1 * modifier;
            return 0;
          });
        }
      }
    }
    
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
    
    // Helper function to escape CSV field (handles commas, quotes, and newlines)
    const escapeCSVField = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      // If field contains comma, quote, or newline, wrap it in quotes and escape existing quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // CSV Headers
    const headers = ['No.', 'Level', 'Budget Code', 'Description', 'Status'];
    
    // Build CSV content with title and date/time
    let csvContent = '';
    
    // Add date/time (right-aligned by adding empty cells before it)
    // For CSV, we'll add it as a separate row
    csvContent += escapeCSVField(formattedDateTime) + '\n';
    
    // Add title
    const title = 'Budget Code List';
    csvContent += escapeCSVField(title) + '\n';
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      csvContent += escapeCSVField(`Search: ${searchKeyword.value.trim()}`) + '\n';
    }
    
    // Add smart filter values if any
    const filterLabels = {
      lbc_level_filter: 'Level',
      lbc_budget_code_filter: 'Budget Code',
      lbc_description_filter: 'Description',
      lbc_status_filter: 'Status',
    };
    
    const activeFilters = [];
    if (smartFilter.value.lbc_level_filter && smartFilter.value.lbc_level_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_level_filter}: ${smartFilter.value.lbc_level_filter.trim()}`);
    }
    if (smartFilter.value.lbc_budget_code_filter && smartFilter.value.lbc_budget_code_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_budget_code_filter}: ${smartFilter.value.lbc_budget_code_filter.trim()}`);
    }
    if (smartFilter.value.lbc_description_filter && smartFilter.value.lbc_description_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_description_filter}: ${smartFilter.value.lbc_description_filter.trim()}`);
    }
    if (smartFilter.value.lbc_status_filter && smartFilter.value.lbc_status_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_status_filter}: ${smartFilter.value.lbc_status_filter.trim()}`);
    }
    
    // Add smart filter values if any
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        csvContent += escapeCSVField(filter) + '\n';
      });
    }
    
    // Add blank line for spacing (only if there are filters or search)
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeFilters.length > 0) {
      csvContent += '\n';
    }
    
    // Add headers
    csvContent += headers.map(escapeCSVField).join(',') + '\n';
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      const row = [
        (index + 1).toString(),
        item.Level || '',
        item['Budget Code'] || '',
        item.Description || '',
        item.Status || '',
      ];
      csvContent += row.map(escapeCSVField).join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Budget_Code_List_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
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
    let dataToExport = [...filteredBudgetCodeList.value];
    
    // Apply current sort from table if available (same logic as PDF/CSV)
    if (tableRef.value && tableRef.value.currentSort !== undefined && tableRef.value.currentSort !== null) {
      const sortIndex = tableRef.value.currentSort;
      const sortDir = tableRef.value.currentSortDir || 'asc';
      const columnTitles = tableRef.value.columnTitle || [];
      
      if (columnTitles.length > 0 && sortIndex >= 0 && sortIndex < columnTitles.length) {
        const columnTitle = columnTitles[sortIndex];
        
        // Skip sorting for 'No' and 'Action' columns
        if (columnTitle && columnTitle !== 'no' && columnTitle !== 'No' && columnTitle !== 'action' && columnTitle !== 'Action') {
          // Map column titles to actual field names in the data
          let fieldName = columnTitle;
          
          if (columnTitle === 'Level' || columnTitle === 'level') {
            fieldName = 'Level';
          } else if (columnTitle === 'Budget Code' || columnTitle === 'budgetCode' || columnTitle === 'BudgetCode') {
            fieldName = 'Budget Code';
          } else if (columnTitle === 'Description' || columnTitle === 'description') {
            fieldName = 'Description';
          } else if (columnTitle === 'Status' || columnTitle === 'status') {
            fieldName = 'Status';
          }
          
          // Apply sorting
          dataToExport = [...dataToExport].sort((a, b) => {
            let aVal = a[fieldName];
            let bVal = b[fieldName];
            
            if (aVal === null || aVal === undefined || aVal === '') aVal = '-';
            if (bVal === null || bVal === undefined || bVal === '') bVal = '-';
            
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            
            const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
            if (isNumeric(aVal)) aVal = parseFloat(aVal);
            if (isNumeric(bVal)) bVal = parseFloat(bVal);
            
            let modifier = sortDir === 'desc' ? -1 : 1;
            if (aVal < bVal) return -1 * modifier;
            if (aVal > bVal) return 1 * modifier;
            return 0;
          });
        }
      }
    }
    
    if (dataToExport.length === 0) {
      $swal.fire({
        title: "No Data",
        text: "There is no data to export",
        icon: "warning",
      });
      return;
    }
    
    // Format current date and time
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
    worksheetData.push(['Budget Code List']);
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      worksheetData.push([`Search: ${searchKeyword.value.trim()}`]);
    }
    
    // Add smart filter values if any
    const filterLabels = {
      lbc_level_filter: 'Level',
      lbc_budget_code_filter: 'Budget Code',
      lbc_description_filter: 'Description',
      lbc_status_filter: 'Status',
    };
    
    const activeFilters = [];
    if (smartFilter.value.lbc_level_filter && smartFilter.value.lbc_level_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_level_filter}: ${smartFilter.value.lbc_level_filter.trim()}`);
    }
    if (smartFilter.value.lbc_budget_code_filter && smartFilter.value.lbc_budget_code_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_budget_code_filter}: ${smartFilter.value.lbc_budget_code_filter.trim()}`);
    }
    if (smartFilter.value.lbc_description_filter && smartFilter.value.lbc_description_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_description_filter}: ${smartFilter.value.lbc_description_filter.trim()}`);
    }
    if (smartFilter.value.lbc_status_filter && smartFilter.value.lbc_status_filter.trim() !== '') {
      activeFilters.push(`${filterLabels.lbc_status_filter}: ${smartFilter.value.lbc_status_filter.trim()}`);
    }
    
    // Add smart filter values if any
    if (activeFilters.length > 0) {
      activeFilters.forEach(filter => {
        worksheetData.push([filter]);
      });
    }
    
    // Add blank row for spacing
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeFilters.length > 0) {
      worksheetData.push([]);
    }
    
    // Add headers
    worksheetData.push(['No.', 'Level', 'Budget Code', 'Description', 'Status']);
    
    // Add data rows
    dataToExport.forEach((item, index) => {
      worksheetData.push([
        (index + 1).toString(),
        item.Level || '',
        item['Budget Code'] || '',
        item.Description || '',
        item.Status || '',
      ]);
    });
    
    // Calculate header row index (0-based)
    // Row 0: date/time, Row 1: title, then search/filters/blank, then headers
    let headerRowIndex = 2; // Start after date/time (0) and title (1), so headers are at index 2
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      headerRowIndex++; // Add search row
    }
    headerRowIndex += activeFilters.length; // Add filter rows
    if ((searchKeyword.value && searchKeyword.value.trim() !== '') || activeFilters.length > 0) {
      headerRowIndex++; // Add blank row
    }
    // Now headerRowIndex points to the header row (0-based) - the row with "No.", "Level", "Budget Code", etc.
    
    // Create workbook and worksheet using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Budget Code List');
    
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
          // Center align for No., Level, and Status columns
          if (colNumber === 1 || colNumber === 2 || colNumber === 5) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
      }
    });
    
    // Set column widths
    worksheet.getColumn(1).width = 8;  // No.
    worksheet.getColumn(2).width = 10; // Level
    worksheet.getColumn(3).width = 20; // Budget Code
    worksheet.getColumn(4).width = 50; // Description
    worksheet.getColumn(5).width = 15; // Status
    
    // Generate Excel file and download
    const fileName = `Budget_Code_List_${new Date().toISOString().split('T')[0]}.xlsx`;
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

// Save Budget Code
const handleSaveBudgetCode = async () => {
  // Validation
  if (
    !budgetCodeForm.value.lbc_level ||
    !budgetCodeForm.value.lbc_budget_code ||
    !budgetCodeForm.value.lbc_status
  ) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/budget/setup/budget-code/${editingId.value}`, {
        method: "PUT",
        body: {
          lbc_level: budgetCodeForm.value.lbc_level,
          lbc_budget_code: budgetCodeForm.value.lbc_budget_code,
          lbc_description: budgetCodeForm.value.lbc_description,
          lbc_status: budgetCodeForm.value.lbc_status,
        },
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/budget/setup/budget-code", {
        method: "POST",
        body: {
          lbc_level: budgetCodeForm.value.lbc_level,
          lbc_budget_code: budgetCodeForm.value.lbc_budget_code,
          lbc_description: budgetCodeForm.value.lbc_description,
          lbc_status: budgetCodeForm.value.lbc_status,
        },
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Budget code updated successfully" : "Budget code created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchBudgetCodes();
      
      // Reset form and close modal
      showBudgetCodeModal.value = false;
      budgetCodeForm.value = {
        lbc_id: "",
        lbc_level: "",
        lbc_budget_code: "",
        lbc_description: "",
        lbc_status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save budget code",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving budget code:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving budget code",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Budget Code form
const handleCancelBudgetCode = () => {
  showBudgetCodeModal.value = false;
  isViewMode.value = false;
  budgetCodeForm.value = {
    lbc_id: "",
    lbc_level: "",
    lbc_budget_code: "",
    lbc_description: "",
    lbc_status: "ACTIVE",
  };
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete budget code "${item["Budget Code"]}"?`,
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
      const response = await useFetch(`/api/budget/setup/budget-code/${item.lbc_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Budget code has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchBudgetCodes();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete budget code",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting budget code:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting budget code",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Code</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</label>
              <div class="flex gap-2">
                <FormKit
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
          <div class="budget-code-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="tableRef"
              :key="`budget-code-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredBudgetCodeList"
              :field="['no', 'Level', 'Budget Code', 'Description', 'Status', 'Action']"
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
              <template v-slot:Level="data">
                {{ data.value.Level }}
              </template>
              <template v-slot:BudgetCode="data">
                {{ data.value['Budget Code'] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.Status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.Status === 'INACTIVE',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
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
            <!-- Level -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Level:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.lbc_level_filter"
                  type="select"
                  :options="levelOptions"
                  placeholder="Select Level"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.lbc_level_filter"
                  type="button"
                  @click="smartFilter.lbc_level_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Budget Code -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Budget Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.lbc_budget_code_filter"
                  type="text"
                  placeholder="Enter Budget Code"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.lbc_description_filter"
                  type="text"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.lbc_status_filter"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.lbc_status_filter"
                  type="button"
                  @click="smartFilter.lbc_status_filter = ''"
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

    <!-- Add/Edit Budget Code Modal -->
    <rs-modal
      v-model="showBudgetCodeModal"
      title="Budget Code"
      size="lg"
      dialog-class="budget-code-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg budget-code-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Budget Code' : (isEditMode ? 'Edit Budget Code' : 'Add Budget Code') }}
          </h4>
          <Icon
            @click="handleCancelBudgetCode"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveBudgetCode">
          <div class="space-y-2 py-2">
            <!-- Level -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Level<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_level"
                  type="select"
                  :options="levelOptions"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Select Level"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Budget Code -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Budget Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_budget_code"
                  type="text"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Enter Budget Code"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_description"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="budgetCodeForm.lbc_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="budgetCodeForm.lbc_status && !isViewMode"
                  type="button"
                  @click="budgetCodeForm.lbc_status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelBudgetCode">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveBudgetCode">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-code-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Budget Code modal - 75% of lg size (800px * 0.75 = 600px) */
.budget-code-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.budget-code-modal-custom .modal-header > :last-child:not(.budget-code-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.budget-code-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.budget-code-modal-custom .budget-code-modal-header {
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
