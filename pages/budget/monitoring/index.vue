<script setup>
definePageMeta({
  title: "Monitoring",
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
      name: "Monitoring",
      path: "/budget/monitoring",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const monitoringList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Top Filter (Monitoring Filter)
const topFilter = ref({
  year: "",
  fundType: "",
  oun_level: "",
  oun_code: "",
  ccr_costcentre_top: "",
  activity_group: "",
  activity_subgroup: "",
  at_activity_code_top: "",
});

// Store original data separately (not as table columns)
const originalDataMap = ref(new Map());

// Filtered data - using ref instead of computed for better reactivity
const filteredMonitoringList = ref([...monitoringList.value]);

// Dropdown options
const statusOptions = ref([
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...monitoringList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      // Search across all text fields
      const searchableText = Object.values(item)
        .filter(val => val !== null && val !== undefined && typeof val !== 'object')
        .map(val => String(val).toLowerCase())
        .join(' ');
      
      return searchableText.includes(keyword);
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredMonitoringList.value = [];
  nextTick(() => {
    filteredMonitoringList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredMonitoringList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchMonitoring();
}, { deep: true });

// Fetch budget monitoring records from API
const fetchMonitoring = async () => {
  try {
    loading.value = true;
    const query = {};

    // Add top filters
    if (topFilter.value.year) {
      query.year = topFilter.value.year;
    }
    if (topFilter.value.fundType) {
      query.fundType = topFilter.value.fundType;
    }
    if (topFilter.value.oun_code) {
      query.oun_code = topFilter.value.oun_code;
    }
    if (topFilter.value.ccr_costcentre_top) {
      query.ccr_costcentre_top = topFilter.value.ccr_costcentre_top;
    }
    if (topFilter.value.at_activity_code_top) {
      query.at_activity_code_top = topFilter.value.at_activity_code_top;
    }

    const { data } = await useFetch("/api/budget/monitoring", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Clear previous map
      originalDataMap.value.clear();
      
      monitoringList.value = (data.value.data || []).map((item, index) => {
        const rowKey = item.budgetid || `row-${index}`;
        
        // Store original data separately (not as table columns)
        // Ensure all required fields are present
        const originalData = {
          ...item,
          bdg_budget_id: item.bdg_budget_id || extractPKFromUrl(item.urlViewBudget) || null,
          bdg_year: item.bdg_year || '', // Store bdg_year from budget model
          budgetid: item.budgetid || rowKey,
          urlViewBudget: item.urlViewBudget || '',
        };
        
        originalDataMap.value.set(rowKey, originalData);
        
        // Also store by bdg_budget_id as backup key
        if (originalData.bdg_budget_id) {
          originalDataMap.value.set(`bdg_${originalData.bdg_budget_id}`, originalData);
        }
        
        // Return only displayable columns (no _original, urlViewBudget, or _rowKey)
        // Add "Action" property to ensure Action column appears at the end
        // Store rowKey as a hidden property for lookup (using non-enumerable property)
        const rowData = {
          no: index + 1,
          "Structure Budget": item.budgetid,
          "Budget Code Desc": item.acm_acct_desc,
          "Activity Desc": item.at_activity_description_bm,
          Opening: item.bdg_bal_carryforward,
          "Allocation Receive": item.bdg_topup_amt,
          Initial: item.bdg_initial_amt,
          "Increment<br>Decrement": item.bdg_additional_amt,
          Virement: item.bdg_virement_amt,
          Allocated: item.bdg_allocated_amt,
          Lock: item.bdg_lock_amt,
          "Pre Request": item.bdg_pre_request_amt,
          Request: item.bdg_request_amt,
          Commit: item.bdg_commit_amt,
          Expenses: item.bdg_expenses_amt,
          Balance: item.bdg_balance_amt,
          Status: item.bdg_status,
          "Fund Type": item.fty_fund_type,
          "Fund Desc": item.fty_fund_desc,
          "Activity Code": item.at_activity_code,
          PTJ: item.oun_code,
          "PTJ Desc": item.oun_desc,
          "Cost Centre": item.ccr_costcentre,
          "Cost Centre Desc": item.ccr_costcentre_desc,
          "Budget Code": item.lbc_budget_code,
          "Budget Closing": item.bdg_closing,
          "Budget Closing By": item.bdg_closing_by,
          Action: "", // Add Action property to ensure Action column appears
        };
        
        // Store rowKey as a non-enumerable property for internal use
        Object.defineProperty(rowData, '_rowKey', {
          value: rowKey,
          enumerable: false,
          writable: false,
        });
        
        return rowData;
      });
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget monitoring records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget monitoring records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget monitoring records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchMonitoring();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchMonitoring();
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Extract PK from URL (e.g., /budget/monitoring/view/123)
const extractPKFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
};

// Handle view action - navigate to Budget Listing page (without exposing parameters in URL)
const handleView = (row) => {
  try {
    // Validate row data
    if (!row || typeof row !== 'object') {
      console.error("Invalid row data:", row);
      $swal.fire({
        title: "Error",
        text: "Invalid row data. Please try again.",
        icon: "error",
      });
      return;
    }
    
    const budgetid = row["Structure Budget"] || "";
    
    if (!budgetid) {
      $swal.fire({
        title: "Warning",
        text: "Budget ID is required",
        icon: "warning",
      });
      return;
    }
    
    // Check if originalDataMap is initialized and has data
    if (!originalDataMap.value || originalDataMap.value.size === 0) {
      console.error("originalDataMap is empty. Available keys:", Array.from(originalDataMap.value?.keys() || []));
      $swal.fire({
        title: "Error",
        text: "Budget data not loaded. Please refresh the page and try again.",
        icon: "error",
      });
      return;
    }
    
    // Get original data from map using budgetid as key
    // Try multiple lookup methods
    let originalData = originalDataMap.value.get(budgetid);
    
    // If not found, try using _rowKey if available (check both enumerable and non-enumerable)
    if (!originalData) {
      try {
        const rowKey = row._rowKey || Object.getOwnPropertyDescriptor(row, '_rowKey')?.value;
        if (rowKey) {
          originalData = originalDataMap.value.get(rowKey);
        }
      } catch (e) {
        console.warn("Could not access _rowKey:", e);
      }
    }
    
    // If still not found, try to find by matching budgetid in all entries
    if (!originalData) {
      // Try to find any entry that matches the budgetid pattern
      for (const [key, value] of originalDataMap.value.entries()) {
        if (value && value.budgetid === budgetid) {
          originalData = value;
          break;
        }
      }
    }
    
    // Last resort: try to find by any key that contains the budgetid
    if (!originalData) {
      for (const [key, value] of originalDataMap.value.entries()) {
        if (value && (key === budgetid || (typeof key === 'string' && key.includes(budgetid)) || (typeof budgetid === 'string' && budgetid.includes(key)))) {
          originalData = value;
          break;
        }
      }
    }
    
    if (!originalData) {
      console.error("Original data not found for budgetid:", budgetid);
      console.error("Row data:", JSON.stringify(row, null, 2));
      console.error("Available keys in map:", Array.from(originalDataMap.value.keys()));
      $swal.fire({
        title: "Error",
        text: `Budget data not found for ID: ${budgetid}. Please refresh the page and try again.`,
        icon: "error",
      });
      return;
    }
    
    // Extract bdg_year from budget model (not from filter field)
    const bdg_year = originalData.bdg_year || originalData.bdgYear || "";
    
    // Get bdg_budget_id (Primary Key) from the original data
    const bdg_budget_id = originalData.bdg_budget_id || 
                          originalData.bdgBudgetId ||
                          extractPKFromUrl(originalData.urlViewBudget) ||
                          null;
    
    if (!bdg_year) {
      console.error("bdg_year not found in originalData:", originalData);
      $swal.fire({
        title: "Error",
        text: "Year (bdg_year) not found in budget record. Cannot proceed.",
        icon: "error",
      });
      return;
    }
    
    if (!bdg_budget_id) {
      console.error("bdg_budget_id not found in originalData:", originalData);
      $swal.fire({
        title: "Error",
        text: "Budget ID (bdg_budget_id) not found. Cannot proceed.",
        icon: "error",
      });
      return;
    }
    
    // Store parameters in sessionStorage (not exposed in URL)
    if (process.client) {
      try {
        const params = {
          bgdID: budgetid,
          year: String(bdg_year), // Ensure year is a string
          bdg_budget_id: String(bdg_budget_id), // Ensure ID is a string
          mode: 'view',
          timestamp: Date.now(),
        };
        
        console.log("Storing parameters in sessionStorage:", params);
        sessionStorage.setItem('budgetListingParams', JSON.stringify(params));
      } catch (storageError) {
        console.error("Error storing in sessionStorage:", storageError);
        $swal.fire({
          title: "Error",
          text: "Failed to store parameters. Please try again.",
          icon: "error",
        });
        return;
      }
    }
    
    // Navigate to Budget Listing page without query parameters
    navigateTo("/budget/budget-listing");
  } catch (error) {
    console.error("Error in handleView:", error);
    console.error("Error stack:", error.stack);
    $swal.fire({
      title: "Error",
      text: `An error occurred: ${error.message || 'Unknown error'}`,
      icon: "error",
    });
  }
};

// Handle edit action - only if status is DRAFT (without exposing parameters in URL)
const handleEdit = (row) => {
  if (row.Status !== "DRAFT") {
    $swal.fire({
      title: "Warning",
      text: "Edit is only available for DRAFT status",
      icon: "warning",
    });
    return;
  }
  
  const budgetid = row["Structure Budget"] || "";
  
  // Get original data from map using budgetid as key
  const originalData = originalDataMap.value.get(budgetid) || {};
  
  // Extract bdg_year from budget model (not from filter field)
  const bdg_year = originalData.bdg_year || "";
  
  // Get PK from the original data
  const pk = originalData.bdg_budget_id || 
             extractPKFromUrl(originalData.urlViewBudget) ||
             originalData.sbg_budget_id || 
             null;
  
  if (!budgetid) {
    $swal.fire({
      title: "Warning",
      text: "Budget ID is required",
      icon: "warning",
    });
    return;
  }
  
  if (!bdg_year) {
    $swal.fire({
      title: "Error",
      text: "Year (bdg_year) not found in budget record. Cannot proceed.",
      icon: "error",
    });
    return;
  }
  
  if (!pk) {
    $swal.fire({
      title: "Error",
      text: "Primary key not found. Cannot proceed with edit.",
      icon: "error",
    });
    return;
  }
  
  // Store parameters in sessionStorage (not exposed in URL)
  if (process.client) {
    sessionStorage.setItem('budgetListingParams', JSON.stringify({
      bgdID: budgetid,
      year: bdg_year, // Use bdg_year from budget model instead of filter field
      bdg_budget_id: pk,
      mode: 'edit',
      timestamp: Date.now(),
    }));
  }
  
  // Navigate to Budget Listing page without query parameters
  navigateTo("/budget/budget-listing");
};

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Top Filter (Monitoring Filter) -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Monitoring Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Year<span class="text-red-500"> *</span>:
              </label>
              <FormKit
                v-model="topFilter.year"
                type="text"
                placeholder="Select Year"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Fund:</label>
              <FormKit
                v-model="topFilter.fundType"
                type="text"
                placeholder="Select Fund"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">PTJ Level:</label>
              <FormKit
                v-model="topFilter.oun_level"
                type="text"
                placeholder="Select PTJ Level"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">
                PTJ<span class="text-red-500"> *</span>:
              </label>
              <FormKit
                v-model="topFilter.oun_code"
                type="text"
                placeholder="Select PTJ"
                validation="required"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Cost Center:</label>
              <FormKit
                v-model="topFilter.ccr_costcentre_top"
                type="text"
                placeholder="Select Cost Center"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Activity Group:</label>
              <FormKit
                v-model="topFilter.activity_group"
                type="text"
                placeholder="Select Activity Group"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Activity Subgroup:</label>
              <FormKit
                v-model="topFilter.activity_subgroup"
                type="text"
                placeholder="Select Activity Subgroup"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Activity:</label>
              <FormKit
                v-model="topFilter.at_activity_code_top"
                type="text"
                placeholder="Select Activity"
                outer-class="mb-0"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <rs-button variant="primary" @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Search
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Monitoring Section -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Monitoring</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
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
              />
            </div>

            <!-- Search on Right -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</label>
              <FormKit
                v-model="searchKeyword"
                type="text"
                placeholder="Search..."
                outer-class="mb-0"
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
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="budget-monitoring-table-wrapper">

            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-monitoring-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredMonitoringList"
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
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
          <template v-slot:StructureBudget="data">
            {{ data.value['Structure Budget'] }}
          </template>
          <template v-slot:BudgetCodeDesc="data">
            {{ data.value['Budget Code Desc'] }}
          </template>
          <template v-slot:ActivityDesc="data">
            {{ data.value['Activity Desc'] }}
          </template>
          <template v-slot:Opening="data">
            {{ toCurrency(data.value.Opening) }}
          </template>
          <template v-slot:AllocationReceive="data">
            {{ toCurrency(data.value['Allocation Receive']) }}
          </template>
          <template v-slot:Initial="data">
            {{ toCurrency(data.value.Initial) }}
          </template>
          <template v-slot:IncrementDecrement="data">
            {{ toCurrency(data.value['Increment<br>Decrement']) }}
          </template>
          <template v-slot:Virement="data">
            {{ toCurrency(data.value.Virement) }}
          </template>
          <template v-slot:Allocated="data">
            {{ toCurrency(data.value.Allocated) }}
          </template>
          <template v-slot:Lock="data">
            {{ toCurrency(data.value.Lock) }}
          </template>
          <template v-slot:PreRequest="data">
            {{ toCurrency(data.value['Pre Request']) }}
          </template>
          <template v-slot:Request="data">
            {{ toCurrency(data.value.Request) }}
          </template>
          <template v-slot:Commit="data">
            {{ toCurrency(data.value.Commit) }}
          </template>
          <template v-slot:Expenses="data">
            {{ toCurrency(data.value.Expenses) }}
          </template>
          <template v-slot:Balance="data">
            {{ toCurrency(data.value.Balance) }}
          </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.Status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.Status === 'REJECTED',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
          <template v-slot:FundType="data">
            {{ data.value['Fund Type'] }}
          </template>
          <template v-slot:FundDesc="data">
            {{ data.value['Fund Desc'] }}
          </template>
          <template v-slot:ActivityCode="data">
            {{ data.value['Activity Code'] }}
          </template>
          <template v-slot:PTJ="data">
            {{ data.value.PTJ }}
          </template>
          <template v-slot:PTJDesc="data">
            {{ data.value['PTJ Desc'] }}
          </template>
          <template v-slot:CostCentre="data">
            {{ data.value['Cost Centre'] }}
          </template>
          <template v-slot:CostCentreDesc="data">
            {{ data.value['Cost Centre Desc'] }}
          </template>
          <template v-slot:BudgetCode="data">
            {{ data.value['Budget Code'] }}
          </template>
          <template v-slot:BudgetClosing="data">
            {{ data.value['Budget Closing'] }}
          </template>
          <template v-slot:BudgetClosingBy="data">
            {{ data.value['Budget Closing By'] }}
          </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="View Budget Listing"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-blue-600 dark:text-blue-400"
                      size="20"
                    />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-monitoring-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

