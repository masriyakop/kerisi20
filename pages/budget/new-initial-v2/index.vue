<script setup>
definePageMeta({
  title: "New Initial V2",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "New Initial V2", path: "/budget/new-initial-v2" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from sessionStorage instead of URL query params
const bam_id = computed(() => {
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('initial_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('initial_form_mode') || 'add';
  }
  return 'add';
});

// Form data
const initialForm = ref({
  bam_year: new Date().getFullYear().toString(),
  bam_allocation_no: "",
  bam_quarter_id: "",
  bam_endorse_doc: "",
  bam_file_name: "",
  bam_status_cd: "DRAFT",
  bam_total_amt: 0,
  bam_id: null,
});

// Detail initial list
const detailList = ref([]);
const loading = ref(false);
const pageSize = ref(5);
const currentPage = ref(1);
const totalRecords = ref(0);
const searchKeyword = ref("");

// Modal state for detail form
const showDetailModal = ref(false);
const isEditDetailMode = ref(false);
const editingDetailId = ref(null);
const detailForm = ref({
  filter: "",
  fty_fund_type: "",
  at_activity_code: "",
  oun_code: "",
  ccr_costcentre: "",
  budget_code: "",
  sbg_budget_id: "",
  initial_amt: "",
});

// Process flow data
const processFlowList = ref([]);
const loadingProcessFlow = ref(false);

// Workflow form
const workflowForm = ref({
  option: "",
  remarks: "",
});

// Dropdown options
const yearOptions = ref([]);
const quarterOptions = ref([]);
const fundTypeOptions = ref([]);
const activityOptions = ref([]);
const ptjOptions = ref([]);
const costCentreOptions = ref([]);
const budgetCodeOptions = ref([]);
const workflowOptions = ref([]);

// File upload
const csvFile = ref(null);
const csvFileName = ref("");

// Fetch master data
const fetchMasterData = async () => {
  if (!bam_id.value) return;
  
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/new-initial-v2/master`, {
      method: "GET",
      query: { bam_id: bam_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const master = data.value.data;
      initialForm.value = {
        bam_year: master.YEAR || new Date().getFullYear().toString(),
        bam_allocation_no: master.REFERENCE || "",
        bam_quarter_id: master.QUARTER || "",
        bam_endorse_doc: master.ENDORSE_DOC || "",
        bam_file_name: master.FILENAMING || "",
        bam_status_cd: master.STAT || "DRAFT",
        bam_total_amt: 0,
        bam_id: bam_id.value,
      };
    }
  } catch (error) {
    console.error("Error fetching master data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch detail list
const fetchDetailList = async () => {
  if (!bam_id.value) {
    detailList.value = [];
    return;
  }

  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/new-initial-v2/detail`, {
      method: "GET",
      query: { 
        bam_id: bam_id.value,
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchKeyword.value,
      },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      detailList.value = (data.value.data || []).map((item, index) => ({
        index: (currentPage.value - 1) * pageSize.value + index + 1,
        ID: item.ID,
        BUDGET_ID: item.BUDGET_ID,
        FUND: item.FUND,
        ACTIVITY: item.ACTIVITY,
        PTJ: item.PTJ,
        CCR: item.CCR,
        BUDGET_CODE: item.BUDGET_CODE,
        AMT: item.AMT,
        initial_amt: parseFloat(item.initial_amt) || 0,
        STAT: item.STAT,
      }));
      totalRecords.value = data.value.meta?.total || 0;
    }
  } catch (error) {
    console.error("Error fetching detail list:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch process flow
const fetchProcessFlow = async () => {
  if (!bam_id.value) {
    processFlowList.value = [];
    return;
  }

  try {
    loadingProcessFlow.value = true;
    const { data } = await useFetch(`/api/budget/new-initial-v2/process-flow`, {
      method: "GET",
      query: { bam_id: bam_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      processFlowList.value = (data.value.data || []).map((item, index) => ({
        index: index + 1,
        wfp_process_name: item.wfp_process_name,
        createdby_name: item.createdby_name,
        sts_oun_desc: item.sts_oun_desc,
        stf_email_addr: item.stf_email_addr,
        stf_telno_work: item.stf_telno_work,
        was_status_desc: item.was_status_desc,
        remark: item.remark,
        createddate: item.createddate,
      }));
    }
  } catch (error) {
    console.error("Error fetching process flow:", error);
  } finally {
    loadingProcessFlow.value = false;
  }
};

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    // Fetch years
    const years = await useFetch(`/api/budget/new-initial-v2/lookups/years`, {
      method: "GET",
      initialCache: false,
    });
    if (years.data.value?.statusCode === 200) {
      yearOptions.value = years.data.value.data.map((item) => ({
        label: item.FLC_NAME,
        value: item.FLC_ID,
      }));
    }

    // Fetch quarters (will be filtered by year)
    const quarters = await useFetch(`/api/budget/new-initial-v2/lookups/quarters`, {
      method: "GET",
      query: { year: initialForm.value.bam_year },
      initialCache: false,
    });
    if (quarters.data.value?.statusCode === 200) {
      quarterOptions.value = quarters.data.value.data.map((item) => ({
        label: item.text,
        value: item.id,
      }));
    }

    // Fetch fund types
    const fundTypes = await useFetch(`/api/budget/new-initial-v2/lookups/fund-types`, {
      method: "GET",
      initialCache: false,
    });
    if (fundTypes.data.value?.statusCode === 200) {
      fundTypeOptions.value = fundTypes.data.value.data.map((item) => ({
        label: `${item.fty_fund_type} - ${item.fty_fund_desc}`,
        value: item.fty_fund_type,
      }));
    }

    // Fetch activities
    const activities = await useFetch(`/api/budget/new-initial-v2/lookups/activities`, {
      method: "GET",
      initialCache: false,
    });
    if (activities.data.value?.statusCode === 200) {
      activityOptions.value = activities.data.value.data.map((item) => ({
        label: `${item.at_activity_code} - ${item.at_activity_description_bm}`,
        value: item.at_activity_code,
      }));
    }

    // Fetch PTJs
    const ptjs = await useFetch(`/api/budget/new-initial-v2/lookups/ptjs`, {
      method: "GET",
      initialCache: false,
    });
    if (ptjs.data.value?.statusCode === 200) {
      ptjOptions.value = ptjs.data.value.data.map((item) => ({
        label: `${item.oun_code} - ${item.oun_desc}`,
        value: item.oun_code,
      }));
    }

    // Fetch cost centres
    const costCentres = await useFetch(`/api/budget/new-initial-v2/lookups/cost-centres`, {
      method: "GET",
      initialCache: false,
    });
    if (costCentres.data.value?.statusCode === 200) {
      costCentreOptions.value = costCentres.data.value.data.map((item) => ({
        label: `${item.ccr_costcentre} - ${item.ccr_costcentre_desc}`,
        value: item.ccr_costcentre,
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Watch year to fetch quarters
watch(() => initialForm.value.bam_year, async (newYear) => {
  if (newYear) {
    try {
      const { data } = await useFetch(`/api/budget/new-initial-v2/lookups/quarters`, {
        method: "GET",
        query: { year: newYear },
        initialCache: false,
      });
      if (data.value?.statusCode === 200) {
        quarterOptions.value = data.value.data.map((item) => ({
          label: item.text,
          value: item.id,
        }));
      }
    } catch (error) {
      console.error("Error fetching quarters:", error);
    }
  }
});

// Fetch budget codes based on selections
const fetchBudgetCodes = async () => {
  if (!detailForm.value.fty_fund_type || !detailForm.value.oun_code) {
    budgetCodeOptions.value = [];
    return;
  }

  try {
    const { data } = await useFetch(`/api/budget/new-initial-v2/lookups/budget-codes`, {
      method: "GET",
      query: {
        fty_fund_type: detailForm.value.fty_fund_type,
        oun_code: detailForm.value.oun_code,
        at_activity_code: detailForm.value.at_activity_code,
        ccr_costcentre: detailForm.value.ccr_costcentre,
      },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      budgetCodeOptions.value = data.value.data.map((item) => ({
        label: `${item.lbc_budget_code} - ${item.lbc_description}`,
        value: item.sbg_budget_id,
        sbg_budget_id: item.sbg_budget_id,
        budget_code: item.lbc_budget_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching budget codes:", error);
  }
};

// Watch for changes to fetch budget codes
watch([() => detailForm.value.fty_fund_type, () => detailForm.value.oun_code, () => detailForm.value.at_activity_code, () => detailForm.value.ccr_costcentre], () => {
  fetchBudgetCodes();
});

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      $swal.fire({
        title: "Error",
        text: "Please upload a CSV file",
        icon: "error",
      });
      return;
    }
    csvFile.value = file;
    csvFileName.value = file.name;
    initialForm.value.bam_file_name = file.name;
  }
};

// Handle add detail
const handleAddDetail = () => {
  isEditDetailMode.value = false;
  editingDetailId.value = null;
  detailForm.value = {
    filter: "",
    fty_fund_type: "",
    at_activity_code: "",
    oun_code: "",
    ccr_costcentre: "",
    budget_code: "",
    sbg_budget_id: "",
    initial_amt: "",
  };
  showDetailModal.value = true;
};

// Handle edit detail
const handleEditDetail = async (item) => {
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/new-initial-v2/detail/get`, {
      method: "GET",
      query: { bad_detl_id: item.ID },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const detail = data.value.data;
      detailForm.value = {
        filter: "",
        fty_fund_type: detail.FUND?.split(" - ")[0] || "",
        at_activity_code: detail.ACTIVITY?.split(" - ")[0] || "",
        oun_code: detail.PTJ?.split(" - ")[0] || "",
        ccr_costcentre: detail.CCR?.split(" - ")[0] || "",
        budget_code: detail.BUDGETCODE?.split(" - ")[0] || "",
        sbg_budget_id: detail.BUDGET_ID || "",
        initial_amt: parseFloat(detail.initial_amt) || 0,
      };
      isEditDetailMode.value = true;
      editingDetailId.value = item.ID;
      showDetailModal.value = true;
      await fetchBudgetCodes();
    }
  } catch (error) {
    console.error("Error fetching detail:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch detail data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle save detail
const handleSaveDetail = async () => {
  if (!detailForm.value.fty_fund_type || !detailForm.value.at_activity_code || 
      !detailForm.value.oun_code || !detailForm.value.ccr_costcentre || 
      !detailForm.value.budget_code || !detailForm.value.initial_amt) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  if (!bam_id.value) {
    $swal.fire({
      title: "Error",
      text: "Please save the master record first",
      icon: "error",
    });
    return;
  }

  try {
    loading.value = true;
    const payload = {
      bam_id: bam_id.value,
      bad_detl_id: isEditDetailMode.value ? editingDetailId.value : null,
      fty_fund_type: detailForm.value.fty_fund_type,
      at_activity_code: detailForm.value.at_activity_code,
      oun_code: detailForm.value.oun_code,
      ccr_costcentre: detailForm.value.ccr_costcentre,
      budget_code: detailForm.value.budget_code,
      sbg_budget_id: detailForm.value.sbg_budget_id,
      initial_amt: parseFloat(detailForm.value.initial_amt.toString().replace(/,/g, "")) || 0,
    };

    const { data } = await useFetch(`/api/budget/new-initial-v2/detail`, {
      method: isEditDetailMode.value ? "PUT" : "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isEditDetailMode.value ? "Detail updated successfully" : "Detail added successfully",
        icon: "success",
      });
      showDetailModal.value = false;
      await fetchDetailList();
      await fetchMasterData(); // Update total amount
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to save detail",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving detail:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving detail",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle delete detail
const handleDeleteDetail = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const { data } = await useFetch(`/api/budget/new-initial-v2/detail`, {
        method: "DELETE",
        query: { bad_detl_id: item.ID },
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Detail has been deleted.",
          icon: "success",
        });
        await fetchDetailList();
        await fetchMasterData();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete detail",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting detail:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting detail",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Handle save application
const handleSaveApplication = async () => {
  if (!initialForm.value.bam_year || !initialForm.value.bam_quarter_id || !initialForm.value.bam_endorse_doc) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const payload = {
      bam_id: bam_id.value,
      bam_year: initialForm.value.bam_year,
      bam_quarter_id: initialForm.value.bam_quarter_id,
      bam_endorse_doc: initialForm.value.bam_endorse_doc,
      bam_file_name: initialForm.value.bam_file_name,
      submitMode: "Save",
    };

    const { data } = await useFetch(`/api/budget/new-initial-v2/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newBamId = data.value.bam_id;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('initial_form_id', newBamId.toString());
        sessionStorage.setItem('initial_form_mode', 'edit');
      }
      
      $swal.fire({
        title: "Success",
        text: "Application saved successfully",
        icon: "success",
      });
      
      await fetchMasterData();
      await fetchDetailList();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to save application",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving application:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving application",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle submit application
const handleSubmitApplication = async () => {
  if (!initialForm.value.bam_year || !initialForm.value.bam_quarter_id || !initialForm.value.bam_endorse_doc) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  if (detailList.value.length === 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please add at least one detail",
      icon: "warning",
    });
    return;
  }

  if (!workflowForm.value.option) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select workflow option",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const payload = {
      bam_id: bam_id.value,
      bam_year: initialForm.value.bam_year,
      bam_quarter_id: initialForm.value.bam_quarter_id,
      bam_endorse_doc: initialForm.value.bam_endorse_doc,
      bam_file_name: initialForm.value.bam_file_name,
      submitMode: "Submit",
      workflow: workflowForm.value,
    };

    const { data } = await useFetch(`/api/budget/new-initial-v2/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newBamId = data.value.bam_id;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('initial_form_id', newBamId.toString());
        sessionStorage.setItem('initial_form_mode', 'edit');
      }
      
      $swal.fire({
        title: "Success",
        text: "Application submitted successfully",
        icon: "success",
      });
      
      await fetchMasterData();
      await fetchDetailList();
      await fetchProcessFlow();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to submit application",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while submitting application",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format amount input
const formatAmount = (event) => {
  let value = event.target.value.replace(/[^0-9.]/g, '');
  if (value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      detailForm.value.initial_amt = numValue.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
};

// Watch page changes
watch([currentPage, pageSize, searchKeyword], () => {
  if (bam_id.value) {
    fetchDetailList();
  }
});

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (bam_id.value) {
    await fetchMasterData();
    await fetchDetailList();
    await fetchProcessFlow();
  }
});

// Computed for total amount
const totalAmount = computed(() => {
  return detailList.value.reduce((sum, item) => sum + (item.initial_amt || 0), 0);
});

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Initial Information Form -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Initial Information</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="initialForm.bam_year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="initialForm.bam_allocation_no"
              type="text"
              label="Reference No"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="initialForm.bam_quarter_id"
              type="select"
              label="Quarter"
              :options="quarterOptions"
              placeholder="Select Quarter"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="initialForm.bam_endorse_doc"
              type="text"
              label="Authority Approval"
              placeholder="Enter Authority Approval"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">File Name (.csv)</label>
              <input
                type="file"
                accept=".csv"
                @change="handleFileUpload"
                class="w-full h-[30px] border border-gray-300 rounded px-2 text-sm"
              />
            </div>
            <FormKit
              v-model="initialForm.bam_file_name"
              type="text"
              label="File Name (.csv)"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="initialForm.bam_status_cd"
              type="text"
              label="Status"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="initialForm.bam_total_amt"
              type="text"
              label="Total Amount"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px] text-right' }"
            />
            <input
              v-model="initialForm.bam_id"
              type="hidden"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Initial Detail Datatable -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Initial Detail</div>
          <rs-button variant="primary" @click="handleAddDetail" class="h-[30px]" :disabled="!bam_id">
            <Icon name="material-symbols:add" class="mr-2" size="1rem" />
            Add
          </rs-button>
        </div>
      </template>
      <template #body>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else>
          <div class="mb-4">
            <FormKit
              v-model="searchKeyword"
              type="text"
              placeholder="Search..."
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
              @keyup.enter="fetchDetailList"
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
          </div>
          <rs-table
            :data="detailList"
            :field="['No', 'Budget Index No', 'Fund', 'Activity', 'PTJ', 'Cost Center', 'Budget Code', 'Amount', 'Action']"
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
            :currentPage="currentPage"
            :totalRecords="totalRecords"
            :hideTableSearch="true"
            :hideTablePageSize="false"
            :hideTableFooter="false"
            maxHeight="600px"
            @page-change="currentPage = $event"
            @page-size-change="pageSize = $event"
          >
            <template v-slot:No="data">
              {{ data.value.index }}
            </template>
            <template v-slot:BudgetIndexNo="data">
              {{ data.value.BUDGET_ID }}
            </template>
            <template v-slot:Fund="data">
              {{ data.value.FUND }}
            </template>
            <template v-slot:Activity="data">
              {{ data.value.ACTIVITY }}
            </template>
            <template v-slot:PTJ="data">
              {{ data.value.PTJ }}
            </template>
            <template v-slot:CostCenter="data">
              {{ data.value.CCR }}
            </template>
            <template v-slot:BudgetCode="data">
              {{ data.value.BUDGET_CODE }}
            </template>
            <template v-slot:Amount="data">
              <span class="text-right block">{{ toCurrency(data.value.initial_amt) }}</span>
            </template>
            <template v-slot:Action="data">
              <div class="flex gap-2">
                <button
                  @click="handleEditDetail(data.value)"
                  :disabled="data.value.STAT === 'APPROVE' || data.value.STAT === 'REJECT' || mode === 'view'"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                </button>
                <button
                  @click="handleDeleteDetail(data.value)"
                  :disabled="data.value.STAT === 'APPROVE' || data.value.STAT === 'REJECT' || mode === 'view'"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
                </button>
              </div>
            </template>
          </rs-table>
          <div class="mt-4 text-right">
            <span class="text-sm font-semibold">Total Amount: {{ toCurrency(totalAmount) }}</span>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Process Flow Datatable -->
    <rs-card v-if="bam_id">
      <template #header>
        <div class="text-lg font-semibold">Process Flow</div>
      </template>
      <template #body>
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
          :hideTableSearch="true"
          :hideTablePageSize="true"
          :hideTableFooter="true"
          maxHeight="400px"
        >
          <template v-slot:No="data">
            {{ data.value.index }}
          </template>
          <template v-slot:Process="data">
            {{ data.value.wfp_process_name }}
          </template>
          <template v-slot:By="data">
            {{ data.value.createdby_name }}
          </template>
          <template v-slot:PTJ="data">
            {{ data.value.sts_oun_desc }}
          </template>
          <template v-slot:Email="data">
            {{ data.value.stf_email_addr }}
          </template>
          <template v-slot:NoTelefon="data">
            {{ data.value.stf_telno_work }}
          </template>
          <template v-slot:Status="data">
            {{ data.value.was_status_desc }}
          </template>
          <template v-slot:Comment="data">
            {{ data.value.remark }}
          </template>
          <template v-slot:Date="data">
            {{ data.value.createddate }}
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Workflow Form -->
    <rs-card v-if="bam_id && initialForm.bam_status_cd !== 'DRAFT'">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="workflowForm.option"
              type="select"
              label="Option"
              :options="workflowOptions"
              placeholder="Select Option"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="md:col-span-2">
              <FormKit
                v-model="workflowForm.remarks"
                type="textarea"
                label="Remarks"
                placeholder="Enter Remarks"
                validation="required"
                rows="4"
                outer-class="mb-0"
              />
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-center gap-3">
      <rs-button variant="primary" @click="handleSaveApplication" class="h-[30px]">
        <Icon name="material-symbols:save" class="mr-2" size="1rem" />
        Save
      </rs-button>
      <rs-button variant="primary" @click="handleSubmitApplication" class="h-[30px]">
        <Icon name="material-symbols:save" class="mr-2" size="1rem" />
        Save & Submit
      </rs-button>
    </div>

    <!-- Detail Modal -->
    <rs-modal
      v-model="showDetailModal"
      :title="isEditDetailMode ? 'Edit Initial Detail' : 'Add Initial Detail'"
      size="lg"
      :overlay-close="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <FormKit
              v-model="detailForm.fty_fund_type"
              type="select"
              label="Fund"
              :options="fundTypeOptions"
              placeholder="Select Fund"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.at_activity_code"
              type="select"
              label="Activity"
              :options="activityOptions"
              placeholder="Select Activity"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.oun_code"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.ccr_costcentre"
              type="select"
              label="Cost Center"
              :options="costCentreOptions"
              placeholder="Select Cost Center"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.budget_code"
              type="select"
              label="Budget Code"
              :options="budgetCodeOptions"
              placeholder="Select Budget Code"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
              @input="(val) => {
                const selected = budgetCodeOptions.find(opt => opt.value === val);
                if (selected) {
                  detailForm.sbg_budget_id = selected.sbg_budget_id;
                }
              }"
            />
            <FormKit
              v-model="detailForm.initial_amt"
              type="text"
              label="Amount"
              placeholder="Enter Amount"
              validation="required"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px] text-right' }"
              @input="formatAmount"
            />
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showDetailModal = false" class="h-[30px]">
            Cancel
          </rs-button>
          <rs-button variant="primary" @click="handleSaveDetail" class="h-[30px]">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

