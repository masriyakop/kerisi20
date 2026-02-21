<script setup>
/* eslint-disable */
const props = defineProps({
  context: Object,
});

// Avoid passing "undefined" to Maska when mask prop is not set; use empty so input is unmasked
const rawMask = props.context?.mask;
const mask = rawMask != null && String(rawMask).trim() !== '' && String(rawMask) !== 'undefined'
  ? String(rawMask)
  : '';

// Never show "undefined" in the input when form model value is missing
const rawValue = props.context?._value;
const displayValue = (rawValue != null && rawValue !== '' && String(rawValue) !== 'undefined')
  ? String(rawValue)
  : '';

function handleInput(e) {
  props.context.node.input(e.target.value);
}
</script>

<template>
  <input
    @input="handleInput"
    :class="context.classes.input"
    :value="displayValue"
    :placeholder="context.attrs.placeholder"
    v-maska="mask"
  />
</template>
