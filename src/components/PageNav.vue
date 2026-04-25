<template>
  <view class="page-nav-shell" :style="navStyleVars">
    <view class="page-nav-placeholder"></view>
    <view class="page-nav">
      <view class="page-nav-inner">
        <view class="side-slot side-slot-left">
          <view class="left-area" @click="handleBack">
            <text class="back-arrow">‹</text>
            <text class="back-text">返回</text>
          </view>
        </view>
        <text class="nav-title">{{ title }}</text>
        <view class="side-slot side-slot-right"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '../stores/user'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const userStore = useUserStore()
const navMetrics = ref({
  top: 'calc(var(--status-bar-height) + 8rpx)',
  bottom: '12rpx',
  horizontalPadding: '24rpx',
  sideWidth: '172rpx',
  barHeight: '84rpx',
  buttonHeight: '64rpx',
  placeholderHeight: 'calc(var(--status-bar-height) + 104rpx)'
})

const navStyleVars = computed(() => ({
  '--page-nav-top': navMetrics.value.top,
  '--page-nav-bottom': navMetrics.value.bottom,
  '--page-nav-horizontal-padding': navMetrics.value.horizontalPadding,
  '--page-nav-side-width': navMetrics.value.sideWidth,
  '--page-nav-bar-height': navMetrics.value.barHeight,
  '--page-nav-button-height': navMetrics.value.buttonHeight,
  '--page-nav-placeholder-height': navMetrics.value.placeholderHeight
}))

function syncNavMetrics() {
  // #ifdef MP-WEIXIN
  try {
    const systemInfo = uni.getSystemInfoSync()
    const menuRect = uni.getMenuButtonBoundingClientRect()

    if (menuRect?.width && menuRect?.height && systemInfo?.windowWidth) {
      const horizontalPadding = Math.max(systemInfo.windowWidth - menuRect.right, 12)
      const sideWidth = Math.max(systemInfo.windowWidth - menuRect.left, menuRect.width + horizontalPadding)
      const bottomGap = Math.max(menuRect.top - (systemInfo.statusBarHeight || 0), 8)
      const placeholderHeight = menuRect.top + menuRect.height + bottomGap

      navMetrics.value = {
        top: `${menuRect.top}px`,
        bottom: `${bottomGap}px`,
        horizontalPadding: `${horizontalPadding}px`,
        sideWidth: `${sideWidth}px`,
        barHeight: `${menuRect.height}px`,
        buttonHeight: `${menuRect.height}px`,
        placeholderHeight: `${placeholderHeight}px`
      }
    }
  } catch (error) {
    console.error('sync page nav metrics failed', error)
  }
  // #endif
}

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

onMounted(() => {
  syncNavMetrics()
})
</script>

<style scoped lang="scss">
.page-nav-shell {
  position: relative;
  margin: calc(-1 * var(--page-nav-offset, 0rpx)) -24rpx 24rpx;
}

.page-nav-placeholder {
  height: var(--page-nav-placeholder-height);
}

.page-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: var(--page-nav-top) var(--page-nav-horizontal-padding) var(--page-nav-bottom);
  background: linear-gradient(180deg, rgba(237, 244, 255, 0.96) 0%, rgba(244, 247, 252, 0.9) 100%);
  backdrop-filter: blur(16rpx);
}

.page-nav-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--page-nav-bar-height);
}

.side-slot {
  display: flex;
  align-items: center;
  width: var(--page-nav-side-width);
  min-width: var(--page-nav-side-width);
}

.side-slot-right {
  justify-content: flex-end;
}

.left-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 132rpx;
  min-height: var(--page-nav-button-height);
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.7);
  border: 2rpx solid rgba(203, 213, 225, 0.55);
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.back-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #475569;
  line-height: 1;
  height: 40rpx;
}

.back-text {
  margin-left: 8rpx;
  line-height: 1;
  font-size: 26rpx;
  color: #475569;
  font-weight: 500;
}

.nav-title {
  position: absolute;
  left: var(--page-nav-side-width);
  right: var(--page-nav-side-width);
  font-size: 32rpx;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
