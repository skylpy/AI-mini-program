<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { initRouteGuard } from './utils/guard'
import { useUserStore } from './stores/user'

onLaunch(() => {
  const userStore = useUserStore()
  userStore.restore()
  initRouteGuard()
})
</script>

<style lang="scss">
page {
  background: #f5f5f5;
  color: #1f2937;
  font-size: 28rpx;
}

.page-container {
  min-height: 100vh;
  padding: calc(var(--status-bar-height) + 24rpx) 24rpx 32rpx;
  background: #f5f5f5;
}

.page-with-tabbar {
  padding-bottom: 120rpx;
}

.page-head {
  margin-bottom: 8rpx;
}

.status-bar {
  height: var(--status-bar-height);
}

.card-block {
  background: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.05);
}

.section-gap {
  margin-top: 24rpx;
}

.primary-btn {
  width: 100%;
  height: 92rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ff7c74, #ff5a5f);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
}

.secondary-btn {
  width: 100%;
  height: 92rpx;
  border-radius: 999rpx;
  border: 2rpx solid rgba(255, 90, 95, 0.18);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5a5f;
  font-size: 30rpx;
  font-weight: 600;
}

.page-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
}

view,
text,
button,
input,
textarea,
swiper,
swiper-item,
image {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  background: transparent;
  line-height: normal;
}

button::after {
  border: 0;
}
</style>
