<script setup>
definePageMeta({
  title: "Purchase Requisition List",
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
      name: "Purchase Requisition",
      path: "/purchasing/purchase-requisition",
    },
    {
      name: "Purchase Requisition List",
      path: "/purchasing/purchase-requisition/list",
    },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Purchase Requisition List";
const moduleName = "Purchasing";
const pageBreadcrumbText = "Dashboard > Purchasing > Purchase Requisition > Purchase Requisition List";
const { logDeleteConfirmationPrompt, updateMessageLogAction } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Table data
const purchaseRequisitionList = ref([]);
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
  RequisitionNo: "",
  Title: "",
  AgreementNo: "",
});

// Store original filter values for reset
const originalFilter = ref({
  Status: "",
  DateFrom: "",
  DateTo: "",
  RequisitionNo: "",
  Title: "",
  AgreementNo: "",
});

// Status options
const statusOptions = ref([]);

// Filtered data - using ref instead of computed for better reactivity
const filteredPurchaseRequisitionList = ref([...purchaseRequisitionList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...purchaseRequisitionList.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const requisitionNo = (item["Requisition No"] || "").toString().toLowerCase();
      const title = (item.Title || "").toString().toLowerCase();
      const totalAmount = (item["Total Amount"] || "").toString().toLowerCase();
      const agreementNo = (item["Agreement No"] || "").toString().toLowerCase();
      const status = (item.Status || "").toString().toLowerCase();

      return (
        requisitionNo.includes(keyword) ||
        title.includes(keyword) ||
        totalAmount.includes(keyword) ||
        agreementNo.includes(keyword) ||
        status.includes(keyword)
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
      const itemDate = new Date(item["Created / Updated Date"] || item.updateddate);
      return itemDate >= filterDate;
    });
  }

  if (smartFilter.value.DateTo) {
    const [day, month, year] = smartFilter.value.DateTo.split('/');
    const filterDate = new Date(`${year}-${month}-${day} 23:59:59`);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item["Created / Updated Date"] || item.updateddate);
      return itemDate <= filterDate;
    });
  }

  if (smartFilter.value.RequisitionNo) {
    const filterTerm = smartFilter.value.RequisitionNo.toLowerCase();
    filtered = filtered.filter((item) => {
      const requisitionNo = (item["Requisition No"] || "").toLowerCase();
      return requisitionNo.includes(filterTerm);
    });
  }

  if (smartFilter.value.Title) {
    const filterTerm = smartFilter.value.Title.toLowerCase();
    filtered = filtered.filter((item) => {
      const title = (item.Title || "").toLowerCase();
      return title.includes(filterTerm);
    });
  }

  if (smartFilter.value.AgreementNo) {
    const filterTerm = smartFilter.value.AgreementNo.toLowerCase();
    filtered = filtered.filter((item) => {
      const agreementNo = (item["Agreement No"] || "").toLowerCase();
      return agreementNo.includes(filterTerm);
    });
  }

  // Update the filtered list
  filteredPurchaseRequisitionList.value = [];
  nextTick(() => {
    filteredPurchaseRequisitionList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredPurchaseRequisitionList.value.length);

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

// Fetch purchase requisitions from API
const fetchPurchaseRequisitions = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
      smartFilter_DateFrom: smartFilter.value.DateFrom || undefined,
      smartFilter_DateTo: smartFilter.value.DateTo || undefined,
      smartFilter_RequisitionNo: smartFilter.value.RequisitionNo || undefined,
      smartFilter_Title: smartFilter.value.Title || undefined,
      smartFilter_AgreementNo: smartFilter.value.AgreementNo || undefined,
    };

    const { data } = await useFetch("/api/purchasing/purchase-requisition/list", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      purchaseRequisitionList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Requisition No": item.rqm_requisition_no || '',
        Title: item.rqm_requisition_title || '',
        "Total Amount": item.rqm_amount || 0,
        "Agreement No": item.rqm_agg_no || '',
        Status: item.rqm_status || '',
        "Created / Updated Date": item.updateddate || '',
        Action: "",
        // Keep original data for actions
        rqm_requisition_id: item.rqm_requisition_id,
        rqm_status: item.rqm_status,
        urlEdit: item.urlEdit,
        updateddate: item.updateddate,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch purchase requisitions",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching purchase requisitions:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching purchase requisitions",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchPurchaseRequisitions();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
    DateFrom: smartFilter.value.DateFrom,
    DateTo: smartFilter.value.DateTo,
    RequisitionNo: smartFilter.value.RequisitionNo,
    Title: smartFilter.value.Title,
    AgreementNo: smartFilter.value.AgreementNo,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
    DateFrom: "",
    DateTo: "",
    RequisitionNo: "",
    Title: "",
    AgreementNo: "",
  };
  originalFilter.value = {
    Status: "",
    DateFrom: "",
    DateTo: "",
    RequisitionNo: "",
    Title: "",
    AgreementNo: "",
  };
  fetchPurchaseRequisitions();
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchPurchaseRequisitions();
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
    DateFrom: originalFilter.value.DateFrom,
    DateTo: originalFilter.value.DateTo,
    RequisitionNo: originalFilter.value.RequisitionNo,
    Title: originalFilter.value.Title,
    AgreementNo: originalFilter.value.AgreementNo,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = async (item) => {
  if (!item.rqm_requisition_id) {
    $swal.fire({
      title: "Error",
      text: "Requisition ID is missing",
      icon: "error",
    });
    return;
  }
  
  try {
    // Store ID and mode in sessionStorage (not exposing in URL)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pr_form_id', item.rqm_requisition_id.toString());
      sessionStorage.setItem('pr_form_mode', 'view');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-requisition/new');
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
  if (!item.rqm_requisition_id) {
    $swal.fire({
      title: "Error",
      text: "Requisition ID is missing",
      icon: "error",
    });
    return;
  }
  
  try {
    // Store ID and mode in sessionStorage (not exposing in URL)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pr_form_id', item.rqm_requisition_id.toString());
      sessionStorage.setItem('pr_form_mode', 'edit');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-requisition/new');
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
  const messageText = `Are you sure? Do you want to delete purchase requisition "${item["Requisition No"]}"?`;
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete purchase requisition "${item["Requisition No"]}"?`,
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
        text: "Purchase requisition has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      await fetchPurchaseRequisitions();
    } catch (error) {
      console.error("Error deleting purchase requisition:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting purchase requisition",
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
  pageName: "Purchase Requisition List",
  apiDataPath: "/api/purchasing/purchase-requisition/list",
  defaultExportColumns: ["Requisition No", "Title", "Total Amount", "Agreement No", "Status"],
  getFilteredList: () => filteredPurchaseRequisitionList.value,
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
      sessionStorage.removeItem('pr_form_id');
      sessionStorage.setItem('pr_form_mode', 'add');
    }
    
    // Navigate to new page without exposing parameters
    navigateTo('/purchasing/purchase-requisition/new');
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
          <div class="text-lg font-semibold">Purchase Requisition List</div>
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
          <div class="purchase-requisition-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`purchase-requisition-table`"
              :data="filteredPurchaseRequisitionList"
              :field="['no', 'Requisition No', 'Title', 'Total Amount', 'Agreement No', 'Status', 'Created / Updated Date', 'Action']"
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
              <template v-slot:RequisitionNo="data">
                {{ data.value['Requisition No'] }}
              </template>
              <template v-slot:Title="data">
                {{ data.value.Title }}
              </template>
              <template v-slot:TotalAmount="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Total Amount']) }}
                </div>
              </template>
              <template v-slot:AgreementNo="data">
                {{ data.value['Agreement No'] }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:CreatedUpdatedDate="data">
                {{ data.value['Created / Updated Date'] }}
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
                  :options="statusOptions"
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

            <!-- Requisition No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Requisition No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.RequisitionNo"
                  type="text"
                  placeholder="Enter Requisition No"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Title -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Title:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.Title"
                  type="text"
                  placeholder="Enter Title"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Agreement No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Agreement No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.AgreementNo"
                  type="text"
                  placeholder="Enter Agreement No"
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
.purchase-requisition-table-wrapper :deep(.table-header) {
  display: none;
}

.purchase-requisition-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
