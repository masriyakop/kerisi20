<script setup>
definePageMeta({
  title: "Virement V2 Form",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Virement V2 Form", path: "/budget/virement-v2-form" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from sessionStorage
const bmm_budget_movement_id = computed(() => {
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('virement_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('virement_form_mode') || 'add';
  }
  return 'add';
});

// Form data
const virementForm = ref({
  bmm_year: new Date().getFullYear().toString(),
  bmm_budget_movement_no: "",
  bmm_endorse_doc: "",
  bmm_movement_type: "",
  bmm_description: "",
  bmm_status: "DRAFT",
  bmm_money_transfer: "N",
  bmm_fileid: null,
});

// Detail lists - From and To
const fromList = ref([]);
const toList = ref([]);
const loading = ref(false);

// Modal state for detail form
const showDetailModal = ref(false);
const isEditDetailMode = ref(false);
const editingDetailId = ref(null);
const detailType = ref("From"); // "From" or "To"
const detailForm = ref({
  filter: "",
  fty_fund_type: "",
  oun_code: "",
  sbg_budget_code: "",
  fund: "",
  ptj: "",
  budget_code: "",
  qbu_quarter_id: "",
  at_activity_code: "",
  ccr_costcentre: "",
  bdg_balance_amt: "",
  bmd_mvt_amt: "",
  cym_currency_code: "",
  cyd_unit: "",
  cyd_conversation_rate: "",
  amt_currency: "",
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
const fundTypeOptions = ref([]);
const ptjOptions = ref([]);
const budgetCodeOptions = ref([]);
const quarterOptions = ref([]);
const movementTypeOptions = ref([]);
const moneyTransferOptions = ref([
  { label: "YES", value: "Y" },
  { label: "NO", value: "N" },
]);
const currencyCodeOptions = ref([]);

// Fetch master data
const fetchMasterData = async () => {
  if (!bmm_budget_movement_id.value) return;
  
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/virement-v2-form/master`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const master = data.value.data;
      virementForm.value = {
        bmm_year: master.bmm_year || new Date().getFullYear().toString(),
        bmm_budget_movement_no: master.bmm_budget_movement_no || "",
        bmm_endorse_doc: master.bmm_endorse_doc || "",
        bmm_movement_type: master.bmm_movement_type || "",
        bmm_description: master.bmm_description || "",
        bmm_status: master.bmm_status || "DRAFT",
        bmm_money_transfer: master.bmm_money_transfer || "N",
        bmm_fileid: master.bmm_fileid || null,
      };
    }
  } catch (error) {
    console.error("Error fetching master data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch detail lists - From
const fetchFromList = async () => {
  if (!bmm_budget_movement_id.value) {
    fromList.value = [];
    return;
  }

  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/virement-v2-form/detail/from`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      fromList.value = (data.value.data || []).map((item, index) => ({
        index: index + 1,
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_id: item.sbg_budget_id,
        qbu_quarter_id: item.qbu_quarter_id,
        fty_fund_type: item.fty_fund_type,
        at_activity_code: item.at_activity_code,
        oun_code: item.oun_code,
        ccr_costcentre: item.ccr_costcentre,
        sbg_budget_code: item.sbg_budget_code,
        bdg_balance_amt: parseFloat(item.bdg_balance_amt) || 0,
        bmd_mvt_amt: parseFloat(item.bmd_mvt_amt) || 0,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: parseFloat(item.cyd_conversation_rate) || 0,
        amt_currency: parseFloat(item.amt_currency) || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching from list:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch detail lists - To
const fetchToList = async () => {
  if (!bmm_budget_movement_id.value) {
    toList.value = [];
    return;
  }

  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/virement-v2-form/detail/to`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      toList.value = (data.value.data || []).map((item, index) => ({
        index: index + 1,
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_id: item.sbg_budget_id,
        qbu_quarter_id: item.qbu_quarter_id,
        fty_fund_type: item.fty_fund_type,
        at_activity_code: item.at_activity_code,
        oun_code: item.oun_code,
        ccr_costcentre: item.ccr_costcentre,
        sbg_budget_code: item.sbg_budget_code,
        bdg_balance_amt: parseFloat(item.bdg_balance_amt) || 0,
        bmd_mvt_amt: parseFloat(item.bmd_mvt_amt) || 0,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: parseFloat(item.cyd_conversation_rate) || 0,
        amt_currency: parseFloat(item.amt_currency) || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching to list:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch process flow
const fetchProcessFlow = async () => {
  if (!bmm_budget_movement_id.value) {
    processFlowList.value = [];
    return;
  }

  try {
    loadingProcessFlow.value = true;
    const { data } = await useFetch(`/api/budget/virement-v2-form/process-flow`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      processFlowList.value = (data.value.data || []).map((item, index) => ({
        index: index + 1,
        wfp_process_name: item.wfp_process_name || "",
        createdby_name: item.createdby_name || "",
        sts_oun_desc: item.sts_oun_desc || "",
        stf_email_addr: item.stf_email_addr || "",
        stf_telno_work: item.stf_telno_work || "",
        was_status_desc: item.was_status_desc || "",
        remark: item.remark || "",
        createddate: item.createddate || "",
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
    const [years, fundTypes, ptjs, quarters, movementTypes, currencyCodes] = await Promise.all([
      useFetch("/api/budget/report/lookups/years"),
      useFetch("/api/budget/planning/report/lookups/fund-type"),
      useFetch("/api/budget/planning/report/lookups/ptj"),
      useFetch("/api/budget/increment-v2-form/lookups/quarters"),
      useFetch("/api/budget/virement-v2-form/lookups/movement-types"),
      useFetch("/api/budget/virement-v2-form/lookups/currency-codes"),
    ]);

    if (years.data.value?.statusCode === 200) {
      yearOptions.value = years.data.value.data.map((item) => ({
        label: item.bdg_year,
        value: item.bdg_year,
      }));
    }

    if (fundTypes.data.value?.statusCode === 200) {
      fundTypeOptions.value = fundTypes.data.value.data.map((item) => ({
        label: `${item.fty_fund_type} - ${item.fty_fund_desc}`,
        value: item.fty_fund_type,
      }));
    }

    if (ptjs.data.value?.statusCode === 200) {
      ptjOptions.value = ptjs.data.value.data.map((item) => ({
        label: `${item.oun_code} - ${item.oun_desc}`,
        value: item.oun_code,
      }));
    }

    if (quarters.data.value?.statusCode === 200) {
      quarterOptions.value = quarters.data.value.data.map((item) => ({
        label: `${item.qbu_year} - ${item.qbu_description}`,
        value: item.qbu_quarter_id,
      }));
    }

    if (movementTypes.data.value?.statusCode === 200) {
      movementTypeOptions.value = movementTypes.data.value.data.map((item) => ({
        label: item.lde_description,
        value: item.lde_value,
      }));
    }

    if (currencyCodes.data.value?.statusCode === 200) {
      currencyCodeOptions.value = currencyCodes.data.value.data.map((item) => ({
        label: `${item.cym_currency_code} - ${item.cym_currency_desc || ''}`,
        value: item.cym_currency_code,
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: parseFloat(item.cyd_conversation_rate) || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Fetch budget codes based on fund type and PTJ
const fetchBudgetCodes = async () => {
  if (!detailForm.value.fty_fund_type || !detailForm.value.oun_code) {
    budgetCodeOptions.value = [];
    return;
  }

  try {
    const { data } = await useFetch(`/api/budget/virement-v2-form/lookups/budget-codes`, {
      method: "GET",
      query: {
        fty_fund_type: detailForm.value.fty_fund_type,
        oun_code: detailForm.value.oun_code,
      },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      budgetCodeOptions.value = data.value.data.map((item) => ({
        label: `${item.lbc_budget_code} - ${item.lbc_description}`,
        value: item.sbg_budget_id,
        sbg_budget_id: item.sbg_budget_id,
        bdg_budget_id: item.bdg_budget_id,
        qbu_quarter_id: item.qbu_quarter_id,
        bdg_balance_amt: parseFloat(item.bdg_balance_amt) || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching budget codes:", error);
  }
};

// Watch for fund type and PTJ changes to fetch budget codes
watch([() => detailForm.value.fty_fund_type, () => detailForm.value.oun_code], () => {
  fetchBudgetCodes();
});

// Watch for budget code selection
watch(() => detailForm.value.sbg_budget_code, async (newVal) => {
  if (newVal) {
    const selected = budgetCodeOptions.value.find((opt) => opt.value === newVal);
    if (selected) {
      detailForm.value.bdg_budget_id = selected.bdg_budget_id;
      detailForm.value.qbu_quarter_id = selected.qbu_quarter_id;
      detailForm.value.bdg_balance_amt = selected.bdg_balance_amt;
      
      // Fetch full budget details to populate other fields
      try {
        const { data } = await useFetch(`/api/budget/virement-v2-form/detail/get-budget`, {
          method: "GET",
          query: { bdg_budget_id: selected.bdg_budget_id },
          initialCache: false,
        });

        if (data.value?.statusCode === 200) {
          const budgetDetail = data.value.data;
          detailForm.value.fund = budgetDetail.fty_fund_type || "";
          detailForm.value.ptj = budgetDetail.oun_code || "";
          detailForm.value.budget_code = budgetDetail.sbg_budget_code || "";
          detailForm.value.qbu_quarter_id = budgetDetail.qbu_quarter_id || detailForm.value.qbu_quarter_id;
          detailForm.value.at_activity_code = budgetDetail.at_activity_code || "";
          detailForm.value.ccr_costcentre = budgetDetail.ccr_costcentre || "";
          detailForm.value.bdg_balance_amt = budgetDetail.bdg_balance_amt || detailForm.value.bdg_balance_amt;
        }
      } catch (error) {
        console.error("Error fetching budget details:", error);
      }
    }
  }
});

// Watch for currency code selection
watch(() => detailForm.value.cym_currency_code, (newVal) => {
  if (newVal) {
    const selected = currencyCodeOptions.value.find((opt) => opt.value === newVal);
    if (selected) {
      detailForm.value.cyd_unit = selected.cyd_unit || "";
      detailForm.value.cyd_conversation_rate = selected.cyd_conversation_rate || 0;
      // Calculate currency amount if virement amount is set
      if (detailForm.value.bmd_mvt_amt) {
        const virementAmt = parseFloat(detailForm.value.bmd_mvt_amt.toString().replace(/,/g, "")) || 0;
        detailForm.value.amt_currency = (virementAmt * selected.cyd_conversation_rate).toFixed(2);
      }
    }
  }
});

// Watch for virement amount changes to calculate currency amount
watch(() => detailForm.value.bmd_mvt_amt, (newVal) => {
  if (newVal && detailForm.value.cyd_conversation_rate) {
    const virementAmt = parseFloat(newVal.toString().replace(/,/g, "")) || 0;
    detailForm.value.amt_currency = (virementAmt * detailForm.value.cyd_conversation_rate).toFixed(2);
  }
});

// Handle add detail
const handleAddDetail = (type) => {
  detailType.value = type;
  isEditDetailMode.value = false;
  editingDetailId.value = null;
  detailForm.value = {
    filter: "",
    fty_fund_type: "",
    oun_code: "",
    sbg_budget_code: "",
    fund: "",
    ptj: "",
    budget_code: "",
    qbu_quarter_id: "",
    at_activity_code: "",
    ccr_costcentre: "",
    bdg_balance_amt: "",
    bmd_mvt_amt: "",
    cym_currency_code: "",
    cyd_unit: "",
    cyd_conversation_rate: "",
    amt_currency: "",
  };
  showDetailModal.value = true;
};

// Handle edit detail
const handleEditDetail = async (item, type) => {
  detailType.value = type;
  
  // For add mode (no master ID), edit local detail
  if (!bmm_budget_movement_id.value) {
    const list = type === "From" ? fromList.value : toList.value;
    detailForm.value = {
      filter: "",
      fty_fund_type: item.fty_fund_type || "",
      oun_code: item.oun_code || "",
      sbg_budget_code: item.sbg_budget_code || item.sbg_budget_id || "",
      fund: item.fty_fund_type || "",
      ptj: item.oun_code || "",
      budget_code: item.sbg_budget_code || "",
      qbu_quarter_id: item.qbu_quarter_id || "",
      at_activity_code: item.at_activity_code || "",
      ccr_costcentre: item.ccr_costcentre || "",
      bdg_balance_amt: item.bdg_balance_amt || 0,
      bmd_mvt_amt: item.bmd_mvt_amt || 0,
      bdg_budget_id: item.bdg_budget_id || "",
      cym_currency_code: item.cym_currency_code || "",
      cyd_unit: item.cyd_unit || "",
      cyd_conversation_rate: item.cyd_conversation_rate || 0,
      amt_currency: item.amt_currency || 0,
    };
    isEditDetailMode.value = true;
    editingDetailId.value = item.index; // Use index for local details
    showDetailModal.value = true;
    await fetchBudgetCodes();
    return;
  }

  // For edit mode (master ID exists), fetch from database
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/virement-v2-form/detail/get`, {
      method: "GET",
      query: { 
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        type: type,
      },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const detail = data.value.data;
      detailForm.value = {
        filter: "",
        fty_fund_type: detail.fundType_virement1 || detail.fty_fund_type?.split(" - ")[0] || "",
        oun_code: detail.ptj_virement1 || detail.oun_code?.split(" - ")[0] || "",
        sbg_budget_code: detail.sbg_budget_id || "",
        fund: detail.fty_fund_type || "",
        ptj: detail.oun_code || "",
        budget_code: detail.sbg_budget_code || "",
        qbu_quarter_id: detail.qbu_quarter_id || "",
        at_activity_code: detail.at_activity_code || "",
        ccr_costcentre: detail.ccr_costcentre || "",
        bdg_balance_amt: parseFloat(detail.bdg_balance_amt) || 0,
        bmd_mvt_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        bdg_budget_id: detail.bdg_budget_id || detail.budgetCode_virement1 || "",
        cym_currency_code: detail.cym_currency_code || "",
        cyd_unit: detail.cyd_unit || "",
        cyd_conversation_rate: parseFloat(detail.cyd_conversation_rate) || 0,
        amt_currency: parseFloat(detail.amt_currency) || 0,
      };
      isEditDetailMode.value = true;
      editingDetailId.value = item.bmd_bgt_movement_detl_id;
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
  if (!detailForm.value.fty_fund_type || !detailForm.value.oun_code || !detailForm.value.sbg_budget_code || !detailForm.value.bmd_mvt_amt) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  const list = detailType.value === "From" ? fromList.value : toList.value;

  // For add mode (no master ID), store details locally
  if (!bmm_budget_movement_id.value) {
    const newDetail = {
      index: list.length + 1,
      bmd_bgt_movement_detl_id: null,
      bdg_budget_id: detailForm.value.bdg_budget_id,
      sbg_budget_id: detailForm.value.sbg_budget_code,
      qbu_quarter_id: detailForm.value.qbu_quarter_id,
      fty_fund_type: detailForm.value.fty_fund_type,
      at_activity_code: detailForm.value.at_activity_code,
      oun_code: detailForm.value.oun_code,
      ccr_costcentre: detailForm.value.ccr_costcentre,
      sbg_budget_code: detailForm.value.sbg_budget_code,
      bdg_balance_amt: parseFloat(detailForm.value.bdg_balance_amt) || 0,
      bmd_mvt_amt: parseFloat(detailForm.value.bmd_mvt_amt.toString().replace(/,/g, "")) || 0,
      cym_currency_code: detailForm.value.cym_currency_code || "",
      cyd_unit: detailForm.value.cyd_unit || "",
      cyd_conversation_rate: parseFloat(detailForm.value.cyd_conversation_rate) || 0,
      amt_currency: parseFloat(detailForm.value.amt_currency) || 0,
    };

    if (isEditDetailMode.value && editingDetailId.value !== null) {
      // Update existing local detail
      const index = list.findIndex(item => item.index === editingDetailId.value);
      if (index !== -1) {
        list[index] = { ...newDetail, index: list[index].index };
      }
    } else {
      // Add new local detail
      list.push(newDetail);
    }

    $swal.fire({
      title: "Success",
      text: isEditDetailMode.value ? "Detail updated successfully" : "Detail added successfully",
      icon: "success",
    });
    showDetailModal.value = false;
    return;
  }

  // For edit mode (master ID exists), save to database
  try {
    loading.value = true;
    const payload = {
      bmm_budget_movement_id: bmm_budget_movement_id.value,
      bmd_bgt_movement_detl_id: isEditDetailMode.value ? editingDetailId.value : null,
      type: detailType.value,
      fty_fund_type: detailForm.value.fty_fund_type,
      oun_code: detailForm.value.oun_code,
      sbg_budget_code: detailForm.value.sbg_budget_code,
      bdg_budget_id: detailForm.value.bdg_budget_id,
      bmd_mvt_amt: detailForm.value.bmd_mvt_amt.toString().replace(/,/g, ""),
      cym_currency_code: detailForm.value.cym_currency_code || "",
      cyd_unit: detailForm.value.cyd_unit || "",
      cyd_conversation_rate: detailForm.value.cyd_conversation_rate || 0,
      amt_currency: detailForm.value.amt_currency || 0,
    };

    const { data } = await useFetch(`/api/budget/virement-v2-form/detail`, {
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
      await fetchFromList();
      await fetchToList();
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
const handleDeleteDetail = async (item, type) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this record?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    const list = type === "From" ? fromList.value : toList.value;
    
    // For add mode (no master ID), delete local detail
    if (!bmm_budget_movement_id.value) {
      const index = list.findIndex(d => d.index === item.index);
      if (index !== -1) {
        list.splice(index, 1);
        // Reindex remaining items
        list.forEach((d, idx) => {
          d.index = idx + 1;
        });
      }
      $swal.fire({
        title: "Success",
        text: "Record deleted successfully",
        icon: "success",
      });
      return;
    }

    // For edit mode (master ID exists), delete from database
    try {
      loading.value = true;
      const { data } = await useFetch(`/api/budget/virement-v2-form/detail`, {
        method: "DELETE",
        query: { bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id },
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Success",
          text: "Record deleted successfully",
          icon: "success",
        });
        await fetchFromList();
        await fetchToList();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete record",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting detail:", error);
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

// Handle save application
const handleSaveApplication = async () => {
  if (!virementForm.value.bmm_endorse_doc || !virementForm.value.bmm_description || !virementForm.value.bmm_movement_type) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  if (fromList.value.length === 0 || toList.value.length === 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please add at least one detail for both From and To",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const totalAmt = [...fromList.value, ...toList.value].reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0);
    
    const payload = {
      bmm_budget_movement_id: bmm_budget_movement_id.value,
      bmm_year: virementForm.value.bmm_year,
      bmm_endorse_doc: virementForm.value.bmm_endorse_doc,
      bmm_movement_type: virementForm.value.bmm_movement_type,
      bmm_description: virementForm.value.bmm_description,
      bmm_money_transfer: virementForm.value.bmm_money_transfer,
      bmm_total_amt: totalAmt,
      submitMode: "Save",
      dataArraySource: fromList.value.map(item => ({
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_code: item.sbg_budget_code || item.sbg_budget_id,
        bmd_mvt_amt: item.bmd_mvt_amt,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: item.cyd_conversation_rate || 0,
        amt_currency: item.amt_currency || 0,
      })),
      dataArrayTarget: toList.value.map(item => ({
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_code: item.sbg_budget_code || item.sbg_budget_id,
        bmd_mvt_amt: item.bmd_mvt_amt,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: item.cyd_conversation_rate || 0,
        amt_currency: item.amt_currency || 0,
      })),
    };

    const { data } = await useFetch(`/api/budget/virement-v2-form/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newMovementId = data.value.bmm_budget_movement_id;
      
      // If this was add mode, save all local details to database
      if (!bmm_budget_movement_id.value) {
        // Save From details
        for (const detail of fromList.value) {
          try {
            await useFetch(`/api/budget/virement-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                type: "From",
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
                cym_currency_code: detail.cym_currency_code || "",
                cyd_unit: detail.cyd_unit || "",
                cyd_conversation_rate: detail.cyd_conversation_rate || 0,
                amt_currency: detail.amt_currency || 0,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving from detail:", error);
          }
        }
        
        // Save To details
        for (const detail of toList.value) {
          try {
            await useFetch(`/api/budget/virement-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                type: "To",
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
                cym_currency_code: detail.cym_currency_code || "",
                cyd_unit: detail.cyd_unit || "",
                cyd_conversation_rate: detail.cyd_conversation_rate || 0,
                amt_currency: detail.amt_currency || 0,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving to detail:", error);
          }
        }
      }
      
      // Store ID in sessionStorage and reload
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('virement_form_id', newMovementId.toString());
        sessionStorage.setItem('virement_form_mode', 'edit');
      }
      
      $swal.fire({
        title: "Success",
        text: "Application saved successfully",
        icon: "success",
      });
      
      await fetchMasterData();
      await fetchFromList();
      await fetchToList();
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
  if (!virementForm.value.bmm_endorse_doc || !virementForm.value.bmm_description || !virementForm.value.bmm_movement_type) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  if (fromList.value.length === 0 || toList.value.length === 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please add at least one detail for both From and To",
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
    const totalAmt = [...fromList.value, ...toList.value].reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0);
    
    const payload = {
      bmm_budget_movement_id: bmm_budget_movement_id.value,
      bmm_year: virementForm.value.bmm_year,
      bmm_endorse_doc: virementForm.value.bmm_endorse_doc,
      bmm_movement_type: virementForm.value.bmm_movement_type,
      bmm_description: virementForm.value.bmm_description,
      bmm_money_transfer: virementForm.value.bmm_money_transfer,
      bmm_total_amt: totalAmt,
      submitMode: "Submit",
      workflow: workflowForm.value,
      dataArraySource: fromList.value.map(item => ({
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_code: item.sbg_budget_code || item.sbg_budget_id,
        bmd_mvt_amt: item.bmd_mvt_amt,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: item.cyd_conversation_rate || 0,
        amt_currency: item.amt_currency || 0,
      })),
      dataArrayTarget: toList.value.map(item => ({
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: item.bdg_budget_id,
        sbg_budget_code: item.sbg_budget_code || item.sbg_budget_id,
        bmd_mvt_amt: item.bmd_mvt_amt,
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: item.cyd_conversation_rate || 0,
        amt_currency: item.amt_currency || 0,
      })),
    };

    const { data } = await useFetch(`/api/budget/virement-v2-form/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newMovementId = data.value.bmm_budget_movement_id;
      
      // If this was add mode, save all local details to database
      if (!bmm_budget_movement_id.value) {
        // Save From details
        for (const detail of fromList.value) {
          try {
            await useFetch(`/api/budget/virement-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                type: "From",
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
                cym_currency_code: detail.cym_currency_code || "",
                cyd_unit: detail.cyd_unit || "",
                cyd_conversation_rate: detail.cyd_conversation_rate || 0,
                amt_currency: detail.amt_currency || 0,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving from detail:", error);
          }
        }
        
        // Save To details
        for (const detail of toList.value) {
          try {
            await useFetch(`/api/budget/virement-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                type: "To",
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
                cym_currency_code: detail.cym_currency_code || "",
                cyd_unit: detail.cyd_unit || "",
                cyd_conversation_rate: detail.cyd_conversation_rate || 0,
                amt_currency: detail.amt_currency || 0,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving to detail:", error);
          }
        }
      }
      
      // Store ID in sessionStorage and reload
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('virement_form_id', newMovementId.toString());
        sessionStorage.setItem('virement_form_mode', 'edit');
      }
      
      $swal.fire({
        title: "Success",
        text: "Application submitted successfully",
        icon: "success",
      });
      
      await fetchMasterData();
      await fetchFromList();
      await fetchToList();
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

// Format virement amount input
const formatVirementAmount = (event) => {
  let value = event.target.value.replace(/[^0-9.]/g, '');
  if (value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      detailForm.value.bmd_mvt_amt = numValue.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      // Recalculate currency amount
      if (detailForm.value.cyd_conversation_rate) {
        detailForm.value.amt_currency = (numValue * detailForm.value.cyd_conversation_rate).toFixed(2);
      }
    }
  }
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (bmm_budget_movement_id.value) {
    await fetchMasterData();
    await fetchFromList();
    await fetchToList();
    await fetchProcessFlow();
  }
});

// Computed for total amounts
const totalFromAmount = computed(() => {
  return fromList.value.reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0);
});

const totalToAmount = computed(() => {
  return toList.value.reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0);
});

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Virement Information Form -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Virement Information</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="virementForm.bmm_year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="virementForm.bmm_budget_movement_no"
              type="text"
              label="Reference"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="virementForm.bmm_endorse_doc"
              type="text"
              label="Authority Approval"
              placeholder="Enter Authority Approval"
              validation="required"
              :maxlength="100"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="virementForm.bmm_movement_type"
              type="select"
              label="Type"
              :options="movementTypeOptions"
              placeholder="Select Type"
              validation="required"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="md:col-span-2 lg:col-span-3">
              <FormKit
                v-model="virementForm.bmm_description"
                type="textarea"
                label="Remark/Reason"
                placeholder="Enter Remark/Reason"
                validation="required"
                :validation-messages="{ required: 'Remark/Reason is required' }"
                :maxlength="1000"
                rows="4"
                outer-class="mb-0"
              />
            </div>
            <FormKit
              v-model="virementForm.bmm_status"
              type="text"
              label="Status"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="virementForm.bmm_money_transfer"
              type="select"
              label="Money Transfer Flag"
              :options="moneyTransferOptions"
              placeholder="Select Money Transfer Flag"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- From Datatable -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">From</div>
          <rs-button variant="primary" @click="handleAddDetail('From')" class="h-[30px]">
            <Icon name="material-symbols:add" class="mr-2" size="1rem" />
            Add
          </rs-button>
        </div>
      </template>
      <template #body>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <rs-table
          v-else
          :data="fromList"
          :field="['No', 'Budget Index No', 'Quarter', 'Fund', 'Activity', 'PTJ', '', 'Cost Center', 'Budget Code', 'Balance Amount', 'Vire Amount (RM)', 'Currency Code', 'Unit', 'Rate', 'Currency Amount ', 'Action']"
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
          :pageSize="10"
          :hideTableSearch="true"
          :hideTablePageSize="true"
          :hideTableFooter="true"
          maxHeight="600px"
        >
          <template v-slot:No="data">
            {{ data.value.index }}
          </template>
          <template v-slot:BudgetIndexNo="data">
            {{ data.value.sbg_budget_id }}
          </template>
          <template v-slot:Quarter="data">
            {{ data.value.qbu_quarter_id }}
          </template>
          <template v-slot:Fund="data">
            {{ data.value.fty_fund_type }}
          </template>
          <template v-slot:Activity="data">
            {{ data.value.at_activity_code }}
          </template>
          <template v-slot:PTJ="data">
            {{ data.value.oun_code }}
          </template>
          <template v-slot:CostCenter="data">
            {{ data.value.ccr_costcentre }}
          </template>
          <template v-slot:BudgetCode="data">
            {{ data.value.sbg_budget_code }}
          </template>
          <template v-slot:BalanceAmount="data">
            {{ toCurrency(data.value.bdg_balance_amt) }}
          </template>
          <template v-slot:VireAmountRM="data">
            {{ toCurrency(data.value.bmd_mvt_amt) }}
          </template>
          <template v-slot:CurrencyCode="data">
            {{ data.value.cym_currency_code }}
          </template>
          <template v-slot:Unit="data">
            {{ data.value.cyd_unit }}
          </template>
          <template v-slot:Rate="data">
            {{ toCurrency(data.value.cyd_conversation_rate) }}
          </template>
          <template v-slot:CurrencyAmount="data">
            {{ toCurrency(data.value.amt_currency) }}
          </template>
          <template v-slot:Action="data">
            <div class="flex gap-2">
              <button
                @click="handleEditDetail(data.value, 'From')"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Edit"
              >
                <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
              </button>
              <button
                @click="handleDeleteDetail(data.value, 'From')"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Delete"
              >
                <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
              </button>
            </div>
          </template>
        </rs-table>
        <div class="mt-4 text-right">
          <span class="text-sm font-semibold">Total Amount: {{ toCurrency(totalFromAmount) }}</span>
        </div>
      </template>
    </rs-card>

    <!-- To Datatable -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">To</div>
          <rs-button variant="primary" @click="handleAddDetail('To')" class="h-[30px]">
            <Icon name="material-symbols:add" class="mr-2" size="1rem" />
            Add
          </rs-button>
        </div>
      </template>
      <template #body>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <rs-table
          v-else
          :data="toList"
          :field="['No', 'Budget Index No', 'Quarter', 'Fund', 'Activity', 'PTJ', 'Cost Center', 'Budget Code', 'Balance Amount', 'Vire Amount (RM)', 'Currency Code', 'Unit', 'Rate', 'Currency Amount ', 'Action']"
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
          :pageSize="10"
          :hideTableSearch="true"
          :hideTablePageSize="true"
          :hideTableFooter="true"
          maxHeight="600px"
        >
          <template v-slot:No="data">
            {{ data.value.index }}
          </template>
          <template v-slot:BudgetIndexNo="data">
            {{ data.value.sbg_budget_id }}
          </template>
          <template v-slot:Quarter="data">
            {{ data.value.qbu_quarter_id }}
          </template>
          <template v-slot:Fund="data">
            {{ data.value.fty_fund_type }}
          </template>
          <template v-slot:Activity="data">
            {{ data.value.at_activity_code }}
          </template>
          <template v-slot:PTJ="data">
            {{ data.value.oun_code }}
          </template>
          <template v-slot:CostCenter="data">
            {{ data.value.ccr_costcentre }}
          </template>
          <template v-slot:BudgetCode="data">
            {{ data.value.sbg_budget_code }}
          </template>
          <template v-slot:BalanceAmount="data">
            {{ toCurrency(data.value.bdg_balance_amt) }}
          </template>
          <template v-slot:VireAmountRM="data">
            {{ toCurrency(data.value.bmd_mvt_amt) }}
          </template>
          <template v-slot:CurrencyCode="data">
            {{ data.value.cym_currency_code }}
          </template>
          <template v-slot:Unit="data">
            {{ data.value.cyd_unit }}
          </template>
          <template v-slot:Rate="data">
            {{ toCurrency(data.value.cyd_conversation_rate) }}
          </template>
          <template v-slot:CurrencyAmount="data">
            {{ toCurrency(data.value.amt_currency) }}
          </template>
          <template v-slot:Action="data">
            <div class="flex gap-2">
              <button
                @click="handleEditDetail(data.value, 'To')"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Edit"
              >
                <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
              </button>
              <button
                @click="handleDeleteDetail(data.value, 'To')"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Delete"
              >
                <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
              </button>
            </div>
          </template>
        </rs-table>
        <div class="mt-4 text-right">
          <span class="text-sm font-semibold">Total Amount: {{ toCurrency(totalToAmount) }}</span>
        </div>
      </template>
    </rs-card>

    <!-- Process Flow Datatable -->
    <rs-card v-if="bmm_budget_movement_id">
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
    <rs-card v-if="bmm_budget_movement_id && virementForm.bmm_status !== 'DRAFT'">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="workflowForm.option"
              type="select"
              label="Option"
              :options="[]"
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
      :title="isEditDetailMode ? `Edit Detail Virement (${detailType})` : `Add Detail Virement (${detailType})`"
      size="lg"
      :overlay-close="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <FormKit
              v-model="detailForm.filter"
              type="select"
              label="Filter"
              :options="[]"
              placeholder="Select Filter"
              outer-class="mb-0 d-none"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Fund Type<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.fty_fund_type"
                  type="select"
                  :options="fundTypeOptions"
                  placeholder="Select Fund Type"
                  validation="required"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PTJ<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.oun_code"
                  type="select"
                  :options="ptjOptions"
                  placeholder="Select PTJ"
                  validation="required"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Budget Code<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.sbg_budget_code"
                  type="select"
                  :options="budgetCodeOptions"
                  placeholder="Select Budget Code"
                  validation="required"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <FormKit
              v-model="detailForm.fund"
              type="text"
              label="Fund"
              :disabled="true"
              outer-class="mb-0 d-none"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.ptj"
              type="text"
              label="PTJ"
              :disabled="true"
              outer-class="mb-0 d-none"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="detailForm.budget_code"
              type="text"
              label="Budget Code"
              :disabled="true"
              outer-class="mb-0 d-none"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Quarter:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.qbu_quarter_id"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Activity:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.at_activity_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Cost Center:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.ccr_costcentre"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Balance Amount:</label>
              <div class="flex-1 flex items-center">
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-r-0 rounded-l text-sm h-[30px] flex items-center">MYR</span>
                <FormKit
                  v-model="detailForm.bdg_balance_amt"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0 flex-1"
                  :classes="{ input: 'h-[30px] rounded-l-none' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Vire Amount (RM):</label>
              <div class="flex-1 flex items-center">
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-r-0 rounded-l text-sm h-[30px] flex items-center">MYR</span>
                <FormKit
                  v-model="detailForm.bmd_mvt_amt"
                  type="text"
                  placeholder="Enter Vire Amount"
                  validation="required"
                  outer-class="mb-0 flex-1"
                  :classes="{ input: 'h-[30px] rounded-l-none' }"
                  @input="formatVirementAmount"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Currency Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.cym_currency_code"
                  type="select"
                  :options="currencyCodeOptions"
                  placeholder="Select Currency Code"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Unit:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.cyd_unit"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Rate:</label>
              <div class="flex-1">
                <FormKit
                  v-model="detailForm.cyd_conversation_rate"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                  :classes="{ input: 'h-[30px]' }"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Currency Amount:</label>
              <div class="flex-1 flex items-center">
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-r-0 rounded-l text-sm h-[30px] flex items-center">MYR</span>
                <FormKit
                  v-model="detailForm.amt_currency"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0 flex-1"
                  :classes="{ input: 'h-[30px] rounded-l-none' }"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="showDetailModal = false" class="h-[30px]">
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

