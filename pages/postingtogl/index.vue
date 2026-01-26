<script setup>
definePageMeta({
  title: "Posting to GL",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "General Ledger", path: "/generalledger" },
    { name: "Posting to GL", path: "/postingtogl" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const postingList = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const pageSize = ref(1000); // Increased default for virtual scrolling
const searchKeyword = ref("");
const currentPage = ref(1);
const totalRecords = ref(0);
const grandTotalDT = ref("0.00");
const grandTotalCR = ref("0.00");

// Virtual scrolling mode
const useVirtualScrolling = ref(true);
const chunkSize = ref(1000); // Load 1000 records at a time
const loadedChunks = ref(0);
const hasMoreData = computed(() => {
  return postingList.value.length < totalRecords.value;
});

// Top filter (Posting Details form)
const topFilter = ref({
  pmt_system_id: "",
  date_from: "",
  date_to: "",
  pmt_total_amt: "",
});

// Smart Filter modal state
const showSmartFilter = ref(false);

// Smart Filter values
const smartFilter = ref({
  pmt_posting_no: "",
  pmt_system_id: "",
  pde_document_no: "",
  pde_reference: "",
  pde_reference1: "",
  pmt_status: "",
  date_from: "",
  date_to: "",
});

// Store original filter values for reset
const originalFilter = ref({
  pmt_posting_no: "",
  pmt_system_id: "",
  pde_document_no: "",
  pde_reference: "",
  pde_reference1: "",
  pmt_status: "",
  date_from: "",
  date_to: "",
});

// System ID options (from lookup query)
const systemIdOptions = ref([]);

// Status options
const statusOptions = ref([]);

// Sort configuration
const sortConfig = ref({
  column: "pmt_posting_no",
  direction: "desc",
});

// Fetch System ID options
const fetchSystemIdOptions = async () => {
  try {
    const { data } = await useFetch("/api/posting-to-gl/system-ids", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      systemIdOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching system IDs:", error);
  }
};

// Fetch Status options
const fetchStatusOptions = async () => {
  try {
    const { data } = await useFetch("/api/posting-to-gl/statuses", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      statusOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};

// Fetch posting records from API
const fetchPostingRecords = async (append = false) => {
  try {
    if (append) {
      loadingMore.value = true;
    } else {
      loading.value = true;
      postingList.value = [];
      loadedChunks.value = 0;
    }
    
    const start = append ? postingList.value.length : 0;
    const length = useVirtualScrolling.value ? chunkSize.value : pageSize.value;
    
    const query = {
      start: start,
      length: length,
      orderBy: sortConfig.value.column,
      orderDirection: sortConfig.value.direction,
      search: searchKeyword.value || "",
    };

    // Add top filter params
    if (topFilter.value.pmt_system_id) {
      query.pmt_system_id = topFilter.value.pmt_system_id;
    }
    if (topFilter.value.date_from) {
      query.date_from = topFilter.value.date_from;
    }
    if (topFilter.value.date_to) {
      query.date_to = topFilter.value.date_to;
    }
    if (topFilter.value.pmt_total_amt) {
      query.pmt_total_amt = topFilter.value.pmt_total_amt;
    }

    // Add smart filter params
    if (smartFilter.value.pmt_posting_no) {
      query.smartFilter_pmt_posting_no = smartFilter.value.pmt_posting_no;
    }
    if (smartFilter.value.pmt_system_id) {
      query.smartFilter_pmt_system_id = smartFilter.value.pmt_system_id;
    }
    if (smartFilter.value.pde_document_no) {
      query.smartFilter_pde_document_no = smartFilter.value.pde_document_no;
    }
    if (smartFilter.value.pde_reference) {
      query.smartFilter_pde_reference = smartFilter.value.pde_reference;
    }
    if (smartFilter.value.pde_reference1) {
      query.smartFilter_pde_reference1 = smartFilter.value.pde_reference1;
    }
    if (smartFilter.value.pmt_status) {
      query.smartFilter_pmt_status = smartFilter.value.pmt_status;
    }
    if (smartFilter.value.date_from) {
      query.smartFilter_date_from = smartFilter.value.date_from;
    }
    if (smartFilter.value.date_to) {
      query.smartFilter_date_to = smartFilter.value.date_to;
    }

    const { data } = await useFetch("/api/posting-to-gl", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newData = (data.value.data || []).map((item) => ({
        no: append ? postingList.value.length + item.no : item.no,
        "Posting No": item.pmt_posting_no || "",
        "Document No": item.pde_document_no || "",
        "System ID": item.pmt_system_id || "",
        "Transaction Amount (CR)": item.amountCR || 0,
        "Transaction Amount (DT)": item.amountDT || 0,
        Status: item.pmt_status || "",
        "Reference 1": item.pde_reference || "",
        "Reference 2": item.pde_reference1 || "",
        "Posted Date": item.pde_trans_date || "",
        Action: "",
        // Keep original data for actions
        pmt_posting_id: item.pmt_posting_id,
        pmt_posting_no: item.pmt_posting_no,
        pde_document_no: item.pde_document_no,
        pmt_system_id: item.pmt_system_id,
        amountCR: item.amountCR,
        amountDT: item.amountDT,
        pmt_status: item.pmt_status,
        pde_reference: item.pde_reference,
        pde_reference1: item.pde_reference1,
        pde_trans_date: item.pde_trans_date,
      }));
      
      if (append) {
        postingList.value = [...postingList.value, ...newData];
        loadedChunks.value++;
      } else {
        postingList.value = newData;
        loadedChunks.value = 1;
      }
      
      totalRecords.value = data.value.recordsFiltered || 0;
      grandTotalDT.value = data.value.footer?.amountDT || "0.00";
      grandTotalCR.value = data.value.footer?.amountCR || "0.00";
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch posting records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching posting records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching posting records",
      icon: "error",
    });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// Load more data for infinite scroll
const loadMoreData = async () => {
  if (loadingMore.value || !hasMoreData.value) return;
  await fetchPostingRecords(true);
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    pmt_posting_no: smartFilter.value.pmt_posting_no,
    pmt_system_id: smartFilter.value.pmt_system_id,
    pde_document_no: smartFilter.value.pde_document_no,
    pde_reference: smartFilter.value.pde_reference,
    pde_reference1: smartFilter.value.pde_reference1,
    pmt_status: smartFilter.value.pmt_status,
    date_from: smartFilter.value.date_from,
    date_to: smartFilter.value.date_to,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    pmt_posting_no: "",
    pmt_system_id: "",
    pde_document_no: "",
    pde_reference: "",
    pde_reference1: "",
    pmt_status: "",
    date_from: "",
    date_to: "",
  };
  originalFilter.value = {
    pmt_posting_no: "",
    pmt_system_id: "",
    pde_document_no: "",
    pde_reference: "",
    pde_reference1: "",
    pmt_status: "",
    date_from: "",
    date_to: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
  currentPage.value = 1;
  fetchPostingRecords();
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    pmt_posting_no: originalFilter.value.pmt_posting_no,
    pmt_system_id: originalFilter.value.pmt_system_id,
    pde_document_no: originalFilter.value.pde_document_no,
    pde_reference: originalFilter.value.pde_reference,
    pde_reference1: originalFilter.value.pde_reference1,
    pmt_status: originalFilter.value.pmt_status,
    date_from: originalFilter.value.date_from,
    date_to: originalFilter.value.date_to,
  };
  showSmartFilter.value = false;
};

// Handle View action
const handleView = (item) => {
  // Navigate to view page with posting ID
  const url = `/postingtogl/view?pmt_posting_id=${item.pmt_posting_id}`;
  navigateTo(url);
};

// Handle search with debounce for better performance
const handleSearch = () => {
  currentPage.value = 1;
  
  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Debounce search to avoid too many API calls while typing
  searchTimeout = setTimeout(() => {
    fetchPostingRecords();
  }, 500); // Wait 500ms after user stops typing
};

// Handle top filter change
const handleTopFilterChange = () => {
  currentPage.value = 1;
  fetchPostingRecords();
};

// Handle sort
const handleSort = (column) => {
  if (column === "No" || column === "Action") return;
  
  // Map display column names to database column names
  const columnMap = {
    "Posting No": "pmt_posting_no",
    "Document No": "pde_document_no",
    "System ID": "pmt_system_id",
    "Transaction Amount (CR)": "amountCR",
    "Transaction Amount (DT)": "amountDT",
    "Status": "pmt_status",
    "Reference 1": "pde_reference",
    "Reference 2": "pde_reference1",
    "Posted Date": "pde_trans_date",
  };
  
  const dbColumn = columnMap[column] || column;
  
  if (sortConfig.value.column === dbColumn) {
    sortConfig.value.direction = sortConfig.value.direction === "asc" ? "desc" : "asc";
  } else {
    sortConfig.value.column = dbColumn;
    sortConfig.value.direction = "asc";
  }
  
  currentPage.value = 1; // Reset to first page when sorting
  fetchPostingRecords();
};

// Handle page size change
const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchPostingRecords();
};

// Initialize on mount
onMounted(async () => {
  await fetchSystemIdOptions();
  await fetchStatusOptions();
  await fetchPostingRecords();
});

// Watch pageSize and fetch when it changes
watch(pageSize, () => {
  handlePageSizeChange();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Top Filter Form: Posting Details -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Posting Details</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- System ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              System ID
            </label>
            <FormKit
              v-model="topFilter.pmt_system_id"
              type="select"
              :options="systemIdOptions"
              placeholder="Select System ID"
              outer-class="mb-0"
              @input="handleTopFilterChange"
            />
          </div>

          <!-- Date From/To -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date From
            </label>
            <div class="flex items-center gap-2">
              <FormKit
                v-model="topFilter.date_from"
                type="date"
                placeholder="Date From"
                outer-class="mb-0 flex-1"
                @input="handleTopFilterChange"
              />
              <span class="px-2 text-gray-600 dark:text-gray-400">to</span>
              <FormKit
                v-model="topFilter.date_to"
                type="date"
                placeholder="Date To"
                outer-class="mb-0 flex-1"
                @input="handleTopFilterChange"
              />
            </div>
          </div>

          <!-- Amount (RM) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (RM)
            </label>
            <FormKit
              v-model="topFilter.pmt_total_amt"
              type="text"
              placeholder="Enter Amount"
              outer-class="mb-0"
              @input="handleTopFilterChange"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Posting</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display Mode:</label>
              <FormKit
                type="select"
                v-model="useVirtualScrolling"
                :options="[
                  { label: 'Virtual Scrolling (Recommended for large data)', value: true },
                  { label: 'Pagination', value: false },
                ]"
                outer-class="mb-0"
                @input="() => { currentPage = 1; fetchPostingRecords(); }"
              />
            </div>
            <div v-if="!useVirtualScrolling" class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Per Page:</label>
              <FormKit
                type="select"
                v-model="pageSize"
                :options="[
                  { label: '10', value: 10 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                  { label: '500', value: 500 },
                  { label: '1000', value: 1000 },
                ]"
                outer-class="mb-0"
              />
            </div>
            <div v-else class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Chunk Size:</label>
              <FormKit
                type="select"
                v-model="chunkSize"
                :options="[
                  { label: '500', value: 500 },
                  { label: '1000', value: 1000 },
                  { label: '2000', value: 2000 },
                  { label: '5000', value: 5000 },
                ]"
                outer-class="mb-0"
                @input="() => { postingList = []; loadedChunks = 0; fetchPostingRecords(); }"
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
                  @input="handleSearch"
                  @keyup.enter="handleSearch"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeyword"
                      type="button"
                      @click="searchKeyword = ''; handleSearch()"
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

          <!-- Table with virtual scrolling or pagination -->
          <div class="posting-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading data...</p>
            </div>
            <!-- Virtual Scrolling Table -->
            <RsTableVirtual
              v-else-if="useVirtualScrolling"
              :key="`posting-table-virtual-${searchKeyword || 'all'}`"
              :data="postingList"
              :field="['no', 'Posting No', 'Document No', 'System ID', 'Transaction Amount (CR)', 'Transaction Amount (DT)', 'Status', 'Reference 1', 'Reference 2', 'Posted Date', 'Action']"
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
              :itemHeight="50"
              containerHeight="600px"
              :onLoadMore="loadMoreData"
              :hasMore="hasMoreData"
              :loading="loadingMore"
            >
              <template v-slot:no="{ value }">
                {{ value.no }}
              </template>
              <template v-slot:PostingNo="{ value }">
                {{ value['Posting No'] }}
              </template>
              <template v-slot:DocumentNo="{ value }">
                {{ value['Document No'] }}
              </template>
              <template v-slot:SystemID="{ value }">
                {{ value['System ID'] }}
              </template>
              <template v-slot:TransactionAmountCR="{ value }">
                <span class="text-right">{{ toCurrency(value['Transaction Amount (CR)']) }}</span>
              </template>
              <template v-slot:TransactionAmountDT="{ value }">
                <span class="text-right">{{ toCurrency(value['Transaction Amount (DT)']) }}</span>
              </template>
              <template v-slot:Status="{ value }">
                {{ value.Status }}
              </template>
              <template v-slot:Reference1="{ value }">
                {{ value['Reference 1'] }}
              </template>
              <template v-slot:Reference2="{ value }">
                {{ value['Reference 2'] }}
              </template>
              <template v-slot:PostedDate="{ value }">
                {{ value['Posted Date'] }}
              </template>
              <template v-slot:Action="{ value }">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView(value)"
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
            </RsTableVirtual>
            <!-- Regular Pagination Table -->
            <rs-table
              v-else
              :key="`posting-table-${searchKeyword || 'all'}-${pageSize}-${currentPage}`"
              :data="postingList"
              :field="['no', 'Posting No', 'Document No', 'System ID', 'Transaction Amount (CR)', 'Transaction Amount (DT)', 'Status', 'Reference 1', 'Reference 2', 'Posted Date', 'Action']"
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
              :pageSize="postingList.length"
              :currentPage="1"
              hideTableFooter
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PostingNo="data">
                {{ data.value['Posting No'] }}
              </template>
              <template v-slot:DocumentNo="data">
                {{ data.value['Document No'] }}
              </template>
              <template v-slot:SystemID="data">
                {{ data.value['System ID'] }}
              </template>
              <template v-slot:TransactionAmountCR="data">
                <span class="text-right">{{ toCurrency(data.value['Transaction Amount (CR)']) }}</span>
              </template>
              <template v-slot:TransactionAmountDT="data">
                <span class="text-right">{{ toCurrency(data.value['Transaction Amount (DT)']) }}</span>
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Reference1="data">
                {{ data.value['Reference 1'] }}
              </template>
              <template v-slot:Reference2="data">
                {{ data.value['Reference 2'] }}
              </template>
              <template v-slot:PostedDate="data">
                {{ data.value['Posted Date'] }}
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
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Pagination Controls for Server-Side Pagination -->
          <div v-if="!loading && totalRecords > 0 && !useVirtualScrolling" class="flex justify-center items-center gap-2 pt-4 border-t">
            <rs-button
              variant="secondary"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage = 1; fetchPostingRecords();"
            >
              First
            </rs-button>
            <rs-button
              variant="secondary"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--; fetchPostingRecords();"
            >
              Previous
            </rs-button>
            <span class="text-sm text-gray-600 dark:text-gray-400 px-4">
              Page {{ currentPage }} of {{ Math.ceil(totalRecords / pageSize) }}
            </span>
            <rs-button
              variant="secondary"
              size="sm"
              :disabled="currentPage >= Math.ceil(totalRecords / pageSize)"
              @click="currentPage++; fetchPostingRecords();"
            >
              Next
            </rs-button>
            <rs-button
              variant="secondary"
              size="sm"
              :disabled="currentPage >= Math.ceil(totalRecords / pageSize)"
              @click="currentPage = Math.ceil(totalRecords / pageSize); fetchPostingRecords();"
            >
              Last
            </rs-button>
          </div>

          <!-- Footer with totals and records count -->
          <div class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span v-if="useVirtualScrolling">
                Showing {{ postingList.length }} of {{ totalRecords }} records
                <span v-if="hasMoreData" class="text-primary">(Loading more as you scroll...)</span>
              </span>
              <span v-else>
                Showing {{ postingList.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0 }} to 
                {{ Math.min(currentPage * pageSize, totalRecords) }} of {{ totalRecords }} records
              </span>
            </div>
            <div class="flex gap-6 text-sm">
              <div>
                <span class="font-medium">Total DT:</span>
                <span class="ml-2">{{ toCurrency(grandTotalDT) }}</span>
              </div>
              <div>
                <span class="font-medium">Total CR:</span>
                <span class="ml-2">{{ toCurrency(grandTotalCR) }}</span>
              </div>
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
            <!-- Posting No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Posting No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.pmt_posting_no"
                  type="text"
                  placeholder="Enter Posting No"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- System ID -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">System ID:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.pmt_system_id"
                  type="select"
                  :options="systemIdOptions"
                  placeholder="Select System ID"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.pmt_system_id"
                  type="button"
                  @click="smartFilter.pmt_system_id = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Document No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Document No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.pde_document_no"
                  type="text"
                  placeholder="Enter Document No"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Reference 1 -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Reference 1:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.pde_reference"
                  type="text"
                  placeholder="Enter Reference 1"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Reference 2 -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Reference 2:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.pde_reference1"
                  type="text"
                  placeholder="Enter Reference 2"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.pmt_status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.pmt_status"
                  type="button"
                  @click="smartFilter.pmt_status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Date From/To -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Date From:</label>
              <div class="flex-1 flex items-center gap-2">
                <FormKit
                  v-model="smartFilter.date_from"
                  type="date"
                  placeholder="Date From"
                  outer-class="mb-0 flex-1"
                />
                <span class="px-2 text-gray-600 dark:text-gray-400">to</span>
                <FormKit
                  v-model="smartFilter.date_to"
                  type="date"
                  placeholder="Date To"
                  outer-class="mb-0 flex-1"
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
.posting-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.posting-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 600;
}

/* Sortable columns */
.posting-table-wrapper :deep(.rs-table thead th.sortable) {
  cursor: pointer;
}

.posting-table-wrapper :deep(.rs-table thead th.sortable:hover) {
  background-color: #2563eb !important;
}
</style>

<style>
/* Custom width for Smart Filter modal */
.smart-filter-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
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
