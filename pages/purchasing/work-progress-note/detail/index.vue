<script setup>
definePageMeta({
  title: "Work Progress Note Detail",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Work Progress Note", path: "/purchasing/work-progress-note" },
    { name: "Work Progress Note Detail", path: "/purchasing/work-progress-note/detail" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from route query
const wpm_progress_id = computed(() => {
  if (route.query.id) return parseInt(route.query.id);
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('wpn_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (route.query.mode) return route.query.mode;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('wpn_form_mode') || 'add';
  }
  return 'add';
});

const isViewMode = computed(() => mode.value === 'view');
const isEditMode = computed(() => mode.value === 'edit');

// Form data - WPN Information section
const wpnForm = ref({
  wpm_progress_no: "",
  wpm_type: "",
  pom_order_no: "",
  vcs_vendor_code: "",
  vcs_vendor_name: "",
  pom_description: "",
  wpm_currency_code: "",
  wpm_receive_date: "",
  wpm_reference_doc: "",
  wpm_create_date: "",
  wpm_status: "DRAFT",
});

// Detail list (for existing PR/PO in WPN/GRN)
const detailList = ref([]);
const loading = ref(false);

// Dropdown options
const wpnTypeOptions = ref([
  { label: "PR", value: "PR" },
  { label: "PO", value: "PO" },
]);
const poPrNoOptions = ref([]);
const vendorOptions = ref([]);

// Fetch master data
const fetchMasterData = async () => {
  if (!wpm_progress_id.value && mode.value !== 'add') return;
  
  try {
    loading.value = true;
    // TODO: Implement API to fetch WPN data
    // const { data } = await useFetch(`/api/purchasing/work-progress-note/detail/${wpm_progress_id.value}`, {
    //   method: "GET",
    //   initialCache: false,
    // });
  } catch (error) {
    console.error("Error fetching WPN data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch WPN data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    // TODO: Implement API endpoints for dropdowns
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Watch WPN Type to fetch PO/PR options
watch(() => wpnForm.value.wpm_type, async (newType) => {
  if (newType) {
    // TODO: Fetch PO/PR numbers based on type
    // if (newType === 'PR') {
    //   // Fetch PR numbers
    // } else if (newType === 'PO') {
    //   // Fetch PO numbers
    // }
  }
});

// Watch PO/PR No to fetch vendor and description
watch(() => wpnForm.value.pom_order_no, async (newPoPrNo) => {
  if (newPoPrNo && wpnForm.value.wpm_type) {
    // TODO: Fetch vendor code, vendor name, and description based on PO/PR No
  }
});

// Fetch existing PR/PO in WPN/GRN
const fetchExistingPRPO = async () => {
  if (!wpm_progress_id.value) return;
  
  try {
    loading.value = true;
    // TODO: Implement API to fetch existing PR/PO
    // const { data } = await useFetch(`/api/purchasing/work-progress-note/detail/existing-pr-po`, {
    //   method: "GET",
    //   query: { wpm_progress_id: wpm_progress_id.value },
    //   initialCache: false,
    // });
  } catch (error) {
    console.error("Error fetching existing PR/PO:", error);
  } finally {
    loading.value = false;
  }
};

// Handle save
const handleSave = async () => {
  try {
    loading.value = true;
    
    // Validate required fields
    if (!wpnForm.value.wpm_create_date) {
      $swal.fire({
        title: "Validation Error",
        text: "WPN Create Date is required",
        icon: "error",
      });
      return;
    }
    
    if (!wpnForm.value.vcs_vendor_code) {
      $swal.fire({
        title: "Validation Error",
        text: "Vendor Code is required",
        icon: "error",
      });
      return;
    }
    
    if (!wpnForm.value.vcs_vendor_name) {
      $swal.fire({
        title: "Validation Error",
        text: "Vendor Name is required",
        icon: "error",
      });
      return;
    }
    
    // TODO: Implement API to save WPN
    $swal.fire({
      title: "Info",
      text: "Save functionality to be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error saving WPN:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to save WPN",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/purchasing/work-progress-note/list");
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (wpm_progress_id.value) {
    await fetchMasterData();
    await fetchExistingPRPO();
  }
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">
          {{ isViewMode ? 'View' : (isEditMode ? 'Edit' : 'New') }} Work Progress Note
        </div>
      </template>
      <template #body>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
        
        <FormKit
          v-else
          type="form"
          :actions="false"
          @submit="handleSave"
        >
          <!-- WPN Information Section -->
          <div class="space-y-4 mb-6">
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
              WPN Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- WPN No -->
              <FormKit
                v-model="wpnForm.wpm_progress_no"
                type="text"
                label="WPN No"
                :disabled="true"
                placeholder="Auto Assigned"
                outer-class="mb-0"
              />
              
              <!-- WPN Type -->
              <FormKit
                v-model="wpnForm.wpm_type"
                type="select"
                label="WPN Type"
                :options="wpnTypeOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- PO No/PR No -->
              <FormKit
                v-model="wpnForm.pom_order_no"
                type="select"
                label="PO No/ PR No (A DRAFT version WPN will be created upon using this PO No)"
                :options="poPrNoOptions"
                :disabled="isViewMode || !wpnForm.wpm_type"
                outer-class="mb-0"
              />
              
              <!-- Vendor Code -->
              <FormKit
                v-model="wpnForm.vcs_vendor_code"
                type="select"
                label="Vendor Code *"
                :options="vendorOptions"
                :disabled="true"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Vendor Name -->
              <FormKit
                v-model="wpnForm.vcs_vendor_name"
                type="text"
                label="Vendor Name *"
                :disabled="true"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- PO Description -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="wpnForm.pom_description"
                  type="textarea"
                  label="PO Description"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Currency Code -->
              <FormKit
                v-model="wpnForm.wpm_currency_code"
                type="text"
                label="Currency Code"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- DO Date -->
              <FormKit
                v-model="wpnForm.wpm_receive_date"
                type="date"
                label="DO Date"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- DO No -->
              <FormKit
                v-model="wpnForm.wpm_reference_doc"
                type="text"
                label="DO No"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- WPN Create Date -->
              <FormKit
                v-model="wpnForm.wpm_create_date"
                type="date"
                label="WPN Create Date *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Status -->
              <FormKit
                v-model="wpnForm.wpm_status"
                type="text"
                label="Status"
                :disabled="true"
                placeholder="DRAFT"
                outer-class="mb-0"
              />
            </div>
          </div>
          
          <!-- List of Existing PR / PO in WPN / GRN Section -->
          <div class="space-y-4 mb-6" v-if="wpm_progress_id">
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
              List of Existing PR / PO in WPN / GRN
            </h3>
            
            <div v-if="detailList.length === 0" class="text-center py-4 text-gray-500">
              No existing PR/PO found
            </div>
            
            <!-- TODO: Add datatable for existing PR/PO -->
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 mt-6">
            <rs-button
              variant="secondary"
              @click="handleCancel"
            >
              Cancel
            </rs-button>
            <rs-button
              v-if="!isViewMode"
              variant="primary"
              @click="handleSave"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
