<script setup>
    definePageMeta({
      title: "Project Monitoring",
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
              Project Monitoring
            </div>
          </template>
          <template #body>
            <div>
              Content for Project Monitoring
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    