<script setup>
definePageMeta({
  title: "Warrant Initial",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Warrant", path: "/budget/report/warrant" },
    { name: "Warrant Initial", path: "/budget/report/warrant/warrant-initial" },
  ],
});

const { $swal } = useNuxtApp();

const warrantList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const filter = ref({
  reference: "",
  year: new Date().getFullYear().toString(),
  quarter: "",
  ptj: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredWarrantList = ref([...warrantList.value]);

const ptjOptions = ref([]);
const quarterOptions = ref([
  { label: "Q1", value: "1" },
  { label: "Q2", value: "2" },
  { label: "Q3", value: "3" },
  { label: "Q4", value: "4" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

const columns = ref([
  { key: "index", label: "No", sortable: false },
  { key: "ID", label: "ID", sortable: false },
  { key: "PTJ", label: "OU", sortable: false },
  { key: "YEARS", label: "Year", sortable: false },
  { key: "DESCR", label: "Quater", sortable: false },
  { key: "ALLOCATE_NO", label: "Reference No", sortable: true },
  { key: "ENDORSE", label: "Authority Approval", sortable: false },
  { key: "AMT", label: "Amount", sortable: false },
  { key: "STAT", label: "Status", sortable: false },
  { key: "actions", label: "Action", sortable: false },
]);

const fetchDropdownOptions = async () => {
  try {
    const ptjs = await useFetch("/api/budget/planning/report/lookups/ptj");
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
  let filtered = [...warrantList.value];

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
  filteredWarrantList.value = [];
  nextTick(() => {
    filteredWarrantList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredWarrantList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch filter and fetch when it changes
watch(filter, () => {
  fetchWarrantInitial();
}, { deep: true });

const fetchWarrantInitial = async () => {
  loading.value = true;
  try {
    const query = {};

    if (filter.value.reference) query.Reference = filter.value.reference;
    if (filter.value.year) query.Year = filter.value.year;
    if (filter.value.quarter) query.Quarter = filter.value.quarter;
    if (filter.value.ptj) query.PTJ = filter.value.ptj;

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null") delete query[key];
    });

    const { data } = await useFetch("/api/budget/report/warrant/warrant-initial", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      warrantList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ID: item.ID,
        PTJ: item.PTJ,
        YEARS: item.YEARS,
        DESCR: item.DESCR,
        ALLOCATE_NO: item.ALLOCATE_NO,
        ENDORSE: item.ENDORSE,
        AMT: item.AMT,
        STAT: item.STAT,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch Warrant Initial records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching Warrant Initial records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Warrant Initial records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchWarrantInitial();
});

// Handle search - trigger fetch with filter
const handleSearch = () => {
  fetchWarrantInitial();
};

const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleDownloadPDF = (id, years, ptj) => {
  $swal.fire({
    title: "Info",
    text: "Download functionality will be implemented",
    icon: "info",
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormKit
              v-model="filter.reference"
              type="text"
              label="Reference"
              placeholder="Enter Reference"
              outer-class="mb-0"
            />
            <FormKit
              v-model="filter.year"
              type="text"
              label="Year"
              placeholder="Enter Year"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Year is required' }"
            />
            <FormKit
              v-model="filter.quarter"
              type="select"
              label="Quarter"
              :options="quarterOptions"
              placeholder="Select Quarter"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Quarter is required' }"
            />
            <FormKit
              v-model="filter.ptj"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
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
        <div class="text-lg font-semibold">Initial Listing</div>
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
          <div class="warrant-initial-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`warrant-initial-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredWarrantList"
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
              <template v-slot:ID="data">{{ data.value.ID }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:YEARS="data">{{ data.value.YEARS }}</template>
              <template v-slot:DESCR="data">{{ data.value.DESCR }}</template>
              <template v-slot:ALLOCATENO="data">{{ data.value.ALLOCATE_NO }}</template>
              <template v-slot:ENDORSE="data">{{ data.value.ENDORSE }}</template>
              <template v-slot:AMT="data">{{ toCurrency(data.value.AMT) }}</template>
              <template v-slot:STAT="data">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': data.value.STAT === 'DRAFT',
                    'text-green-600 dark:text-green-400': data.value.STAT === 'APPROVE' || data.value.STAT === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.STAT === 'CANCEL',
                  }"
                >
                  {{ data.value.STAT }}
                </span>
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleDownloadPDF(data.value.ID, data.value.YEARS, data.value.PTJ)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Download PDF"
                  >
                    <Icon name="ic:round-print" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
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
.warrant-initial-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

