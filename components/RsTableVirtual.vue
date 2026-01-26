<script setup>
// Convert field names to camelCase for slot matching (same logic as RsTable)
const spacingCharactertoCamelCase = (element) => {
  if (element.charAt(0) == element.charAt(0).toUpperCase()) {
    // Camelcase the string and remove spacing
    // and if there is () in the string, do Uppercase inside the () and dont spacing it
    let camelCase = element
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => {
        return str.toUpperCase();
      })
      .replace(/\s/g, "");
    
    let resultCamelCase = camelCase.replace(/\(([^)]+)\)/, (str) => {
      return str.toUpperCase();
    });
    
    return resultCamelCase;
  } else {
    return element;
  }
};

const props = defineProps({
  field: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({
      variant: "default",
      striped: false,
      bordered: false,
      borderless: false,
      hover: false,
    }),
  },
  optionsAdvanced: {
    type: Object,
    default: () => ({
      sortable: true,
      filterable: false,
      responsive: false,
      outsideBorder: false,
    }),
  },
  itemHeight: {
    type: Number,
    default: 50, // Height of each row in pixels
  },
  containerHeight: {
    type: [String, Number],
    default: '600px', // Container height
  },
  // Callback function to load more data when scrolling near bottom
  onLoadMore: {
    type: Function,
    default: null,
  },
  // Whether more data is available
  hasMore: {
    type: Boolean,
    default: false,
  },
  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },
})

const containerRef = ref(null)
const scrollTop = ref(0)

const containerHeightValue = computed(() => {
  if (typeof props.containerHeight === 'number') {
    return `${props.containerHeight}px`
  }
  return props.containerHeight
})

// Calculate visible range for virtual scrolling
const visibleRange = computed(() => {
  if (!containerRef.value || props.data.length === 0) {
    return { start: 0, end: 0 }
  }
  
  const containerHeight = containerRef.value.clientHeight || 600
  const startIndex = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - 5) // Overscan 5 items
  const visibleCount = Math.ceil(containerHeight / props.itemHeight)
  const endIndex = Math.min(props.data.length, startIndex + visibleCount + 10) // Overscan 10 items below
  
  return {
    start: startIndex,
    end: endIndex,
  }
})

// Get visible items
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return props.data.slice(start, end).map((item, index) => ({
    data: item,
    index: start + index,
  }))
})

// Calculate padding for virtual scrolling
const paddingTop = computed(() => {
  return visibleRange.value.start * props.itemHeight
})

const paddingBottom = computed(() => {
  const remaining = props.data.length - visibleRange.value.end
  return remaining * props.itemHeight
})

// Watch for scroll position to trigger load more
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
  
  if (!props.onLoadMore || !props.hasMore || props.loading) return
  
  const target = e.target
  const scrollTopValue = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight
  
  // Load more when user scrolls to 80% of the container
  if (scrollTopValue + clientHeight >= scrollHeight * 0.8) {
    props.onLoadMore()
  }
}

// Expose methods for parent components
defineExpose({
  scrollToIndex: (index) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * props.itemHeight
    }
  },
  scrollToTop: () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  },
})
</script>

<template>
  <div class="virtual-table-wrapper">
    <div
      ref="containerRef"
      :style="{ height: containerHeightValue, overflow: 'auto' }"
      @scroll="handleScroll"
      class="virtual-table-container"
    >
      <table
        class="table-content virtual-table"
        :class="{
          '!border-y !border-0 border-[rgb(var(--bg-1))]': true,
          'table-auto': true,
        }"
      >
        <thead
          class="text-left border-[rgb(var(--border-color))] sticky top-0 z-10"
          :class="{
            'border-y': !options.borderless,
            'border-[rgb(var(--border-color))] bg-[rgb(var(--bg-2))]':
              options.variant === 'default',
            'border-primary/50 bg-primary text-white':
              options.variant === 'primary',
            'border-secondary/50 bg-secondary text-white':
              options.variant === 'secondary',
            'border-info/50 bg-info text-white ': options.variant === 'info',
            'border-success/50 bg-success text-white':
              options.variant === 'success',
            'border-warning/50 bg-warning text-white':
              options.variant === 'warning',
            'border-danger/50 bg-danger text-white':
              options.variant === 'danger',
          }"
        >
          <tr>
            <th
              class="relative py-3 pl-5 pr-8 whitespace-nowrap"
              :class="{
                'border-r last:border-l last:border-r-0':
                  options.bordered && !options.borderless,
                'border-[rgb(var(--border-color))]':
                  options.variant === 'default',
                'border-primary/80': options.variant === 'primary',
                'border-secondary/80': options.variant === 'secondary',
                'border-info/80': options.variant === 'info',
                'border-success/80': options.variant === 'success',
                'border-warning/80': options.variant === 'warning',
                'border-danger/80': options.variant === 'danger',
              }"
              style="min-width: 100px"
              v-for="(val, index) in field"
              :key="index"
            >
              {{ val }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Virtual padding top -->
          <tr v-if="paddingTop > 0" style="height: 0">
            <td :colspan="field.length" style="height: 0; padding: 0; border: none;">
              <div :style="{ height: `${paddingTop}px` }"></div>
            </td>
          </tr>
          
          <!-- Visible rows -->
          <template v-for="{ data: item, index } in visibleItems" :key="index">
            <tr
              :class="{
                'border-y border-[rgb(var(--border-color))]':
                  !options.bordered && !options.borderless,
                'border-b': options.bordered && !options.borderless,
                'border-b-0': options.borderless,
                'border-[rgb(var(--border-color))] odd:bg-[rgb(var(--bg-1))] even:bg-[rgb(var(--bg-2))]':
                  options.variant === 'default' && options.striped,
                'border-primary/20 odd:bg-white even:bg-primary/5':
                  options.variant === 'primary' && options.striped,
                'border-secondary/20 odd:bg-white even:bg-secondary/5':
                  options.variant === 'secondary' && options.striped,
                'border-info/20 odd:bg-white even:bg-info/5':
                  options.variant === 'info' && options.striped,
                'border-success/20 odd:bg-white even:bg-success/5':
                  options.variant === 'success' && options.striped,
                'border-warning/20 odd:bg-white even:bg-warning/5':
                  options.variant === 'warning' && options.striped,
                'border-danger/20 odd:bg-white even:bg-danger/5':
                  options.variant === 'danger' && options.striped,
                'cursor-pointer hover:bg-slate-300':
                  options.hover && options.variant === 'default',
                'cursor-pointer hover:bg-primary/5':
                  options.hover && options.variant === 'primary',
                'cursor-pointer hover:bg-secondary/5':
                  options.hover && options.variant === 'secondary',
                'cursor-pointer hover:bg-info/5':
                  options.hover && options.variant === 'info',
                'cursor-pointer hover:bg-success/5':
                  options.hover && options.variant === 'success',
                'cursor-pointer hover:bg-warning/5':
                  options.hover && options.variant === 'warning',
                'cursor-pointer hover:bg-danger/5':
                  options.hover && options.variant === 'danger',
              }"
              :style="{ height: `${itemHeight}px` }"
            >
              <td
                class="p-4 pl-5 break-words"
                :class="{
                  'border-r last:border-l last:border-r-0':
                    options.bordered && !options.borderless,
                  'border-[rgb(var(--border-color))]':
                    options.variant === 'default',
                  'border-primary/20': options.variant === 'primary',
                  'border-secondary/20': options.variant === 'secondary',
                  'border-info/20': options.variant === 'info',
                  'border-success/20': options.variant === 'success',
                  'border-warning/20': options.variant === 'warning',
                  'border-danger/20': options.variant === 'danger',
                }"
                v-for="(fieldName, fieldIndex) in field"
                :key="fieldIndex"
              >
                <slot
                  :name="spacingCharactertoCamelCase(fieldName)"
                  :text="item[fieldName]"
                  :value="item"
                  :index="index"
                >
                  {{ item[fieldName] }}
                </slot>
              </td>
            </tr>
          </template>
          
          <!-- Virtual padding bottom -->
          <tr v-if="paddingBottom > 0" style="height: 0">
            <td :colspan="field.length" style="height: 0; padding: 0; border: none;">
              <div :style="{ height: `${paddingBottom}px` }"></div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Loading indicator at bottom -->
      <div
        v-if="loading && hasMore"
        class="flex justify-center items-center py-4"
      >
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading more...</span>
      </div>
      
      <!-- End of list indicator -->
      <div
        v-if="!hasMore && data.length > 0"
        class="flex justify-center items-center py-4 text-gray-500"
      >
        <span>No more data to load</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-table-wrapper {
  width: 100%;
}

.virtual-table-container {
  position: relative;
}

.virtual-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.virtual-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: inherit;
}

.virtual-table tbody {
  display: table-row-group;
}
</style>
