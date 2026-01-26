<script setup>
    definePageMeta({
      title: "Workbence Management",
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
              Workbence Management
            </div>
          </template>
          <template #body>
            <div>
              Content for Workbence Management
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    