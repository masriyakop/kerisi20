<script setup>
    definePageMeta({
      title: "General Ledger",
      middleware: ["auth"],
      requiresAuth: true,
    });
    </script>
    
    <template>
      <div>
        <LayoutsBreadcrumb />
        <rs-card>
          <template #header>
            <div>
              General Ledger
            </div>
          </template>
          <template #body>
            <div>
              Content for General Ledger
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    