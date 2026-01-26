<script setup>
definePageMeta({
  title: "PO Confirmation Process List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Order", path: "/purchasing/purchase-order" },
    { name: "Closing", path: "/purchasing/purchase-order/closing" },
    { name: "PO Confirmation Process List", path: "/purchasing/purchase-order/closing/po-confirmation-process-list" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const poList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(5);

// Smart Filter modal state
const showSmartFilter = ref(false);
const smartFilter = ref({
  fty_fund_type: "",
  ppc_year: "",
});
const originalFilter = ref({});

// Filtered data
const filteredPOList = ref([...poList.value]);

// Year options (will be fetched from API)
const yearOptions = ref([]);

// Fund options
const fundOptions = ref([
  { label: "E01 - MENGURUS", value: "E01" },
  { label: "OTHERS", value: "other" },
]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...poList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const searchableFields = [
        item["PO No"],
        item["PO Detail Account"],
        item["Fund Type"],
        item.Activity,
        item["Cost Center"],
        item["Account Code"],
        item["Cpa Project No"],
        item["Old Structure Budget"],
        item["New Structure Budget"],
        item.Remark,
      ].map(f => (f || "").toString().toLowerCase());

      return searchableFields.some(field => field.includes(keyword));
    });
  }

  filteredPOList.value = [];
  nextTick(() => {
    filteredPOList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredPOList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  fetchPOs();
}, { deep: true });

// Currency formatter
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch year options
const fetchYearOptions = async () => {
  try {
    // Generate years from current year going back 10 years
    const currentYear = new Date().getFullYear();
    yearOptions.value = Array.from({ length: 10 }, (_, i) => ({
      label: (currentYear - i).toString(),
      value: (currentYear - i).toString(),
    }));
  } catch (error) {
    console.error("Error fetching year options:", error);
  }
};

// Fetch PO data
const fetchPOs = async () => {
  try {
    loading.value = true;
    const query = {
      search: searchKeyword.value || undefined,
      fty_fund_type: smartFilter.value.fty_fund_type || undefined,
      ppc_year: smartFilter.value.ppc_year || undefined,
    };

    const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-confirmation-process-list", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      poList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ...item,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch PO Confirmation Process List data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching PO Confirmation Process List:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching PO Confirmation Process List data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchYearOptions();
  await fetchPOs();
});

// Handle filter
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    fty_fund_type: "",
    ppc_year: "",
  };
  originalFilter.value = {};
  fetchPOs();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchPOs();
};

const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

// Download functions
const handleDownloadPDF = () => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
};

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

    <!-- PO Closing List -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">PO Closing List</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
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

          <div class="po-confirmation-process-list-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`po-confirmation-process-list-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredPOList"
              :field="['no', 'PO No', 'PO Detail Account', 'Activity', 'Cpa Project No', 'Balance', 'Old Structure Budget', 'New Structure Budget', 'Remark']"
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
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PONo="data">
                {{ data.value['PO No'] }}
              </template>
              <template v-slot:PODetailAccount="data">
                {{ data.value['PO Detail Account'] }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value.Activity }}
              </template>
              <template v-slot:CpaProjectNo="data">
                {{ data.value['Cpa Project No'] }}
              </template>
              <template v-slot:Balance="data">
                <div class="text-right">
                  {{ toCurrency(data.value.Balance) }}
                </div>
              </template>
              <template v-slot:OldStructureBudget="data">
                {{ data.value['Old Structure Budget'] }}
              </template>
              <template v-slot:NewStructureBudget="data">
                {{ data.value['New Structure Budget'] }}
              </template>
              <template v-slot:Remark="data">
                {{ data.value.Remark }}
              </template>
            </rs-table>
          </div>

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
            <FormKit
              v-model="smartFilter.fty_fund_type"
              type="select"
              label="Fund Type"
              :options="fundOptions"
              placeholder="Select Fund Type"
              outer-class="mb-0"
            />
            <FormKit
              v-model="smartFilter.ppc_year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              outer-class="mb-0"
            />
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
.po-confirmation-process-list-table-wrapper :deep(.table-header) {
  display: none;
}

.po-confirmation-process-list-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
