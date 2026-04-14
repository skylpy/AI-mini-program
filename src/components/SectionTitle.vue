<template>
  <view class="section-title">
    <view class="title-left">
      <view class="bar"></view>
      <text class="title-text">{{ title }}</text>
    </view>
    <text v-if="desc" class="title-desc">{{ desc }}</text>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.title-left {
  display: flex;
  align-items: center;
}

.bar {
  width: 10rpx;
  height: 30rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #5aa5ff, #7bd1ff);
}

.title-text {
  margin-left: 14rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.title-desc {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
