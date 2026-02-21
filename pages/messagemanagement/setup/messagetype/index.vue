<script setup>
import { useMessageLog } from "~/composables/useMessageLog";

definePageMeta({
  title: "Message Type",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Messagemanagement",
    "path": "/messagemanagement"
  },
  {
    "name": "Setup",
    "path": "/messagemanagement/setup"
  },
  {
    "name": "Messagetype",
    "path": "/messagemanagement/setup/messagetype"
  },
  {
    "name": "Message Type",
    "path": "/messagemanagement/setup/messagetype/messagetype"
  }
],
});

const { $swal } = useNuxtApp();

const pageNameForLog = "Message Type";
const moduleNameForLog = "Messagetype";
const pageBreadcrumbTextForLog = "Messagemanagement > Setup > Messagetype > Message Type";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName: pageNameForLog,
  moduleName: moduleNameForLog,
  pageBreadcrumbText: pageBreadcrumbTextForLog,
});

// Table data
const messagetypeList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showMessagetypeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({});
const originalFilter = ref({});

// Top Filter state
const topFilter = ref({});

// Smart Filter labels for export (field key -> display label)
// Smart Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
const smartFilterLabels = {"Code_filter":"Code","Description_filter":"Description","Status_filter":"Status"};
const smartFilterOptionsMap = {"Status_filter":"StatusOptions"};

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
// No top filter labels
// No top filter options mapping

// Form data
const messagetypeForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const StatusOptions = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);



// Helper function to get lookup label from options array
const getLookupLabel = (options, value) => {
  if (!options || !Array.isArray(options) || value === null || value === undefined || value === '') {
    return value || '';
  }
  const valueStr = String(value);
  const option = options.find(opt => String(opt.value) === valueStr || String(opt.label) === valueStr);
  return option ? option.label : value;
};

// Helper function to format date to DD/MM/YYYY
const formatDate = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format datetime to DD/MM/YYYY HH:MI:SS AM/PM
const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    return `${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return '-';
  }
};

// Helper function to format date to YYYY-MM-DD for HTML date input
const formatDateForInput = (value) => {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};


// Fetch data function - fetches all data, rs-table handles pagination client-side
const fetchData = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
    };

    // Remove empty values
    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null) {
        delete query[key];
      }
    });


    const { data: data0 } = await useFetch("/api/message-management/setup/message-type", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      messagetypeList.value = (data0.value.data || []).map((item, idx) => {
        const mappedItem = {
          no: idx + 1,
          Action: "",
        };
        // Map fields from API response
        Object.keys(item).forEach((key) => {
          mappedItem[key] = item[key];
        });
        return mappedItem;
      });
      applyFilters();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Filtered data - using ref instead of computed for better reactivity
const filteredMessagetypeList = ref([...messagetypeList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...messagetypeList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return Object.keys(item).some((key) => {
        if (key === 'no' || key === 'Action') return false;
        const value = String(item[key] || "").toLowerCase();
        return value.includes(keyword);
      });
    });
  }

  // Apply smart filter
  // Build set of dropdown field names for exact matching (built at generation time)
  const dropdownFilterFields = ["Status"];
  
  Object.keys(smartFilter.value).forEach((key) => {
    if (smartFilter.value[key]) {
      // Remove _filter suffix to get the actual field name
      const fieldName = key.replace(/_filter$/, "");
      
      filtered = filtered.filter((item) => {
        // Try both the field name and the original key (for backward compatibility)
        const itemValue = item[fieldName] || item[key];
        const filterValue = smartFilter.value[key];
        
        // For dropdown fields, use exact match (handle type conversion)
        if (dropdownFilterFields.includes(fieldName)) {
          // Convert both to strings for comparison (handles number/string mismatches)
          return String(itemValue) === String(filterValue);
        } else {
          // For text fields, use includes (substring match)
          const itemValueStr = String(itemValue || "").toLowerCase();
          const filterValueStr = String(filterValue).toLowerCase();
          return itemValueStr.includes(filterValueStr);
        }
      });
    }
  });

  // Update the filtered list - force reactivity by creating new array reference
  filteredMessagetypeList.value = [];
  nextTick(() => {
    filteredMessagetypeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredMessagetypeList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Check if any smart filter is active
const hasActiveFilters = computed(() => {
  return Object.values(smartFilter.value).some((value) => {
    return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
  });
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {};
  originalFilter.value = {};
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
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
  pageName: "Message Type",
  apiDataPath: "/api/message-management/setup/message-type",
  defaultExportColumns: ["Code", "Description", "Status"],
  getFilteredList: () => filteredMessagetypeList.value,
  datatableRef,
  searchKeyword,
  smartFilter,
  topFilter,
  applyFilters,
  getLookupLabel,
  columnOptionsLookup: { Status: StatusOptions },
  smartFilterLabels: { Code_filter: "Code", Description_filter: "Description", Status_filter: "Status" },
  smartFilterOptionsLookup: { Status_filter: StatusOptions },
});

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  messagetypeForm.value = { ...item };
  
  showMessagetypeModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  // Copy only the aliased fields (form fields) to avoid sending stale original field values
  // This prevents original database fields (like lde_value) from overwriting edited alias values (like Code)
  // The PUT endpoint processes original fields LAST, so they would overwrite alias values if both are present
  // Only copy aliased fields (form fields) - exclude original database fields to prevent stale values
  const formFields = ["id","Code","Description","Status"];
  messagetypeForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      messagetypeForm.value[fieldName] = item[fieldName];
    }
  });
  showMessagetypeModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  messagetypeForm.value = {};
  
  showMessagetypeModal.value = true;
};

// Delete function
const handleDelete = async (item) => {
  const messageText = "Are you sure? Do you want to delete this record?";
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete this record?`,
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
      const apiPath = "/api/message-management/setup/message-type";
      const response = await useFetch(`${apiPath}/${item.id || Object.values(item)[0]}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Record has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchData();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete record",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Save function
const handleSaveMessagetype = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/message-management/setup/message-type";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: messagetypeForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: messagetypeForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      const successMessage = isEditMode.value ? "Success. " + pageNameForLog + " updated successfully" : "Success. " + pageNameForLog + " is created successfully";
      $swal.fire({
        title: "Success",
        text: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (isEditMode.value) {
        await logUpdateSuccess(successMessage, pageNameForLog + " updated");
      } else {
        await logCreateSuccess(successMessage, pageNameForLog + " created");
      }
      
      // Refresh data from API
      await fetchData();
      
      // Reset form and close modal
      showMessagetypeModal.value = false;
      messagetypeForm.value = {};
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save record",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving record:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel form
const handleCancelMessagetype = () => {
  showMessagetypeModal.value = false;
  isViewMode.value = false;
  messagetypeForm.value = {};
};



// Initialize on mount
onMounted(() => {
fetchData();
});
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
    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">List of Message</div>
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="messagetype_pageSize">Display:</label>
              <FormKit
                id="messagetype_pageSize"
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="messagetype_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="messagetype_searchKeyword"
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
                  :variant="hasActiveFilters ? 'danger' : 'secondary'"
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
          <div class="messagetype-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`messagetype-table`"
              :data="filteredMessagetypeList"
              :field='["no","Code","Description","Status","Action"]'
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
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="isGrouped"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                {{ data.value.Code }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ getLookupLabel(StatusOptions, data.value.Status) }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-start">
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
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Code">Code:</label>
              <div class="flex-1">
                <FormKit
                  id="smartFilter_Code"
                  v-model="smartFilter.Code_filter"
                  type="text"
                  
                  placeholder="Enter Code"
                  outer-class="mb-0"
                />
                
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Description">Description:</label>
              <div class="flex-1">
                <FormKit
                  id="smartFilter_Description"
                  v-model="smartFilter.Description_filter"
                  type="text"
                  
                  placeholder="Enter Description"
                  outer-class="mb-0"
                />
                
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium" for="smartFilter_Status">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  id="smartFilter_Status"
                  v-model="smartFilter.Status_filter"
                  type="select"
                  :options="StatusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Status_filter"
                  type="button"
                  @click="smartFilter.Status_filter = ''"
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

    <!-- Add/Edit Modal -->
    <rs-modal
      v-model="showMessagetypeModal"
      title="Add/Edit Message Type"
      size="lg"
      dialog-class="messagetype-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg messagetype-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Add/Edit Message Type' : (isEditMode ? 'Edit Add/Edit Message Type' : 'Add Add/Edit Message Type') }}
          </h4>
          <Icon
            @click="handleCancelMessagetype"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveMessagetype">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagetypeForm_Code">Code:</label>
              <div class="flex-1">
                <FormKit
                  id="messagetypeForm_Code"
                  v-model="messagetypeForm.Code"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Code"
                  outer-class="mb-0"
                  
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagetypeForm_Description">Description:</label>
              <div class="flex-1">
                <FormKit
                  id="messagetypeForm_Description"
                  v-model="messagetypeForm.Description"
                  type="text"
                  
                  :disabled="isViewMode"
                  placeholder="Enter Description"
                  outer-class="mb-0"
                  
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium" for="messagetypeForm_Status">Status:</label>
              <div class="flex-1">
                <FormKit
                  id="messagetypeForm_Status"
                  v-model="messagetypeForm.Status"
                  type="select"
                  :options="StatusOptions"
                  :disabled="isViewMode"
                  placeholder="Select Status"
                  outer-class="mb-0"
                  
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelMessagetype">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveMessagetype">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

  </div>
</template>

<style scoped>
/* Compact radio/checkbox: horizontal layout, less spacing */
.compact-radio-checkbox :deep(ul),
.compact-radio-checkbox :deep([class*="options"]) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}
.compact-radio-checkbox :deep(li) {
  margin: 0;
  padding: 0;
}
.compact-radio-checkbox :deep(label) {
  margin-bottom: 0;
}
/* Text format from component item cssClass (format-uppercase, format-initcap, format-lowercase) */
.format-uppercase :deep(input),
.format-uppercase :deep(textarea) {
  text-transform: uppercase;
}
.format-lowercase :deep(input),
.format-lowercase :deep(textarea) {
  text-transform: lowercase;
}
.format-initcap :deep(input),
.format-initcap :deep(textarea) {
  text-transform: capitalize;
}
/* Hide default table header since we're using custom header */
.messagetype-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.messagetype-table-wrapper :deep(.rs-table thead th:last-child),
.messagetype-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for List of Message modal - 75% of lg size (800px * 0.75 = 600px) */
.messagetype-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.messagetype-modal-custom .modal-header > :last-child:not(.messagetype-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.messagetype-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.messagetype-modal-custom .messagetype-modal-header {
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

/* Ensure Smart Filter modal header matches List of Message modal styling */
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