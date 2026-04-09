<script setup>
definePageMeta({
  title: "Senarai Pengesahan Program",
  middleware: ["auth"],
  requiresAuth: true,
});

const approvals = ref([
  { code: "PG-2025-0101", name: "Program DYMM Muallaf", pemohon: "Unit Program", submittedAt: "2025-05-02", status: "Menunggu Kelulusan" },
  { code: "PG-2025-0102", name: "Program Bantuan Fakir", pemohon: "Unit Kebajikan", submittedAt: "2025-05-04", status: "Semakan Pelulus" },
]);
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="font-semibold">Senarai Pengesahan Program</div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">Kod</th>
                <th class="border p-2 text-left">Nama Program</th>
                <th class="border p-2 text-left">Pemohon</th>
                <th class="border p-2 text-left">Tarikh Mohon</th>
                <th class="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in approvals" :key="item.code">
                <td class="border p-2">{{ item.code }}</td>
                <td class="border p-2">{{ item.name }}</td>
                <td class="border p-2">{{ item.pemohon }}</td>
                <td class="border p-2">{{ item.submittedAt }}</td>
                <td class="border p-2">{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>
