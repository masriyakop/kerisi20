<script setup>
import { useMessageLog } from "~/composables/useMessageLog";

definePageMeta({
  title: "01Cuba",
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
    "name": "Sampleform",
    "path": "/page-editor/pengujianmuka/sampleform"
  },
  {
    "name": "01Cuba",
    "path": "/page-editor/pengujianmuka/sampleform/01cuba"
  }
],
});

const { $swal } = useNuxtApp();

const pageNameForLog = "01Cuba";
const moduleNameForLog = "Sampleform";
const pageBreadcrumbTextForLog = "Page Editor > Pengujianmuka > Sampleform > 01Cuba";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName: pageNameForLog,
  moduleName: moduleNameForLog,
  pageBreadcrumbText: pageBreadcrumbTextForLog,
});

// Table data
const cubaList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit modal state
const showCubaModal = ref(false);
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
const cubaForm = ref({});

// Dropdown options - generated for fields with lookup_queryMapping
const JantinaOptions = ref([{"label":"MALE","value":"M"},{"label":"FEMALE","value":"F"}]);



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
const filteredCubaList = ref([...cubaList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...cubaList.value];

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
  filteredCubaList.value = [];
  nextTick(() => {
    filteredCubaList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredCubaList.value.length);

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
  cubaForm.value = { ...item };
  
  showCubaModal.value = true;
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
  const formFields = ["id"];
  cubaForm.value = {};
  formFields.forEach((fieldName) => {
    if (item[fieldName] !== undefined) {
      cubaForm.value[fieldName] = item[fieldName];
    }
  });
  showCubaModal.value = true;
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  cubaForm.value = {};
  
  showCubaModal.value = true;
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
      const apiPath = "${fallbackApiPath}";
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
const handleSaveCuba = async () => {
  try {
    loading.value = true;
    const apiPath = "${fallbackApiPath}";
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: cubaForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch(apiPath, {
        method: "POST",
        body: cubaForm.value,
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
      showCubaModal.value = false;
      cubaForm.value = {};
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
const handleCancelCuba = () => {
  showCubaModal.value = false;
  isViewMode.value = false;
  cubaForm.value = {};
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
        <div class="text-lg font-semibold">Pekerja</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveCuba">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="cubaForm.Nama"
                type="text"
                label="nama"
                :disabled="isViewMode"
                placeholder="Enter nama"
                outer-class="mb-0"
              />
              <FormKit
                v-model="cubaForm.Tarikh_Lahir"
                type="date"
                label="tarikh lahir"
                :disabled="isViewMode"
                placeholder="Enter tarikh lahir"
                outer-class="mb-0"
              />
              <div class="md:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span class="text-sm font-medium">jantina</span>
                <template v-for="(opt, idx) in JantinaOptions" :key="idx">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="cubaForm.Jantina" :value="opt.value" :disabled="isViewMode" class="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                    <span>{{ opt.label }}</span>
                  </label>
                </template>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <rs-button variant="danger" size="sm" @click="handleCancelCuba">
              Cancel
            </rs-button>
            <rs-button v-if="!isViewMode" variant="primary" size="sm" type="submit">
              Save
            </rs-button>
          </div>
        </FormKit>
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

</style>

<style>

</style>