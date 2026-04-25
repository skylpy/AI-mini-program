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
  background: #f4f7fc;
  color: #1f2937;
  font-size: 28rpx;
}

.page-container {
  --page-nav-offset: calc(var(--status-bar-height) + 24rpx);
  min-height: 100vh;
  padding: var(--page-nav-offset) 24rpx 32rpx;
  background: linear-gradient(180deg, #edf4ff 0, #f4f7fc 240rpx, #f4f7fc 100%);
}

/* #ifdef MP-WEIXIN */
.page-container {
  --page-nav-offset: calc(var(--status-bar-height) + 24rpx + 8px);
}
/* #endif */

.page-with-tabbar {
  padding-bottom: 120rpx;
}

.page-head {
  margin-bottom: 8rpx;
  padding: 26rpx 24rpx;
  background: #ffffff;
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  border-radius: 28rpx;
  box-shadow: 0 12rpx 28rpx rgba(31, 50, 92, 0.06);
}

.status-bar {
  height: var(--status-bar-height);
}

.card-block {
  background: #ffffff;
  border: 2rpx solid rgba(228, 236, 250, 0.92);
  border-radius: 28rpx;
  box-shadow: 0 12rpx 28rpx rgba(31, 50, 92, 0.06);
}

.section-gap {
  margin-top: 24rpx;
}

.primary-btn {
  width: 100%;
  height: 92rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #3b75ff, #2d67f6);
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
  border: 2rpx solid rgba(45, 103, 246, 0.15);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d67f6;
  font-size: 30rpx;
  font-weight: 600;
}

.page-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #8a97ad;
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
