<script setup>
definePageMeta({
  title: "Vot Book Report (WBR051)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Budget Report By PTJ", path: "/budget/report/budget-report-by-ptj" },
    { name: "Vot Book Report (WBR051)", path: "/budget/report/budget-report-by-ptj/vot-book-report-wbr051" },
  ],
});

const { $swal } = useNuxtApp();

const filter = ref({
  year: "",
  fund: "",
  ptjLevel: "",
  ptj: "",
  costCenter: "",
  activityGroup: "",
  activitySubGroup: "",
  activity: "",
});

const yearOptions = ref([]);
const fundTypeOptions = ref([]);
const ptjLevelOptions = ref([
  { label: "3", value: "3" },
  { label: "4", value: "4" },
]);
const ptjOptions = ref([]);
const costCenterOptions = ref([]);
const activityGroupOptions = ref([]);
const activitySubGroupOptions = ref([]);
const activityOptions = ref([]);

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
  if (!filter.value.year || !filter.value.fund || !filter.value.ptj) {
    $swal.fire({
      title: "Validation Error",
      text: "Year, Fund, and PTJ are required",
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
  if (!filter.value.year || !filter.value.fund || !filter.value.ptj) {
    $swal.fire({
      title: "Validation Error",
      text: "Year, Fund, and PTJ are required",
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
  if (!filter.value.year || !filter.value.fund || !filter.value.ptj) {
    $swal.fire({
      title: "Validation Error",
      text: "Year, Fund, and PTJ are required",
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
        <div class="text-lg font-semibold">Report Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              v-model="filter.fund"
              type="select"
              label="Fund"
              :options="fundTypeOptions"
              placeholder="Select Fund"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Fund is required' }"
            />
            <FormKit
              v-model="filter.ptjLevel"
              type="select"
              label="PTJ Level"
              :options="ptjLevelOptions"
              placeholder="Select PTJ Level"
              outer-class="mb-0"
            />
            <FormKit
              v-model="filter.ptj"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'PTJ is required' }"
            />
            <FormKit
              v-model="filter.costCenter"
              type="select"
              label="Cost Center"
              :options="costCenterOptions"
              placeholder="Select Cost Center"
              outer-class="mb-0"
            />
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
            <FormKit
              v-model="filter.activity"
              type="select"
              label="Activity"
              :options="activityOptions"
              placeholder="Select Activity"
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

