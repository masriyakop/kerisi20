<script setup>
definePageMeta({
  title: "Variation Report (WBR074)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Budget Report By PTJ", path: "/budget/report/budget-report-by-ptj" },
    { name: "Variation Report (WBR074)", path: "/budget/report/budget-report-by-ptj/variation-report-wbr074" },
  ],
});

const { $swal } = useNuxtApp();

const reportList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  reportType: "WBR074",
  statementDate: new Date().toLocaleDateString('en-MY'),
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
  { key: "index", label: "No", sortable: false },
  { key: "fty_fund_type", label: "Fund", sortable: false },
  { key: "oun_code", label: "PTJ", sortable: false },
  { key: "ccr_costcentre", label: "Cost Center", sortable: false },
  { key: "at_activity_code", label: "Activity Code", sortable: false },
  { key: "at_activity_description_bm", label: "Activity Code Description", sortable: false },
  { key: "lbc_budget_code", label: "Account Code", sortable: false },
  { key: "lbc_description", label: "Account Code Description", sortable: false },
  { key: "opening", label: "Opening<br>(RM)", sortable: false },
  { key: "initial", label: "Initial<br>(RM)", sortable: false },
  { key: "virement", label: "Virement<br>(RM)", sortable: false },
  { key: "additional", label: "Inc/Dec<br>(RM)", sortable: false },
  { key: "topup", label: "Topup<br>(RM)", sortable: false },
  { key: "allocated", label: "Allocated<br>(RM)", sortable: false },
  { key: "pre_request", label: "Pre Request<br>(RM)", sortable: false },
  { key: "request", label: "Request<br>(RM)", sortable: false },
  { key: "commit", label: "Commit<br>(RM)", sortable: false },
  { key: "locked", label: "Locked<br>(RM)", sortable: false },
  { key: "expenses", label: "Expenses<br>(RM)", sortable: false },
  { key: "balance", label: "Balance<br>(RM)", sortable: false },
  { key: "expenses_percentage", label: "Expenses<br>(%)", sortable: false },
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
  fetchVariationReport();
}, { deep: true });

const fetchVariationReport = async () => {
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

    const { data } = await useFetch("/api/budget/report/budget-report-by-ptj/variation-report-wbr074", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        fty_fund_type: item.fty_fund_type,
        oun_code: item.oun_code,
        ccr_costcentre: item.ccr_costcentre,
        at_activity_code: item.at_activity_code,
        at_activity_description_bm: item.at_activity_description_bm,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description,
        opening: item.opening,
        initial: item.initial,
        virement: item.virement,
        additional: item.additional,
        topup: item.topup,
        allocated: item.allocated,
        pre_request: item.pre_request,
        request: item.request,
        commit: item.commit,
        locked: item.locked,
        expenses: item.expenses,
        balance: item.balance,
        expenses_percentage: item.expenses_percentage,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch Variation Report",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching Variation Report:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Variation Report",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchVariationReport();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchVariationReport();
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
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="topFilter.reportType"
              type="text"
              label="Report Type"
              :disabled="true"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.statementDate"
              type="text"
              label="Statement Date"
              :disabled="true"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Year is required' }"
            />
            <FormKit
              v-model="topFilter.fundType"
              type="select"
              label="Fund Type"
              :options="fundTypeOptions"
              placeholder="Select Fund Type"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Fund Type is required' }"
            />
            <FormKit
              v-model="topFilter.ptj"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
              outer-class="mb-0"
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
          <div class="variation-report-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`variation-report-table-${searchKeyword || 'all'}-${pageSize}`"
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
              <template v-slot:ftyfundtype="data">{{ data.value.fty_fund_type }}</template>
              <template v-slot:ouncode="data">{{ data.value.oun_code }}</template>
              <template v-slot:ccrcostcentre="data">{{ data.value.ccr_costcentre }}</template>
              <template v-slot:atactivitycode="data">{{ data.value.at_activity_code }}</template>
              <template v-slot:atactivitydescriptionbm="data">{{ data.value.at_activity_description_bm }}</template>
              <template v-slot:lbcbudgetcode="data">{{ data.value.lbc_budget_code }}</template>
              <template v-slot:lbdescription="data">{{ data.value.lbc_description }}</template>
              <template v-slot:opening="data">{{ toCurrency(data.value.opening) }}</template>
              <template v-slot:initial="data">{{ toCurrency(data.value.initial) }}</template>
              <template v-slot:virement="data">{{ toCurrency(data.value.virement) }}</template>
              <template v-slot:additional="data">{{ toCurrency(data.value.additional) }}</template>
              <template v-slot:topup="data">{{ toCurrency(data.value.topup) }}</template>
              <template v-slot:allocated="data">{{ toCurrency(data.value.allocated) }}</template>
              <template v-slot:prerequest="data">{{ toCurrency(data.value.pre_request) }}</template>
              <template v-slot:request="data">{{ toCurrency(data.value.request) }}</template>
              <template v-slot:commit="data">{{ toCurrency(data.value.commit) }}</template>
              <template v-slot:locked="data">{{ toCurrency(data.value.locked) }}</template>
              <template v-slot:expenses="data">{{ toCurrency(data.value.expenses) }}</template>
              <template v-slot:balance="data">{{ toCurrency(data.value.balance) }}</template>
              <template v-slot:expensespercentage="data">{{ toCurrency(data.value.expenses_percentage) }}</template>
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
.variation-report-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

