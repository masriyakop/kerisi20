<script setup>
    definePageMeta({
      title: "Workflow Configuration",
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
              Workflow Configuration
            </div>
          </template>
          <template #body>
            <div>
              Content for Workflow Configuration
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    