<template>
  <view class="page-nav">
    <view class="left-area" @click="handleBack">
      <text class="back-arrow"><</text>
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
  min-height: 72rpx;
  margin-bottom: 20rpx;
}

.left-area {
  display: flex;
  align-items: center;
  min-width: 132rpx;
  padding: 12rpx 0;
}

.back-arrow {
  font-size: 34rpx;
  color: #111827;
  line-height: 1;
}

.back-text {
  margin-left: 8rpx;
  font-size: 26rpx;
  color: #374151;
}

.nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 360rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

.right-placeholder {
  width: 132rpx;
}
</style>
