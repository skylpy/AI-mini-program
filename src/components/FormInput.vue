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
      @blur="handleBlur"
    />
    <view v-if="showActions" class="input-actions">
      <view v-if="passwordToggle" class="icon-action" @click="togglePassword">
        <image
          class="action-icon toggle-icon"
          :src="passwordVisible ? passwordShowIcon : passwordHideIcon"
          mode="aspectFit"
        />
      </view>
      <view v-if="showClear" class="icon-action" @click="handleClear">
        <image class="action-icon clear-icon" :src="clearIcon" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import clearIcon from '../static/normal/icon_input_clear.png'
import passwordHideIcon from '../static/normal/icon_pwd_hide.png'
import passwordShowIcon from '../static/normal/icon_pwd_show.png'

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

const showClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled && !props.passwordToggle
)
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
  passwordVisible.value = false
  emit('update:modelValue', '')
}

function handleBlur() {
  focused.value = false
}

function togglePassword() {
  if (props.disabled) {
    return
  }

  passwordVisible.value = !passwordVisible.value
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

.icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
}

.action-icon {
  width: 34rpx;
  height: 34rpx;
  flex-shrink: 0;
}
</style>
