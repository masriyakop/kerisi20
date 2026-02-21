<script setup>
definePageMeta({
  title: "Allocation",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Setup",
      path: "/budget/setup",
    },
    {
      name: "Allocation",
      path: "/budget/setup/allocation",
    },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Allocation";
const moduleName = "Budget";
const pageBreadcrumbText = "Dashboard > Budget > Setup > Allocation";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Table data
const allocationList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);
const pageSize = ref(10);
const searchKeyword = ref("");

// Add/Edit Allocation modal state
const showAllocationModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);
const allocationForm = ref({
  ID: "",
  YEARS: "",
  DESCS: "",
  SDATE: "",
  EDATE: "",
  STAT: "ACTIVE",
});

// Smart Filter modal state
const showSmartFilter = ref(false);
const smartFilter = ref({
  qbu_year: "",
  qbu_description: "",
  qbu_start_date: "",
  qbu_end_date: "",
  statusDesc: "",
});

// Store original filter values for reset
const originalFilter = ref({
  qbu_year: "",
  qbu_description: "",
  qbu_start_date: "",
  qbu_end_date: "",
  statusDesc: "",
});

// Dropdown options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

const yearOptions = ref([]);

// Filtered data - using ref instead of computed for better reactivity
const filteredAllocationList = ref([...allocationList.value]);

// Fetch year options
const fetchYearOptions = async () => {
  try {
    // This would typically come from an API, for now use current year ± 5 years
    const currentYear = new Date().getFullYear();
    yearOptions.value = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      yearOptions.value.push({ label: i.toString(), value: i.toString() });
    }
  } catch (error) {
    console.error("Error fetching year options:", error);
  }
};

// Function to apply filters
const applyFilters = () => {
  let filtered = [...allocationList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const year = (item.Year || "").toString().toLowerCase();
      const allocation = (item['Allocation'] || "").toLowerCase();
      const startDate = (item['Start Date'] || "").toLowerCase();
      const endDate = (item['End Date'] || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        year.includes(keyword) ||
        allocation.includes(keyword) ||
        startDate.includes(keyword) ||
        endDate.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.qbu_year) {
    filtered = filtered.filter((item) => item.Year === smartFilter.value.qbu_year);
  }

  if (smartFilter.value.qbu_description) {
    const filterDesc = smartFilter.value.qbu_description.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemDesc = (item['Allocation'] || "").toLowerCase();
      return itemDesc.includes(filterDesc);
    });
  }

  if (smartFilter.value.qbu_start_date) {
    filtered = filtered.filter((item) => item['Start Date'] === smartFilter.value.qbu_start_date);
  }

  if (smartFilter.value.qbu_end_date) {
    filtered = filtered.filter((item) => item['End Date'] === smartFilter.value.qbu_end_date);
  }

  if (smartFilter.value.statusDesc) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.statusDesc);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredAllocationList.value = [];
  nextTick(() => {
    filteredAllocationList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredAllocationList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch allocations from API
const fetchAllocations = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/setup/allocation", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      allocationList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Year: item.YEARS,
        'Allocation': item.DESCSFORMATTED,
        'Start Date': item.SDATE,
        'End Date': item.EDATE,
        Status: item.STAT,
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        ID: item.ID,
        YEARS: item.YEARS,
        DESCS: item.DESCS,
        DESCSFORMATTED: item.DESCSFORMATTED,
        SDATE: item.SDATE,
        EDATE: item.EDATE,
        STAT: item.STAT,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch allocations",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching allocations:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching allocations",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchYearOptions();
  fetchAllocations();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    qbu_year: smartFilter.value.qbu_year,
    qbu_description: smartFilter.value.qbu_description,
    qbu_start_date: smartFilter.value.qbu_start_date,
    qbu_end_date: smartFilter.value.qbu_end_date,
    statusDesc: smartFilter.value.statusDesc,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    qbu_year: "",
    qbu_description: "",
    qbu_start_date: "",
    qbu_end_date: "",
    statusDesc: "",
  };
  originalFilter.value = {
    qbu_year: "",
    qbu_description: "",
    qbu_start_date: "",
    qbu_end_date: "",
    statusDesc: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    qbu_year: originalFilter.value.qbu_year,
    qbu_description: originalFilter.value.qbu_description,
    qbu_start_date: originalFilter.value.qbu_start_date,
    qbu_end_date: originalFilter.value.qbu_end_date,
    statusDesc: originalFilter.value.statusDesc,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.ID;
  allocationForm.value = {
    ID: item.ID,
    YEARS: item.YEARS,
    DESCS: item.DESCS,
    SDATE: item.SDATE,
    EDATE: item.EDATE,
    STAT: item.STAT,
  };
  showAllocationModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  allocationForm.value = {
    ID: "",
    YEARS: new Date().getFullYear().toString(),
    DESCS: "",
    SDATE: "",
    EDATE: "",
    STAT: "ACTIVE",
  };
  showAllocationModal.value = true;
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
  pageName: "Allocation",
  apiDataPath: "/api/budget/setup/allocation",
  defaultExportColumns: ["Year", "Allocation", "Start Date", "End Date", "Status"],
  getFilteredList: () => filteredAllocationList.value,
  datatableRef,
  searchKeyword,
  smartFilter,
  applyFilters,
  getLookupLabel: (opts, val) => {
    if (!opts || !Array.isArray(opts) || val == null || val === "") return val ?? "";
    const opt = opts.find((o) => String(o.value) === String(val) || String(o.label) === String(val));
    return opt ? opt.label : val;
  },
  smartFilterLabels: { qbu_year: "Year", qbu_description: "Allocation", qbu_start_date: "Start Date", qbu_end_date: "End Date", statusDesc: "Status" },
  smartFilterOptionsLookup: { statusDesc: statusOptions },
});

// Edit function
const handleEdit = async (item) => {
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/setup/allocation/${item.ID}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      isEditMode.value = true;
      isViewMode.value = false;
      editingId.value = item.ID;
      allocationForm.value = {
        ID: data.value.data.ID,
        YEARS: data.value.data.YEARS,
        DESCS: data.value.data.DESCS,
        SDATE: data.value.data.SDATE,
        EDATE: data.value.data.EDATE,
        STAT: data.value.data.STAT,
      };
      showAllocationModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch allocation",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching allocation:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching allocation",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Delete function
const handleDelete = async (item) => {
  const messageText = `Are you sure? Do you want to delete allocation "${item.DESCS}"?`;
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete allocation "${item.DESCS}"?`,
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
      const { data } = await useFetch(`/api/budget/setup/allocation/${item.ID}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Allocation has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchAllocations();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete allocation",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting allocation:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting allocation",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save function (Create or Update)
const handleSave = async () => {
  // Validation
  if (!allocationForm.value.YEARS || !allocationForm.value.DESCS || !allocationForm.value.SDATE || !allocationForm.value.EDATE || !allocationForm.value.STAT) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Year, Description, Start Date, End Date, Status)",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const url = isEditMode.value
      ? `/api/budget/setup/allocation/${editingId.value}`
      : "/api/budget/setup/allocation";
    const method = isEditMode.value ? "PUT" : "POST";

    const { data } = await useFetch(url, {
      method,
      body: allocationForm.value,
      initialCache: false,
    });

    if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
      const successMessage = isEditMode.value ? "Success. Allocation updated successfully" : "Success. Allocation is created successfully";
      $swal.fire({
        title: "Success",
        text: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      if (isEditMode.value) await logUpdateSuccess(successMessage, "Allocation updated");
      else await logCreateSuccess(successMessage, "Allocation created");
      showAllocationModal.value = false;
      await fetchAllocations();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to save allocation",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving allocation:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving allocation",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel function
const handleCancelAllocation = () => {
  showAllocationModal.value = false;
  isViewMode.value = false;
  allocationForm.value = {
    ID: "",
    YEARS: new Date().getFullYear().toString(),
    DESCS: "",
    SDATE: "",
    EDATE: "",
    STAT: "ACTIVE",
  };
};
</script>

<template>
  <div class="space-y-6">
    <input
      ref="templateFileInputRef"
      type="file"
      accept=".json,application/json"
      class="hidden"
      @change="onTemplateFileChange"
    />
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Allocation</div>
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
          <div class="allocation-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`allocation-table`"
              :data="filteredAllocationList"
              :field="['no', 'Year', 'Allocation', 'Start Date', 'End Date', 'Status', 'Action']"
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
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Year="data">
                {{ data.value.Year }}
              </template>
              <template v-slot:Allocation="data">
                {{ data.value['Allocation'] }}
              </template>
              <template v-slot:StartDate="data">
                {{ data.value['Start Date'] }}
              </template>
              <template v-slot:EndDate="data">
                {{ data.value['End Date'] }}
              </template>
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
            <!-- Year -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Year:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.qbu_year"
                  type="select"
                  :options="yearOptions"
                  placeholder="Select Year"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.qbu_year"
                  type="button"
                  @click="smartFilter.qbu_year = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Allocation -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Allocation:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.qbu_description"
                  type="text"
                  placeholder="Enter Allocation"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Start Date -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Start Date:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.qbu_start_date"
                  type="date"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- End Date -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">End Date:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.qbu_end_date"
                  type="date"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.statusDesc"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.statusDesc"
                  type="button"
                  @click="smartFilter.statusDesc = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>
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

    <!-- Add/Edit Allocation Modal -->
    <rs-modal
      v-model="showAllocationModal"
      title="Allocation"
      size="lg"
      dialog-class="allocation-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg allocation-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Allocation' : (isEditMode ? 'Edit Allocation' : 'Add Allocation') }}
          </h4>
          <Icon
            @click="handleCancelAllocation"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave">
          <div class="space-y-2 py-2">
            <!-- ID (hidden) -->
            <div v-if="isEditMode" class="hidden">
              <FormKit
                v-model="allocationForm.ID"
                type="text"
                disabled
              />
            </div>

            <!-- Year -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Year<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="allocationForm.YEARS"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Enter Year"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="allocationForm.DESCS"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                  input-class="uppercase"
                />
              </div>
            </div>

            <!-- Start Date -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Start Date<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="allocationForm.SDATE"
                  type="date"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- End Date -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">End Date<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="allocationForm.EDATE"
                  type="date"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="allocationForm.STAT"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="allocationForm.STAT && !isViewMode"
                  type="button"
                  @click="allocationForm.STAT = ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancelAllocation">
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
.allocation-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Allocation modal */
.allocation-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.allocation-modal-custom .modal-header > :last-child:not(.allocation-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.allocation-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.allocation-modal-custom .allocation-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Hide default close icon for Smart Filter modal */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure Smart Filter modal header matches Allocation modal styling */
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

