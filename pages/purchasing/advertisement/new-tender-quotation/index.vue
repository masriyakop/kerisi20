<script setup>
definePageMeta({
  title: "New Tender/Quotation",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Advertisement", path: "/purchasing/advertisement" },
    { name: "New Tender/Quotation", path: "/purchasing/advertisement/new-tender-quotation" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from route query
const tender_id = computed(() => {
  if (route.query.id) return parseInt(route.query.id);
  return null;
});

const mode = computed(() => {
  if (route.query.mode) return route.query.mode;
  return 'add';
});

const isViewMode = computed(() => mode.value === 'view');
const isEditMode = computed(() => mode.value === 'edit');

// Form data - Information section
const tenderForm = ref({
  tender_id: "",
  rqm_requisition_no: "",
  tdm_tender_no: "",
  tdm_request_by: "",
  tdm_request_date: "",
  tdm_status: "DRAFT",
  tdm_requisition_method: "",
  tdm_tender_type: "",
  tdm_title: "",
  tdm_justification: "",
  so_code: "",
  tdm_delivery_address: "",
  tdm_estimate_siap: "",
  tdm_contact_person: "",
  tdm_reference_no: "",
});

const loading = ref(false);

// Dropdown options
const requisitionNoOptions = ref([]);
const requestByOptions = ref([]);
const requisitionMethodOptions = ref([]);
const tenderTypeOptions = ref([
  { label: "TENDER", value: "TENDER" },
  { label: "QUOTATION", value: "QUOTATION" },
  { label: "DIRECT PURCHASE", value: "DIRECT PURCHASE" },
]);

// Fetch master data
const fetchMasterData = async () => {
  if (!tender_id.value && mode.value !== 'add') return;
  
  try {
    loading.value = true;
    // TODO: Implement API to fetch tender data
  } catch (error) {
    console.error("Error fetching tender data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch tender data",
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

// Handle save
const handleSave = async () => {
  try {
    loading.value = true;
    
    // Validate required fields
    if (!tenderForm.value.rqm_requisition_no) {
      $swal.fire({
        title: "Validation Error",
        text: "Purchase Requisition No is required",
        icon: "error",
      });
      return;
    }
    
    if (!tenderForm.value.tdm_request_by) {
      $swal.fire({
        title: "Validation Error",
        text: "Request By is required",
        icon: "error",
      });
      return;
    }
    
    if (!tenderForm.value.tdm_request_date) {
      $swal.fire({
        title: "Validation Error",
        text: "Request Date is required",
        icon: "error",
      });
      return;
    }
    
    if (!tenderForm.value.tdm_tender_type) {
      $swal.fire({
        title: "Validation Error",
        text: "Tender type is required",
        icon: "error",
      });
      return;
    }
    
    if (!tenderForm.value.tdm_title) {
      $swal.fire({
        title: "Validation Error",
        text: "Title is required",
        icon: "error",
      });
      return;
    }
    
    if (!tenderForm.value.tdm_justification) {
      $swal.fire({
        title: "Validation Error",
        text: "Justification is required",
        icon: "error",
      });
      return;
    }
    
    // TODO: Implement API to save tender
    $swal.fire({
      title: "Info",
      text: "Save functionality to be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error saving tender:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to save tender",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/purchasing/advertisement/request-list");
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (tender_id.value) {
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
          {{ isViewMode ? 'View' : (isEditMode ? 'Edit' : 'New') }} Tender/Quotation
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
          <!-- Information Section -->
          <div class="space-y-4 mb-6">
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
              Information
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Purchase Requisition No -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.rqm_requisition_no"
                  type="select"
                  label="Purchase Requisition No *"
                  :options="requisitionNoOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Tender / Quotation No -->
              <FormKit
                v-model="tenderForm.tdm_tender_no"
                type="text"
                label="Tender / Quotation No"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Request By -->
              <FormKit
                v-model="tenderForm.tdm_request_by"
                type="select"
                label="Request By *"
                :options="requestByOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Request Date -->
              <FormKit
                v-model="tenderForm.tdm_request_date"
                type="date"
                label="Request Date *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Status -->
              <FormKit
                v-model="tenderForm.tdm_status"
                type="text"
                label="Status"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Requisition Method -->
              <FormKit
                v-model="tenderForm.tdm_requisition_method"
                type="select"
                label="Requisition Method"
                :options="requisitionMethodOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- Tender type -->
              <FormKit
                v-model="tenderForm.tdm_tender_type"
                type="select"
                label="Tender type *"
                :options="tenderTypeOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Title -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_title"
                  type="text"
                  label="Title * (max length: 4000)"
                  :disabled="isViewMode"
                  validation="required|max:4000"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Justification -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_justification"
                  type="textarea"
                  label="Justification * (max length: 4000)"
                  :disabled="isViewMode"
                  validation="required|max:4000"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Code SO -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.so_code"
                  type="select"
                  label="Code SO"
                  :options="[]"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Quotation/Tender Delivery Address -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_delivery_address"
                  type="textarea"
                  label="Quotation/Tender Delivery Address"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Estimate Siap -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_estimate_siap"
                  type="text"
                  label="Estimate Siap"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Contact Person -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_contact_person"
                  type="text"
                  label="Contact Person"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Reference No -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="tenderForm.tdm_reference_no"
                  type="text"
                  label="Reference No"
                  placeholder="Auto Assigned"
                  :disabled="isViewMode"
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
