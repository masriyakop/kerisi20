<script setup>
definePageMeta({
  title: "New Variation Order (VO)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Variation Order(VO)", path: "/purchasing/variation-order" },
    { name: "New Variation Order (VO)", path: "/purchasing/variation-order/new" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from route query
const agv_id = computed(() => {
  if (route.query.id) return parseInt(route.query.id);
  return null;
});

const mode = computed(() => {
  if (route.query.mode) return route.query.mode;
  return 'add';
});

const isViewMode = computed(() => mode.value === 'view');
const isEditMode = computed(() => mode.value === 'edit');

// Form data - Details section
const voForm = ref({
  agv_vo_no: "",
  agv_date_of_letter: "",
  agv_reference_no: "",
  agr_agreement_no: "",
  agr_agreement_id: "",
  agr_amt: 0,
  agv_amt: 0,
  agv_reason: "",
  agv_document: "",
  agv_status: "DRAFT",
});

const loading = ref(false);

// Dropdown options
const agreementNoOptions = ref([]);

// Fetch master data
const fetchMasterData = async () => {
  if (!agv_id.value && mode.value !== 'add') return;
  
  try {
    loading.value = true;
    // TODO: Implement API to fetch VO data
  } catch (error) {
    console.error("Error fetching VO data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch VO data",
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

// Watch Agreement No to fetch agreement details
watch(() => voForm.value.agr_agreement_no, async (newAgreementNo) => {
  if (newAgreementNo) {
    // TODO: Fetch agreement details (ID, Amount) based on agreement no
    // const { data } = await useFetch(`/api/purchasing/variation-order/lookups/agreement/${newAgreementNo}`, {
    //   method: "GET",
    //   initialCache: false,
    // });
    // if (data.value?.statusCode === 200) {
    //   voForm.value.agr_agreement_id = data.value.data.agr_agreement_id;
    //   voForm.value.agr_amt = data.value.data.agr_amt;
    // }
  }
});

// Calculate new agreement amount
const newAgreementAmount = computed(() => {
  const agreementAmt = voForm.value.agr_amt || 0;
  const voAmt = voForm.value.agv_amt || 0;
  return agreementAmt + voAmt;
});

// Handle save
const handleSave = async () => {
  try {
    loading.value = true;
    
    // Validate required fields
    if (!voForm.value.agv_date_of_letter) {
      $swal.fire({
        title: "Validation Error",
        text: "Date of Letter is required",
        icon: "error",
      });
      return;
    }
    
    if (!voForm.value.agv_reference_no) {
      $swal.fire({
        title: "Validation Error",
        text: "Reference No is required",
        icon: "error",
      });
      return;
    }
    
    if (!voForm.value.agr_agreement_no) {
      $swal.fire({
        title: "Validation Error",
        text: "Agreement No is required",
        icon: "error",
      });
      return;
    }
    
    if (!voForm.value.agv_amt || voForm.value.agv_amt <= 0) {
      $swal.fire({
        title: "Validation Error",
        text: "Amount VO (RM) is required and must be greater than 0",
        icon: "error",
      });
      return;
    }
    
    if (!voForm.value.agv_reason) {
      $swal.fire({
        title: "Validation Error",
        text: "Reason is required",
        icon: "error",
      });
      return;
    }
    
    // TODO: Implement API to save VO
    $swal.fire({
      title: "Info",
      text: "Save functionality to be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error saving VO:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to save VO",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/purchasing/variation-order/list");
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (agv_id.value) {
    await fetchMasterData();
  }
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">
          {{ isViewMode ? 'View' : (isEditMode ? 'Edit' : 'New') }} Variation Order (VO)
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
          <!-- Details Section -->
          <div class="space-y-4 mb-6">
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
              Details
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- VO No -->
              <FormKit
                v-model="voForm.agv_vo_no"
                type="text"
                label="VO No *"
                placeholder="Auto Assigned"
                :disabled="true"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Date of Letter -->
              <FormKit
                v-model="voForm.agv_date_of_letter"
                type="date"
                label="Date of Letter *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Reference No -->
              <FormKit
                v-model="voForm.agv_reference_no"
                type="text"
                label="Reference No *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Agreement No -->
              <FormKit
                v-model="voForm.agr_agreement_no"
                type="select"
                label="Agreement No *"
                :options="agreementNoOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Agreement ID (hidden) -->
              <FormKit
                v-model="voForm.agr_agreement_id"
                type="text"
                label="Aggreement ID"
                class="d-none"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Agreement Amount (RM) -->
              <FormKit
                v-model="voForm.agr_amt"
                type="text"
                label="Agreement Amount (RM) *"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Amount VO (RM) -->
              <FormKit
                v-model="voForm.agv_amt"
                type="text"
                label="Amount VO (RM) *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- New Amount Agreement (RM) -->
              <FormKit
                :model-value="newAgreementAmount.toFixed(2)"
                type="text"
                label="New Amount Agreement (RM)"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Reason -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="voForm.agv_reason"
                  type="textarea"
                  label="Reason *"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Upload Document -->
              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  label="Upload Document"
                  :disabled="isViewMode"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  outer-class="mb-0"
                />
              </div>
            </div>
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
