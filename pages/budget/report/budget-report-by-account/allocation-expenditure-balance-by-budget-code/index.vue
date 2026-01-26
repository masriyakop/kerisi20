<script setup>
definePageMeta({
  title: "Allocation, Expenditure & Balance of Allocation by Budget Code",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Budget Report By Account", path: "/budget/report/budget-report-by-account" },
    { name: "Allocation, Expenditure & Balance of Allocation by Budget Code", path: "/budget/report/budget-report-by-account/allocation-expenditure-balance-by-budget-code" },
  ],
});

const { $swal } = useNuxtApp();

const reportList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  year: "",
  Fund: "",
  dateFrom: "",
  dateTo: "",
  activityGroup: "",
  activitySubGroup: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredReportList = ref([...reportList.value]);

const fundTypeOptions = ref([]);
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
  { key: "index", label: "No", sortable: false },
  { key: "at_activity_code", label: "Activity Code", sortable: true },
  { key: "at_activity_description_bm", label: "Activity Description", sortable: false },
  { key: "lbc_budget_code", label: "Budget Code", sortable: false },
  { key: "lbc_description", label: "Budget Description", sortable: false },
  { key: "peruntukan", label: "Allocation <br> (RM)", sortable: false },
  { key: "lck", label: "Lock <br> (RM)", sortable: false },
  { key: "request", label: "Request<br> (RM)", sortable: false },
  { key: "commitment", label: "Commitment <br> (RM)", sortable: false },
  { key: "Belanja", label: "Expenses <br> (RM)", sortable: false },
  { key: "Jumlah_Perbelanjaan", label: "Total Expenses <br> (RM)", sortable: false },
  { key: "Baki_Peruntukan", label: "Allocation Balance <br> (RM)", sortable: false },
]);

const fetchDropdownOptions = async () => {
  try {
    const fundTypes = await useFetch("/api/budget/planning/report/lookups/fund-type");
    if (fundTypes.data.value?.statusCode === 200) {
      fundTypeOptions.value = fundTypes.data.value.data.map((item) => ({
        label: `${item.fty_fund_type} - ${item.fty_fund_desc}`,
        value: item.fty_fund_type,
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
  fetchReport();
}, { deep: true });

const fetchReport = async () => {
  loading.value = true;
  try {
    const query = {};

    if (topFilter.value.year) query.year = topFilter.value.year;
    if (topFilter.value.Fund) query.Fund = topFilter.value.Fund;
    if (topFilter.value.dateFrom) query.date_from = topFilter.value.dateFrom;
    if (topFilter.value.dateTo) query.date_to = topFilter.value.dateTo;
    if (topFilter.value.activityGroup) query.tf_activity_group = topFilter.value.activityGroup;
    if (topFilter.value.activitySubGroup) query.tf_activity_subgroup = topFilter.value.activitySubGroup;

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null") delete query[key];
    });

    const { data } = await useFetch("/api/budget/report/budget-report-by-account/allocation-expenditure-balance-by-budget-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        at_activity_code: item.at_activity_code,
        at_activity_description_bm: item.at_activity_description_bm,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description,
        peruntukan: item.peruntukan,
        lck: item.lck,
        request: item.request,
        commitment: item.commitment,
        Belanja: item.Belanja,
        Jumlah_Perbelanjaan: item.Jumlah_Perbelanjaan,
        Baki_Peruntukan: item.Baki_Peruntukan,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch report",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching report",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchReport();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchReport();
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
              v-model="topFilter.Fund"
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
          <div class="allocation-expenditure-balance-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`allocation-expenditure-balance-table-${searchKeyword || 'all'}-${pageSize}`"
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
              <template v-slot:no="data">{{ data.value.no }}</template>
              <template v-slot:atactivitycode="data">{{ data.value.at_activity_code }}</template>
              <template v-slot:atactivitydescriptionbm="data">{{ data.value.at_activity_description_bm }}</template>
              <template v-slot:lbcbudgetcode="data">{{ data.value.lbc_budget_code }}</template>
              <template v-slot:lbdescription="data">{{ data.value.lbc_description }}</template>
              <template v-slot:peruntukan="data">{{ toCurrency(data.value.peruntukan) }}</template>
              <template v-slot:lck="data">{{ toCurrency(data.value.lck) }}</template>
              <template v-slot:request="data">{{ toCurrency(data.value.request) }}</template>
              <template v-slot:commitment="data">{{ toCurrency(data.value.commitment) }}</template>
              <template v-slot:Belanja="data">{{ toCurrency(data.value.Belanja) }}</template>
              <template v-slot:JumlahPerbelanjaan="data">{{ toCurrency(data.value.Jumlah_Perbelanjaan) }}</template>
              <template v-slot:BakiPeruntukan="data">{{ toCurrency(data.value.Baki_Peruntukan) }}</template>
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
.allocation-expenditure-balance-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

