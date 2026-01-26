<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
  },
  dialogClass: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "top",
  },
  hideOverlay: {
    type: Boolean,
    default: false,
  },
  okOnly: {
    type: Boolean,
    default: false,
  },
  okTitle: {
    type: String,
    default: "OK",
  },
  cancelOnly: {
    type: Boolean,
    default: false,
  },
  cancelTitle: {
    type: String,
    default: "Cancel",
  },
  okCallback: {
    type: Function,
    default: () => {},
  },
  cancelCallback: {
    type: Function,
    default: () => {},
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  overlayClose: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: "70vh",
  },
  draggable: {
    type: Boolean,
    default: true,
  },
});

const modalDialogRef = ref(null);
const modalHeaderRef = ref(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const closeModal = () => {
  emits("update:modelValue", false);
};

const validateCancelCallback = () => {
  if (props.cancelCallback == "() => {}") closeModal();
  else props.cancelCallback();
};

// Draggable functionality
const handleMouseDown = (e) => {
  if (!props.draggable || !modalDialogRef.value) return;
  
  isDragging.value = true;
  const rect = modalDialogRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  e.preventDefault();
};

const handleMouseMove = (e) => {
  if (!isDragging.value || !modalDialogRef.value) return;
  
  const x = e.clientX - dragOffset.value.x;
  const y = e.clientY - dragOffset.value.y;
  
  modalDialogRef.value.style.position = 'fixed';
  modalDialogRef.value.style.left = `${x}px`;
  modalDialogRef.value.style.top = `${y}px`;
  modalDialogRef.value.style.margin = '0';
  modalDialogRef.value.style.transform = 'none';
};

const handleMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden";
      // Reset position when modal opens
      if (modalDialogRef.value && props.draggable) {
        nextTick(() => {
          modalDialogRef.value.style.position = '';
          modalDialogRef.value.style.left = '';
          modalDialogRef.value.style.top = '';
          modalDialogRef.value.style.margin = '';
          modalDialogRef.value.style.transform = '';
        });
      }
    } else {
      document.body.style.overflow = "auto";
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <Teleport to="body">
    <transition-group name="fade">
      <div
        v-if="modelValue"
        @click.self="overlayClose ? closeModal() : ''"
        class="modal"
        style="z-index: 1000"
        :class="{
          'modal-top': position == 'top',
          'modal-center': position == 'center',
          'modal-end': position == 'bottom',
          'modal-hide-overlay': hideOverlay,
        }"
      >
        <div
          v-show="modelValue"
          ref="modalDialogRef"
          class="modal-dialog"
          :class="dialogClass"
          :style="{
            width: size == 'sm' ? '300px' : size == 'md' ? '500px' : '800px',
          }"
        >
          <div class="modal-content">
            <div 
              ref="modalHeaderRef"
              class="modal-header"
              :class="{ 'cursor-move': draggable }"
              @mousedown="handleMouseDown"
            >
              <h4 v-if="!$slots.header">
                {{ title }}
              </h4>
              <slot name="header"></slot>
              <Icon
                @click="closeModal"
                class="hover:text-gray-800 cursor-pointer"
                name="ic:round-close"
              ></Icon>
            </div>
            <div class="modal-body">
              <NuxtScrollbar
                :style="{
                  'max-height': height,
                }"
              >
                <slot name="body"></slot>
                <slot v-if="!$slots.body"></slot>
              </NuxtScrollbar>
            </div>
            <div v-if="!hideFooter" class="modal-footer">
              <slot name="footer"></slot>
              <rs-button
                v-if="!$slots.footer && !okOnly"
                @click="validateCancelCallback"
                variant="primary-text"
              >
                {{ cancelTitle }}</rs-button
              >
              <rs-button
                v-if="!$slots.footer && !cancelOnly"
                @click="okCallback"
                >{{ okTitle }}</rs-button
              >
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </Teleport>
</template>
