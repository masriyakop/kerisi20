<script setup>
definePageMeta({
  title: "Budget Summary By Account Code (WBR072)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Budget Report By Account", path: "/budget/report/budget-report-by-account" },
    { name: "Budget Summary By Account Code (WBR072)", path: "/budget/report/budget-report-by-account/budget-summary-by-account-code-wbr072" },
  ],
});

const { $swal } = useNuxtApp();

const reportList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  year: "",
  fundType: "",
  ptj: "",
  dateFrom: "",
  dateTo: "",
  activityGroup: "",
  activitySubGroup: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredReportList = ref([...reportList.value]);

const yearOptions = ref([]);
const fundTypeOptions = ref([]);
const ptjOptions = ref([]);
const activityGroupOptions = ref([]);
const activitySubGroupOptions = ref([]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

const columns = ref([
  { key: "acct_code", label: "Account Code", sortable: true },
  { key: "PTJ", label: "PTJ", sortable: false },
  { key: "opening", label: "Opening<br>(RM)", sortable: false },
  { key: "initial", label: "Initial<br>(RM)", sortable: false },
  { key: "virement", label: "Virement<br>(RM)", sortable: false },
  { key: "additional", label: "Inc/Dec<br>(RM)", sortable: false },
  { key: "allocated", label: "Allocated<br>(RM)", sortable: false },
  { key: "locked", label: "Lock<br>(RM)", sortable: false },
  { key: "request", label: "Request<br>(RM)", sortable: false },
  { key: "pre_request", label: "Pre Request<br>(RM)", sortable: false },
  { key: "commit", label: "Commit<br>(RM)", sortable: false },
  { key: "expenses", label: "Expenses<br>(RM)", sortable: false },
  { key: "balance", label: "Balance<br>(RM)", sortable: false },
]);

const fetchDropdownOptions = async () => {
  try {
    const [years, fundTypes, ptjs] = await Promise.all([
      useFetch("/api/budget/report/lookups/years"),
      useFetch("/api/budget/planning/report/lookups/fund-type"),
      useFetch("/api/budget/planning/report/lookups/ptj"),
    ]);

    if (years.data.value?.statusCode === 200) {
      yearOptions.value = years.data.value.data.map((item) => ({
        label: item.bdg_year,
        value: item.bdg_year,
      }));
    }

    if (fundTypes.data.value?.statusCode === 200) {
      fundTypeOptions.value = fundTypes.data.value.data.map((item) => ({
        label: `${item.fty_fund_type} - ${item.fty_fund_desc}`,
        value: item.fty_fund_type,
      }));
    }

    if (ptjs.data.value?.statusCode === 200) {
      ptjOptions.value = ptjs.data.value.data.map((item) => ({
        label: `${item.oun_code} - ${item.oun_desc}`,
        value: item.oun_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Function to apply filters
const applyFilters = () => {
  let filtered = [...reportList.value];

  // Apply search filter - search all columns
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      // Search across all text fields
      const searchableText = Object.values(item)
        .filter(val => val !== null && val !== undefined && typeof val !== 'object')
        .map(val => String(val).toLowerCase())
        .join(' ');
      
      return searchableText.includes(keyword);
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredReportList.value = [];
  nextTick(() => {
    filteredReportList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredReportList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchBudgetSummary();
}, { deep: true });

const fetchBudgetSummary = async () => {
  loading.value = true;
  try {
    const query = {};

    if (topFilter.value.year) query.year = topFilter.value.year;
    if (topFilter.value.fundType) query.fundType = topFilter.value.fundType;
    if (topFilter.value.ptj) query.ptj = topFilter.value.ptj;
    if (topFilter.value.dateFrom) query.dateFrom = topFilter.value.dateFrom;
    if (topFilter.value.dateTo) query.dateTo = topFilter.value.dateTo;
    if (topFilter.value.activityGroup) query.activityGroup = topFilter.value.activityGroup;
    if (topFilter.value.activitySubGroup) query.activitySubGroup = topFilter.value.activitySubGroup;

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null") delete query[key];
    });

    const { data } = await useFetch("/api/budget/report/budget-report-by-account/budget-summary-by-account-code-wbr072", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = data.value.data || [];
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch Budget Summary By Account Code",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching Budget Summary By Account Code:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Budget Summary By Account Code",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchBudgetSummary();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchBudgetSummary();
};

const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Filter By</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="topFilter.year"
              type="text"
              label="Year"
              placeholder="Enter Year"
              outer-class="mb-0 force-one-column"
            />
            <FormKit
              v-model="topFilter.fundType"
              type="select"
              label="Fund"
              :options="fundTypeOptions"
              placeholder="Select Fund"
              outer-class="mb-0 force-one-column"
            />
            <div class="flex items-center gap-2">
              <FormKit
                v-model="topFilter.dateFrom"
                type="date"
                label="Date From"
                outer-class="mb-0 flex-1"
              />
              <span class="px-2 pt-6">to</span>
              <FormKit
                v-model="topFilter.dateTo"
                type="date"
                label="Date To"
                outer-class="mb-0 flex-1"
              />
            </div>
            <FormKit
              v-model="topFilter.activityGroup"
              type="select"
              label="Activity Group"
              :options="activityGroupOptions"
              placeholder="Select Activity Group"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.activitySubGroup"
              type="select"
              label="Activity SubGroup"
              :options="activitySubGroupOptions"
              placeholder="Select Activity SubGroup"
              outer-class="mb-0"
            />
          </div>
          <div class="flex justify-end gap-2">
            <rs-button @click="handleSearch" color="primary">Search</rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Listing</div>
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
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="budget-summary-account-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-summary-account-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredReportList"
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
              <template v-slot:acctcode="data">{{ data.value.acct_code }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:opening="data">{{ toCurrency(data.value.opening) }}</template>
              <template v-slot:initial="data">{{ toCurrency(data.value.initial) }}</template>
              <template v-slot:virement="data">{{ toCurrency(data.value.virement) }}</template>
              <template v-slot:additional="data">{{ toCurrency(data.value.additional) }}</template>
              <template v-slot:allocated="data">{{ toCurrency(data.value.allocated) }}</template>
              <template v-slot:locked="data">{{ toCurrency(data.value.locked) }}</template>
              <template v-slot:request="data">{{ toCurrency(data.value.request) }}</template>
              <template v-slot:prerequest="data">{{ toCurrency(data.value.pre_request) }}</template>
              <template v-slot:commit="data">{{ toCurrency(data.value.commit) }}</template>
              <template v-slot:expenses="data">{{ toCurrency(data.value.expenses) }}</template>
              <template v-slot:balance="data">{{ toCurrency(data.value.balance) }}</template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-summary-account-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

