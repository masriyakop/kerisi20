<script setup>
definePageMeta({
  title: "New Purchase Requisition",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Requisition", path: "/purchasing/purchase-requisition" },
    { name: "New Purchase Requisition", path: "/purchasing/purchase-requisition/new" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from route query or sessionStorage
const rqm_requisition_id = computed(() => {
  if (route.query.id) return parseInt(route.query.id);
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('pr_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (route.query.mode) return route.query.mode;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('pr_form_mode') || 'add';
  }
  return 'add';
});

const isViewMode = computed(() => mode.value === 'view');
const isEditMode = computed(() => mode.value === 'edit');

// Form data - Information section
const requisitionForm = ref({
  rqm_requisition_no: "",
  rqm_request_by: "",
  rqm_request_date: "",
  rqm_status: "DRAFT",
  rqm_requisition_title: "",
  rqm_justification: "",
  rqm_agreement: "",
  rqm_agg_no: "",
  rqm_contact_person: "",
  rqm_vendor: "",
});

// Form data - Details section
const detailsForm = ref({
  rqm_enter_amount: 0,
  rqm_total_amount: 0,
  rqm_rate_date: "",
  rqm_currency_code: "",
  rqm_rate_type: "",
  rqm_conversion_unit: "",
  rqm_conversion_rate: "",
  rqm_document_no: "",
  rqm_requisition_type: "",
});

// Detail list (for items) - Items datatable
const detailList = ref([]);
const loading = ref(false);

// Process Flow data
const processFlowList = ref([]);
const loadingProcessFlow = ref(false);

// Dropdown options
const requestByOptions = ref([]);
const agreementOptions = ref([{ label: "Yes", value: "Y" }, { label: "No", value: "N" }]);
const agreementNoOptions = ref([]);
const contactPersonOptions = ref([]);
const vendorOptions = ref([]);
const currencyOptions = ref([]);
const rateTypeOptions = ref([]);
const requisitionTypeOptions = ref([]);

// Fetch master data
const fetchMasterData = async () => {
  // Only fetch if we have an ID (Edit or View mode)
  if (!rqm_requisition_id.value) return;
  
  try {
    loading.value = true;
    
    const { data } = await useFetch(`/api/purchasing/purchase-requisition/${rqm_requisition_id.value}`, {
      method: "GET",
      initialCache: false,
    });
    
    if (data.value?.statusCode === 200) {
      const reqData = data.value.data;
      
      // Populate Information section
      requisitionForm.value = {
        rqm_requisition_no: reqData.rqm_requisition_no || "",
        rqm_request_by: reqData.rqm_request_by || "",
        rqm_request_date: reqData.rqm_request_date || "",
        rqm_status: reqData.rqm_status || "DRAFT",
        rqm_requisition_title: reqData.rqm_requisition_title || "",
        rqm_justification: reqData.rqm_justification || "",
        rqm_agreement: reqData.rqm_agreement || "N",
        rqm_agg_no: reqData.rqm_agg_no || "",
        rqm_contact_person: reqData.rqm_contact_person || "",
        rqm_vendor: reqData.rqm_vendor || "",
      };
      
      // Populate Details section
      detailsForm.value = {
        rqm_enter_amount: reqData.rqm_enter_amount || 0,
        rqm_total_amount: reqData.rqm_total_amount || 0,
        rqm_rate_date: reqData.rqm_rate_date || "",
        rqm_currency_code: reqData.rqm_currency_code || "",
        rqm_rate_type: reqData.rqm_rate_type || "",
        rqm_conversion_unit: reqData.rqm_conversion_unit || 0,
        rqm_conversion_rate: reqData.rqm_conversion_rate || 0,
        rqm_document_no: reqData.rqm_document_no || "",
        rqm_requisition_type: reqData.rqm_requisition_type || "",
      };
      
      // Populate detail list (requisition details)
      if (reqData.requisition_details && Array.isArray(reqData.requisition_details)) {
        detailList.value = reqData.requisition_details.map((detail, index) => ({
          no: index + 1,
          rqd_requisition_id: detail.rqd_requisition_id,
          rqd_line_no: detail.rqd_line_no || 0,
          rqd_spec_desc: detail.rqd_spec_desc || "",
          rqd_pakej_no: detail.rqd_pakej_no || "",
          rqd_item_no: detail.rqd_item_no || 0,
          rqd_spec_level: detail.rqd_spec_level || "",
          rqd_spec_head: detail.rqd_spec_head || "",
          itm_item_code: detail.itm_item_code || "",
          rqd_qty: detail.rqd_qty || "",
          rqd_uom: detail.rqd_uom || "",
          rqd_price: detail.rqd_price || 0,
          rqd_gross_amt: detail.rqd_gross_amt || 0,
          rqd_ent_amt: detail.rqd_ent_amt || 0,
          rqd_total_price: detail.rqd_total_price || 0,
          rqd_total_price_rm: detail.rqd_total_price_rm || 0,
          org_code: detail.org_code || "",
          fty_fund_type: detail.fty_fund_type || "",
          oun_code: detail.oun_code || "",
          at_activity_code: detail.at_activity_code || "",
          ccr_costcentre: detail.ccr_costcentre || "",
          so_code: detail.so_code || "",
          cpa_project_no: detail.cpa_project_no || "",
          bdg_budget_code: detail.bdg_budget_code || "",
          acm_acct_code: detail.acm_acct_code || "",
          rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || "",
          sbg_budget_id: detail.sbg_budget_id || null,
          rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || "",
          rqd_commit_amt: detail.rqd_commit_amt || 0,
          rqd_vot: detail.rqd_vot || "",
          rqd_taxcode: detail.rqd_taxcode || "",
          rqd_taxpct: detail.rqd_taxpct || 0,
          rqd_taxamt: detail.rqd_taxamt || 0,
          rqd_status: detail.rqd_status || "",
        }));
      } else {
        detailList.value = [];
      }
      
      // Fetch Process Flow
      await fetchProcessFlow();
      
      // If agreement is 'Y', fetch agreement no options
      if (requisitionForm.value.rqm_agreement === 'Y') {
        await fetchAgreementNoOptions();
      }
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch requisition data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching requisition data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch requisition data",
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
    // Fetch request by options (staff)
    // Fetch agreement no options
    // Fetch contact person options
    // Fetch vendor options
    // Fetch currency options
    // Fetch rate type options
    // Fetch requisition type options
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Watch agreement to show/hide agreement no
watch(() => requisitionForm.value.rqm_agreement, (newVal) => {
  if (newVal === 'Y') {
    // Show agreement no field and fetch options
    fetchAgreementNoOptions();
  } else {
    requisitionForm.value.rqm_agg_no = "";
  }
});

// Fetch agreement no options
const fetchAgreementNoOptions = async () => {
  try {
    // TODO: Implement API to fetch agreement numbers
    // const { data } = await useFetch(`/api/purchasing/purchase-requisition/lookups/agreements`, {
    //   method: "GET",
    //   initialCache: false,
    // });
  } catch (error) {
    console.error("Error fetching agreement options:", error);
  }
};

// Fetch Process Flow
const fetchProcessFlow = async () => {
  if (!rqm_requisition_id.value) {
    processFlowList.value = [];
    return;
  }
  
  try {
    loadingProcessFlow.value = true;
    const { data } = await useFetch(`/api/purchasing/purchase-requisition/${rqm_requisition_id.value}/process-flow`, {
      method: "GET",
      initialCache: false,
    });
    
    if (data.value?.statusCode === 200) {
      processFlowList.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching process flow:", error);
  } finally {
    loadingProcessFlow.value = false;
  }
};

// Handle save
const handleSave = async () => {
  try {
    loading.value = true;
    
    // Validate required fields
    if (!requisitionForm.value.rqm_request_by) {
      $swal.fire({
        title: "Validation Error",
        text: "Request By is required",
        icon: "error",
      });
      return;
    }
    
    if (!requisitionForm.value.rqm_request_date) {
      $swal.fire({
        title: "Validation Error",
        text: "Request Date is required",
        icon: "error",
      });
      return;
    }
    
    if (!requisitionForm.value.rqm_requisition_title) {
      $swal.fire({
        title: "Validation Error",
        text: "Title is required",
        icon: "error",
      });
      return;
    }
    
    if (!requisitionForm.value.rqm_justification) {
      $swal.fire({
        title: "Validation Error",
        text: "Justification is required",
        icon: "error",
      });
      return;
    }
    
    if (!requisitionForm.value.rqm_agreement) {
      $swal.fire({
        title: "Validation Error",
        text: "Agreement is required",
        icon: "error",
      });
      return;
    }
    
    if (requisitionForm.value.rqm_agreement === 'Y' && !requisitionForm.value.rqm_agg_no) {
      $swal.fire({
        title: "Validation Error",
        text: "Agreement No is required when Agreement is Yes",
        icon: "error",
      });
      return;
    }
    
    if (!requisitionForm.value.rqm_contact_person) {
      $swal.fire({
        title: "Validation Error",
        text: "Contact Person is required",
        icon: "error",
      });
      return;
    }
    
    // TODO: Implement API to save requisition
    // const { data } = await useFetch(`/api/purchasing/purchase-requisition`, {
    //   method: isEditMode.value ? "PUT" : "POST",
    //   body: {
    //     ...requisitionForm.value,
    //     ...detailsForm.value,
    //     rqm_requisition_id: rqm_requisition_id.value,
    //   },
    //   initialCache: false,
    // });
    
    // if (data.value?.statusCode === 200) {
    //   $swal.fire({
    //     title: "Success",
    //     text: `Purchase Requisition ${isEditMode.value ? 'updated' : 'created'} successfully`,
    //     icon: "success",
    //   });
    //   
    //   // Navigate back to list
    //   navigateTo("/purchasing/purchase-requisition/list");
    // }
    
    $swal.fire({
      title: "Info",
      text: "Save functionality to be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error saving requisition:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to save requisition",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/purchasing/purchase-requisition/list");
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  // Fetch master data if in Edit or View mode (when ID exists)
  if (rqm_requisition_id.value && (isEditMode.value || isViewMode.value)) {
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
          {{ isViewMode ? 'View' : (isEditMode ? 'Edit' : 'New') }} Purchase Requisition
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
              <!-- Requisition No -->
              <FormKit
                v-model="requisitionForm.rqm_requisition_no"
                type="text"
                label="Requisition No"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Request By -->
              <FormKit
                v-model="requisitionForm.rqm_request_by"
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
                v-model="requisitionForm.rqm_request_date"
                type="date"
                label="Request Date *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Status -->
              <FormKit
                v-model="requisitionForm.rqm_status"
                type="text"
                label="Status"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Title -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="requisitionForm.rqm_requisition_title"
                  type="text"
                  label="Title *"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Justification -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="requisitionForm.rqm_justification"
                  type="textarea"
                  label="Justification *"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Agreement -->
              <FormKit
                v-model="requisitionForm.rqm_agreement"
                type="select"
                label="Agreement *"
                :options="agreementOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Agreement No -->
              <FormKit
                v-if="requisitionForm.rqm_agreement === 'Y'"
                v-model="requisitionForm.rqm_agg_no"
                type="select"
                label="Agreement No *"
                :options="agreementNoOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Contact Person -->
              <FormKit
                v-model="requisitionForm.rqm_contact_person"
                type="select"
                label="Contact Person *"
                :options="contactPersonOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Vendor -->
              <FormKit
                v-model="requisitionForm.rqm_vendor"
                type="select"
                label="Vendor"
                :options="vendorOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
            </div>
          </div>
          
          <!-- Details Section -->
          <div class="space-y-4 mb-6">
            <h3 class="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
              Details
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Enter Amount -->
              <FormKit
                v-model="detailsForm.rqm_enter_amount"
                type="text"
                label="Enter Amount"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Total Amount -->
              <FormKit
                v-model="detailsForm.rqm_total_amount"
                type="text"
                label="Total Amount"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Rate Date -->
              <FormKit
                v-model="detailsForm.rqm_rate_date"
                type="date"
                label="Rate Date (FOR INTERNATIONAL RATE ONLY)"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- Foreign Currency Code -->
              <FormKit
                v-model="detailsForm.rqm_currency_code"
                type="select"
                label="Foreign Currency Code"
                :options="currencyOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- Rate Type -->
              <FormKit
                v-model="detailsForm.rqm_rate_type"
                type="select"
                label="Rate Type *"
                :options="rateTypeOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Conversion Unit -->
              <FormKit
                v-model="detailsForm.rqm_conversion_unit"
                type="text"
                label="Conversion Unit *"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Conversion Rate -->
              <FormKit
                v-model="detailsForm.rqm_conversion_rate"
                type="text"
                label="Conversion Rate *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Document No -->
              <FormKit
                v-model="detailsForm.rqm_document_no"
                type="text"
                label="Document No *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Requisition Type -->
              <FormKit
                v-model="detailsForm.rqm_requisition_type"
                type="select"
                label="Requisition Type"
                :options="requisitionTypeOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
            </div>
          </div>
          
          <!-- Items Datatable -->
          <rs-card v-if="rqm_requisition_id">
            <template #header>
              <div class="text-lg font-semibold">Items</div>
            </template>
            <template #body>
              <div class="items-table-wrapper" :style="{ maxHeight: detailList.length > 10 ? '600px' : 'auto', overflowY: detailList.length > 10 ? 'auto' : 'visible' }">
                <div v-if="loading" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <rs-table
                  v-else
                  :data="detailList"
                  :field="['No', 'Line No', 'Item Code', 'Item Description', 'Qty', 'UOM', 'Price', 'Gross Amount', 'Enter Amount', 'Total Price', 'Total Price RM', 'Status']"
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
                  :pageSize="5"
                  hideTableSearch
                  hideTablePageSize
                >
                  <template v-slot:No="data">
                    {{ data.value.no }}
                  </template>
                  <template v-slot:LineNo="data">
                    {{ data.value.rqd_line_no || '' }}
                  </template>
                  <template v-slot:ItemCode="data">
                    {{ data.value.itm_item_code || '' }}
                  </template>
                  <template v-slot:ItemDescription="data">
                    {{ data.value.rqd_spec_desc || '' }}
                  </template>
                  <template v-slot:Qty="data">
                    {{ data.value.rqd_qty || '' }}
                  </template>
                  <template v-slot:UOM="data">
                    {{ data.value.rqd_uom || '' }}
                  </template>
                  <template v-slot:Price="data">
                    <div class="text-right">
                      {{ (data.value.rqd_price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                  </template>
                  <template v-slot:GrossAmount="data">
                    <div class="text-right">
                      {{ (data.value.rqd_gross_amt || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                  </template>
                  <template v-slot:EnterAmount="data">
                    <div class="text-right">
                      {{ (data.value.rqd_ent_amt || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                  </template>
                  <template v-slot:TotalPrice="data">
                    <div class="text-right">
                      {{ (data.value.rqd_total_price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                  </template>
                  <template v-slot:TotalPriceRM="data">
                    <div class="text-right">
                      {{ (data.value.rqd_total_price_rm || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                  </template>
                  <template v-slot:Status="data">
                    {{ data.value.rqd_status || '' }}
                  </template>
                </rs-table>
              </div>
            </template>
          </rs-card>

          <!-- Process Flow Datatable -->
          <rs-card v-if="rqm_requisition_id">
            <template #header>
              <div class="text-lg font-semibold">Process Flow</div>
            </template>
            <template #body>
              <div class="process-flow-table-wrapper" :style="{ maxHeight: processFlowList.length > 10 ? '600px' : 'auto', overflowY: processFlowList.length > 10 ? 'auto' : 'visible' }">
                <div v-if="loadingProcessFlow" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <rs-table
                  v-else
                  :data="processFlowList"
                  :field="['No', 'Process', 'By', 'PTJ', 'Email', 'No Telefon', 'Status', 'Comment', 'Date']"
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
                  :pageSize="5"
                  hideTableSearch
                  hideTablePageSize
                  hideTableFooter
                >
                  <template v-slot:No="data">
                    {{ data.value.no }}
                  </template>
                  <template v-slot:Process="data">
                    {{ data.value.Process }}
                  </template>
                  <template v-slot:By="data">
                    {{ data.value.By }}
                  </template>
                  <template v-slot:PTJ="data">
                    {{ data.value.PTJ }}
                  </template>
                  <template v-slot:Email="data">
                    {{ data.value.Email }}
                  </template>
                  <template v-slot:NoTelefon="data">
                    {{ data.value['No Telefon'] }}
                  </template>
                  <template v-slot:Status="data">
                    {{ data.value.Status }}
                  </template>
                  <template v-slot:Comment="data">
                    {{ data.value.Comment }}
                  </template>
                  <template v-slot:Date="data">
                    {{ data.value.Date }}
                  </template>
                </rs-table>
              </div>
            </template>
          </rs-card>
          
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
/* Blue column headers for all datatables */
.items-table-wrapper :deep(.rs-table thead th),
.process-flow-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 600;
}

.items-table-wrapper :deep(.rs-table thead th.sortable),
.process-flow-table-wrapper :deep(.rs-table thead th.sortable) {
  cursor: pointer;
}

.items-table-wrapper :deep(.rs-table thead th.sortable:hover),
.process-flow-table-wrapper :deep(.rs-table thead th.sortable:hover) {
  background-color: #2563eb !important;
}

/* Scrollbar for tables with more than 10 rows */
.items-table-wrapper,
.process-flow-table-wrapper {
  max-height: 600px;
  overflow-y: auto;
}
</style>
