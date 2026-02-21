<script setup>
import { useMessageLog } from "~/composables/useMessageLog";

definePageMeta({
  title: "Message List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Messagemanagement",
    "path": "/messagemanagement"
  },
  {
    "name": "Messagelist",
    "path": "/messagemanagement/messagelist"
  },
  {
    "name": "Message List",
    "path": "/messagemanagement/messagelist/messagelist"
  }
],
});

const { $swal } = useNuxtApp();

const pageNameForLog = "Message List";
const moduleNameForLog = "Messagelist";
const pageBreadcrumbTextForLog = "Messagemanagement > Messagelist > Message List";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName: pageNameForLog,
  moduleName: moduleNameForLog,
  pageBreadcrumbText: pageBreadcrumbTextForLog,
});

// Table data
const messagelistList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showMessagelistModal = ref(false);
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
const smartFilterLabels = {"Type_filter":"Type","Module_filter":"Module","PageName_filter":"Page Name"};
const smartFilterOptionsMap = {"Type_filter":"TypeOptions","Module_filter":"ModuleOptions","PageName_filter":"PageNameOptions"};

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
// No top filter labels
// No top filter options mapping

// Form data
const messagelistForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const TypeOptions = ref([]);
const ModuleOptions = ref([]);
const PageNameOptions = ref([]);

// Fetch dropdown options function (independent dropdowns)
const fetchDropdownOptions = async () => {
  try {
    // Fetch Type options
    const { data: TypeData } = await useFetch("/api/page-generated/2983/lookups/Type", {
      method: "GET",
      initialCache: false,
    });
    if (TypeData.value?.statusCode === 200 && TypeData.value?.data) {
      TypeOptions.value = TypeData.value.data.map((item) => ({
        label: item.label || item.label || item.lde_description || "",
        value: item.value || item.value || item.lde_value || "",
      }));
    }

    // Fetch Module options
    const { data: ModuleData } = await useFetch("/api/page-generated/2983/lookups/Module", {
      method: "GET",
      initialCache: false,
    });
    if (ModuleData.value?.statusCode === 200 && ModuleData.value?.data) {
      ModuleOptions.value = ModuleData.value.data.map((item) => ({
        label: item.label || item.label || item.ml_module_name || "",
        value: item.value || item.value || item.ml_module_name || "",
      }));
    }

    // Fetch PageName options
    const { data: PageNameData } = await useFetch("/api/page-generated/2983/lookups/PageName", {
      method: "GET",
      initialCache: false,
    });
    if (PageNameData.value?.statusCode === 200 && PageNameData.value?.data) {
      PageNameOptions.value = PageNameData.value.data.map((item) => ({
        label: item.label || item.label || item.ml_page_name || "",
        value: item.value || item.value || item.ml_page_name || "",
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


    const { data: data0 } = await useFetch("/api/message-management/message-list", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      messagelistList.value = (data0.value.data || []).map((item, idx) => {
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
const filteredMessagelistList = ref([...messagelistList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...messagelistList.value];

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
  const dropdownFilterFields = ["Type","Module","Page_Name","PageName"];
  
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
  filteredMessagelistList.value = [];
  nextTick(() => {
    filteredMessagelistList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredMessagelistList.value.length);

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

// Datatable features (Save/Load Template, Ungroup/Group, Generate API, Download PDF/CSV)
const {
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
} = useDatatableFeatures({
  pageName: "Message List",
  apiDataPath: "/api/message-management/message-list",
  defaultExportColumns: ["Code", "Type", "Page Name", "Bread Crumb", "Module", "Message", "Respond", "Date"],
  getFilteredList: () => filteredMessagelistList.value,
  datatableRef,
  searchKeyword,
  smartFilter,
  topFilter,
  applyFilters,
  getLookupLabel,
  columnOptionsLookup: { Type: TypeOptions, "Page Name": PageNameOptions, Module: ModuleOptions },
  columnDateTypeMap: { Date: "date" },
  smartFilterLabels: { Type_filter: "Type", Module_filter: "Module", PageName_filter: "Page Name" },
  smartFilterOptionsLookup: { Type_filter: TypeOptions, Module_filter: ModuleOptions, PageName_filter: PageNameOptions },
});

// Download Excel function
const handleDownloadExcel = async () => {
  try {
    // Import ExcelJS dynamically for better styling support
    const ExcelJS = await import('exceljs');
    
    // Get current filtered data
    let dataToExport = [...filteredMessagelistList.value];
    
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
    worksheetData.push(["Message List"]);
    
    // Add search keyword if any
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      worksheetData.push([`Search: ${searchKeyword.value.trim()}`]);
    }
    
    // Build smart filter options lookup for dropdown/radio/checkbox/listbox filter fields
    const smartFilterOptionsLookup = {};
    if (typeof TypeOptions !== 'undefined') smartFilterOptionsLookup["Type_filter"] = TypeOptions.value;
    if (typeof ModuleOptions !== 'undefined') smartFilterOptionsLookup["Module_filter"] = ModuleOptions.value;
    if (typeof PageNameOptions !== 'undefined') smartFilterOptionsLookup["PageName_filter"] = PageNameOptions.value;
    
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
    const exportColumns = ["Code","Type","Page Name","Bread Crumb","Module","Message","Respond","Date"];
    const columnToOptionsMap = {"Type":"TypeOptions","Page Name":"PageNameOptions","Module":"ModuleOptions"};
    const columnDateTypeMap = {"Date":"date"};
    worksheetData.push(['No.', ...exportColumns]);
    
    // Build options lookup object for dropdown/radio/checkbox/listbox columns
    const columnOptionsLookup = {};
    columnOptionsLookup["Type"] = TypeOptions.value;
    columnOptionsLookup["Page Name"] = PageNameOptions.value;
    columnOptionsLookup["Module"] = ModuleOptions.value;
    
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
    const worksheet = workbook.addWorksheet("Message List");
    
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
    const fileName = `Message_List_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  messagelistForm.value = { ...item };
  
  showMessagelistModal.value = true;
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
  const formFields = ["id","Code","Type","Page_Name","Bread_Crumb","Module","Message","Respond","Date"];
  messagelistForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      messagelistForm.value[fieldName] = item[fieldName];
    }
  });
  showMessagelistModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  messagelistForm.value = {};
  
  showMessagelistModal.value = true;
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
      const apiPath = "/api/message-management/message-list";
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
const handleSaveMessagelist = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/message-management/message-list";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: messagelistForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: messagelistForm.value,
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
      showMessagelistModal.value = false;
      messagelistForm.value = {};
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
const handleCancelMessagelist = () => {
  showMessagelistModal.value = false;
  isViewMode.value = false;
  messagelistForm.value = {};
};



// Initialize on mount
onMounted(() => {
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
          <div class="text-lg font-semibold">List of Message</div>
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="messagelist_pageSize">Display:</label>
              <FormKit
                id="messagelist_pageSize"
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="messagelist_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="messagelist_searchKeyword"
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
          <div class="messagelist-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`messagelist-table`"
              :data="filteredMessagelistList"
              :field='["no","Code","Type","Page Name","Bread Crumb","Module","Message","Respond","Date","Action"]'
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
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="isGrouped"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                {{ data.value.Code }}
              </template>
              <template v-slot:Type="data">
                {{ getLookupLabel(TypeOptions, data.value.Type) }}
              </template>
              <template v-slot:PageName="data">
                {{ getLookupLabel(PageNameOptions, data.value["Page Name"]) }}
              </template>
              <template v-slot:BreadCrumb="data">
                {{ data.value["Bread Crumb"] }}
              </template>
              <template v-slot:Module="data">
                {{ getLookupLabel(ModuleOptions, data.value.Module) }}
              </template>
              <template v-slot:Message="data">
                {{ data.value.Message }}
              </template>
              <template v-slot:Respond="data">
                {{ data.value.Respond }}
              </template>
              <template v-slot:Date="data">
                {{ formatDate(data.value.Date) }}
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
              
            </div>
          </div>
        </div>
      </template>
    </rs-card>

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
              <label class="w-32 text-sm font-medium" for="smartFilter_Type">Type:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Type"
                  v-model="smartFilter.Type_filter"
                  type="select"
                  :options="TypeOptions"
                  placeholder="Select Type"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Type_filter"
                  type="button"
                  @click="smartFilter.Type_filter = ''"
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
              <label class="w-32 text-sm font-medium" for="smartFilter_Module">Module:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Module"
                  v-model="smartFilter.Module_filter"
                  type="select"
                  :options="ModuleOptions"
                  placeholder="Select Module"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Module_filter"
                  type="button"
                  @click="smartFilter.Module_filter = ''"
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
              <label class="w-32 text-sm font-medium" for="smartFilter_PageName">Page Name:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_PageName"
                  v-model="smartFilter.PageName_filter"
                  type="select"
                  :options="PageNameOptions"
                  placeholder="Select Page Name"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.PageName_filter"
                  type="button"
                  @click="smartFilter.PageName_filter = ''"
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
      v-model="showMessagelistModal"
      title="List of Message"
      size="lg"
      dialog-class="messagelist-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg messagelist-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View List of Message' : (isEditMode ? 'Edit List of Message' : 'Add List of Message') }}
          </h4>
          <Icon
            @click="handleCancelMessagelist"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveMessagelist">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_mm_mesg_code">mm_mesg_code:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_mm_mesg_code"
                  v-model="messagelistForm.mm_mesg_code"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter mm_mesg_code"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_mm_mesg_type">mm_mesg_type:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_mm_mesg_type"
                  v-model="messagelistForm.mm_mesg_type"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter mm_mesg_type"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_ml_page_name">ml_page_name:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_ml_page_name"
                  v-model="messagelistForm.ml_page_name"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ml_page_name"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_ml_page_breadcrumb">ml_page_breadcrumb:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_ml_page_breadcrumb"
                  v-model="messagelistForm.ml_page_breadcrumb"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ml_page_breadcrumb"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_ml_module_name">ml_module_name:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_ml_module_name"
                  v-model="messagelistForm.ml_module_name"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ml_module_name"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_ml_mesg_desc">ml_mesg_desc:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_ml_mesg_desc"
                  v-model="messagelistForm.ml_mesg_desc"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ml_mesg_desc"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_ml_user_action">ml_user_action:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_ml_user_action"
                  v-model="messagelistForm.ml_user_action"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter ml_user_action"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagelistForm_createddate">createddate:</label>
              <div class="flex-1">
                <FormKit
                  id="messagelistForm_createddate"
                  v-model="messagelistForm.createddate"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter createddate"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelMessagelist">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveMessagelist">
            Save
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
.messagelist-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.messagelist-table-wrapper :deep(.rs-table thead th:last-child),
.messagelist-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for List of Message modal - 75% of lg size (800px * 0.75 = 600px) */
.messagelist-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.messagelist-modal-custom .modal-header > :last-child:not(.messagelist-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.messagelist-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.messagelist-modal-custom .messagelist-modal-header {
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

/* Ensure Smart Filter modal header matches List of Message modal styling */
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