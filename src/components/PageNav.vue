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
  min-width: 132rpx;
  padding: 14rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.88);
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  box-shadow: 0 8rpx 20rpx rgba(31, 50, 92, 0.05);
}

.back-arrow {
  font-size: 40rpx;
  color: #2d67f6;
  line-height: 1;
  transform: translateY(-2rpx);
}

.back-text {
  margin-left: 8rpx;
  font-size: 26rpx;
  color: #2d67f6;
  font-weight: 600;
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
