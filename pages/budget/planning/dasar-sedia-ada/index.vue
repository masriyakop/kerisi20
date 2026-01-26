<script setup>
definePageMeta({
  title: "Dasar Sedia Ada",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Planning", path: "/budget/planning" },
    { name: "Dasar Sedia Ada", path: "/budget/planning/dasar-sedia-ada" },
  ],
});

const { $swal } = useNuxtApp();

const planningList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const showSmartFilter = ref(false);
const smartFilter = ref({
  bpm_planning_no: "",
  bpm_year: "",
  bpm_oun_code: "",
  bpm_ccr_costcentre: "",
  bpm_status: "",
});

const originalFilter = ref({ ...smartFilter.value });

// Filtered data - using ref instead of computed for better reactivity
const filteredPlanningList = ref([...planningList.value]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...planningList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const planningNo = (item['Planning No'] || "").toLowerCase();
      const planningYear = (item['Planning Year'] || "").toString().toLowerCase();
      const ptj = (item.PTJ || "").toLowerCase();
      const costCenter = (item['Cost Center'] || "").toLowerCase();
      const description = (item.Description || "").toLowerCase();
      const remark = (item.Remark || "").toLowerCase();
      const totalPlanning = (item['Total Planning'] || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        planningNo.includes(keyword) ||
        planningYear.includes(keyword) ||
        ptj.includes(keyword) ||
        costCenter.includes(keyword) ||
        description.includes(keyword) ||
        remark.includes(keyword) ||
        totalPlanning.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.bpm_planning_no) {
    const filterNo = smartFilter.value.bpm_planning_no.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemNo = (item['Planning No'] || "").toLowerCase();
      return itemNo.includes(filterNo);
    });
  }

  if (smartFilter.value.bpm_year) {
    filtered = filtered.filter((item) => {
      const itemYear = (item['Planning Year'] || "").toString();
      return itemYear === smartFilter.value.bpm_year;
    });
  }

  if (smartFilter.value.bpm_oun_code) {
    const filterPTJ = smartFilter.value.bpm_oun_code.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemPTJ = (item.PTJ || "").toLowerCase();
      return itemPTJ.includes(filterPTJ);
    });
  }

  if (smartFilter.value.bpm_ccr_costcentre) {
    const filterCC = smartFilter.value.bpm_ccr_costcentre.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemCC = (item['Cost Center'] || "").toLowerCase();
      return itemCC.includes(filterCC);
    });
  }

  if (smartFilter.value.bpm_status) {
    filtered = filtered.filter((item) => {
      const itemStatus = (item.Status || "").toLowerCase();
      return itemStatus.includes(smartFilter.value.bpm_status.toLowerCase());
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredPlanningList.value = [];
  nextTick(() => {
    filteredPlanningList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredPlanningList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

const fetchPlannings = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/planning/dasar-sedia-ada", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      planningList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        bpm_id: item.bpm_id, // Hidden column
        'Planning No': item.bpm_planning_no,
        'Planning Year': item.bpm_year,
        PTJ: item.bpm_oun_code,
        'Cost Center': item.bpm_ccr_costcentre,
        Description: item.ccr_costcentre_desc,
        Remark: item.bpm_remark,
        'Total Planning': parseFloat(item.bpm_total_amt || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        Status: item.bpm_status,
      }));
      applyFilters();
    }
  } catch (error) {
    console.error("Error fetching plannings:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching plannings",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlannings();
});

const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    bpm_planning_no: "",
    bpm_year: "",
    bpm_oun_code: "",
    bpm_ccr_costcentre: "",
    bpm_status: "",
  };
  originalFilter.value = { ...smartFilter.value };
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
};

const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete planning "${item['Planning No']}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const { data } = await useFetch(`/api/budget/planning/dasar-sedia-ada/${item.bpm_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Planning has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchPlannings();
      }
    } catch (error) {
      console.error("Error deleting planning:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting planning",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Dasar Sedia Ada</div>
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
          <div class="dasar-sedia-ada-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`dasar-sedia-ada-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredPlanningList"
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
              <template v-slot:PlanningNo="data">{{ data.value['Planning No'] }}</template>
              <template v-slot:PlanningYear="data">{{ data.value['Planning Year'] }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:CostCenter="data">{{ data.value['Cost Center'] }}</template>
              <template v-slot:Description="data">{{ data.value.Description }}</template>
              <template v-slot:Remark="data">{{ data.value.Remark }}</template>
              <template v-slot:TotalPlanning="data">{{ data.value['Total Planning'] }}</template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.Status === 'ACTIVE' || data.value.Status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.Status === 'INACTIVE' || data.value.Status === 'REJECTED',
                    'text-blue-600 dark:text-blue-400': !['ACTIVE', 'APPROVED', 'INACTIVE', 'REJECTED'].includes(data.value.Status),
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
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

          <!-- Custom Footer with Records Count -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
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
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Planning No:</label>
              <div class="flex-1">
                <FormKit v-model="smartFilter.bpm_planning_no" type="text" placeholder="Enter Planning No" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Planning Year:</label>
              <div class="flex-1">
                <FormKit v-model="smartFilter.bpm_year" type="text" placeholder="Enter Year" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PTJ:</label>
              <div class="flex-1">
                <FormKit v-model="smartFilter.bpm_oun_code" type="text" placeholder="Enter PTJ" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Cost Center:</label>
              <div class="flex-1">
                <FormKit v-model="smartFilter.bpm_ccr_costcentre" type="text" placeholder="Enter Cost Center" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1">
                <FormKit v-model="smartFilter.bpm_status" type="text" placeholder="Enter Status" outer-class="mb-0" />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="handleFilterReset">Reset</rs-button>
          <rs-button variant="primary" @click="handleFilterOk">Ok</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.dasar-sedia-ada-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Hide default close icon for Smart Filter modal */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure Smart Filter modal header matches Fund Type modal styling */
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

