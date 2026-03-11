<script setup>
definePageMeta({
  title: "Workflow Configuration",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Workflow Management", path: "/workflowmanagement" },
    { name: "Workflow Configuration", path: "/workflowconfiguration" },
  ],
});

const { $swal } = useNuxtApp();

// State
const workflows = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const selectedWorkflow = ref(null);
const processes = ref([]);
const processesLoading = ref(false);
const selectedProcess = ref(null);
const processDetails = ref([]);
const authorizedRoles = ref([]);
const detailsLoading = ref(false);
const collapsedIds = ref(new Set());

// Modals
const showWorkflowModal = ref(false);
const showProcessModal = ref(false);
const showProcessDetailModal = ref(false);
const showAuthorizedRoleModal = ref(false);
const isWorkflowEditMode = ref(false);
const isProcessEditMode = ref(false);
const isProcessDetailEditMode = ref(false);
const isAuthorizedRoleEditMode = ref(false);
const editingWorkflowCode = ref(null);
const editingProcessId = ref(null);
const editingProcessDetailId = ref(null);
const editingAuthorizedRoleId = ref(null);

// Forms
const workflowForm = ref({
  wfa_workflow_code: "",
  wfa_workflow_title: "",
  wfa_prevent_self_process: null,
  wfa_involve_posting: 1,
});
const processForm = ref({
  wfp_process_name: "",
  wfp_process_desc_bm: "",
  wfp_sequence: 0,
  wfp_duration_kpi: null,
  wfp_duration_kpi_withquery: null,
  wfp_status: "1",
  wfp_is_email_notification: 1,
  wfp_is_todo_notification: 1,
  wfp_is_by_unit: null,
  wfp_is_by_ptj: null,
  wfp_is_allow_query: null,
});
const processDetailForm = ref({
  wpd_status_code: "",
  wpd_status_desc: "",
  wpd_reroute_process: null,
  wpd_proc_to_exec: "",
  wpd_order: null,
});
const authorizedRoleForm = ref({
  war_group_code: "",
  war_limit_min: null,
  war_limit_max: null,
});

// Filtered workflows
const filteredWorkflows = computed(() => {
  if (!searchKeyword.value.trim()) return workflows.value;
  const kw = searchKeyword.value.toLowerCase().trim();
  return workflows.value.filter(
    (w) =>
      (w.wfa_workflow_code || "").toLowerCase().includes(kw) ||
      (w.wfa_workflow_title || "").toLowerCase().includes(kw)
  );
});

// Sorted processes by sequence
const sortedProcesses = computed(() =>
  [...processes.value].sort((a, b) => (a.wfp_sequence || 0) - (b.wfp_sequence || 0))
);

// Fetch workflows
const fetchWorkflows = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/workflow-configuration", {
      method: "GET",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      workflows.value = data.value.data || [];
      if (!selectedWorkflow.value && workflows.value.length > 0) {
        selectedWorkflow.value = workflows.value[0];
        await fetchProcesses(workflows.value[0].wfa_workflow_code);
      }
    }
  } catch (error) {
    console.error("Error fetching workflows:", error);
    $swal.fire({ title: "Error", text: "Failed to fetch workflows", icon: "error" });
  } finally {
    loading.value = false;
  }
};

// Fetch processes for selected workflow
const fetchProcesses = async (code) => {
  if (!code) {
    processes.value = [];
    selectedProcess.value = null;
    processDetails.value = [];
    authorizedRoles.value = [];
    return;
  }
  try {
    processesLoading.value = true;
    const { data } = await useFetch(`/api/workflow-configuration/${code}/processes`, {
      method: "GET",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      processes.value = data.value.data || [];
      selectedProcess.value = null;
      processDetails.value = [];
      authorizedRoles.value = [];
    }
  } catch (error) {
    console.error("Error fetching processes:", error);
    processes.value = [];
  } finally {
    processesLoading.value = false;
  }
};

// Fetch process details and authorized roles for selected process
const fetchProcessDetailsAndRoles = async (processId) => {
  if (!processId) {
    processDetails.value = [];
    authorizedRoles.value = [];
    return;
  }
  try {
    detailsLoading.value = true;
    const [detailsRes, rolesRes] = await Promise.all([
      useFetch(`/api/workflow-configuration/processes/${processId}/details`, {
        method: "GET",
        initialCache: false,
      }),
      useFetch(`/api/workflow-configuration/processes/${processId}/authorized-roles`, {
        method: "GET",
        initialCache: false,
      }),
    ]);
    if (detailsRes.data.value?.statusCode === 200) {
      processDetails.value = detailsRes.data.value.data || [];
    }
    if (rolesRes.data.value?.statusCode === 200) {
      authorizedRoles.value = rolesRes.data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching process details:", error);
    processDetails.value = [];
    authorizedRoles.value = [];
  } finally {
    detailsLoading.value = false;
  }
};

// Select workflow
const handleSelectWorkflow = (wf) => {
  selectedWorkflow.value = wf;
  fetchProcesses(wf?.wfa_workflow_code);
};

// Select process
const handleSelectProcess = (proc) => {
  selectedProcess.value = proc;
  fetchProcessDetailsAndRoles(proc?.wfp_process_id);
};

// Toggle process collapse
const toggleProcessCollapse = (proc) => {
  const id = proc.wfp_process_id;
  const next = new Set(collapsedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  collapsedIds.value = next;
  if (!next.has(id)) {
    selectedProcess.value = proc;
    fetchProcessDetailsAndRoles(id);
  }
};

// --- Workflow CRUD ---
const handleAddWorkflow = () => {
  isWorkflowEditMode.value = false;
  editingWorkflowCode.value = null;
  workflowForm.value = {
    wfa_workflow_code: "",
    wfa_workflow_title: "",
    wfa_prevent_self_process: null,
    wfa_involve_posting: 1,
  };
  showWorkflowModal.value = true;
};

const handleEditWorkflow = (wf) => {
  isWorkflowEditMode.value = true;
  editingWorkflowCode.value = wf.wfa_workflow_code;
  workflowForm.value = {
    wfa_workflow_code: wf.wfa_workflow_code,
    wfa_workflow_title: wf.wfa_workflow_title || "",
    wfa_prevent_self_process: wf.wfa_prevent_self_process ?? null,
    wfa_involve_posting: wf.wfa_involve_posting ?? 1,
  };
  showWorkflowModal.value = true;
};

const handleSaveWorkflow = async () => {
  if (!workflowForm.value.wfa_workflow_code || !workflowForm.value.wfa_workflow_title) {
    $swal.fire({ title: "Validation", text: "Code and title are required", icon: "warning" });
    return;
  }
  try {
    const url = isWorkflowEditMode.value
      ? `/api/workflow-configuration/workflow/${editingWorkflowCode.value}`
      : "/api/workflow-configuration/workflow";
    const body = isWorkflowEditMode.value
      ? {
          wfa_workflow_title: workflowForm.value.wfa_workflow_title,
          wfa_prevent_self_process: workflowForm.value.wfa_prevent_self_process,
          wfa_involve_posting: workflowForm.value.wfa_involve_posting,
        }
      : workflowForm.value;
    const { data } = await useFetch(url, {
      method: isWorkflowEditMode.value ? "PUT" : "POST",
      body,
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Success", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      showWorkflowModal.value = false;
      await fetchWorkflows();
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error saving workflow:", error);
    $swal.fire({ title: "Error", text: "Failed to save workflow", icon: "error" });
  }
};

const handleDeleteWorkflow = async (wf) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Delete workflow "${wf.wfa_workflow_title}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
  });
  if (!result.isConfirmed) return;
  try {
    const { data } = await useFetch(`/api/workflow-configuration/workflow/${wf.wfa_workflow_code}`, {
      method: "DELETE",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Deleted", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      if (selectedWorkflow.value?.wfa_workflow_code === wf.wfa_workflow_code) {
        selectedWorkflow.value = null;
        processes.value = [];
        selectedProcess.value = null;
        processDetails.value = [];
        authorizedRoles.value = [];
      }
      await fetchWorkflows();
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error deleting workflow:", error);
    $swal.fire({ title: "Error", text: "Failed to delete workflow", icon: "error" });
  }
};

// --- Process CRUD ---
const handleAddProcess = () => {
  if (!selectedWorkflow.value) {
    $swal.fire({ title: "Warning", text: "Select a workflow first", icon: "warning" });
    return;
  }
  isProcessEditMode.value = false;
  editingProcessId.value = null;
  const maxSeq = processes.value.length > 0 ? Math.max(...processes.value.map((p) => p.wfp_sequence || 0)) : 0;
  processForm.value = {
    wfp_process_name: "",
    wfp_process_desc_bm: "",
    wfp_sequence: maxSeq + 1,
    wfp_duration_kpi: null,
    wfp_duration_kpi_withquery: null,
    wfp_status: "1",
    wfp_is_email_notification: 1,
    wfp_is_todo_notification: 1,
    wfp_is_by_unit: null,
    wfp_is_by_ptj: null,
    wfp_is_allow_query: null,
  };
  showProcessModal.value = true;
};

const handleEditProcess = (proc) => {
  isProcessEditMode.value = true;
  editingProcessId.value = proc.wfp_process_id;
  processForm.value = {
    wfp_process_name: proc.wfp_process_name || "",
    wfp_process_desc_bm: proc.wfp_process_desc_bm || "",
    wfp_sequence: proc.wfp_sequence ?? 0,
    wfp_duration_kpi: proc.wfp_duration_kpi ?? null,
    wfp_duration_kpi_withquery: proc.wfp_duration_kpi_withquery ?? null,
    wfp_status: proc.wfp_status ?? "1",
    wfp_is_email_notification: proc.wfp_is_email_notification ?? 1,
    wfp_is_todo_notification: proc.wfp_is_todo_notification ?? 1,
    wfp_is_by_unit: proc.wfp_is_by_unit ?? null,
    wfp_is_by_ptj: proc.wfp_is_by_ptj ?? null,
    wfp_is_allow_query: proc.wfp_is_allow_query ?? null,
  };
  showProcessModal.value = true;
};

const handleSaveProcess = async () => {
  if (!processForm.value.wfp_process_name) {
    $swal.fire({ title: "Validation", text: "Process name is required", icon: "warning" });
    return;
  }
  try {
    const url = isProcessEditMode.value
      ? `/api/workflow-configuration/process/${editingProcessId.value}`
      : "/api/workflow-configuration/process";
    const body = isProcessEditMode.value
      ? processForm.value
      : { ...processForm.value, wfp_workflow_code: selectedWorkflow.value.wfa_workflow_code };
    const { data } = await useFetch(url, {
      method: isProcessEditMode.value ? "PUT" : "POST",
      body,
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Success", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      showProcessModal.value = false;
      await fetchProcesses(selectedWorkflow.value?.wfa_workflow_code);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error saving process:", error);
    $swal.fire({ title: "Error", text: "Failed to save process", icon: "error" });
  }
};

const handleDeleteProcess = async (proc) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Delete process "${proc.wfp_process_name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
  });
  if (!result.isConfirmed) return;
  try {
    const { data } = await useFetch(`/api/workflow-configuration/process/${proc.wfp_process_id}`, {
      method: "DELETE",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Deleted", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      if (selectedProcess.value?.wfp_process_id === proc.wfp_process_id) {
        selectedProcess.value = null;
        processDetails.value = [];
        authorizedRoles.value = [];
      }
      await fetchProcesses(selectedWorkflow.value?.wfa_workflow_code);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error deleting process:", error);
    $swal.fire({ title: "Error", text: "Failed to delete process", icon: "error" });
  }
};

// --- Process Detail CRUD ---
const handleAddProcessDetail = () => {
  if (!selectedProcess.value) {
    $swal.fire({ title: "Warning", text: "Select a process first", icon: "warning" });
    return;
  }
  isProcessDetailEditMode.value = false;
  editingProcessDetailId.value = null;
  processDetailForm.value = {
    wpd_status_code: "",
    wpd_status_desc: "",
    wpd_reroute_process: null,
    wpd_proc_to_exec: "",
    wpd_order: null,
  };
  showProcessDetailModal.value = true;
};

const handleEditProcessDetail = (d) => {
  isProcessDetailEditMode.value = true;
  editingProcessDetailId.value = d.wpd_process_details_id;
  const ext = (d.wpd_extended_field && typeof d.wpd_extended_field === "object" ? d.wpd_extended_field : {}) || {};
  processDetailForm.value = {
    wpd_status_code: d.wpd_status_code || "",
    wpd_status_desc: (d.wpd_status_desc ?? ext.wpd_status_desc) || "",
    wpd_reroute_process: d.wpd_reroute_process ?? null,
    wpd_proc_to_exec: d.wpd_proc_to_exec || "",
    wpd_order: d.wpd_order ?? null,
  };
  showProcessDetailModal.value = true;
};

const handleSaveProcessDetail = async () => {
  if (!processDetailForm.value.wpd_status_code) {
    $swal.fire({ title: "Validation", text: "Status code is required", icon: "warning" });
    return;
  }
  try {
    const url = isProcessDetailEditMode.value
      ? `/api/workflow-configuration/process-detail/${editingProcessDetailId.value}`
      : "/api/workflow-configuration/process-detail";
    const body = isProcessDetailEditMode.value
      ? processDetailForm.value
      : { ...processDetailForm.value, wpd_process_id: selectedProcess.value.wfp_process_id };
    const { data } = await useFetch(url, {
      method: isProcessDetailEditMode.value ? "PUT" : "POST",
      body,
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Success", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      showProcessDetailModal.value = false;
      await fetchProcessDetailsAndRoles(selectedProcess.value?.wfp_process_id);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error saving process detail:", error);
    $swal.fire({ title: "Error", text: "Failed to save process detail", icon: "error" });
  }
};

const handleDeleteProcessDetail = async (d) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Delete process detail "${d.wpd_status || d.wpd_status_code}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
  });
  if (!result.isConfirmed) return;
  try {
    const { data } = await useFetch(`/api/workflow-configuration/process-detail/${d.wpd_process_details_id}`, {
      method: "DELETE",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Deleted", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      await fetchProcessDetailsAndRoles(selectedProcess.value?.wfp_process_id);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error deleting process detail:", error);
    $swal.fire({ title: "Error", text: "Failed to delete process detail", icon: "error" });
  }
};

// --- Authorized Role CRUD ---
const handleAddAuthorizedRole = () => {
  if (!selectedProcess.value) {
    $swal.fire({ title: "Warning", text: "Select a process first", icon: "warning" });
    return;
  }
  isAuthorizedRoleEditMode.value = false;
  editingAuthorizedRoleId.value = null;
  authorizedRoleForm.value = {
    war_group_code: "",
    war_limit_min: null,
    war_limit_max: null,
  };
  showAuthorizedRoleModal.value = true;
};

const handleEditAuthorizedRole = (r) => {
  isAuthorizedRoleEditMode.value = true;
  editingAuthorizedRoleId.value = r.war_authorized_role_id;
  authorizedRoleForm.value = {
    war_group_code: r.war_group_code || "",
    war_limit_min: r.war_limit_min != null ? parseFloat(r.war_limit_min) : null,
    war_limit_max: r.war_limit_max != null ? parseFloat(r.war_limit_max) : null,
  };
  showAuthorizedRoleModal.value = true;
};

const handleSaveAuthorizedRole = async () => {
  if (!authorizedRoleForm.value.war_group_code) {
    $swal.fire({ title: "Validation", text: "Group code is required", icon: "warning" });
    return;
  }
  try {
    const url = isAuthorizedRoleEditMode.value
      ? `/api/workflow-configuration/authorized-role/${editingAuthorizedRoleId.value}`
      : "/api/workflow-configuration/authorized-role";
    const body = isAuthorizedRoleEditMode.value
      ? authorizedRoleForm.value
      : { ...authorizedRoleForm.value, war_process_id: selectedProcess.value.wfp_process_id };
    const { data } = await useFetch(url, {
      method: isAuthorizedRoleEditMode.value ? "PUT" : "POST",
      body,
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Success", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      showAuthorizedRoleModal.value = false;
      await fetchProcessDetailsAndRoles(selectedProcess.value?.wfp_process_id);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error saving authorized role:", error);
    $swal.fire({ title: "Error", text: "Failed to save authorized role", icon: "error" });
  }
};

const handleDeleteAuthorizedRole = async (r) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Delete authorized role "${r.war_group_code}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
  });
  if (!result.isConfirmed) return;
  try {
    const { data } = await useFetch(`/api/workflow-configuration/authorized-role/${r.war_authorized_role_id}`, {
      method: "DELETE",
      initialCache: false,
    });
    if (data.value?.statusCode === 200) {
      $swal.fire({ title: "Deleted", text: data.value.message, icon: "success", timer: 1500, showConfirmButton: false });
      await fetchProcessDetailsAndRoles(selectedProcess.value?.wfp_process_id);
    } else {
      $swal.fire({ title: "Error", text: data.value?.message || "Failed", icon: "error" });
    }
  } catch (error) {
    console.error("Error deleting authorized role:", error);
    $swal.fire({ title: "Error", text: "Failed to delete authorized role", icon: "error" });
  }
};

onMounted(() => {
  fetchWorkflows();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Workflow Configuration</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Sidebar: Workflow list -->
          <div class="col-span-1 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Workflow</label>
              <FormKit
                v-model="searchKeyword"
                type="text"
                placeholder="Search workflow..."
                outer-class="mb-0 flex-1"
              >
                <template #suffix>
                  <button
                    v-if="searchKeyword"
                    type="button"
                    @click="searchKeyword = ''"
                    class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                  </button>
                </template>
              </FormKit>
            </div>

            <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <div class="px-4 py-2 text-xs font-semibold uppercase text-gray-500 border-b dark:border-gray-700 flex items-center justify-between">
                <span>Workflows</span>
              </div>

              <div v-if="loading" class="p-4 text-center text-sm text-gray-500">Loading...</div>
              <div v-else-if="filteredWorkflows.length === 0" class="p-4 text-center text-sm text-gray-500">
                No workflows found
              </div>
              <div v-else class="max-h-[540px] overflow-y-auto">
                <div
                  v-for="wf in filteredWorkflows"
                  :key="wf.wfa_workflow_code"
                  class="relative group"
                >
                  <button
                    @click="handleSelectWorkflow(wf)"
                    class="w-full text-left px-4 py-3 border-b last:border-b-0 dark:border-gray-700 hover:bg-primary/10 transition pr-10"
                    :class="{
                      'bg-primary/10 border-primary text-primary': selectedWorkflow?.wfa_workflow_code === wf.wfa_workflow_code,
                    }"
                  >
                    <div class="text-sm font-semibold">{{ wf.wfa_workflow_title || wf.wfa_workflow_code }}</div>
                    <div class="text-xs text-gray-500">{{ wf.wfa_workflow_code }}</div>
                  </button>
                  <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      @click.stop="handleEditWorkflow(wf)"
                      class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Edit"
                    >
                      <Icon name="material-symbols:edit" size="16" class="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      @click.stop="handleDeleteWorkflow(wf)"
                      class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      title="Delete"
                    >
                      <Icon name="material-symbols:delete" size="16" class="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex justify-end p-2 border-t dark:border-gray-700">
                <rs-button size="sm" variant="primary" @click="handleAddWorkflow">
                  <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                  Add
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Detail Panel -->
          <div class="col-span-1 lg:col-span-2">
            <div class="border rounded-lg bg-white dark:bg-gray-900 shadow-sm h-full flex flex-col">
              <div class="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div class="text-lg font-semibold">
                    {{ selectedWorkflow?.wfa_workflow_title || "Select a workflow" }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ selectedWorkflow?.wfa_workflow_code || "" }}
                  </div>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col gap-4">
                <div class="border rounded-lg p-3 h-full bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-semibold">Workflow Process</div>
                  </div>

                  <div v-if="!selectedWorkflow" class="flex items-center justify-center h-32 text-sm text-gray-500">
                    Select a workflow to view processes
                  </div>

                  <div v-else>
                    <div v-if="processesLoading" class="flex items-center justify-center h-32 text-sm text-gray-500">
                      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span class="ml-2">Loading processes...</span>
                    </div>

                    <div v-else-if="sortedProcesses.length === 0" class="flex flex-col items-center justify-center h-32 text-sm text-gray-500 gap-2">
                      <span>No processes found for this workflow.</span>
                      <rs-button variant="primary" size="sm" @click="handleAddProcess">
                        <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                        Add Process
                      </rs-button>
                    </div>

                    <div v-else class="space-y-3">
                      <div
                        v-for="proc in sortedProcesses"
                        :key="proc.wfp_process_id"
                        class="border rounded-lg bg-white dark:bg-gray-900"
                      >
                        <div
                          class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <div
                            class="flex-1 cursor-pointer"
                            @click="toggleProcessCollapse(proc)"
                          >
                            <div class="flex items-center gap-2">
                              <div class="font-semibold text-sm">{{ proc.wfp_process_name }}</div>
                              <span class="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                Seq: {{ proc.wfp_sequence }}
                              </span>
                              <span
                                class="text-[11px] px-2 py-0.5 rounded"
                                :class="{
                                  'bg-green-100 text-green-700': proc.wfp_status === '1',
                                  'bg-gray-200 text-gray-600': proc.wfp_status !== '1',
                                }"
                              >
                                {{ proc.wfp_status === "1" ? "Active" : "Inactive" }}
                              </span>
                              <Icon
                                :name="collapsedIds.has(proc.wfp_process_id) ? 'material-symbols:unfold-more-rounded' : 'material-symbols:unfold-less-rounded'"
                                size="1rem"
                                class="text-gray-500 ml-1"
                              />
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <rs-button variant="secondary" size="sm" @click.stop="handleEditProcess(proc)">
                              <Icon name="material-symbols:edit" class="mr-1" size="1rem" />
                              Edit
                            </rs-button>
                            <rs-button variant="danger" size="sm" @click.stop="handleDeleteProcess(proc)">
                              <Icon name="material-symbols:delete" class="mr-1" size="1rem" />
                              Delete
                            </rs-button>
                          </div>
                        </div>

                        <div v-if="!collapsedIds.has(proc.wfp_process_id)" class="px-3 pb-3 text-xs text-gray-600 dark:text-gray-300">
                          <div class="mt-1 font-semibold">Process Details & Authorized Roles</div>
                          <div v-if="selectedProcess?.wfp_process_id !== proc.wfp_process_id" class="text-gray-500 italic mt-1">
                            Click to load details
                          </div>
                          <template v-else>
                            <div v-if="detailsLoading" class="text-gray-500 italic mt-1">Loading...</div>
                            <template v-else>
                              <div class="mt-2 space-y-2">
                                <div>
                                  <div class="flex items-center justify-between mb-1">
                                    <span class="font-medium">Process Details</span>
                                    <rs-button size="xs" variant="primary" class="!px-2" @click="handleAddProcessDetail">
                                      <Icon name="material-symbols:add" size="1rem" />
                                    </rs-button>
                                  </div>
                                  <ul v-if="processDetails.length" class="space-y-1">
                                    <li
                                      v-for="d in processDetails"
                                      :key="d.wpd_process_details_id"
                                      class="p-2 rounded border bg-white dark:bg-gray-800 flex justify-between items-center"
                                    >
                                      <span>{{ d.wpd_status }}</span>
                                      <div class="flex gap-1">
                                        <button @click="handleEditProcessDetail(d)" class="p-1 hover:bg-gray-100 rounded">
                                          <Icon name="material-symbols:edit" size="14" />
                                        </button>
                                        <button @click="handleDeleteProcessDetail(d)" class="p-1 hover:bg-red-100 rounded">
                                          <Icon name="material-symbols:delete" size="14" class="text-red-600" />
                                        </button>
                                      </div>
                                    </li>
                                  </ul>
                                  <div v-else class="text-gray-500 italic">No process details</div>
                                </div>
                                <div>
                                  <div class="flex items-center justify-between mb-1">
                                    <span class="font-medium">Authorized Roles</span>
                                    <rs-button size="xs" variant="primary" class="!px-2" @click="handleAddAuthorizedRole">
                                      <Icon name="material-symbols:add" size="1rem" />
                                    </rs-button>
                                  </div>
                                  <ul v-if="authorizedRoles.length" class="space-y-1">
                                    <li
                                      v-for="r in authorizedRoles"
                                      :key="r.war_authorized_role_id"
                                      class="p-2 rounded border bg-white dark:bg-gray-800 flex justify-between items-center"
                                    >
                                      <span>{{ r.war_group_code }} ({{ r.war_limit_min ?? '-' }} - {{ r.war_limit_max ?? '-' }})</span>
                                      <div class="flex gap-1">
                                        <button @click="handleEditAuthorizedRole(r)" class="p-1 hover:bg-gray-100 rounded">
                                          <Icon name="material-symbols:edit" size="14" />
                                        </button>
                                        <button @click="handleDeleteAuthorizedRole(r)" class="p-1 hover:bg-red-100 rounded">
                                          <Icon name="material-symbols:delete" size="14" class="text-red-600" />
                                        </button>
                                      </div>
                                    </li>
                                  </ul>
                                  <div v-else class="text-gray-500 italic">No authorized roles</div>
                                </div>
                              </div>
                            </template>
                          </template>
                        </div>
                      </div>
                      <div class="flex justify-end mt-2">
                        <rs-button size="sm" variant="primary" @click="handleAddProcess">
                          <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                          Add Process
                        </rs-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Workflow Modal -->
    <rs-modal
      v-model="showWorkflowModal"
      :title="isWorkflowEditMode ? 'Edit Workflow' : 'Add Workflow'"
      size="md"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveWorkflow">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Code <span class="text-red-500">*</span></label>
              <FormKit
                v-model="workflowForm.wfa_workflow_code"
                type="text"
                :disabled="isWorkflowEditMode"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Title <span class="text-red-500">*</span></label>
              <FormKit
                v-model="workflowForm.wfa_workflow_title"
                type="text"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Prevent Self Process</label>
              <FormKit
                v-model="workflowForm.wfa_prevent_self_process"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Involve Posting</label>
              <FormKit
                v-model="workflowForm.wfa_involve_posting"
                type="number"
                outer-class="mb-0"
              />
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <rs-button variant="secondary" @click="showWorkflowModal = false">Cancel</rs-button>
        <rs-button variant="primary" @click="handleSaveWorkflow">Save</rs-button>
      </template>
    </rs-modal>

    <!-- Process Modal -->
    <rs-modal
      v-model="showProcessModal"
      :title="isProcessEditMode ? 'Edit Process' : 'Add Process'"
      size="lg"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveProcess">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-medium mb-1">Process Name <span class="text-red-500">*</span></label>
              <FormKit
                v-model="processForm.wfp_process_name"
                type="text"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Description (BM)</label>
              <FormKit
                v-model="processForm.wfp_process_desc_bm"
                type="text"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sequence</label>
              <FormKit
                v-model="processForm.wfp_sequence"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Duration KPI</label>
              <FormKit
                v-model="processForm.wfp_duration_kpi"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <FormKit
                v-model="processForm.wfp_status"
                type="text"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email Notification</label>
              <FormKit
                v-model="processForm.wfp_is_email_notification"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Todo Notification</label>
              <FormKit
                v-model="processForm.wfp_is_todo_notification"
                type="number"
                outer-class="mb-0"
              />
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <rs-button variant="secondary" @click="showProcessModal = false">Cancel</rs-button>
        <rs-button variant="primary" @click="handleSaveProcess">Save</rs-button>
      </template>
    </rs-modal>

    <!-- Process Detail Modal -->
    <rs-modal
      v-model="showProcessDetailModal"
      :title="isProcessDetailEditMode ? 'Edit Process Detail' : 'Add Process Detail'"
      size="md"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveProcessDetail">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Status Code <span class="text-red-500">*</span></label>
              <FormKit
                v-model="processDetailForm.wpd_status_code"
                type="text"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status Description</label>
              <FormKit
                v-model="processDetailForm.wpd_status_desc"
                type="text"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Reroute Process</label>
              <FormKit
                v-model="processDetailForm.wpd_reroute_process"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Proc To Exec</label>
              <FormKit
                v-model="processDetailForm.wpd_proc_to_exec"
                type="text"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Order</label>
              <FormKit
                v-model="processDetailForm.wpd_order"
                type="number"
                outer-class="mb-0"
              />
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <rs-button variant="secondary" @click="showProcessDetailModal = false">Cancel</rs-button>
        <rs-button variant="primary" @click="handleSaveProcessDetail">Save</rs-button>
      </template>
    </rs-modal>

    <!-- Authorized Role Modal -->
    <rs-modal
      v-model="showAuthorizedRoleModal"
      :title="isAuthorizedRoleEditMode ? 'Edit Authorized Role' : 'Add Authorized Role'"
      size="md"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveAuthorizedRole">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Group Code <span class="text-red-500">*</span></label>
              <FormKit
                v-model="authorizedRoleForm.war_group_code"
                type="text"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Limit Min</label>
              <FormKit
                v-model="authorizedRoleForm.war_limit_min"
                type="number"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Limit Max</label>
              <FormKit
                v-model="authorizedRoleForm.war_limit_max"
                type="number"
                outer-class="mb-0"
              />
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <rs-button variant="secondary" @click="showAuthorizedRoleModal = false">Cancel</rs-button>
        <rs-button variant="primary" @click="handleSaveAuthorizedRole">Save</rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
