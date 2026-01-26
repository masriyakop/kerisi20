<script setup>
    definePageMeta({
      title: "Business Rule Management",
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
              Business Rule Management
            </div>
          </template>
          <template #body>
            <div>
              Content for Business Rule Management
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    