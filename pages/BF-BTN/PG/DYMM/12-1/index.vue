<script setup>
definePageMeta({
  title: "Rekod Senarai Kehadiran",
  middleware: ["auth"],
  requiresAuth: true,
});

const attendances = ref([
  { code: "PG-2025-0005", name: "Program Bantuan Hari Raya", tarikh: "2025-05-01", hadir: 278, tidakHadir: 22 },
  { code: "PG-2025-0006", name: "Program Bimbingan Komuniti", tarikh: "2025-05-07", hadir: 82, tidakHadir: 8 },
]);
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="font-semibold">Rekod Senarai Kehadiran</div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">Kod Program</th>
                <th class="border p-2 text-left">Nama Program</th>
                <th class="border p-2 text-left">Tarikh</th>
                <th class="border p-2 text-left">Hadir</th>
                <th class="border p-2 text-left">Tidak Hadir</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in attendances" :key="item.code">
                <td class="border p-2">{{ item.code }}</td>
                <td class="border p-2">{{ item.name }}</td>
                <td class="border p-2">{{ item.tarikh }}</td>
                <td class="border p-2">{{ item.hadir }}</td>
                <td class="border p-2">{{ item.tidakHadir }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>
