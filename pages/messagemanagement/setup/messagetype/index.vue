<script setup>
    definePageMeta({
      title: "Message Type",
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
              Message Type
            </div>
          </template>
          <template #body>
            <div>
              Content for Message Type
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    