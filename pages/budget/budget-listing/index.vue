<script setup>
definePageMeta({
  title: "Budget Listing",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Budget Listing",
      path: "/budget/budget-listing",
    },
  ],
});

const { $swal } = useNuxtApp();

// Active tab
const activeTab = ref("initial");

// Table data for each tab
const tableData = ref({
  initial: [],
  increment_decrement: [],
  virement: [],
  prerequisition: [],
  requisition: [],
  commitment: [],
  expenses: [],
});

// Loading states
const loading = ref({
  initial: false,
  increment_decrement: false,
  virement: false,
  prerequisition: false,
  requisition: false,
  commitment: false,
  expenses: false,
});

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Filter parameters from Budget Monitoring page (stored in sessionStorage, not URL)
const bgdID = ref("");
const year = ref("");
const bdg_budget_id = ref(null); // Primary key from Budget Monitoring
const viewMode = ref("view"); // 'view' or 'edit'

// Column configurations for each table
const columnConfigs = {
  initial: {
    columns: ["No", "Year", "Structure Budget", "Allocation No", "Transaction Date", "Total (RM)", "Reference No", "Status"],
    dt_keys: ["", "bdg_year", "bdg_budget_id", "ALLOCATION", "trans_date", "bdg_initial_amt", "bdg_ref_id", "bdg_status"],
    dt_js: ["return row.index", "", "", "", "", "return toCurrency(row.bdg_initial_amt)", "", ""],
    dt_class: ["small-column", "", "text-nowrap", "", "", "text-right", "", ""],
  },
  increment_decrement: {
    columns: ["No", "Year", "Structure Budget", "Transaction Date", "Reference No", "Transaction Amount (RM)"],
    dt_keys: ["", "bdg_year", "bdg_budget_id", "bgt_trans_date", "bgt_ref", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "return moment(row.bgt_trans_date).format('DD/MM/YYYY')", "", "return toCurrency(row.bgt_trans_amt)"],
    dt_class: ["small-column", "", "text-nowrap", "", "", "text-right"],
  },
  virement: {
    columns: ["No", "Year", "Structure Budget", "Transaction Date", "Reference No", "Transaction Amount (RM)"],
    dt_keys: ["", "bdg_year", "bdg_budget_id", "bgt_trans_date", "bgt_ref", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "return moment(row.bgt_trans_date).format('DD/MM/YYYY')", "", "return toCurrency(row.bgt_trans_amt)"],
    dt_class: ["small-column", "", "text-nowrap", "", "", "text-right"],
  },
  prerequisition: {
    columns: ["No", "Structure Budget No", "Fund Type", "Activity", "PTJ", "Cost Center", "Account Code", "Budget Code", "Transaction Date", "Reference No", "Transaction Amount (RM)"],
    dt_keys: ["", "sbg_budget_id", "fty_fund_type", "at_activity_code", "oun_code", "ccr_costcentre", "acm_acct_code", "lbc_budget_code", "bgt_trans_date", "bgt_ref", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "", "", "", "", "", "", "", ""],
    dt_class: ["small-column", "d-none", "", "", "", "", "", "", "", "", "text-right"],
  },
  requisition: {
    columns: ["No", "Budget No", "Structure Budget No", "Fund Type", "Activity", "PTJ", "Cost Center", "Account Code", "Transaction Date", "Reference No", "Requisition No", "Transaction Amount (RM)"],
    dt_keys: ["", "bdg_budget_id", "sbg_budget_id", "fty_fund_type", "at_activity_code", "oun_code", "ccr_costcentre", "acm_acct_code", "bgt_trans_date", "bgt_ref", "rqm_requisition_no", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "", "", "", "", "", "return moment(row.bgt_trans_date).format('DD/MM/YYYY')", "", "", "return toCurrency(row.bgt_trans_amt)"],
    dt_class: ["small-column", "d-none", "d-none", "", "", "", "", "", "", "", "d-none", "text-right"],
  },
  commitment: {
    columns: ["No", "Budget No", "Structure Budget No", "Fund Type", "Activity", "PTJ", "Cost Center", "Account Code", "Transaction Date", "Reference No", "Transaction Amount (RM)"],
    dt_keys: ["", "bdg_budget_id", "sbg_budget_id", "fty_fund_type", "at_activity_code", "oun_code", "ccr_costcentre", "lbc_budget_code", "bgt_trans_date", "bgt_ref", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "", "", "", "", "", "return moment(row.bgt_trans_date).format('DD/MM/YYYY')", "", "return toCurrency(row.bgt_trans_amt)"],
    dt_class: ["small-column", "d-none", "d-none", "", "", "", "", "", "", "", "text-right"],
  },
  expenses: {
    columns: ["No", "Budget No", "Structure Budget No", "Fund Type", "Activity", "PTJ", "Cost Center", "Account Code", "Budget Code", "Transaction Date", "Reference No", "Transaction Amount (RM)"],
    dt_keys: ["", "bdg_budget_id", "sbg_budget_id", "fty_fund_type", "at_activity_code", "oun_code", "ccr_costcentre", "acm_acct_code", "bdg_budget_code", "bgt_trans_date", "bgt_ref", "bgt_trans_amt"],
    dt_js: ["return row.index", "", "", "", "", "", "", "", "", "return row.bgt_trans_date?moment(row.bgt_trans_date).format('DD/MM/YYYY'):null", "", "return toCurrency(row.bgt_trans_amt)"],
    dt_class: ["small-column", "d-none", "d-none", "", "", "", "", "", "", "", "", "text-right"],
  },
};

// Fetch data for a specific tab
const fetchTableData = async (tabName) => {
  if (!bgdID.value || !year.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a budget from Budget Monitoring page first",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value[tabName] = true;
    
    const queryParams = {
      bgdID: bgdID.value,
      year: year.value,
      search: searchKeyword.value || "",
      page: 1,
      pageSize: pageSize.value,
    };

    console.log("queryParams:", queryParams);

    // Add the specific query parameter for each tab
    const queryParamMap = {
      initial: "dt_initial",
      increment_decrement: "dt_increment_decrement",
      virement: "dt_virement",
      prerequisition: "prerequisition_v2",
      requisition: "dt_requisition_v2",
      commitment: "dt_comitment_v2",
      expenses: "dt_expenses_v2",
    };

    queryParams[queryParamMap[tabName]] = "1";

    const { data } = await useFetch("/api/budget/budget-listing", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      console.log("zzzzz:", data.value.data);
      const config = columnConfigs[tabName];
      tableData.value[tabName] = (data.value.data || []).map((item, index) => {
        const row = { no: index + 1 };
        
        // Map data based on dt_keys - only include columns that are not hidden (d-none)
        config.columns.forEach((col, idx) => {
          if (col !== "No" && col !== "Action") {
            const dtClass = config.dt_class?.[idx] || "";
            // Skip columns marked as d-none (hidden)
            if (dtClass.includes("d-none")) {
              return; // Don't include this column in the row data
            }
            
            const key = config.dt_keys[idx];
            if (key) {
              // Handle special cases
              if (key === "ALLOCATION") {
                row[col] = item.ALLOCATION || "";
              } else {
                row[col] = item[key] || "";
              }
            } else {
              row[col] = "";
            }
          }
        });
        
        // Keep original data for actions
        row._original = item;
        console.log("row:", row);
        return row;


      });
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || `Failed to fetch ${tabName} data`,
        icon: "error",
      });
    }
  } catch (error) {
    console.error(`Error fetching ${tabName} data:`, error);
    $swal.fire({
      title: "Error",
      text: `An error occurred while fetching ${tabName} data`,
      icon: "error",
    });
  } finally {
    loading.value[tabName] = false;
  }
};

// Watch active tab and fetch data
watch(activeTab, (newTab) => {
  // Only fetch if we have required parameters and data hasn't been loaded yet
  if (bgdID.value && year.value && tableData.value[newTab].length === 0) {
    fetchTableData(newTab);
  }
}, { immediate: false });

// Handle view action - navigate to Budget Monitoring view page (without exposing parameters)
const handleView = (row) => {
  // Get PK from row data
  const rowPk = row._original?.bdg_budget_id || 
                row._original?.bgt_budget_detl_id || 
                row._original?.sbg_budget_id || 
                null;
  
  // Store parameters in sessionStorage
  if (process.client) {
    sessionStorage.setItem('budgetMonitoringViewParams', JSON.stringify({
      bgdID: bgdID.value,
      year: year.value,
      pk: rowPk || bdg_budget_id.value,
      mode: 'view',
      timestamp: Date.now(),
    }));
  }
  
  // Navigate to Budget Monitoring page without query parameters
  navigateTo("/budget/monitoring");
};

// Handle edit action - only if status is DRAFT (without exposing parameters in URL)
const handleEdit = (row) => {
  if (row._original?.bdg_status !== "DRAFT") {
    $swal.fire({
      title: "Warning",
      text: "Edit is only available for DRAFT status",
      icon: "warning",
    });
    return;
  }
  
  // Get PK from row data
  const rowPk = row._original?.bdg_budget_id || 
                row._original?.bgt_budget_detl_id || 
                row._original?.sbg_budget_id || 
                null;
  
  if (!rowPk) {
    $swal.fire({
      title: "Error",
      text: "Primary key not found. Cannot proceed with edit.",
      icon: "error",
    });
    return;
  }
  
  // Store parameters in sessionStorage (not exposed in URL)
  if (process.client) {
    sessionStorage.setItem('budgetMonitoringEditParams', JSON.stringify({
      bgdID: bgdID.value,
      year: year.value,
      pk: rowPk,
      mode: 'edit',
      timestamp: Date.now(),
    }));
  }
  
  // Navigate to Budget Monitoring page without query parameters
  navigateTo("/budget/monitoring");
};

// Format currency
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

// Get current table columns (excluding hidden ones, but always include Action)
const currentColumns = computed(() => {
  const config = columnConfigs[activeTab.value];
  if (!config) return ["No", "Action"];
  
  const visibleColumns = config.columns.filter((col, idx) => {
    const dtClass = config.dt_class?.[idx] || "";
    // Exclude columns marked as d-none
    return !dtClass.includes("d-none");
  });
  
  // Always include Action column at the end
  if (!visibleColumns.includes("Action")) {
    visibleColumns.push("Action");
  }
  
  return visibleColumns;
});

// Get current table data
const currentTableData = computed(() => {
  return tableData.value[activeTab.value] || [];
});

// Apply search filter
const applySearch = () => {
  fetchTableData(activeTab.value);
};

// Load parameters from sessionStorage on mount
onMounted(() => {
  if (process.client) {
    try {
      const storedParams = sessionStorage.getItem('budgetListingParams');
      if (storedParams) {
        const params = JSON.parse(storedParams);
        
        // Check if data is not too old (5 minutes)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() - params.timestamp < fiveMinutes) {
          bgdID.value = params.bgdID || "";
          year.value = params.year || "";
          bdg_budget_id.value = params.bdg_budget_id || params.pk || null; // Support both bdg_budget_id and pk for backward compatibility
          viewMode.value = params.mode || "view";
          
          // Clear sessionStorage after reading
          sessionStorage.removeItem('budgetListingParams');
          
          // Fetch data if we have required parameters
          if (bgdID.value && year.value) {
            fetchTableData(activeTab.value);
          } else {
            $swal.fire({
              title: "Warning",
              text: "Budget ID and Year are required. Please select a budget from Budget Monitoring page.",
              icon: "warning",
            });
          }
        } else {
          // Data expired
          sessionStorage.removeItem('budgetListingParams');
          $swal.fire({
            title: "Session Expired",
            text: "Please select a budget from Budget Monitoring page again.",
            icon: "warning",
          });
        }
      } else {
        $swal.fire({
          title: "No Data",
          text: "Please select a budget from Budget Monitoring page first.",
          icon: "info",
        });
      }
    } catch (error) {
      console.error("Error reading sessionStorage:", error);
      $swal.fire({
        title: "Error",
        text: "Failed to load budget parameters. Please try again.",
        icon: "error",
      });
    }
  }
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Listing</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Tabs -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8 overflow-x-auto">
              <button
                v-for="tab in [
                  { key: 'initial', label: 'Budget Initial' },
                  { key: 'increment_decrement', label: 'Increment / Decrement' },
                  { key: 'virement', label: 'Virement' },
                  { key: 'prerequisition', label: 'Pre Requisition' },
                  { key: 'requisition', label: 'Requisition' },
                  { key: 'commitment', label: 'Commitment' },
                  { key: 'expenses', label: 'Expenses' },
                ]"
                :key="tab.key"
                @click="activeTab = tab.key; fetchTableData(tab.key)"
                :class="[
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Search and Display Controls -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
                outer-class="mb-0"
                @change="fetchTableData(activeTab)"
              />
            </div>

            <!-- Search on Right -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</label>
              <div class="flex gap-2">
                <FormKit
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  @keyup.enter="applySearch"
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
                <rs-button
                  class="!px-3"
                  style="height: 40px; min-height: 40px;"
                  @click="applySearch"
                >
                  <Icon
                    name="ic:outline-search"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="budget-listing-table-wrapper" :style="{ maxHeight: currentTableData.length > 10 ? '600px' : 'auto', overflowY: currentTableData.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading[activeTab]" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-listing-table-${activeTab}-${searchKeyword || 'all'}-${pageSize}`"
              :data="currentTableData"
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
            >
              <!-- Dynamic column slots -->
              <template v-for="col in currentColumns" :key="col" v-slot:[col]="data">
                <span v-if="col === 'No'">{{ data.value.no }}</span>
                <span v-else-if="col.includes('(RM)') || col.includes('Total')" class="text-right">
                  {{ toCurrency(data.value[col]) }}
                </span>
                <span v-else-if="col.includes('Date')">
                  {{ formatDate(data.value[col]) }}
                </span>
                <span v-else>{{ data.value[col] }}</span>
              </template>

              <!-- Action column -->
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-blue-600 dark:text-blue-400"
                      size="20"
                    />
                  </button>
                  <button
                    v-if="data.value._original?.bdg_status === 'DRAFT'"
                    @click="handleEdit(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.budget-listing-table-wrapper {
  overflow-x: auto;
}

/* Blue column headers */
:deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 600;
}

/* Sortable columns except No and Action */
:deep(.rs-table thead th:not(:first-child):not(:last-child)) {
  cursor: pointer;
}

:deep(.rs-table thead th:first-child),
:deep(.rs-table thead th:last-child) {
  cursor: default;
}
</style>
