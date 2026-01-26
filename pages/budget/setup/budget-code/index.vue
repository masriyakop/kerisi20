<script setup>
definePageMeta({
  title: "Budget Code",
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
      name: "Budget Code",
      path: "/budget/setup/budget-code",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const budgetCodeList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit Budget Code modal state
const showBudgetCodeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({
  lbc_level_filter: "",
  lbc_budget_code_filter: "",
  lbc_description_filter: "",
  lbc_status_filter: "",
});

// Store original filter values for reset
const originalFilter = ref({
  lbc_level_filter: "",
  lbc_budget_code_filter: "",
  lbc_description_filter: "",
  lbc_status_filter: "",
});

// Dropdown options
const levelOptions = ref([
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
]);

const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Budget Code form data
const budgetCodeForm = ref({
  lbc_id: "",
  lbc_level: "",
  lbc_budget_code: "",
  lbc_description: "",
  lbc_status: "ACTIVE",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredBudgetCodeList = ref([...budgetCodeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...budgetCodeList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const level = (item.Level || "").toString().toLowerCase();
      const budgetCode = (item["Budget Code"] || "").toLowerCase();
      const description = (item.Description || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        level.includes(keyword) ||
        budgetCode.includes(keyword) ||
        description.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.lbc_level_filter) {
    filtered = filtered.filter((item) => item.Level === smartFilter.value.lbc_level_filter);
  }

  if (smartFilter.value.lbc_budget_code_filter) {
    const filterCode = smartFilter.value.lbc_budget_code_filter.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemCode = (item["Budget Code"] || "").toLowerCase();
      return itemCode.includes(filterCode);
    });
  }

  if (smartFilter.value.lbc_description_filter) {
    const filterDesc = smartFilter.value.lbc_description_filter.toLowerCase();
    filtered = filtered.filter((item) => {
      const itemDesc = (item.Description || "").toLowerCase();
      return itemDesc.includes(filterDesc);
    });
  }

  if (smartFilter.value.lbc_status_filter) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.lbc_status_filter);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredBudgetCodeList.value = [];
  nextTick(() => {
    filteredBudgetCodeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredBudgetCodeList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch budget codes from API
const fetchBudgetCodes = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/setup/budget-code", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      budgetCodeList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Level: item.lbc_level,
        "Budget Code": item.lbc_budget_code,
        Description: item.lbc_description,
        Status: item.lbc_status,
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        lbc_id: item.lbc_id,
        lbc_level: item.lbc_level,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description,
        lbc_status: item.lbc_status,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget codes",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget codes",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  fetchBudgetCodes();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    lbc_level_filter: smartFilter.value.lbc_level_filter,
    lbc_budget_code_filter: smartFilter.value.lbc_budget_code_filter,
    lbc_description_filter: smartFilter.value.lbc_description_filter,
    lbc_status_filter: smartFilter.value.lbc_status_filter,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    lbc_level_filter: "",
    lbc_budget_code_filter: "",
    lbc_description_filter: "",
    lbc_status_filter: "",
  };
  originalFilter.value = {
    lbc_level_filter: "",
    lbc_budget_code_filter: "",
    lbc_description_filter: "",
    lbc_status_filter: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    lbc_level_filter: originalFilter.value.lbc_level_filter,
    lbc_budget_code_filter: originalFilter.value.lbc_budget_code_filter,
    lbc_description_filter: originalFilter.value.lbc_description_filter,
    lbc_status_filter: originalFilter.value.lbc_status_filter,
  };
  showSmartFilter.value = false;
};

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.lbc_id;
  budgetCodeForm.value = {
    lbc_id: item.lbc_id.toString(),
    lbc_level: item.lbc_level.toString(),
    lbc_budget_code: item["Budget Code"],
    lbc_description: item.Description || "",
    lbc_status: item.Status,
  };
  showBudgetCodeModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.lbc_id;
  budgetCodeForm.value = {
    lbc_id: item.lbc_id.toString(),
    lbc_level: item.lbc_level.toString(),
    lbc_budget_code: item["Budget Code"],
    lbc_description: item.Description || "",
    lbc_status: item.Status,
  };
  showBudgetCodeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  budgetCodeForm.value = {
    lbc_id: "",
    lbc_level: "",
    lbc_budget_code: "",
    lbc_description: "",
    lbc_status: "ACTIVE",
  };
  showBudgetCodeModal.value = true;
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

// Save Budget Code
const handleSaveBudgetCode = async () => {
  // Validation
  if (
    !budgetCodeForm.value.lbc_level ||
    !budgetCodeForm.value.lbc_budget_code ||
    !budgetCodeForm.value.lbc_status
  ) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/budget/setup/budget-code/${editingId.value}`, {
        method: "PUT",
        body: {
          lbc_level: budgetCodeForm.value.lbc_level,
          lbc_budget_code: budgetCodeForm.value.lbc_budget_code,
          lbc_description: budgetCodeForm.value.lbc_description,
          lbc_status: budgetCodeForm.value.lbc_status,
        },
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/budget/setup/budget-code", {
        method: "POST",
        body: {
          lbc_level: budgetCodeForm.value.lbc_level,
          lbc_budget_code: budgetCodeForm.value.lbc_budget_code,
          lbc_description: budgetCodeForm.value.lbc_description,
          lbc_status: budgetCodeForm.value.lbc_status,
        },
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Budget code updated successfully" : "Budget code created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchBudgetCodes();
      
      // Reset form and close modal
      showBudgetCodeModal.value = false;
      budgetCodeForm.value = {
        lbc_id: "",
        lbc_level: "",
        lbc_budget_code: "",
        lbc_description: "",
        lbc_status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save budget code",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving budget code:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving budget code",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Budget Code form
const handleCancelBudgetCode = () => {
  showBudgetCodeModal.value = false;
  isViewMode.value = false;
  budgetCodeForm.value = {
    lbc_id: "",
    lbc_level: "",
    lbc_budget_code: "",
    lbc_description: "",
    lbc_status: "ACTIVE",
  };
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete budget code "${item["Budget Code"]}"?`,
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
      const response = await useFetch(`/api/budget/setup/budget-code/${item.lbc_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Budget code has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchBudgetCodes();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete budget code",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting budget code:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting budget code",
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
        <div class="text-lg font-semibold">Budget Code</div>
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
          <div class="budget-code-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-code-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredBudgetCodeList"
              :field="['no', 'Level', 'Budget Code', 'Description', 'Status', 'Action']"
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
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Level="data">
                {{ data.value.Level }}
              </template>
              <template v-slot:BudgetCode="data">
                {{ data.value['Budget Code'] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
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
            <!-- Level -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Level:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.lbc_level_filter"
                  type="select"
                  :options="levelOptions"
                  placeholder="Select Level"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.lbc_level_filter"
                  type="button"
                  @click="smartFilter.lbc_level_filter = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Budget Code -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Budget Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.lbc_budget_code_filter"
                  type="text"
                  placeholder="Enter Budget Code"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.lbc_description_filter"
                  type="text"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.lbc_status_filter"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.lbc_status_filter"
                  type="button"
                  @click="smartFilter.lbc_status_filter = ''"
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

    <!-- Add/Edit Budget Code Modal -->
    <rs-modal
      v-model="showBudgetCodeModal"
      title="Budget Code"
      size="lg"
      dialog-class="budget-code-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg budget-code-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Budget Code' : (isEditMode ? 'Edit Budget Code' : 'Add Budget Code') }}
          </h4>
          <Icon
            @click="handleCancelBudgetCode"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveBudgetCode">
          <div class="space-y-2 py-2">
            <!-- Level -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Level<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_level"
                  type="select"
                  :options="levelOptions"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Select Level"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Budget Code -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Budget Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_budget_code"
                  type="text"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Enter Budget Code"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="budgetCodeForm.lbc_description"
                  type="text"
                  :disabled="isViewMode"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="budgetCodeForm.lbc_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="budgetCodeForm.lbc_status && !isViewMode"
                  type="button"
                  @click="budgetCodeForm.lbc_status = ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancelBudgetCode">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveBudgetCode">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-code-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Budget Code modal - 75% of lg size (800px * 0.75 = 600px) */
.budget-code-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.budget-code-modal-custom .modal-header > :last-child:not(.budget-code-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.budget-code-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.budget-code-modal-custom .budget-code-modal-header {
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

/* Ensure Smart Filter modal header matches Budget Code modal styling */
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
