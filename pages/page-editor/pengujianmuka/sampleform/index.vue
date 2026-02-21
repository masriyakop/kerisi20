<script setup>
definePageMeta({
  title: "Sample FORM",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
  {
    "name": "Page Editor",
    "path": "/page-editor"
  },
  {
    "name": "Pengujianmuka",
    "path": "/page-editor/pengujianmuka"
  },
  {
    "name": "Sample FORM",
    "path": "/page-editor/pengujianmuka/sampleform"
  }
],
});

const { $swal } = useNuxtApp();

// Table data
const sampleformList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showSampleformModal = ref(false);
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
// No smart filter labels
// No smart filter options mapping

// Top Filter labels for export (field key -> display label)
// Top Filter options mapping for export (field key -> options variable name for dropdown/radio/checkbox/listbox)
// No top filter labels
// No top filter options mapping

// Form data
const sampleformForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const item5Options = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);
const item8Options = ref([{"label":"ACTIVE","value":"1"},{"label":"INACTIVE","value":"0"}]);
const radio2Options = ref([{"label":"YES","value":"1"},{"label":"NO","value":"0"}]);



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

// Format text on blur (format-uppercase, format-initcap, format-lowercase from component item cssClass)
const handleFormatBlur = (fieldName, format) => {
  const form = sampleformForm.value;
  if (!form) return;
  const v = form[fieldName];
  if (v == null) return;
  const s = String(v);
  if (format === 'uppercase') form[fieldName] = s.toUpperCase();
  else if (format === 'lowercase') form[fieldName] = s.toLowerCase();
  else if (format === 'initcap') form[fieldName] = s.replace(/\\b\\w/g, c => c.toUpperCase());
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


    const { data: data0 } = await useFetch("/api/page-editor/pengujianmuka/sample-form", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      sampleformList.value = (data0.value.data || []).map((item, idx) => {
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
const filteredSampleformList = ref([...sampleformList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...sampleformList.value];

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
  const dropdownFilterFields = [];
  
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
  filteredSampleformList.value = [];
  nextTick(() => {
    filteredSampleformList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredSampleformList.value.length);

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



// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id || Object.values(item)[0];
  sampleformForm.value = { ...item };
  
  showSampleformModal.value = true;
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
  const formFields = ["id","Budget_Code","Description","Status"];
  sampleformForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      sampleformForm.value[fieldName] = item[fieldName];
    }
  });
  showSampleformModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  sampleformForm.value = {};
  
  showSampleformModal.value = true;
};

// Delete function
const handleDelete = async (item) => {
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

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const apiPath = "/api/page-editor/pengujianmuka/sample-form";
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
const handleSaveSampleform = async () => {
  try {
    loading.value = true;
    const apiPath = "/api/page-editor/pengujianmuka/sample-form";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: sampleformForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: sampleformForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Record updated successfully" : "Record created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchData();
      
      // Reset form and close modal
      showSampleformModal.value = false;
      sampleformForm.value = {};
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
const handleCancelSampleform = () => {
  showSampleformModal.value = false;
  isViewMode.value = false;
  sampleformForm.value = {};
};



// Initialize on mount
onMounted(() => {
fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Form</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveSampleform">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="sampleformForm.Textfield01"
                type="text"
                label="Textfield01"
                :disabled="isViewMode"
                placeholder="Enter Textfield01"
                outer-class="mb-0 format-uppercase" @blur="handleFormatBlur('Textfield01', 'uppercase')"
              />
              <div class="md:col-span-2 force-one-column format-lowercase">
                <FormKit
                v-model="sampleformForm.item10"
                type="text"
                label="textfield10"
                :disabled="isViewMode"
                placeholder="Enter textfield10"
                outer-class="mb-0 format-lowercase" @blur="handleFormatBlur('item10', 'lowercase')"
                />
              </div>
              <div class="md:col-span-2">
                <FormKit
                  v-model="sampleformForm.item2"
                  type="textarea"
                  label="item02"
                  :disabled="isViewMode"
                  placeholder="Enter item02"
                  outer-class="mb-0 format-initcap"
                  rows="4" @blur="handleFormatBlur('item2', 'initcap')"
                />
              </div>
              <FormKit
                v-model="sampleformForm.item4"
                type="date"
                label="date04"
                :disabled="isViewMode"
                placeholder="Enter date04"
                outer-class="mb-0"
              />
              <div class="md:col-span-2">
                <FormKit
                  v-model="sampleformForm.item3"
                  type="textarea"
                  label="item03"
                  :disabled="isViewMode"
                  placeholder="Enter item03"
                  outer-class="mb-0"
                  rows="4"
                />
              </div>
              <div class="md:col-span-1 flex flex-wrap items-center gap-x-4 gap-y-1 radio-inline">
                <span class="text-sm font-medium">radio5</span>
                <template v-for="(opt, idx) in item5Options" :key="idx">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="sampleformForm.item5" :value="opt.value" :disabled="isViewMode" class="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                    <span>{{ opt.label }}</span>
                  </label>
                </template>
              </div>
              <div class="md:col-span-1 flex flex-wrap items-center gap-x-4 gap-y-1 radio-inline">
                <span class="text-sm font-medium">radio02</span>
                <template v-for="(opt, idx) in radio2Options" :key="idx">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="sampleformForm.radio2" :value="opt.value" :disabled="isViewMode" class="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                    <span>{{ opt.label }}</span>
                  </label>
                </template>
              </div>
              <FormKit
                v-model="sampleformForm.item6"
                type="file"
                label="fileupload"
                :disabled="isViewMode"
                placeholder="Enter fileupload"
                outer-class="mb-0"
              />
              <FormKit
                v-model="sampleformForm.item7"
                type="mask"
                label="mask7"
                :disabled="isViewMode"
                placeholder="Enter mask7" :mask="'##/##/####'"
                outer-class="mb-0"
              />
              <div>
                <FormKit
                  v-model="sampleformForm.item8"
                  type="select"
                  label="dropdown8"
                  :options="item8Options"
                  :disabled="isViewMode"
                  placeholder="Select dropdown8"
                  outer-class="mb-0"
                />
              </div>
              <div class="md:col-span-2 flex items-center gap-2">
                <label class="text-sm font-medium">checkbox9</label>
                <input
                  type="checkbox"
                  v-model="sampleformForm.item9"
                  :true-value="'1'"
                  :false-value="''"
                  :disabled="isViewMode"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <rs-button variant="danger" size="sm" @click="handleCancelSampleform">
              Cancel
            </rs-button>
            <rs-button v-if="!isViewMode" variant="primary" size="sm" type="submit">
              Save
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">sample DATATABLE</div>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="sampleform_pageSize">Display:</label>
              <FormKit
                id="sampleform_pageSize"
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
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="sampleform_searchKeyword">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  id="sampleform_searchKeyword"
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
          <div class="sampleform-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`sampleform-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredSampleformList"
              :field='["no","Budget Code","Description","Status","Action"]'
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
              <template v-slot:BudgetCode="data">
                {{ data.value["Budget Code"] }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>

            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
            <div class="flex items-center gap-2">
              
              
              
              
            </div>
          </div>
        </div>
      </template>
    </rs-card>

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
.sampleform-table-wrapper :deep(.table-header) {
  display: none;
}

/* Left-align Action column header and cells */
.sampleform-table-wrapper :deep(.rs-table thead th:last-child),
.sampleform-table-wrapper :deep(.rs-table tbody td:last-child) {
  text-align: left !important;
}
</style>

<style>
/* Custom width for sample DATATABLE modal - 75% of lg size (800px * 0.75 = 600px) */
.sampleform-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.sampleform-modal-custom .modal-header > :last-child:not(.sampleform-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.sampleform-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.sampleform-modal-custom .sampleform-modal-header {
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

/* Ensure Smart Filter modal header matches sample DATATABLE modal styling */
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