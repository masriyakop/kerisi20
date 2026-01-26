<script setup>
    definePageMeta({
      title: "Account Code X",
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
              Account Code X
            </div>
          </template>
          <template #body>
            <div>
              Content for Account Code X
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    