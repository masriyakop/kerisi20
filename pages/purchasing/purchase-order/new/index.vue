<script setup>
definePageMeta({
  title: "New Purchase Order",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Order", path: "/purchasing/purchase-order" },
    { name: "New Purchase Order", path: "/purchasing/purchase-order/new" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from route query
const pom_order_id = computed(() => {
  if (route.query.id) return parseInt(route.query.id);
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('po_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (route.query.mode) return route.query.mode;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('po_form_mode') || 'add';
  }
  return 'add';
});

const isViewMode = computed(() => mode.value === 'view');
const isEditMode = computed(() => mode.value === 'edit');

// Form data - Information section
const purchaseOrderForm = ref({
  pom_order_no: "",
  vcs_vendor_code: "",
  pom_deliver_address: "",
  pom_request_by: "",
  pom_estimate_delivery_date: "",
  pom_request_date: "",
  pom_document_no: "",
  pom_description: "",
  pom_document_received_date: "",
  pom_purchase_method: "",
  pom_purchase_type: "",
  pom_contact_person: "",
  pom_order_status: "DRAFT",
});

// Form data - Details section
const detailsForm = ref({
  pom_total_amount: 0,
  pom_discount_amount: 0,
});

// Detail list (for items) - PO Items
const detailList = ref([]);
const loading = ref(false);

// PR List data
const prList = ref([]);
const loadingPRList = ref(false);
const selectedPR = ref(null);

// PR Items data
const prItemsList = ref([]);
const loadingPRItems = ref(false);

// Process Flow data
const processFlowList = ref([]);
const loadingProcessFlow = ref(false);

// Dropdown options
const vendorOptions = ref([]);
const requestByOptions = ref([]);
const purchaseMethodOptions = ref([]);
const purchaseTypeOptions = ref([]);
const contactPersonOptions = ref([]);

// Fetch master data
const fetchMasterData = async () => {
  // Only fetch if we have an ID (Edit or View mode)
  if (!pom_order_id.value) return;
  
  try {
    loading.value = true;
    
    const { data } = await useFetch(`/api/purchasing/purchase-order/${pom_order_id.value}`, {
      method: "GET",
      initialCache: false,
    });
    
    if (data.value?.statusCode === 200) {
      const poData = data.value.data;
      
      // Populate Information section
      purchaseOrderForm.value = {
        pom_order_no: poData.pom_order_no || "",
        vcs_vendor_code: poData.vcs_vendor_code || "",
        pom_deliver_address: poData.pom_deliver_address || "",
        pom_request_by: poData.pom_request_by || "",
        pom_estimate_delivery_date: poData.pom_estimate_delivery_date || "",
        pom_request_date: poData.pom_request_date || "",
        pom_document_no: poData.pom_document_no || "",
        pom_description: poData.pom_description || "",
        pom_document_received_date: poData.pom_document_received_date || "",
        pom_purchase_method: poData.pom_purchase_method || "",
        pom_purchase_type: poData.pom_purchase_type || "",
        pom_contact_person: poData.pom_contact_person || "",
        pom_order_status: poData.pom_order_status || "DRAFT",
      };
      
      // Populate Details section
      detailsForm.value = {
        pom_total_amount: poData.pom_total_amount || 0,
        pom_discount_amount: poData.pom_discount_amount || 0,
      };
      
      // Populate detail list (purchase order details)
      if (poData.purchase_order_details && Array.isArray(poData.purchase_order_details)) {
        detailList.value = poData.purchase_order_details.map((detail, index) => ({
          no: index + 1,
          pod_order_detl_id: detail.pod_order_detl_id,
          pod_line_no: detail.pod_line_no || 0,
          rqm_requisition_no: detail.rqm_requisition_no || "",
          bdg_budget_code: detail.bdg_budget_code || "",
          am_account_code: detail.am_account_code || "",
          itm_item_code: detail.itm_item_code || "",
          oun_code: detail.oun_code || "",
          pod_order_qty: detail.pod_order_qty || 0,
          pod_unit_price: detail.pod_unit_price || 0,
          pod_gross_amt: detail.pod_gross_amt || 0,
          pod_discount: detail.pod_discount || 0,
          pod_total_amt: detail.pod_total_amt || 0,
          pod_total_invoiced: detail.pod_total_invoiced || 0,
          pod_total_paid: detail.pod_total_paid || 0,
          pod_item_spec: detail.pod_item_spec || "",
          pod_status: detail.pod_status || "",
          pod_request_no: detail.pod_request_no || "",
          pod_received_qty: detail.pod_received_qty || 0,
          pod_uom: detail.pod_uom || "",
          pod_crnote_amt: detail.pod_crnote_amt || 0,
          pod_lib_seq: detail.pod_lib_seq || "",
          so_code: detail.so_code || "",
          cpa_project_no: detail.cpa_project_no || "",
          pod_pakej_no: detail.pod_pakej_no || 0,
          itm_item_no: detail.itm_item_no || 0,
          pod_brand: detail.pod_brand || "",
          cny_country_code: detail.cny_country_code || "",
          pod_taxcode: detail.pod_taxcode || "",
          pod_taxpct: detail.pod_taxpct || 0,
          pod_taxamt: detail.pod_taxamt || 0,
          ccr_costcentre: detail.ccr_costcentre || "",
          pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || "",
          fty_fund_type: detail.fty_fund_type || "",
          at_activity_code: detail.at_activity_code || "",
          pod_at_activity_code_budget: detail.pod_at_activity_code_budget || "",
          sbg_budget_id: detail.sbg_budget_id || null,
          pod_ent_amt: detail.pod_ent_amt || 0,
          pod_total_amtrm: detail.pod_total_amtrm || 0,
          pod_req_no: detail.pod_req_no || "",
          rqd_requisition_id: detail.rqd_requisition_id || null,
          pod_flag_manual: detail.pod_flag_manual || "",
          pod_cn_amount_ent: detail.pod_cn_amount_ent || 0,
          pod_cn_amount: detail.pod_cn_amount || 0,
        }));
      } else {
        detailList.value = [];
      }
      
      // Fetch PR List and Process Flow
      await Promise.all([
        fetchPRList(),
        fetchProcessFlow(),
      ]);
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch purchase order data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching purchase order data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch purchase order data",
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

// Fetch PR List
const fetchPRList = async () => {
  if (!pom_order_id.value) {
    prList.value = [];
    return;
  }
  
  try {
    loadingPRList.value = true;
    const { data } = await useFetch(`/api/purchasing/purchase-order/${pom_order_id.value}/pr-list`, {
      method: "GET",
      initialCache: false,
    });
    
    if (data.value?.statusCode === 200) {
      prList.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching PR list:", error);
  } finally {
    loadingPRList.value = false;
  }
};

// Fetch PR Items
const fetchPRItems = async (rqm_requisition_no) => {
  if (!pom_order_id.value || !rqm_requisition_no) {
    prItemsList.value = [];
    return;
  }
  
  try {
    loadingPRItems.value = true;
    const { data } = await useFetch(`/api/purchasing/purchase-order/${pom_order_id.value}/pr-items`, {
      method: "GET",
      query: { rqm_requisition_no },
      initialCache: false,
    });
    
    if (data.value?.statusCode === 200) {
      prItemsList.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching PR items:", error);
  } finally {
    loadingPRItems.value = false;
  }
};

// Fetch Process Flow
const fetchProcessFlow = async () => {
  if (!pom_order_id.value) {
    processFlowList.value = [];
    return;
  }
  
  try {
    loadingProcessFlow.value = true;
    const { data } = await useFetch(`/api/purchasing/purchase-order/${pom_order_id.value}/process-flow`, {
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

// Handle PR selection
const handlePRSelect = (item) => {
  selectedPR.value = item;
  fetchPRItems(item["Requisition No"]);
};

// Handle save
const handleSave = async () => {
  try {
    loading.value = true;
    
    // Validate required fields
    if (!purchaseOrderForm.value.vcs_vendor_code) {
      $swal.fire({
        title: "Validation Error",
        text: "Vendor is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_request_by) {
      $swal.fire({
        title: "Validation Error",
        text: "Request By is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_request_date) {
      $swal.fire({
        title: "Validation Error",
        text: "Request Date is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_document_no) {
      $swal.fire({
        title: "Validation Error",
        text: "Document No is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_description) {
      $swal.fire({
        title: "Validation Error",
        text: "Purchase Description is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_document_received_date) {
      $swal.fire({
        title: "Validation Error",
        text: "Document Received Date is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_purchase_type) {
      $swal.fire({
        title: "Validation Error",
        text: "Purchase Type is required",
        icon: "error",
      });
      return;
    }
    
    if (!purchaseOrderForm.value.pom_contact_person) {
      $swal.fire({
        title: "Validation Error",
        text: "Contact Person is required",
        icon: "error",
      });
      return;
    }
    
    // TODO: Implement API to save purchase order
    $swal.fire({
      title: "Info",
      text: "Save functionality to be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error saving purchase order:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to save purchase order",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/purchasing/purchase-order/list");
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  // Fetch master data if in Edit or View mode (when ID exists)
  if (pom_order_id.value && (isEditMode.value || isViewMode.value)) {
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
          {{ isViewMode ? 'View' : (isEditMode ? 'Edit' : 'New') }} Purchase Order
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
              <!-- Order No -->
              <FormKit
                v-model="purchaseOrderForm.pom_order_no"
                type="text"
                label="Order No"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Vendor -->
              <FormKit
                v-model="purchaseOrderForm.vcs_vendor_code"
                type="select"
                label="Vendor *"
                :options="vendorOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Deliver Address -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="purchaseOrderForm.pom_deliver_address"
                  type="textarea"
                  label="Deliver Address"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Request By -->
              <FormKit
                v-model="purchaseOrderForm.pom_request_by"
                type="select"
                label="Request By *"
                :options="requestByOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Estimate Delivery Date -->
              <FormKit
                v-model="purchaseOrderForm.pom_estimate_delivery_date"
                type="date"
                label="Estimate Delivery Date *"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Request Date -->
              <FormKit
                v-model="purchaseOrderForm.pom_request_date"
                type="date"
                label="Request Date *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Document No -->
              <FormKit
                v-model="purchaseOrderForm.pom_document_no"
                type="text"
                label="Document No *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Purchase Description -->
              <div class="md:col-span-2">
                <FormKit
                  v-model="purchaseOrderForm.pom_description"
                  type="textarea"
                  label="Purchase Description *"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
              
              <!-- Document Received Date -->
              <FormKit
                v-model="purchaseOrderForm.pom_document_received_date"
                type="date"
                label="Document Received Date *"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Purchase Method -->
              <FormKit
                v-model="purchaseOrderForm.pom_purchase_method"
                type="select"
                label="Purchase Method"
                :options="purchaseMethodOptions"
                :disabled="isViewMode"
                outer-class="mb-0"
              />
              
              <!-- Purchase Type -->
              <FormKit
                v-model="purchaseOrderForm.pom_purchase_type"
                type="select"
                label="Purchase Type *"
                :options="purchaseTypeOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Contact Person -->
              <FormKit
                v-model="purchaseOrderForm.pom_contact_person"
                type="select"
                label="Contact Person *"
                :options="contactPersonOptions"
                :disabled="isViewMode"
                validation="required"
                validation-visibility="dirty"
                outer-class="mb-0"
              />
              
              <!-- Status -->
              <FormKit
                v-model="purchaseOrderForm.pom_order_status"
                type="text"
                label="Status"
                :disabled="true"
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
              <!-- Total Amount -->
              <FormKit
                v-model="detailsForm.pom_total_amount"
                type="text"
                label="Total Amount"
                :disabled="true"
                outer-class="mb-0"
              />
              
              <!-- Discount Amount -->
              <FormKit
                v-model="detailsForm.pom_discount_amount"
                type="text"
                label="Discount Amount"
                :disabled="true"
                outer-class="mb-0"
              />
            </div>
          </div>
          
          <!-- PR List Datatable -->
          <rs-card v-if="pom_order_id">
            <template #header>
              <div class="text-lg font-semibold">PR List</div>
            </template>
            <template #body>
              <div class="pr-list-table-wrapper" :style="{ maxHeight: prList.length > 10 ? '600px' : 'auto', overflowY: prList.length > 10 ? 'auto' : 'visible' }">
                <div v-if="loadingPRList" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <rs-table
                  v-else
                  :data="prList"
                :field="['No', 'Requisition No', 'Title', 'Amount', 'Status', 'Request Date', 'PTJ Code']"
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
                <template v-slot:RequisitionNo="data">
                  <span 
                    :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedPR?.rqm_requisition_id === data.value.rqm_requisition_id }"
                    class="cursor-pointer px-2 py-1 rounded"
                    @click="handlePRSelect(data.value)"
                  >
                    {{ data.value['Requisition No'] }}
                  </span>
                </template>
                <template v-slot:Title="data">
                  {{ data.value.Title }}
                </template>
                <template v-slot:Amount="data">
                  <div class="text-right">
                    {{ data.value.Amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:Status="data">
                  {{ data.value.Status }}
                </template>
                <template v-slot:RequestDate="data">
                  {{ data.value['Request Date'] }}
                </template>
                <template v-slot:PTJCode="data">
                  {{ data.value['PTJ Code'] }}
                </template>
              </rs-table>
              </div>
            </template>
          </rs-card>

          <!-- PR Items Datatable -->
          <rs-card v-if="selectedPR">
            <template #header>
              <div class="text-lg font-semibold">PR Items</div>
            </template>
            <template #body>
              <div class="pr-items-table-wrapper" :style="{ maxHeight: prItemsList.length > 10 ? '600px' : 'auto', overflowY: prItemsList.length > 10 ? 'auto' : 'visible' }">
                <div v-if="loadingPRItems" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <rs-table
                  v-else
                  :data="prItemsList"
                :field="['No', 'Item Code', 'Item Description', 'Qty', 'UOM', 'Price', 'Gross Amount', 'Total Price', 'Total Price RM', 'Status']"
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
                <template v-slot:ItemCode="data">
                  {{ data.value.itm_item_code }}
                </template>
                <template v-slot:ItemDescription="data">
                  {{ data.value['Item Description'] }}
                </template>
                <template v-slot:Qty="data">
                  {{ data.value.rqd_qty }}
                </template>
                <template v-slot:UOM="data">
                  {{ data.value.rqd_uom }}
                </template>
                <template v-slot:Price="data">
                  <div class="text-right">
                    {{ data.value.rqd_price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:GrossAmount="data">
                  <div class="text-right">
                    {{ data.value.rqd_gross_amt.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:TotalPrice="data">
                  <div class="text-right">
                    {{ data.value.rqd_total_price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:TotalPriceRM="data">
                  <div class="text-right">
                    {{ data.value.rqd_total_price_rm.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:Status="data">
                  {{ data.value.rqd_status }}
                </template>
              </rs-table>
              </div>
            </template>
          </rs-card>

          <!-- PO Items Datatable -->
          <rs-card v-if="pom_order_id">
            <template #header>
              <div class="text-lg font-semibold">PO Items</div>
            </template>
            <template #body>
              <div class="po-items-table-wrapper" :style="{ maxHeight: detailList.length > 10 ? '600px' : 'auto', overflowY: detailList.length > 10 ? 'auto' : 'visible' }">
                <div v-if="loading" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <rs-table
                  v-else
                  :data="detailList"
                :field="['No', 'Line No', 'PR No', 'Item Code', 'Item Spec', 'Qty', 'UOM', 'Unit Price', 'Gross Amount', 'Discount', 'Total Amount', 'Status']"
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
                  {{ data.value.no || data.value.pod_line_no || '' }}
                </template>
                <template v-slot:LineNo="data">
                  {{ data.value.pod_line_no || '' }}
                </template>
                <template v-slot:PRNo="data">
                  {{ data.value.rqm_requisition_no || '' }}
                </template>
                <template v-slot:ItemCode="data">
                  {{ data.value.itm_item_code || '' }}
                </template>
                <template v-slot:ItemSpec="data">
                  {{ data.value.pod_item_spec || '' }}
                </template>
                <template v-slot:Qty="data">
                  {{ data.value.pod_order_qty || '' }}
                </template>
                <template v-slot:UOM="data">
                  {{ data.value.pod_uom || '' }}
                </template>
                <template v-slot:UnitPrice="data">
                  <div class="text-right">
                    {{ (data.value.pod_unit_price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:GrossAmount="data">
                  <div class="text-right">
                    {{ (data.value.pod_gross_amt || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:Discount="data">
                  <div class="text-right">
                    {{ (data.value.pod_discount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:TotalAmount="data">
                  <div class="text-right">
                    {{ (data.value.pod_total_amt || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </template>
                <template v-slot:Status="data">
                  {{ data.value.pod_status || '' }}
                </template>
              </rs-table>
              </div>
            </template>
          </rs-card>

          <!-- Process Flow Datatable -->
          <rs-card v-if="pom_order_id">
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
.pr-list-table-wrapper :deep(.rs-table thead th),
.pr-items-table-wrapper :deep(.rs-table thead th),
.po-items-table-wrapper :deep(.rs-table thead th),
.process-flow-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 600;
}

.pr-list-table-wrapper :deep(.rs-table thead th.sortable),
.pr-items-table-wrapper :deep(.rs-table thead th.sortable),
.po-items-table-wrapper :deep(.rs-table thead th.sortable),
.process-flow-table-wrapper :deep(.rs-table thead th.sortable) {
  cursor: pointer;
}

.pr-list-table-wrapper :deep(.rs-table thead th.sortable:hover),
.pr-items-table-wrapper :deep(.rs-table thead th.sortable:hover),
.po-items-table-wrapper :deep(.rs-table thead th.sortable:hover),
.process-flow-table-wrapper :deep(.rs-table thead th.sortable:hover) {
  background-color: #2563eb !important;
}

/* Scrollbar for tables with more than 10 rows */
.pr-list-table-wrapper,
.pr-items-table-wrapper,
.po-items-table-wrapper,
.process-flow-table-wrapper {
  max-height: 600px;
  overflow-y: auto;
}
</style>
