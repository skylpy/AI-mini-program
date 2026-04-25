<template>
  <view class="page-nav">
    <view class="left-area" @click="handleBack">
      <text class="back-arrow">‹</text>
      <text class="back-text">返回</text>
    </view>
    <text class="nav-title">{{ title }}</text>
    <view class="right-placeholder"></view>
  </view>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const userStore = useUserStore()

function handleBack() {
  const pages = getCurrentPages()

  if (pages.length > 1) {
    uni.navigateBack()
    return
  }

  if (userStore.isLoggedIn()) {
    uni.switchTab({
      url: '/pages/tabbar/home/index'
    })
    return
  }

  uni.reLaunch({
    url: '/pages/login/index'
  })
}
</script>

<style scoped lang="scss">
.page-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 84rpx;
  margin-bottom: 24rpx;
}

.left-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  min-width: 132rpx;
  padding: 14rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  border: 2rpx solid rgba(203, 213, 225, 0.7);
  box-shadow: 0 8rpx 20rpx rgba(31, 50, 92, 0.04);
}

.back-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  color: #475569;
  line-height: 1;
}

.back-text {
  font-size: 26rpx;
  line-height: 1;
  color: #475569;
  font-weight: 500;
}

.nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 360rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  line-height: 1.2;
}

.right-placeholder {
  width: 172rpx;
}
</style>
