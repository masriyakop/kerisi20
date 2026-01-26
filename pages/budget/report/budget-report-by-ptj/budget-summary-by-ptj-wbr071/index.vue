<script setup>
definePageMeta({
  title: "Budget Summary By PTJ (WBR071)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Budget Report By PTJ", path: "/budget/report/budget-report-by-ptj" },
    { name: "Budget Summary By PTJ (WBR071)", path: "/budget/report/budget-report-by-ptj/budget-summary-by-ptj-wbr071" },
  ],
});

const { $swal } = useNuxtApp();

const filter = ref({
  reportType: "Budget Summary Report",
  statementDate: new Date().toLocaleDateString('en-MY'),
  year: "",
  fundType: "",
  ptj: "",
  dateFrom: "",
  dateTo: "",
  activityGroup: "",
  activitySubGroup: "",
});

const yearOptions = ref([]);
const fundTypeOptions = ref([]);
const ptjOptions = ref([]);
const activityGroupOptions = ref([]);
const activitySubGroupOptions = ref([]);

const fetchDropdownOptions = async () => {
  try {
    const [years, fundTypes, ptjs] = await Promise.all([
      useFetch("/api/budget/report/lookups/years"),
      useFetch("/api/budget/planning/report/lookups/fund-type"),
      useFetch("/api/budget/planning/report/lookups/ptj"),
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
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

const handleGenerate = () => {
  if (!filter.value.year || !filter.value.fundType) {
    $swal.fire({
      title: "Validation Error",
      text: "Year and Fund Type are required",
      icon: "error",
    });
    return;
  }
  $swal.fire({
    title: "Info",
    text: "Report generation will be implemented",
    icon: "info",
  });
};

const handleDownloadCSV = () => {
  if (!filter.value.year || !filter.value.fundType) {
    $swal.fire({
      title: "Validation Error",
      text: "Year and Fund Type are required",
      icon: "error",
    });
    return;
  }
  $swal.fire({
    title: "Info",
    text: "CSV download will be implemented",
    icon: "info",
  });
};

const handleDownloadPDF = () => {
  if (!filter.value.year || !filter.value.fundType) {
    $swal.fire({
      title: "Validation Error",
      text: "Year and Fund Type are required",
      icon: "error",
    });
    return;
  }
  $swal.fire({
    title: "Info",
    text: "PDF download will be implemented",
    icon: "info",
  });
};

onMounted(() => {
  fetchDropdownOptions();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="filter.reportType"
              type="text"
              label="Report Type"
              :disabled="true"
              outer-class="mb-0"
            />
            <FormKit
              v-model="filter.statementDate"
              type="text"
              label="Statement Date"
              :disabled="true"
              outer-class="mb-0"
            />
            <FormKit
              v-model="filter.year"
              type="select"
              label="Year"
              :options="yearOptions"
              placeholder="Select Year"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Year is required' }"
            />
            <FormKit
              v-model="filter.fundType"
              type="select"
              label="Fund Type"
              :options="fundTypeOptions"
              placeholder="Select Fund Type"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Fund Type is required' }"
            />
            <FormKit
              v-model="filter.ptj"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
              outer-class="mb-0"
            />
            <div class="flex items-center gap-2">
              <FormKit
                v-model="filter.dateFrom"
                type="date"
                label="Date From"
                outer-class="mb-0 flex-1"
              />
              <span class="px-2 pt-6">to</span>
              <FormKit
                v-model="filter.dateTo"
                type="date"
                label="Date To"
                outer-class="mb-0 flex-1"
              />
            </div>
            <FormKit
              v-model="filter.activityGroup"
              type="select"
              label="Activity Group"
              :options="activityGroupOptions"
              placeholder="Select Activity Group"
              outer-class="mb-0"
            />
            <FormKit
              v-model="filter.activitySubGroup"
              type="select"
              label="Activity SubGroup"
              :options="activitySubGroupOptions"
              placeholder="Select Activity SubGroup"
              outer-class="mb-0"
            />
          </div>
          <div class="flex justify-end gap-2">
            <rs-button @click="handleGenerate" color="primary">Generate</rs-button>
            <rs-button @click="handleDownloadCSV" color="secondary">Download CSV</rs-button>
            <rs-button @click="handleDownloadPDF" color="secondary">Download PDF</rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

