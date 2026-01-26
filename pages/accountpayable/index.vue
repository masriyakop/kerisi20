<script setup>
    definePageMeta({
      title: "Account Payable",
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
              Account Payable
            </div>
          </template>
          <template #body>
            <div>
              Content for Account Payable
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    