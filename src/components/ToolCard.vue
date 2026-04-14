<template>
  <view class="tool-card" @click="$emit('click')">
    <view class="icon-wrap" :style="{ background: iconBg }">
      <text class="icon-text">{{ icon }}</text>
    </view>
    <view class="content">
      <text class="title">{{ title }}</text>
      <text class="subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<script setup>
defineEmits(['click'])

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'TOOL'
  },
  iconBg: {
    type: String,
    default: '#f3f4f6'
  }
})
</script>

<style scoped lang="scss">
.tool-card {
  display: flex;
  align-items: center;
  padding: 26rpx 22rpx;
  min-height: 180rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.05);
}

.icon-wrap {
  flex-shrink: 0;
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #2563eb;
}

.content {
  margin-left: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.subtitle {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}
</style>
