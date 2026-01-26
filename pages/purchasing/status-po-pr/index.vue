<script setup>
definePageMeta({
  title: "Status PO & PR",
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
      name: "Status PO & PR",
      path: "/purchasing/status-po-pr",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const statusPOList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Smart Filter values
const smartFilter = ref({
  date_start: "",
  date_end: "",
  pom_order_no: "",
  rqm_requisition_no: "",
  vcs_vendor_code: "",
  pom_order_status: "",
});

// Store original filter values for reset
const originalFilter = ref({
  date_start: "",
  date_end: "",
  pom_order_no: "",
  rqm_requisition_no: "",
  vcs_vendor_code: "",
  pom_order_status: "",
});

// PO Status options
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

// Fetch Status PO & PR data
const fetchStatusPO = async () => {
  try {
    loading.value = true;
    const query = {
      search: searchKeyword.value || undefined,
      date_start: smartFilter.value.date_start || undefined,
      date_end: smartFilter.value.date_end || undefined,
      smartFilter_pom_order_no: smartFilter.value.pom_order_no || undefined,
      smartFilter_rqm_requisition_no: smartFilter.value.rqm_requisition_no || undefined,
      smartFilter_vcs_vendor_code: smartFilter.value.vcs_vendor_code || undefined,
      smartFilter_pom_order_status: smartFilter.value.pom_order_status || undefined,
    };

    const response = await useFetch("/api/purchasing/status-po-pr", {
      query,
      initialCache: false,
    });

    if (response.data.value?.statusCode === 200) {
      statusPOList.value = response.data.value.data || [];
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to fetch Status PO & PR data",
        icon: "error",
      });
      statusPOList.value = [];
      filteredStatusPOList.value = [];
    }
  } catch (error) {
    console.error("Error fetching Status PO & PR:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Status PO & PR data",
      icon: "error",
    });
    statusPOList.value = [];
    filteredStatusPOList.value = [];
  } finally {
    loading.value = false;
  }
};

// Filtered data - using ref instead of computed for better reactivity
const filteredStatusPOList = ref([...statusPOList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...statusPOList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const poNo = (item['PO No'] || "").toString().toLowerCase();
      const pr = (item['PR'] || "").toString().toLowerCase();
      const description = (item['Description'] || "").toString().toLowerCase();
      const requestDate = (item['Request Date'] || "").toString().toLowerCase();
      const itemCode = (item['Item Code'] || "").toString().toLowerCase();
      const itemDesc = (item['Item Desc'] || "").toString().toLowerCase();
      const poStatus = (item['PO Status'] || "").toString().toLowerCase();
      const vendorId = (item['Vendor ID'] || "").toString().toLowerCase();
      const vendorName = (item['Vendor Name'] || "").toString().toLowerCase();
      const billNo = (item['Bill No'] || "").toString().toLowerCase();

      return (
        poNo.includes(keyword) ||
        pr.includes(keyword) ||
        description.includes(keyword) ||
        requestDate.includes(keyword) ||
        itemCode.includes(keyword) ||
        itemDesc.includes(keyword) ||
        poStatus.includes(keyword) ||
        vendorId.includes(keyword) ||
        vendorName.includes(keyword) ||
        billNo.includes(keyword)
      );
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredStatusPOList.value = [];
  nextTick(() => {
    filteredStatusPOList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredStatusPOList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and fetch data when it changes
watch(smartFilter, () => {
  fetchStatusPO();
}, { deep: true, immediate: false });

// Initialize data on mount
onMounted(() => {
  fetchPOStatusOptions();
  fetchStatusPO();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    date_start: smartFilter.value.date_start,
    date_end: smartFilter.value.date_end,
    pom_order_no: smartFilter.value.pom_order_no,
    rqm_requisition_no: smartFilter.value.rqm_requisition_no,
    vcs_vendor_code: smartFilter.value.vcs_vendor_code,
    pom_order_status: smartFilter.value.pom_order_status,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    date_start: "",
    date_end: "",
    pom_order_no: "",
    rqm_requisition_no: "",
    vcs_vendor_code: "",
    pom_order_status: "",
  };
  originalFilter.value = {
    date_start: "",
    date_end: "",
    pom_order_no: "",
    rqm_requisition_no: "",
    vcs_vendor_code: "",
    pom_order_status: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    date_start: originalFilter.value.date_start,
    date_end: originalFilter.value.date_end,
    pom_order_no: originalFilter.value.pom_order_no,
    rqm_requisition_no: originalFilter.value.rqm_requisition_no,
    vcs_vendor_code: originalFilter.value.vcs_vendor_code,
    pom_order_status: originalFilter.value.pom_order_status,
  };
  showSmartFilter.value = false;
};

// View PO function
const handleViewPO = (item) => {
  if (item.urlViewPO) {
    navigateTo(item.urlViewPO);
  }
};

// View PR function
const handleViewPR = (item) => {
  if (item.urlViewPR) {
    navigateTo(item.urlViewPR);
  }
};

// Download PDF function
const handleDownloadPDF = () => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
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
        <div class="text-lg font-semibold">Status PO & PR</div>
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
          <div class="status-po-pr-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`status-po-pr-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredStatusPOList"
              :field="['no', 'PO No', 'PR', 'Description', 'Request Date', 'Item Code', 'Item Desc', 'PO Status', 'Vendor ID', 'Vendor Name', 'Bill No', 'Action']"
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
              <template v-slot:PONo="data">
                {{ data.value['PO No'] }}
              </template>
              <template v-slot:PR="data">
                {{ data.value['PR'] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value['Description'] }}
              </template>
              <template v-slot:RequestDate="data">
                {{ data.value['Request Date'] }}
              </template>
              <template v-slot:ItemCode="data">
                {{ data.value['Item Code'] }}
              </template>
              <template v-slot:ItemDesc="data">
                {{ data.value['Item Desc'] }}
              </template>
              <template v-slot:POStatus="data">
                {{ data.value['PO Status'] }}
              </template>
              <template v-slot:VendorID="data">
                {{ data.value['Vendor ID'] }}
              </template>
              <template v-slot:VendorName="data">
                {{ data.value['Vendor Name'] }}
              </template>
              <template v-slot:BillNo="data">
                {{ data.value['Bill No'] }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    v-if="data.value.urlViewPO"
                    @click="handleViewPO(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View PO"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    v-if="data.value.urlViewPR"
                    @click="handleViewPR(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View PR"
                  >
                    <Icon
                      name="material-symbols:visibility-outline"
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
            <!-- Date (Start) -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Date (Start):</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.date_start"
                  type="date"
                  placeholder="Select Start Date"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Date (End) -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Date (End):</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.date_end"
                  type="date"
                  placeholder="Select End Date"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- PO No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PO No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.pom_order_no"
                  type="text"
                  placeholder="Enter PO No"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- PR -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PR:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.rqm_requisition_no"
                  type="text"
                  placeholder="Enter PR"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Vendor ID -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Vendor ID:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.vcs_vendor_code"
                  type="text"
                  placeholder="Enter Vendor ID"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- PO Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PO Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.pom_order_status"
                  type="select"
                  :options="[
                    { label: '-- Select --', value: '' },
                    ...poStatusOptions.map(opt => ({ label: opt.label, value: opt.value })),
                  ]"
                  placeholder="Select PO Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.pom_order_status"
                  type="button"
                  @click="smartFilter.pom_order_status = ''"
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
        <div class="flex justify-end gap-2 p-3 border-t">
          <rs-button variant="secondary" @click="handleFilterReset">
            Reset
          </rs-button>
          <rs-button variant="primary" @click="handleFilterOk">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.status-po-pr-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
