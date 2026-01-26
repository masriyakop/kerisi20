<script setup>
definePageMeta({
  title: "Warrant Decrement",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Warrant", path: "/budget/report/warrant" },
    { name: "Warrant Decrement", path: "/budget/report/warrant/warrant-decrement" },
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
  ptj: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredWarrantList = ref([...warrantList.value]);

const ptjOptions = ref([]);
const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

const columns = ref([
  { key: "index", label: "No", sortable: false },
  { key: "bmm_budget_movement_id", label: "ID", sortable: false },
  { key: "bmm_year", label: "Year", sortable: true },
  { key: "bmm_budget_movement_no", label: "Reference No", sortable: true },
  { key: "oun_code", label: "OU", sortable: false },
  { key: "bmm_endorse_doc", label: "Authority Approval", sortable: false },
  { key: "bmm_reason", label: "Reason", sortable: false },
  { key: "bmm_total_amt", label: "Amount", sortable: false },
  { key: "bmm_status", label: "Status", sortable: false },
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
  fetchWarrantDecrement();
}, { deep: true });

const fetchWarrantDecrement = async () => {
  loading.value = true;
  try {
    const query = {};

    if (filter.value.reference) query.Reference = filter.value.reference;
    if (filter.value.year) query.Year = filter.value.year;
    if (filter.value.ptj) query.PTJ = filter.value.ptj;

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null") delete query[key];
    });

    const { data } = await useFetch("/api/budget/report/warrant/warrant-decrement", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      warrantList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        bmm_budget_movement_id: item.bmm_budget_movement_id,
        bmm_year: item.bmm_year,
        bmm_budget_movement_no: item.bmm_budget_movement_no,
        oun_code: item.oun_code,
        bmm_endorse_doc: item.bmm_endorse_doc,
        bmm_reason: item.bmm_reason,
        bmm_total_amt: item.bmm_total_amt,
        bmm_status: item.bmm_status,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch Warrant Decrement records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching Warrant Decrement records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Warrant Decrement records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchWarrantDecrement();
});

// Handle search - trigger fetch with filter
const handleSearch = () => {
  fetchWarrantDecrement();
};

const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleDownloadPDF = (id, year, ptj) => {
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div class="text-lg font-semibold">Decrement Listing</div>
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
          <div class="warrant-decrement-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`warrant-decrement-table-${searchKeyword || 'all'}-${pageSize}`"
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
              <template v-slot:bmmbudgetmovementid="data">{{ data.value.bmm_budget_movement_id }}</template>
              <template v-slot:bmmyear="data">{{ data.value.bmm_year }}</template>
              <template v-slot:bmmbudgetmovementno="data">{{ data.value.bmm_budget_movement_no }}</template>
              <template v-slot:ouncode="data">{{ data.value.oun_code }}</template>
              <template v-slot:bmmendorsedoc="data">{{ data.value.bmm_endorse_doc }}</template>
              <template v-slot:bmmreason="data">{{ data.value.bmm_reason }}</template>
              <template v-slot:bmmtotalamt="data">{{ toCurrency(data.value.bmm_total_amt) }}</template>
              <template v-slot:bmmstatus="data">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': data.value.bmm_status === 'DRAFT',
                    'text-green-600 dark:text-green-400': data.value.bmm_status === 'APPROVE' || data.value.bmm_status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.bmm_status === 'CANCEL',
                  }"
                >
                  {{ data.value.bmm_status }}
                </span>
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleDownloadPDF(data.value.bmm_budget_movement_id, data.value.bmm_year, data.value.oun_code)"
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
.warrant-decrement-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

