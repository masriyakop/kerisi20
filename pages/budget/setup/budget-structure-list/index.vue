<script setup>
definePageMeta({
  title: "Budget Structure List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Setup", path: "/budget/setup" },
    { name: "Budget Structure List", path: "/budget/setup/budget-structure-list" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const structureList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Top filter
const topFilter = ref({
  tf_year: new Date().getFullYear().toString(),
  tf_fund: "",
  tf_ouncode: "",
  tf_costcentre: "",
  tf_activity: "",
});

// Add/Edit Budget Structure modal state
const showStructureModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);
const structureForm = ref({
  ID: "",
  FUND: "",
  ACTIVITY: "",
  OUN: "",
  CCR: "",
  PROJNO: "",
  BUDGETCODE: "",
  STAT: "1",
  YEAR: new Date().getFullYear().toString(),
  DEFISIT: "N",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredStructureList = ref([...structureList.value]);

// Options
const statusOptions = ref([
  { label: "ACTIVE", value: "1" },
  { label: "INACTIVE", value: "0" },
]);

const deficitOptions = ref([
  { label: "YES", value: "Y" },
  { label: "NO", value: "N" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...structureList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const fund = (item.Fund || "").toLowerCase();
      const ptj = (item.PTJ || "").toLowerCase();
      const costCentre = (item['Cost Centre'] || "").toLowerCase();
      const activity = (item.Activity || "").toLowerCase();
      const activityDesc = (item['Activity Description'] || "").toLowerCase();
      const budgetCode = (item['Budget Code'] || "").toLowerCase();
      const budgetCodeDesc = (item['Budget Code Description'] || "").toLowerCase();
      const deficit = (item['Deficit Budget'] || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();
      const year = (item.Year || "").toString().toLowerCase();

      return (
        fund.includes(keyword) ||
        ptj.includes(keyword) ||
        costCentre.includes(keyword) ||
        activity.includes(keyword) ||
        activityDesc.includes(keyword) ||
        budgetCode.includes(keyword) ||
        budgetCodeDesc.includes(keyword) ||
        deficit.includes(keyword) ||
        status.includes(keyword) ||
        year.includes(keyword)
      );
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredStructureList.value = [];
  nextTick(() => {
    filteredStructureList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredStructureList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Fetch structures from API
const fetchStructures = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
    };

    // Remove empty values
    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === null) {
        delete query[key];
      }
    });

    const { data } = await useFetch("/api/budget/setup/budget-structure-list", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      structureList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Fund: item.FUND,
        PTJ: item.OUN,
        'Cost Centre': item.CCR,
        Activity: item.ACTIVITY,
        'Activity Description': item.activity_desc || '',
        'Budget Code': item.BUDGETCODE,
        'Budget Code Description': item.lbc_description || '',
        'Deficit Budget': item.DEFISIT,
        Status: item.STAT === '1' || item.STAT === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        Year: item.YEAR,
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        ID: item.ID,
        FUND: item.FUND,
        OUN: item.OUN,
        CCR: item.CCR,
        ACTIVITY: item.ACTIVITY,
        BUDGETCODE: item.BUDGETCODE,
        DEFISIT: item.DEFISIT,
        STAT: item.STAT,
        YEAR: item.YEAR,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget structures",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget structures:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget structures",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStructures();
});

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchStructures();
}, { deep: true });

const handleSearch = () => {
  fetchStructures();
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.ID;
  structureForm.value = {
    ID: item.ID,
    FUND: item.FUND,
    ACTIVITY: item.ACTIVITY,
    OUN: item.OUN,
    CCR: item.CCR,
    PROJNO: item.PROJNO || "",
    BUDGETCODE: item.BUDGETCODE,
    STAT: item.STAT,
    YEAR: item.YEAR,
    DEFISIT: item.DEFISIT,
  };
  showStructureModal.value = true;
};

const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  structureForm.value = {
    ID: "",
    FUND: "",
    ACTIVITY: "",
    OUN: "",
    CCR: "",
    PROJNO: "",
    BUDGETCODE: "",
    STAT: "1",
    YEAR: new Date().getFullYear().toString(),
    DEFISIT: "N",
  };
  showStructureModal.value = true;
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

const handleEdit = async (item) => {
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/setup/budget-structure-list/${item.ID}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      isEditMode.value = true;
      isViewMode.value = false;
      editingId.value = item.ID;
      structureForm.value = {
        ID: data.value.data.ID,
        FUND: data.value.data.FUND,
        ACTIVITY: data.value.data.ACTIVITY,
        OUN: data.value.data.OUN,
        CCR: data.value.data.CCR,
        PROJNO: data.value.data.PROJNO || "",
        BUDGETCODE: data.value.data.BUDGETCODE,
        STAT: data.value.data.STAT,
        YEAR: data.value.data.YEAR,
        DEFISIT: data.value.data.DEFISIT,
      };
      showStructureModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget structure",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget structure:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget structure",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete this budget structure?`,
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
      const { data } = await useFetch(`/api/budget/setup/budget-structure-list/${item.ID}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Budget structure has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchStructures();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete budget structure",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting budget structure:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting budget structure",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

const handleSave = async () => {
  if (!structureForm.value.FUND || !structureForm.value.ACTIVITY || !structureForm.value.OUN || 
      !structureForm.value.CCR || !structureForm.value.BUDGETCODE || !structureForm.value.YEAR || 
      !structureForm.value.STAT || !structureForm.value.DEFISIT) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const url = isEditMode.value
      ? `/api/budget/setup/budget-structure-list/${editingId.value}`
      : "/api/budget/setup/budget-structure-list";
    const method = isEditMode.value ? "PUT" : "POST";

    const { data } = await useFetch(url, {
      method,
      body: structureForm.value,
      initialCache: false,
    });

    if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Budget structure updated successfully" : "Budget structure created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      showStructureModal.value = false;
      await fetchStructures();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to save budget structure",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving budget structure:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving budget structure",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const handleCancelStructure = () => {
  showStructureModal.value = false;
  isViewMode.value = false;
};

const downloadPDF = () => {
  console.log("Downloading PDF");
  // TODO: Implement PDF download functionality
};

const downloadCSV = () => {
  console.log("Downloading CSV");
  // TODO: Implement CSV download functionality
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Top Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="flex items-end gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
            <div>
              <label class="block text-sm font-medium mb-2">Year:</label>
              <FormKit
                v-model="topFilter.tf_year"
                type="text"
                placeholder="Enter Year"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Fund:</label>
              <FormKit
                v-model="topFilter.tf_fund"
                type="text"
                placeholder="Enter Fund"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">PTJ:</label>
              <FormKit
                v-model="topFilter.tf_ouncode"
                type="text"
                placeholder="Enter PTJ"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Cost Centre:</label>
              <FormKit
                v-model="topFilter.tf_costcentre"
                type="text"
                placeholder="Enter Cost Centre"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Activity:</label>
              <FormKit
                v-model="topFilter.tf_activity"
                type="text"
                placeholder="Enter Activity"
                outer-class="mb-0"
              />
            </div>
          </div>
          <div class="flex-shrink-0">
            <rs-button @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Search
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Budget Structure List -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Structure List</div>
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
          <div class="budget-structure-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-structure-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredStructureList"
              :field="['no', 'Fund', 'PTJ', 'Cost Centre', 'Activity', 'Activity Description', 'Budget Code', 'Budget Code Description', 'Deficit Budget', 'Status', 'Year', 'Action']"
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
              <template v-slot:Fund="data">{{ data.value.Fund }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:CostCentre="data">{{ data.value['Cost Centre'] }}</template>
              <template v-slot:Activity="data">{{ data.value.Activity }}</template>
              <template v-slot:ActivityDescription="data">{{ data.value['Activity Description'] }}</template>
              <template v-slot:BudgetCode="data">{{ data.value['Budget Code'] }}</template>
              <template v-slot:BudgetCodeDescription="data">{{ data.value['Budget Code Description'] }}</template>
              <template v-slot:DeficitBudget="data">{{ data.value['Deficit Budget'] }}</template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.Status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.Status === 'INACTIVE',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:Year="data">{{ data.value.Year }}</template>
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
                  <button
                    @click="handleEdit(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
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
              <rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Add/Edit Budget Structure Modal -->
    <rs-modal
      v-model="showStructureModal"
      title="Budget Structure"
      size="lg"
      dialog-class="budget-structure-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg budget-structure-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Budget Structure' : (isEditMode ? 'Edit Budget Structure' : 'Add Budget Structure') }}
          </h4>
          <Icon
            @click="handleCancelStructure"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave">
          <div class="space-y-2 py-2">
            <div v-if="isEditMode" class="hidden">
              <FormKit v-model="structureForm.ID" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Fund<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.FUND"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">PTJ<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.OUN"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Cost Center<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.CCR"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Activity<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.ACTIVITY"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Budget Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.BUDGETCODE"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Year<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="structureForm.YEAR"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                  input-class="format-integer"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Deficit<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="structureForm.DEFISIT"
                  type="select"
                  :options="deficitOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="structureForm.DEFISIT && !isViewMode"
                  type="button"
                  @click="structureForm.DEFISIT = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="structureForm.STAT"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="structureForm.STAT && !isViewMode"
                  type="button"
                  @click="structureForm.STAT = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelStructure">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSave" :disabled="loading">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-structure-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Budget Structure modal */
.budget-structure-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.budget-structure-modal-custom .modal-header > :last-child:not(.budget-structure-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.budget-structure-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.budget-structure-modal-custom .budget-structure-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>

