<script setup>
    definePageMeta({
      title: "PTJ Code",
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
              PTJ Code
            </div>
          </template>
          <template #body>
            <div>
              Content for PTJ Code
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    