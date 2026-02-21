<script setup>
definePageMeta({
  title: "Purchase Order List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Purchasing",
      path: "/purchasing",
    },
    {
      name: "Purchase Order",
      path: "/purchasing/purchase-order",
    },
    {
      name: "Purchase Order List",
      path: "/purchasing/purchase-order/list",
    },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Purchase Order List";
const moduleName = "Purchasing";
const pageBreadcrumbText = "Dashboard > Purchasing > Purchase Order > Purchase Order List";
const { logDeleteConfirmationPrompt, updateMessageLogAction } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Table data
const purchaseOrderList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Smart Filter values
const smartFilter = ref({
  Status: "",
  DateFrom: "",
  DateTo: "",
  Cancellation: "",
  VenName: "",
  Description: "",
  PoNo: "",
});

// Store original filter values for reset
const originalFilter = ref({
  Status: "",
  DateFrom: "",
  DateTo: "",
  Cancellation: "",
  VenName: "",
  Description: "",
  PoNo: "",
});

// PO Status options - will be fetched from API
const poStatusOptions = ref([]);

// Fetch PO Status options
const fetchPOStatusOptions = async () => {
  try {
    const response = await useFetch("/api/purchasing/status-po-pr/po-status-options", {
      initialCache: false,
    });
    if (response.data.value?.statusCode === 200) {
      poStatusOptions.value = response.data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching PO status options:", error);
  }
};

// Filtered data - using ref instead of computed for better reactivity
const filteredPurchaseOrderList = ref([...purchaseOrderList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...purchaseOrderList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const poNo = (item["Purchase Order No"] || "").toString().toLowerCase();
      const description = (item.Description || "").toString().toLowerCase();
      const ptj = (item.PTJ || "").toString().toLowerCase();
      const vendorCode = (item["Vendor Code"] || "").toString().toLowerCase();
      const vendorName = (item["Vendor Name"] || "").toString().toLowerCase();
      const amount = (item.Amount || "").toString().toLowerCase();
      const status = (item.Status || "").toString().toLowerCase();
      const prlNo = (item["PRL No."] || "").toString().toLowerCase();

      return (
        poNo.includes(keyword) ||
        description.includes(keyword) ||
        ptj.includes(keyword) ||
        vendorCode.includes(keyword) ||
        vendorName.includes(keyword) ||
        amount.includes(keyword) ||
        status.includes(keyword) ||
        prlNo.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.Status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.Status);
  }

  if (smartFilter.value.DateFrom) {
    const [day, month, year] = smartFilter.value.DateFrom.split('/');
    const filterDate = new Date(`${year}-${month}-${day}`);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item["Update/Create Date"] || item.createddate);
      return itemDate >= filterDate;
    });
  }

  if (smartFilter.value.DateTo) {
    const [day, month, year] = smartFilter.value.DateTo.split('/');
    const filterDate = new Date(`${year}-${month}-${day} 23:59:59`);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item["Update/Create Date"] || item.createddate);
      return itemDate <= filterDate;
    });
  }

  if (smartFilter.value.Cancellation) {
    const filterTerm = smartFilter.value.Cancellation.toLowerCase();
    filtered = filtered.filter((item) => {
      // This would need to come from vendor data if available
      return true; // Placeholder
    });
  }

  if (smartFilter.value.VenName) {
    const filterTerm = smartFilter.value.VenName.toLowerCase();
    filtered = filtered.filter((item) => {
      const vendorName = (item["Vendor Name"] || "").toLowerCase();
      return vendorName.includes(filterTerm);
    });
  }

  if (smartFilter.value.Description) {
    const filterTerm = smartFilter.value.Description.toLowerCase();
    filtered = filtered.filter((item) => {
      const description = (item.Description || "").toLowerCase();
      return description.includes(filterTerm);
    });
  }

  if (smartFilter.value.PoNo) {
    filtered = filtered.filter((item) => item["Purchase Order No"] === smartFilter.value.PoNo);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredPurchaseOrderList.value = [];
  nextTick(() => {
    filteredPurchaseOrderList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredPurchaseOrderList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Format currency
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch purchase orders from API
const fetchPurchaseOrders = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
      smartFilter_DateFrom: smartFilter.value.DateFrom || undefined,
      smartFilter_DateTo: smartFilter.value.DateTo || undefined,
      smartFilter_Cancellation: smartFilter.value.Cancellation || undefined,
      smartFilter_VenName: smartFilter.value.VenName || undefined,
      smartFilter_Description: smartFilter.value.Description || undefined,
      smartFilter_PoNo: smartFilter.value.PoNo || undefined,
    };

    const { data } = await useFetch("/api/purchasing/purchase-order/list", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      purchaseOrderList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Purchase Order No": item.pom_order_no || '',
        Description: item.pom_description || '',
        PTJ: item.oun_code || '',
        "Vendor Code": item.vcs_vendor_code || '',
        "Vendor Name": item.vcs_vendor_name || '',
        Amount: item.pom_order_amt_rm || 0,
        Status: item.pom_order_status || '',
        "PRL No.": item.prlno || '',
        "Update/Create Date": item.createddate || '',
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        pom_order_id: item.pom_order_id,
        pom_order_status: item.pom_order_status,
        urlEdit: item.urlEdit,
        was_notes: item.was_notes || '',
        createddate: item.createddate,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch purchase orders",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching purchase orders",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchPOStatusOptions();
  fetchPurchaseOrders();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
    DateFrom: smartFilter.value.DateFrom,
    DateTo: smartFilter.value.DateTo,
    Cancellation: smartFilter.value.Cancellation,
    VenName: smartFilter.value.VenName,
    Description: smartFilter.value.Description,
    PoNo: smartFilter.value.PoNo,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
    DateFrom: "",
    DateTo: "",
    Cancellation: "",
    VenName: "",
    Description: "",
    PoNo: "",
  };
  originalFilter.value = {
    Status: "",
    DateFrom: "",
    DateTo: "",
    Cancellation: "",
    VenName: "",
    Description: "",
    PoNo: "",
  };
  fetchPurchaseOrders();
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchPurchaseOrders();
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
    DateFrom: originalFilter.value.DateFrom,
    DateTo: originalFilter.value.DateTo,
    Cancellation: originalFilter.value.Cancellation,
    VenName: originalFilter.value.VenName,
    Description: originalFilter.value.Description,
    PoNo: originalFilter.value.PoNo,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = async (item) => {
  if (!item.pom_order_id) {
    $swal.fire({
      title: "Error",
      text: "Purchase Order ID is missing",
      icon: "error",
    });
    return;
  }
  
  try {
    // Store ID and mode in sessionStorage (not exposing in URL)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('po_form_id', item.pom_order_id.toString());
      sessionStorage.setItem('po_form_mode', 'view');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-order/new');
  } catch (error) {
    console.error("Error navigating to view:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to navigate to view page",
      icon: "error",
    });
  }
};

// Edit function
const handleEdit = async (item) => {
  if (!item.pom_order_id) {
    $swal.fire({
      title: "Error",
      text: "Purchase Order ID is missing",
      icon: "error",
    });
    return;
  }
  
  const status = item.pom_order_status;
  if (status === 'APPROVE' || status === 'CANCEL PARTIAL' || status === 'CANCEL' || status === 'PARTIAL' || status === 'COMPLETE') {
    $swal.fire({
      title: "Cannot Edit",
      text: "This purchase order cannot be edited in its current status",
      icon: "warning",
    });
    return;
  }
  
  try {
    // Store ID and mode in sessionStorage (not exposing in URL)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('po_form_id', item.pom_order_id.toString());
      sessionStorage.setItem('po_form_mode', 'edit');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-order/new');
  } catch (error) {
    console.error("Error navigating to edit:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to navigate to edit page",
      icon: "error",
    });
  }
};

// Delete function
const handleDelete = async (item) => {
  if (item.pom_order_status !== 'DRAFT') {
    $swal.fire({
      title: "Cannot Delete",
      text: "Only DRAFT purchase orders can be deleted",
      icon: "warning",
    });
    return;
  }

  const messageText = `Are you sure? Do you want to delete purchase order "${item["Purchase Order No"]}"?`;
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete purchase order "${item["Purchase Order No"]}"?`,
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
      // TODO: Implement delete API
      $swal.fire({
        title: "Deleted!",
        text: "Purchase order has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchPurchaseOrders();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting purchase order",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
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
  pageName: "Purchase Order List",
  apiDataPath: "/api/purchasing/purchase-order/list",
  defaultExportColumns: ["Purchase Order No", "Description", "PTJ", "Vendor Name", "Amount", "Status"],
  getFilteredList: () => filteredPurchaseOrderList.value,
  datatableRef,
  searchKeyword,
  smartFilter,
  applyFilters,
});

// Add function
const handleAdd = () => {
  try {
    // Clear any existing session storage for new entry
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('po_form_id');
      sessionStorage.setItem('po_form_mode', 'add');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-order/new');
  } catch (error) {
    console.error("Error navigating to add:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to navigate to new page",
      icon: "error",
    });
  }
};
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

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Purchase Order</div>
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
          <div class="purchase-order-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`purchase-order-table`"
              :data="filteredPurchaseOrderList"
              :field="['no', 'Purchase Order No', 'Description', 'PTJ', 'Vendor Code', 'Vendor Name', 'Amount', 'Status', 'PRL No.', 'Action']"
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
              <template v-slot:PurchaseOrderNo="data">
                {{ data.value['Purchase Order No'] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
              </template>
              <template v-slot:VendorCode="data">
                {{ data.value['Vendor Code'] }}
              </template>
              <template v-slot:VendorName="data">
                {{ data.value['Vendor Name'] }}
              </template>
              <template v-slot:Amount="data">
                <div class="text-right">
                  {{ toCurrency(data.value.Amount) }}
                </div>
              </template>
              <template v-slot:Status="data">
                <div 
                  v-if="data.value.pom_order_status !== 'ENTRY' && data.value.was_notes"
                  class="w-100"
                  :title="data.value.was_notes"
                >
                  {{ data.value.Status }}
                </div>
                <div v-else>
                  {{ data.value.Status }}
                </div>
              </template>
              <template v-slot:PRLNo="data">
                {{ data.value['PRL No.'] }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    v-if="data.value.pom_order_status === 'APPROVE' || data.value.pom_order_status === 'CANCEL PARTIAL' || data.value.pom_order_status === 'CANCEL' || data.value.pom_order_status === 'PARTIAL' || data.value.pom_order_status === 'COMPLETE'"
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
                    v-else
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
                    v-if="data.value.pom_order_status !== 'APPROVE' && data.value.pom_order_status !== 'CANCEL PARTIAL' && data.value.pom_order_status !== 'CANCEL' && data.value.pom_order_status !== 'PARTIAL' && data.value.pom_order_status !== 'COMPLETE'"
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
                    v-if="data.value.pom_order_status === 'DRAFT'"
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
            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.Status"
                  type="select"
                  :options="poStatusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Status"
                  type="button"
                  @click="smartFilter.Status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Date From -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Date From:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.DateFrom"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Date To -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Date To:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.DateTo"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Cancellation -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Cancellation:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.Cancellation"
                  type="text"
                  placeholder="Enter Cancellation"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Vendor Name -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Vendor Name:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.VenName"
                  type="text"
                  placeholder="Enter Vendor Name"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.Description"
                  type="text"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- PO No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PO No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.PoNo"
                  type="text"
                  placeholder="Enter PO No"
                  outer-class="mb-0"
                />
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
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.purchase-order-table-wrapper :deep(.table-header) {
  display: none;
}

.purchase-order-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
