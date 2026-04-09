<script setup>
definePageMeta({
  title: "Senarai Program SJK",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();
const selectedProgram = ref("");

const daerahLabel = "Sepang";
const kariahLabel = "Masjid Al-Ehsan";
const lokasiKariah = "Masjid Al-Ehsan, Sg. Pelek";

const tableData = ref([
  { code: "SJK001", namaProgram: "Program SJK Pendidikan", tarikhProgram: "2025-06-01" },
  { code: "SJK002", namaProgram: "Program SJK Kesihatan", tarikhProgram: "2025-06-05" },
  { code: "SJK003", namaProgram: "Program SJK Pembangunan", tarikhProgram: "2025-06-12" },
]);

const handleDaftar = async () => {
  if (!selectedProgram.value) {
    await $swal.fire({
      icon: "warning",
      title: "Pilih Program",
      text: "Sila pilih satu program SJK terlebih dahulu.",
    });
    return;
  }

  await $swal.fire({
    icon: "success",
    title: "Pendaftaran Berjaya",
    text: "Program berjaya didaftarkan. Notifikasi jemputan akan dihantar (dummy mode).",
  });

  selectedProgram.value = "";
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="font-semibold">Senarai Program SJK</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded border bg-gray-50 p-3 text-sm">
              <div class="text-gray-500">Daerah</div>
              <div class="font-medium">{{ daerahLabel }}</div>
            </div>
            <div class="rounded border bg-gray-50 p-3 text-sm">
              <div class="text-gray-500">Kariah</div>
              <div class="font-medium">{{ kariahLabel }}</div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">#</th>
                  <th class="border p-2 text-left">Nama Program</th>
                  <th class="border p-2 text-left">Lokasi</th>
                  <th class="border p-2 text-left">Tarikh Program</th>
                  <th class="border p-2 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="item.code">
                  <td class="border p-2">{{ index + 1 }}</td>
                  <td class="border p-2">{{ item.namaProgram }}</td>
                  <td class="border p-2">{{ lokasiKariah }}</td>
                  <td class="border p-2">{{ item.tarikhProgram }}</td>
                  <td class="border p-2 text-center">
                    <input v-model="selectedProgram" type="radio" :value="item.code" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end">
            <rs-button variant="primary" @click="handleDaftar">Daftar Program</rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>
