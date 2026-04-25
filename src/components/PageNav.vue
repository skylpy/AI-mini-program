<template>
  <view class="page-nav-wrap">
    <view :class="['page-nav-shell', { 'page-nav-shell-fixed': fixed }]">
      <view class="page-nav">
        <view class="left-area" @click="handleBack">
          <image class="back-arrow" :src="backIcon" mode="aspectFit" />
          <text class="back-text">返回</text>
        </view>
        <text class="nav-title">{{ title }}</text>
        <view class="right-placeholder"></view>
      </view>
    </view>
    <view v-if="fixed" class="page-nav-placeholder"></view>
  </view>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import backIcon from '../static/normal/icon_back.png'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  fixed: {
    type: Boolean,
    default: true
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
.page-nav-wrap {
  width: 100%;
}

.page-nav-shell {
  position: relative;
  margin-bottom: 24rpx;
}

.page-nav-shell-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  padding: calc(var(--status-bar-height) + 10rpx) 24rpx 14rpx;
  background: linear-gradient(180deg, rgba(237, 244, 255, 0.96) 0%, rgba(244, 247, 252, 0.88) 100%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 10rpx 26rpx rgba(31, 50, 92, 0.06);
}

.page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 84rpx;
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
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
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

.page-nav-placeholder {
  height: calc(var(--status-bar-height) + 108rpx);
}

/* #ifdef MP-WEIXIN */
.page-nav-shell-fixed {
  padding-top: calc(var(--status-bar-height) + 10rpx + 8px);
}

.page-nav-placeholder {
  height: calc(var(--status-bar-height) + 108rpx + 8px);
}
/* #endif */
</style>
