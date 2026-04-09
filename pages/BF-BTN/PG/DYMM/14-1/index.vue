<script setup>
definePageMeta({
  title: "Rekod Senarai Tuntutan",
  middleware: ["auth"],
  requiresAuth: true,
});

const claims = ref([
  { refNo: "CLM-2025-001", programCode: "PG-2025-0005", claimant: "Masjid Al-Ehsan", amount: 12500, status: "Dalam Semakan" },
  { refNo: "CLM-2025-002", programCode: "PG-2025-0008", claimant: "Komuniti IPT", amount: 8900, status: "Diluluskan" },
]);
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="font-semibold">Rekod Senarai Tuntutan</div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">No Rujukan</th>
                <th class="border p-2 text-left">Kod Program</th>
                <th class="border p-2 text-left">Penuntut</th>
                <th class="border p-2 text-left">Jumlah (RM)</th>
                <th class="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in claims" :key="item.refNo">
                <td class="border p-2">{{ item.refNo }}</td>
                <td class="border p-2">{{ item.programCode }}</td>
                <td class="border p-2">{{ item.claimant }}</td>
                <td class="border p-2">{{ item.amount.toLocaleString() }}</td>
                <td class="border p-2">{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>
