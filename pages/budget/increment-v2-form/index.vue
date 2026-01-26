<script setup>
definePageMeta({
  title: "Increment V2 Form",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Increment V2 Form", path: "/budget/increment-v2-form" },
  ],
});

const route = useRoute();
const { $swal } = useNuxtApp();

// Get ID and mode from sessionStorage instead of URL query params
const bmm_budget_movement_id = computed(() => {
  if (typeof window !== 'undefined') {
    const storedId = sessionStorage.getItem('increment_form_id');
    return storedId ? parseInt(storedId) : null;
  }
  return null;
});

const mode = computed(() => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('increment_form_mode') || 'add';
  }
  return 'add';
});

// Form data
const incrementForm = ref({
  bmm_year: new Date().getFullYear().toString(),
  bmm_budget_movement_no: "",
  bmm_endorse_doc: "",
  bmm_description: "",
  bmm_status: "DRAFT",
});

// Detail increment list
const detailList = ref([]);
const loading = ref(false);

// Modal state for detail form
const showDetailModal = ref(false);
const isEditDetailMode = ref(false);
const editingDetailId = ref(null);
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

// Fetch master data
const fetchMasterData = async () => {
  if (!bmm_budget_movement_id.value) return;
  
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/increment-v2-form/master`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const master = data.value.data;
      incrementForm.value = {
        bmm_year: master.bmm_year || new Date().getFullYear().toString(),
        bmm_budget_movement_no: master.bmm_budget_movement_no || "",
        bmm_endorse_doc: master.bmm_endorse_doc || "",
        bmm_description: master.bmm_description || master.bmm_reason || "",
        bmm_status: master.bmm_status || "DRAFT",
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
  if (!bmm_budget_movement_id.value) {
    detailList.value = [];
    return;
  }

  try {
    loading.value = true;
    const { data } = await useFetch(`/api/budget/increment-v2-form/detail`, {
      method: "GET",
      query: { bmm_budget_movement_id: bmm_budget_movement_id.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      detailList.value = (data.value.data || []).map((item, index) => ({
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
      }));
    }
  } catch (error) {
    console.error("Error fetching detail list:", error);
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
    const { data } = await useFetch(`/api/budget/increment-v2-form/process-flow`, {
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
    const [years, fundTypes, ptjs, quarters] = await Promise.all([
      useFetch("/api/budget/report/lookups/years"),
      useFetch("/api/budget/planning/report/lookups/fund-type"),
      useFetch("/api/budget/planning/report/lookups/ptj"),
      useFetch("/api/budget/increment-v2-form/lookups/quarters"),
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
    const { data } = await useFetch(`/api/budget/increment-v2-form/lookups/budget-codes`, {
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
        const { data } = await useFetch(`/api/budget/increment-v2-form/detail/get-budget`, {
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

// Handle add detail
const handleAddDetail = () => {
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
  };
  showDetailModal.value = true;
};

// Handle edit detail
const handleEditDetail = async (item) => {
  // For add mode (no master ID), edit local detail
  if (!bmm_budget_movement_id.value) {
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
    const { data } = await useFetch(`/api/budget/increment-v2-form/detail/get`, {
      method: "GET",
      query: { bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const detail = data.value.data;
      detailForm.value = {
        filter: "",
        fty_fund_type: detail.new_fty_fund_type || detail.fty_fund_type?.split(" - ")[0] || "",
        oun_code: detail.new_oun_code2 || detail.oun_code?.split(" - ")[0] || "",
        sbg_budget_code: detail.sbg_budget_id || "",
        fund: detail.fty_fund_type || "",
        ptj: detail.oun_code || "",
        budget_code: detail.sbg_budget_code || "",
        qbu_quarter_id: detail.qbu_quarter_id || "",
        at_activity_code: detail.at_activity_code || "",
        ccr_costcentre: detail.ccr_costcentre || "",
        bdg_balance_amt: parseFloat(detail.bdg_balance_amt) || 0,
        bmd_mvt_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        bdg_budget_id: detail.bdg_budget_id || detail.new_bdg_budget_id2 || "",
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

  // For add mode (no master ID), store details locally
  if (!bmm_budget_movement_id.value) {
    const newDetail = {
      index: detailList.value.length + 1,
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
    };

    if (isEditDetailMode.value && editingDetailId.value !== null) {
      // Update existing local detail
      const index = detailList.value.findIndex(item => item.index === editingDetailId.value);
      if (index !== -1) {
        detailList.value[index] = { ...newDetail, index: detailList.value[index].index };
      }
    } else {
      // Add new local detail
      detailList.value.push(newDetail);
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
      fty_fund_type: detailForm.value.fty_fund_type,
      oun_code: detailForm.value.oun_code,
      sbg_budget_code: detailForm.value.sbg_budget_code,
      bdg_budget_id: detailForm.value.bdg_budget_id,
      bmd_mvt_amt: detailForm.value.bmd_mvt_amt.toString().replace(/,/g, ""),
    };

    const { data } = await useFetch(`/api/budget/increment-v2-form/detail`, {
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
    text: "Do you want to delete this record?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    // For add mode (no master ID), delete local detail
    if (!bmm_budget_movement_id.value) {
      const index = detailList.value.findIndex(d => d.index === item.index);
      if (index !== -1) {
        detailList.value.splice(index, 1);
        // Reindex remaining items
        detailList.value.forEach((d, idx) => {
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
      const { data } = await useFetch(`/api/budget/increment-v2-form/detail`, {
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
        await fetchDetailList();
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
  if (!incrementForm.value.bmm_endorse_doc || !incrementForm.value.bmm_description) {
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
      text: "Please add at least one detail increment",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const payload = {
      bmm_budget_movement_id: bmm_budget_movement_id.value,
      bmm_year: incrementForm.value.bmm_year,
      bmm_endorse_doc: incrementForm.value.bmm_endorse_doc,
      bmm_description: incrementForm.value.bmm_description,
      bmm_total_amt: detailList.value.reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0),
      submitMode: "Save",
    };

    const { data } = await useFetch(`/api/budget/increment-v2-form/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newMovementId = data.value.bmm_budget_movement_id;
      
      // If this was add mode, save all local details to database
      if (!bmm_budget_movement_id.value && detailList.value.length > 0) {
        for (const detail of detailList.value) {
          try {
            await useFetch(`/api/budget/increment-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving detail:", error);
          }
        }
      }
      
      // Store ID in sessionStorage and reload
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('increment_form_id', newMovementId.toString());
        sessionStorage.setItem('increment_form_mode', 'edit');
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
  if (!incrementForm.value.bmm_endorse_doc || !incrementForm.value.bmm_description) {
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
      text: "Please add at least one detail increment",
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
      bmm_budget_movement_id: bmm_budget_movement_id.value,
      bmm_year: incrementForm.value.bmm_year,
      bmm_endorse_doc: incrementForm.value.bmm_endorse_doc,
      bmm_description: incrementForm.value.bmm_description,
      bmm_total_amt: detailList.value.reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0),
      submitMode: "Submit",
      workflow: workflowForm.value,
    };

    const { data } = await useFetch(`/api/budget/increment-v2-form/submit`, {
      method: "POST",
      body: payload,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const newMovementId = data.value.bmm_budget_movement_id;
      
      // If this was add mode, save all local details to database
      if (!bmm_budget_movement_id.value && detailList.value.length > 0) {
        for (const detail of detailList.value) {
          try {
            await useFetch(`/api/budget/increment-v2-form/detail`, {
              method: "POST",
              body: {
                bmm_budget_movement_id: newMovementId,
                fty_fund_type: detail.fty_fund_type,
                oun_code: detail.oun_code,
                sbg_budget_code: detail.sbg_budget_code || detail.sbg_budget_id,
                bdg_budget_id: detail.bdg_budget_id,
                bmd_mvt_amt: detail.bmd_mvt_amt,
              },
              initialCache: false,
            });
          } catch (error) {
            console.error("Error saving detail:", error);
          }
        }
      }
      
      // Store ID in sessionStorage and reload
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('increment_form_id', newMovementId.toString());
        sessionStorage.setItem('increment_form_mode', 'edit');
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

// Format increment amount input
const formatIncrementAmount = (event) => {
  let value = event.target.value.replace(/[^0-9.]/g, '');
  if (value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      detailForm.value.bmd_mvt_amt = numValue.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
};

// Initialize
onMounted(async () => {
  await fetchDropdownOptions();
  if (bmm_budget_movement_id.value) {
    await fetchMasterData();
    await fetchDetailList();
    await fetchProcessFlow();
  }
});

// Computed for total amount
const totalAmount = computed(() => {
  return detailList.value.reduce((sum, item) => sum + (item.bmd_mvt_amt || 0), 0);
});

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Increment Information Form -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Increment Information</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="incrementForm.bmm_year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              :disabled="mode === 'view'"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="incrementForm.bmm_budget_movement_no"
              type="text"
              label="Reference"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <FormKit
              v-model="incrementForm.bmm_endorse_doc"
              type="text"
              label="Authority Approval"
              placeholder="Enter Authority Approval"
              :validation="mode !== 'view' ? 'required' : ''"
              :disabled="mode === 'view'"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
            <div class="md:col-span-2 lg:col-span-3">
              <FormKit
                v-model="incrementForm.bmm_description"
                type="textarea"
                label="Remark/Reason"
                placeholder="Enter Remark/Reason"
                :validation="mode !== 'view' ? 'required' : ''"
                :validation-messages="{ required: 'Remark/Reason is required' }"
                :disabled="mode === 'view'"
                :maxlength="1000"
                rows="4"
                outer-class="mb-0"
              />
            </div>
            <FormKit
              v-model="incrementForm.bmm_status"
              type="text"
              label="Status"
              :disabled="true"
              outer-class="mb-0"
              :classes="{ input: 'h-[30px]' }"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Detail Increment Datatable -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Detail Increment</div>
          <rs-button v-if="mode !== 'view'" variant="primary" @click="handleAddDetail" class="h-[30px]">
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
          :data="detailList"
          :field="['No', 'Budget Index No', 'Quarter', 'Fund', 'Activity', 'PTJ', 'Cost Center', 'Budget Code', 'Balance Amount', 'Increment Amount', 'Action']"
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
          <template v-slot:IncrementAmount="data">
            {{ toCurrency(data.value.bmd_mvt_amt) }}
          </template>
          <template v-slot:Action="data">
            <div v-if="mode !== 'view'" class="flex gap-2">
              <button
                @click="handleEditDetail(data.value)"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Edit"
              >
                <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
              </button>
              <button
                @click="handleDeleteDetail(data.value)"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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
    <rs-card v-if="bmm_budget_movement_id && incrementForm.bmm_status !== 'DRAFT'">
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
    <div v-if="mode !== 'view'" class="flex justify-center gap-3">
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
      :title="isEditDetailMode ? 'Edit Detail Increment' : 'Add Detail Increment'"
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
              <label class="w-32 text-sm font-medium">Amount Balance:</label>
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
              <label class="w-32 text-sm font-medium">Increment Amount:</label>
              <div class="flex-1 flex items-center">
                <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-r-0 rounded-l text-sm h-[30px] flex items-center">MYR</span>
                <FormKit
                  v-model="detailForm.bmd_mvt_amt"
                  type="text"
                  placeholder="Enter Increment Amount"
                  validation="required"
                  outer-class="mb-0 flex-1"
                  :classes="{ input: 'h-[30px] rounded-l-none' }"
                  @input="formatIncrementAmount"
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

