<template>
  <view class="form-input" :class="{ 'is-focused': focused }">
    <input
      :value="modelValue"
      class="input-core"
      :type="type"
      :password="passwordToggle && !passwordVisible"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      @input="handleInput"
      @focus="focused = true"
      @blur="focused = false"
    />
    <view v-if="showActions" class="input-actions">
      <text
        v-if="passwordToggle"
        class="action-text toggle-text"
        @click="passwordVisible = !passwordVisible"
      >
        {{ passwordVisible ? '隐藏' : '显示' }}
      </text>
      <text v-if="showClear" class="action-text clear-text" @click="handleClear">清除</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  modelModifiers: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  maxlength: {
    type: [String, Number],
    default: 140
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  passwordToggle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)
const passwordVisible = ref(false)

const showClear = computed(() => props.clearable && !!props.modelValue && !props.disabled)
const showActions = computed(() => showClear.value || props.passwordToggle)

function normalizeValue(value) {
  if (props.modelModifiers?.trim) {
    return value.trim()
  }
  return value
}

function handleInput(event) {
  emit('update:modelValue', normalizeValue(event.detail.value))
}

function handleClear() {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.form-input {
  display: flex;
  align-items: center;
  min-height: 92rpx;
  padding: 0 24rpx 0 28rpx;
  background: #f5f8ff;
  border: 2rpx solid rgba(228, 236, 250, 0.95);
  border-radius: 22rpx;
}

.is-focused {
  border-color: rgba(45, 103, 246, 0.28);
  box-shadow: 0 0 0 6rpx rgba(45, 103, 246, 0.06);
}

.input-core {
  flex: 1;
  min-width: 0;
  height: 88rpx;
  font-size: 28rpx;
  color: #111827;
  background: transparent;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.action-text {
  font-size: 22rpx;
  line-height: 1;
  color: #2d67f6;
}

.clear-text {
  color: #8aa1d9;
}
</style>
