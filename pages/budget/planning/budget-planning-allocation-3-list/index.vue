<script setup>
definePageMeta({
  title: "Budget Planning Allocation 3 List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Planning", path: "/budget/planning" },
    { name: "Budget Planning Allocation 3 List", path: "/budget/planning/budget-planning-allocation-3-list" },
  ],
});

const { $swal } = useNuxtApp();

const planningList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Filtered data - using ref instead of computed for better reactivity
const filteredPlanningList = ref([...planningList.value]);

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

const fetchPlannings = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/planning/budget-planning-allocation-3-list", {
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlannings();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Planning Allocation 3 List</div>
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
          <div class="budget-planning-allocation-3-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-planning-allocation-3-table-${searchKeyword || 'all'}-${pageSize}`"
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
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
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
.budget-planning-allocation-3-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

