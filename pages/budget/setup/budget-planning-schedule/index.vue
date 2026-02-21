<script setup>
definePageMeta({
  title: "Budget Planning Schedule",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Setup", path: "/budget/setup" },
    { name: "Budget Planning Schedule", path: "/budget/setup/budget-planning-schedule" },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Budget Planning Schedule";
const moduleName = "Budget";
const pageBreadcrumbText = "Dashboard > Budget > Setup > Budget Planning Schedule";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Table data
const scheduleList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);
const pageSize = ref(10);
const searchKeyword = ref("");
const topFilterYear = ref(new Date().getFullYear().toString());

// Add/Edit Schedule modal state
const showScheduleModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Filtered data - using ref instead of computed for better reactivity
const filteredScheduleList = ref([...scheduleList.value]);
const scheduleForm = ref({
  bps_id: "",
  cmd_year: "",
  cmd_start_date: "",
  cmd_end_date: "",
  cmd_status: "1",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "1" },
  { label: "INACTIVE", value: "0" },
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
  let filtered = [...scheduleList.value];

  // Filter by topFilterYear if set
  if (topFilterYear.value && topFilterYear.value.trim() !== "") {
    filtered = filtered.filter((item) => {
      const itemYear = (item['Budget Year'] || "").toString();
      return itemYear === topFilterYear.value;
    });
  }

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const budgetYear = (item['Budget Year'] || "").toString().toLowerCase();
      const planningDate = (item['Planning Date'] || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        budgetYear.includes(keyword) ||
        planningDate.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredScheduleList.value = [];
  nextTick(() => {
    filteredScheduleList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredScheduleList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilterYear and apply filters when it changes
watch(topFilterYear, () => {
  fetchSchedules();
}, { immediate: false });

// Fetch schedules from API
const fetchSchedules = async () => {
  try {
    loading.value = true;
    const query = {
      cm_filter_year: topFilterYear.value || undefined,
    };

    const { data } = await useFetch("/api/budget/setup/budget-planning-schedule", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      scheduleList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Budget Year': item.bps_year_budget,
        'Planning Date': item.planning_date,
        Status: item.bps_status === '1' || item.bps_status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        bps_id: item.bps_id,
        current_year: item.current_year,
        bps_year_budget: item.bps_year_budget,
        planning_date: item.planning_date,
        bps_status: item.bps_status,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch schedules",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching schedules:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching schedules",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchSchedules();
});

// Handle search
const handleSearch = () => {
  fetchSchedules();
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.bps_id;
  
  // Convert date from DD/MM/YYYY to YYYY-MM-DD for date input
  const convertDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };
  
  scheduleForm.value = {
    bps_id: item.bps_id,
    cmd_year: item.bps_year_budget?.toString() || '',
    cmd_start_date: convertDate(item.planning_date?.split(' - ')[0] || ''),
    cmd_end_date: convertDate(item.planning_date?.split(' - ')[1] || ''),
    cmd_status: item.bps_status,
  };
  showScheduleModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  scheduleForm.value = {
    bps_id: "",
    cmd_year: "",
    cmd_start_date: "",
    cmd_end_date: "",
    cmd_status: "1",
  };
  showScheduleModal.value = true;
};

// Datatable features (Save/Load Template, Ungroup/Group, Generate API, Download PDF/CSV)
const {
  templateFileInputRef,
  exportConfigRef,
  isGrouped,
  showGenerateApiModal,
  apiOutputType,
  generateApiLoading,
  handleSaveTemplate,
  handleLoadTemplate,
  onTemplateFileChange,
  handleGenerateApi,
  handleGenerateApiProceed,
  handleCloseGenerateApiModal,
  handleUngroupList,
  handleGroupList,
  handleDownloadPDF,
  handleDownloadCSV,
} = useDatatableFeatures({
  pageName: "Budget Planning Schedule",
  apiDataPath: "/api/budget/setup/budget-planning-schedule",
  defaultExportColumns: ["Budget Year", "Planning Date", "Status"],
  getFilteredList: () => filteredScheduleList.value,
  datatableRef,
  searchKeyword,
  smartFilter: ref({}),
  applyFilters,
  smartFilterLabels: {},
  smartFilterOptionsLookup: {},
});

// Edit function
const handleEdit = async (item) => {
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/setup/budget-planning-schedule/${item.bps_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      isEditMode.value = true;
      isViewMode.value = false;
      editingId.value = item.bps_id;
      
      // Convert date from DD/MM/YYYY to YYYY-MM-DD for date input
      const convertDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      };
      
      scheduleForm.value = {
        bps_id: data.value.data.bps_id,
        cmd_year: data.value.data.bps_year_budget?.toString() || '',
        cmd_start_date: convertDate(data.value.data.bps_plan_startDate),
        cmd_end_date: convertDate(data.value.data.bps_plan_endDate),
        cmd_status: data.value.data.bps_status,
      };
      showScheduleModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch schedule",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching schedule:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching schedule",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Delete function
const handleDelete = async (item) => {
  if (item.current_year === parseInt(item.bps_year_budget)) {
    $swal.fire({
      title: "Cannot Delete",
      text: "Cannot delete schedule for current year",
      icon: "warning",
    });
    return;
  }

  const messageText = `Are you sure? Do you want to delete schedule for year "${item.bps_year_budget}"?`;
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete schedule for year "${item.bps_year_budget}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  await updateMessageLogAction(logId, result.isConfirmed ? "Yes, delete it!" : "Cancel");

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const { data } = await useFetch(`/api/budget/setup/budget-planning-schedule/${item.bps_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Schedule has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchSchedules();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete schedule",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting schedule",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save function
const handleSave = async () => {
  if (!scheduleForm.value.cmd_year || !scheduleForm.value.cmd_start_date || !scheduleForm.value.cmd_end_date || !scheduleForm.value.cmd_status) {
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
      ? `/api/budget/setup/budget-planning-schedule/${editingId.value}`
      : "/api/budget/setup/budget-planning-schedule";
    const method = isEditMode.value ? "PUT" : "POST";

    const { data } = await useFetch(url, {
      method,
      body: scheduleForm.value,
      initialCache: false,
    });

    if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
      const successMessage = data.value.message || (isEditMode.value ? "Success. Budget Planning Schedule updated successfully" : "Success. Budget Planning Schedule is created successfully");
      $swal.fire({
        title: "Success",
        text: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      if (isEditMode.value) await logUpdateSuccess(successMessage, "Budget Planning Schedule updated");
      else await logCreateSuccess(successMessage, "Budget Planning Schedule created");
      showScheduleModal.value = false;
      await fetchSchedules();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to save schedule",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving schedule:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving schedule",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel function
const handleCancelSchedule = () => {
  showScheduleModal.value = false;
  isViewMode.value = false;
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
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Year:</label>
            <FormKit
              v-model="topFilterYear"
              type="text"
              placeholder="Enter Year"
              outer-class="mb-0 w-32"
              input-class="format-integer"
            />
          </div>
          <rs-button @click="handleSearch">
            <Icon name="material-symbols:search" class="mr-1" size="1rem" />
            Search
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Listing Schedule -->
    <input
      ref="templateFileInputRef"
      type="file"
      accept=".json,application/json"
      class="hidden"
      @change="onTemplateFileChange"
    />
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Budget Planning Schedule</div>
          <rs-dropdown
            variant="secondary-text"
            size="sm"
            :hideChevron="true"
            position="bottom"
            textAlign="right"
            itemSize="11rem"
            class="[&_.button]:!h-8 [&_.button]:!min-h-8 [&_.button]:!p-1 [&_.button]:!border-0 [&_.button]:!min-w-0"
          >
            <template #title>
              <Icon name="mdi:dots-vertical" size="1rem" />
            </template>
            <rs-dropdown-item @click="handleSaveTemplate">Save Template</rs-dropdown-item>
            <rs-dropdown-item @click="handleLoadTemplate">Load Template</rs-dropdown-item>
            <rs-dropdown-item v-if="isGrouped" @click="handleUngroupList">Ungroup List</rs-dropdown-item>
            <rs-dropdown-item v-else @click="handleGroupList">Group List</rs-dropdown-item>
            <rs-dropdown-item @click="handleGenerateApi">Generate API</rs-dropdown-item>
          </rs-dropdown>
        </div>
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
          <div class="budget-planning-schedule-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`budget-planning-schedule-table`"
              :data="filteredScheduleList"
              :field="['no', 'Budget Year', 'Planning Date', 'Status', 'Action']"
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
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="isGrouped"
            >
              <template v-slot:no="data">{{ data.value.no }}</template>
              <template v-slot:BudgetYear="data">{{ data.value['Budget Year'] }}</template>
              <template v-slot:PlanningDate="data">{{ data.value['Planning Date'] }}</template>
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
                    :disabled="data.value.current_year === parseInt(data.value.bps_year_budget)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                    :disabled="data.value.current_year === parseInt(data.value.bps_year_budget)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Generate API Modal -->
    <rs-modal
      v-model="showGenerateApiModal"
      title="Generate API"
      size="md"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Type</label>
            <FormKit
              v-model="apiOutputType"
              type="select"
              :options="[
                { label: 'JSON', value: 'JSON' },
                { label: 'PDF', value: 'PDF' },
                { label: 'CSV', value: 'CSV' },
                { label: 'EXCEL', value: 'EXCEL' },
              ]"
              outer-class="mb-0"
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            A unique API key will be generated. Use the URL to access data in the selected format. JSON and PDF display in browser; CSV and Excel download.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="handleCloseGenerateApiModal">Cancel</rs-button>
          <rs-button variant="primary" :disabled="generateApiLoading" @click="handleGenerateApiProceed">
            {{ generateApiLoading ? 'Generating...' : 'Proceed' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Budget Planning Schedule Modal -->
    <rs-modal
      v-model="showScheduleModal"
      title="Budget Planning Schedule"
      size="lg"
      dialog-class="budget-planning-schedule-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg budget-planning-schedule-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Planning Schedule' : (isEditMode ? 'Edit Planning Schedule' : 'Add Planning Schedule') }}
          </h4>
          <Icon
            @click="handleCancelSchedule"
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
              <FormKit v-model="scheduleForm.bps_id" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Year<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="scheduleForm.cmd_year"
                  type="text"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                  input-class="format-integer"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Planning Start Date<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="scheduleForm.cmd_start_date"
                  type="date"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Planning End Date<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="scheduleForm.cmd_end_date"
                  type="date"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="scheduleForm.cmd_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="scheduleForm.cmd_status && !isViewMode"
                  type="button"
                  @click="scheduleForm.cmd_status = ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancelSchedule">
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
.budget-planning-schedule-table-wrapper :deep(.table-header) {
  display: none;
}

/* Align Action column header to the right to match the icons */
.budget-planning-schedule-table-wrapper :deep(thead th:last-child) {
  text-align: right !important;
  padding-right: 1rem !important;
}

/* Ensure Action column cells are also right-aligned */
.budget-planning-schedule-table-wrapper :deep(tbody td:last-child) {
  text-align: right !important;
  padding-right: 1rem !important;
}
</style>

<style>
/* Custom width for Budget Planning Schedule modal */
.budget-planning-schedule-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.budget-planning-schedule-modal-custom .modal-header > :last-child:not(.budget-planning-schedule-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.budget-planning-schedule-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.budget-planning-schedule-modal-custom .budget-planning-schedule-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>

