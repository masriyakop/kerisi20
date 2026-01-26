<script setup>
definePageMeta({
  title: "Fund Type",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Setup",
      path: "/setup",
    },
    {
      name: "GL Structure Setup",
      path: "/glstructure",
    },
    {
      name: "Fund Type",
      path: "/fundtype",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const fundTypeList = ref([]);
const loading = ref(false);

// Table reference to access sort state
const tableRef = ref(null);

// Track current sort state
const currentSortColumn = ref(null);
const currentSortDirection = ref('asc');

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit Fund Type modal state
const showFundTypeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({
  fundType: "",
  typeBasis: "",
  status: "",
});

// Smart Filter options
const fundTypeOptions = ref([
  { label: "E01 - Zakat", value: "E01 - Zakat" },
  { label: "E02 - WAKAF", value: "E02 - WAKAF" },
  { label: "E03 - sumber AM", value: "E03 - sumber AM" },
  { label: "E04 - AMILIN", value: "E04 - AMILIN" },
]);

const typeBasisOptions = ref([
  { label: "Allocation Basis", value: "Allocation Basis" },
  { label: "CASH Basis", value: "CASH Basis" },
]);

const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Fund Type form data
const fundTypeForm = ref({
  fundType: "",
  descriptionMalay: "",
  descriptionEnglish: "",
  typeBasis: "",
  remark: "",
  status: "ACTIVE",
});

// Store original filter values for reset
const originalFilter = ref({
  fundType: "",
  typeBasis: "",
  status: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredFundTypeList = ref([...fundTypeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...fundTypeList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      // Search in all relevant fields (excluding 'no' and 'action')
      const fundType = (item.fundType || "").toLowerCase();
      const descriptionMalay = (item.descriptionMalay || "").toLowerCase();
      const descriptionEnglish = (item.descriptionEnglish || "").toLowerCase();
      const typeBasis = (item.typeBasis || "").toLowerCase();
      const status = (item.status || "").toLowerCase();
      const remark = (item.remark || "").toLowerCase();

      // Check if keyword exists in any of the searchable fields
      return (
        fundType.includes(keyword) ||
        descriptionMalay.includes(keyword) ||
        descriptionEnglish.includes(keyword) ||
        typeBasis.includes(keyword) ||
        status.includes(keyword) ||
        remark.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.fundType) {
    // Extract fund type code (e.g., "E01" from "E01 - Zakat")
    const fundTypeCode = smartFilter.value.fundType.split(" - ")[0];
    filtered = filtered.filter((item) => {
      // Match by fund type code (E01, E02, etc.)
      return item.fundType === fundTypeCode || item.fundType.startsWith(fundTypeCode);
    });
  }

  if (smartFilter.value.typeBasis) {
    filtered = filtered.filter((item) => {
      const itemBasis = item.typeBasis.toUpperCase();
      const filterBasis = smartFilter.value.typeBasis.toUpperCase();
      return itemBasis.includes(filterBasis) || filterBasis.includes(itemBasis);
    });
  }

  if (smartFilter.value.status) {
    filtered = filtered.filter((item) => item.status === smartFilter.value.status);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredFundTypeList.value = [];
  nextTick(() => {
    filteredFundTypeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredFundTypeList.value.length);


// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch fund types from API
const fetchFundTypes = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/fundtype", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Normalize status to ACTIVE/INACTIVE to avoid raw numeric values
      fundTypeList.value = (data.value.data || []).map((item) => ({
        ...item,
        status:
          item?.status && (String(item.status).trim() === "1" || item.status === 1)
            ? "ACTIVE"
            : "INACTIVE",
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch fund types",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching fund types:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching fund types",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchFundTypes();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  // Store current filter values
  originalFilter.value = {
    fundType: smartFilter.value.fundType,
    typeBasis: smartFilter.value.typeBasis,
    status: smartFilter.value.status,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    fundType: "",
    typeBasis: "",
    status: "",
  };
  originalFilter.value = {
    fundType: "",
    typeBasis: "",
    status: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  // Restore original filter values
  smartFilter.value = {
    fundType: originalFilter.value.fundType,
    typeBasis: originalFilter.value.typeBasis,
    status: originalFilter.value.status,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.fty_fund_id;
  fundTypeForm.value = {
    fundType: item.fundType,
    descriptionMalay: item.descriptionMalay,
    descriptionEnglish: item.descriptionEnglish || "",
    typeBasis: item.typeBasis,
    remark: item.remark || "",
    status: item.status,
  };
  showFundTypeModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.fty_fund_id;
  fundTypeForm.value = {
    fundType: item.fundType,
    descriptionMalay: item.descriptionMalay,
    descriptionEnglish: item.descriptionEnglish || "",
    typeBasis: item.typeBasis,
    remark: item.remark || "",
    status: item.status,
  };
  showFundTypeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  fundTypeForm.value = {
    fundType: "",
    descriptionMalay: "",
    descriptionEnglish: "",
    typeBasis: "",
    remark: "",
    status: "ACTIVE",
  };
  showFundTypeModal.value = true;
};

// Save Fund Type
const handleSaveFundType = async () => {
  // Validation
  if (
    !fundTypeForm.value.fundType ||
    !fundTypeForm.value.descriptionMalay ||
    !fundTypeForm.value.typeBasis ||
    !fundTypeForm.value.status
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
      response = await useFetch(`/api/fundtype/${editingId.value}`, {
        method: "PUT",
        body: fundTypeForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/fundtype", {
        method: "POST",
        body: fundTypeForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Fund type updated successfully" : "Fund type created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchFundTypes();
      
      // Reset form and close modal
      showFundTypeModal.value = false;
      fundTypeForm.value = {
        fundType: "",
        descriptionMalay: "",
        descriptionEnglish: "",
        typeBasis: "",
        remark: "",
        status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save fund type",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving fund type:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving fund type",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Fund Type form
const handleCancelFundType = () => {
  showFundTypeModal.value = false;
  isViewMode.value = false;
  fundTypeForm.value = {
    fundType: "",
    descriptionMalay: "",
    descriptionEnglish: "",
    typeBasis: "",
    remark: "",
    status: "ACTIVE",
  };
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete fund type "${item.fundType}"?`,
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
      const response = await useFetch(`/api/fundtype/${item.fty_fund_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Fund type has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchFundTypes();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete fund type",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting fund type:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting fund type",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
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
    let dataToExport = [...filteredFundTypeList.value];
    
    // Apply current sort from table if available
    if (tableRef.value && tableRef.value.currentSort !== undefined && tableRef.value.currentSort !== null) {
      const sortIndex = tableRef.value.currentSort;
      const sortDir = tableRef.value.currentSortDir || 'asc';
      const columnTitles = tableRef.value.columnTitle || [];
      
      if (columnTitles.length > 0 && sortIndex >= 0 && sortIndex < columnTitles.length) {
        const columnTitle = columnTitles[sortIndex];
        
        // Skip sorting for 'No' and 'Action' columns
        if (columnTitle && columnTitle !== 'no' && columnTitle !== 'No' && columnTitle !== 'action' && columnTitle !== 'Action') {
          // The columnTitle from table is already in camelCase (from Object.keys or field prop)
          // So we can use it directly to access the data
          const fieldName = columnTitle;
          
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
    
    // Add title in the center
    // Adjust title Y position based on logo height
    const title = "List of Fund Type";
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
      (item.fundType || '').toUpperCase(),
      (item.descriptionMalay || '').toUpperCase(),
      (item.typeBasis || '').toUpperCase(),
      (item.status || '').toUpperCase(),
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['No.', 'Fund Type', 'Description', 'Type Basis', 'Status']],
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
        1: { cellWidth: 25 }, // Fund Type
        2: { cellWidth: 60 }, // Description
        3: { cellWidth: 50 }, // Type Basis
        4: { cellWidth: 30 }, // Status
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Save PDF
    const fileName = `Fund_Type_List_${new Date().toISOString().split('T')[0]}.pdf`;
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
  $swal.fire({
    title: "Info",
    text: "CSV download functionality will be implemented",
    icon: "info",
  });
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Fund Type</div>
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
          <div class="fund-type-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="tableRef"
              :key="`fund-type-table-${searchKeyword || 'all'}`"
              :data="filteredFundTypeList"
              :field="['no', 'fundType', 'descriptionMalay', 'descriptionEnglish', 'typeBasis', 'status', 'remark', 'action']"
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
              <template v-slot:fundType="data">
                {{ data.value.fundType }}
              </template>
              <template v-slot:descriptionMalay="data">
                {{ data.value.descriptionMalay }}
              </template>
              <template v-slot:descriptionEnglish="data">
                {{ data.value.descriptionEnglish }}
              </template>
              <template v-slot:typeBasis="data">
                {{ data.value.typeBasis }}
              </template>
              <template v-slot:status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.status === 'INACTIVE',
                  }"
                >
                  {{ data.value.status }}
                </span>
              </template>
              <template v-slot:action="data">
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
            <!-- Fund Type -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Fund Type:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.fundType"
                  type="select"
                  :options="fundTypeOptions"
                  placeholder="Select Fund Type"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.fundType"
                  type="button"
                  @click="smartFilter.fundType = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Type Basis -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Type Basis:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.typeBasis"
                  type="select"
                  :options="typeBasisOptions"
                  placeholder="Select Type Basis"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.typeBasis"
                  type="button"
                  @click="smartFilter.typeBasis = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.status"
                  type="button"
                  @click="smartFilter.status = ''"
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

    <!-- Add/Edit Fund Type Modal -->
    <rs-modal
      v-model="showFundTypeModal"
      title="Fund Type"
      size="lg"
      dialog-class="fund-type-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg fund-type-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Fund Type' : (isEditMode ? 'Edit Fund Type' : 'Add Fund Type') }}
          </h4>
          <Icon
            @click="handleCancelFundType"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveFundType">
          <div class="space-y-2 py-2">
            <!-- Fund Type -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Fund Type<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="fundTypeForm.fundType"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description (Malay) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="fundTypeForm.descriptionMalay"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description (English) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="fundTypeForm.descriptionEnglish"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Type Basis -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Type Basis<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="fundTypeForm.typeBasis"
                  type="select"
                  :options="typeBasisOptions"
                  placeholder="Select Type Basis"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="fundTypeForm.typeBasis && !isViewMode"
                  type="button"
                  @click="fundTypeForm.typeBasis = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Remark -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Remark:</label>
              <div class="flex-1">
                <FormKit
                  v-model="fundTypeForm.remark"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="fundTypeForm.status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="fundTypeForm.status && !isViewMode"
                  type="button"
                  @click="fundTypeForm.status = ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancelFundType">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveFundType">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.fund-type-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Fund Type modal - 75% of lg size (800px * 0.75 = 600px) */
.fund-type-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.fund-type-modal-custom .modal-header > :last-child:not(.fund-type-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.fund-type-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.fund-type-modal-custom .fund-type-modal-header {
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

/* Ensure Smart Filter modal header matches Fund Type modal styling */
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

