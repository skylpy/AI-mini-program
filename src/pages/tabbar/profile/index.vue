<template>
  <view class="profile-page">
    <view class="profile-header">
      <view class="status-bar"></view>
      <view class="header-top">
        <view>
          <text class="header-title">我的</text>
          <text class="header-subtitle">账户信息与使用服务管理</text>
        </view>
        <view class="header-action" @click="handleMenuClick({ key: 'settings' })">
          <image class="header-action-icon" :src="settingsIcon" mode="aspectFit" />
        </view>
      </view>
    </view>

    <view class="profile-card">
      <view class="avatar-wrap">
        <image v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view v-else class="avatar-placeholder">{{ userInitial }}</view>
      </view>
      <view class="user-content">
        <view class="user-name-row">
          <text class="username">{{ userInfo.username || '微信用户' }}</text>
          <text class="user-tag">已登录</text>
        </view>
        <text class="user-id">ID：{{ userInfo.id || '--' }}</text>
        <text class="user-desc">查看您的转换记录、浏览历史和账户设置</text>
      </view>
    </view>

    <view class="content-area">
      <view class="section-block">
        <view class="section-head">
          <text class="section-title">常用服务</text>
        </view>
        <view class="menu-card">
          <view
            v-for="item in firstGroup"
            :key="item.key"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <view class="menu-left">
              <view class="menu-icon-wrap">
                <image class="menu-icon" :src="menuIconMap[item.key]" mode="aspectFit" />
              </view>
              <view class="menu-text">
                <text class="menu-title">{{ item.title }}</text>
                <text class="menu-desc">{{ item.desc }}</text>
              </view>
            </view>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <view class="section-block">
        <view class="section-head">
          <text class="section-title">账户与支持</text>
        </view>
        <view class="menu-card">
          <view
            v-for="item in secondGroup"
            :key="item.key"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <view class="menu-left">
              <view class="menu-icon-wrap">
                <image class="menu-icon" :src="menuIconMap[item.key]" mode="aspectFit" />
              </view>
              <view class="menu-text">
                <text class="menu-title">{{ item.title }}</text>
                <text class="menu-desc">{{ item.desc }}</text>
              </view>
            </view>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <view class="logout-wrap">
        <button class="logout-btn" :disabled="logoutLoading" @click="handleLogout">
          {{ logoutLoading ? '退出中...' : '退出登录' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { logout } from '../../../api/auth'
import { getUserProfile } from '../../../api/user'
import { requireLogin } from '../../../utils/guard'
import { useUserStore } from '../../../stores/user'

const userStore = useUserStore()

const firstGroup = [
  { key: 'records', title: '转换记录', desc: '查看最近转换历史' },
  { key: 'browse-history', title: '我的浏览', desc: '查看最近访问内容' },
  { key: 'faq', title: '常见问题', desc: '快速获取使用帮助' }
]

const secondGroup = [
  // { key: 'settings', title: '设置', desc: '账号与安全设置' },
  { key: 'service', title: '联系客服', desc: '联系人工客服' },
  { key: 'feedback', title: '我要反馈', desc: '提交建议与问题' },
  // { key: 'share', title: '好用分享', desc: '分享给更多好友' }
]

const userInfo = computed(() => userStore.state.userInfo || {})
const userInitial = computed(() => (userInfo.value.username || 'U').slice(0, 1))
const logoutLoading = ref(false)

function svgToDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const settingsIcon = svgToDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 16.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" stroke="#EAF2FF" stroke-width="2.2"/><path d="M35 24.2v-4.4l-3.1-.6a10.3 10.3 0 0 0-1.2-2.9l1.8-2.6-3.1-3.1-2.6 1.8a10.3 10.3 0 0 0-2.9-1.2L23.2 8h-4.4l-.6 3.1a10.3 10.3 0 0 0-2.9 1.2l-2.6-1.8-3.1 3.1 1.8 2.6a10.3 10.3 0 0 0-1.2 2.9L7 19.8v4.4l3.1.6a10.3 10.3 0 0 0 1.2 2.9l-1.8 2.6 3.1 3.1 2.6-1.8a10.3 10.3 0 0 0 2.9 1.2l.6 3.1h4.4l.6-3.1a10.3 10.3 0 0 0 2.9-1.2l2.6 1.8 3.1-3.1-1.8-2.6a10.3 10.3 0 0 0 1.2-2.9l3.1-.6Z" stroke="#EAF2FF" stroke-width="2.2" stroke-linejoin="round"/></svg>'
)

const menuIconMap = {
  records: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="14" stroke="#3B6FF6" stroke-width="2.8"/><path d="M26 18v8l5 4" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  ),
  'browse-history': svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M10 26s6-10 16-10 16 10 16 10-6 10-16 10-16-10-16-10Z" stroke="#3B6FF6" stroke-width="2.8" stroke-linejoin="round"/><circle cx="26" cy="26" r="4.5" stroke="#3B6FF6" stroke-width="2.8"/></svg>'
  ),
  faq: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M26 42c8.837 0 16-6.716 16-15S34.837 12 26 12 10 18.716 10 27c0 3.226 1.087 6.214 2.935 8.654L12 42l6.398-2.996A16.58 16.58 0 0 0 26 42Z" stroke="#3B6FF6" stroke-width="2.8" stroke-linejoin="round"/><path d="M21.5 22.5a4.8 4.8 0 1 1 8.3 3.3c-1.4 1.4-2.8 2.2-2.8 4.2" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round"/><circle cx="27" cy="34.5" r="1.2" fill="#3B6FF6"/></svg>'
  ),
  settings: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M26 20a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" stroke="#3B6FF6" stroke-width="2.8"/><path d="M40 28v-4l-3.2-.7a11 11 0 0 0-1.1-2.5l1.9-2.7-2.8-2.8-2.7 1.9a11 11 0 0 0-2.5-1.1L28 13h-4l-.7 3.2a11 11 0 0 0-2.5 1.1l-2.7-1.9-2.8 2.8 1.9 2.7a11 11 0 0 0-1.1 2.5L12 24v4l3.2.7a11 11 0 0 0 1.1 2.5l-1.9 2.7 2.8 2.8 2.7-1.9a11 11 0 0 0 2.5 1.1L24 39h4l.7-3.2a11 11 0 0 0 2.5-1.1l2.7 1.9 2.8-2.8-1.9-2.7a11 11 0 0 0 1.1-2.5L40 28Z" stroke="#3B6FF6" stroke-width="2.8" stroke-linejoin="round"/></svg>'
  ),
  service: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M18 27a8 8 0 0 1 16 0v5a4 4 0 0 1-4 4h-2v-8h8" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 36h-1a4 4 0 0 1-4-4v-5a13 13 0 1 1 26 0" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 39h6" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round"/></svg>'
  ),
  feedback: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M14 16h24a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H24l-8 6v-6h-2a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4Z" stroke="#3B6FF6" stroke-width="2.8" stroke-linejoin="round"/><path d="M19 24h14M19 30h9" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round"/></svg>'
  ),
  share: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="17" cy="26" r="4" stroke="#3B6FF6" stroke-width="2.8"/><circle cx="34" cy="18" r="4" stroke="#3B6FF6" stroke-width="2.8"/><circle cx="34" cy="34" r="4" stroke="#3B6FF6" stroke-width="2.8"/><path d="M20.5 24.5l9.5-4.7M20.5 27.5l9.5 4.7" stroke="#3B6FF6" stroke-width="2.8" stroke-linecap="round"/></svg>'
  )
}

async function fetchProfile() {
  try {
    const res = await getUserProfile({ showError: false })
    if (res?.data) {
      userStore.updateUserInfo(res.data)
    }
  } catch (error) {
    console.error('profile error', error)
  }
}

function handleMenuClick(item) {
  const routeMap = {
    records: '/pages/records/index',
    'browse-history': '/pages/browse-history/index',
    faq: '/pages/faq/index',
    settings: '/pages/settings/index',
    service: '/pages/service/index',
    feedback: '/pages/feedback/index'
  }

  if (item.key === 'share') {
    uni.showToast({ title: '请点击右上角分享', icon: 'none' })
    return
  }

  const url = routeMap[item.key]
  if (url) {
    uni.navigateTo({ url })
  }
}

function confirmLogout() {
  return new Promise((resolve) => {
    uni.showModal({
      title: '退出登录',
      content: '确认退出当前账号吗？',
      confirmColor: '#2d67f6',
      success: ({ confirm }) => {
        resolve(confirm)
      },
      fail: () => resolve(false)
    })
  })
}

async function handleLogout() {
  if (logoutLoading.value) {
    return
  }

  const confirmed = await confirmLogout()
  if (!confirmed) {
    return
  }

  logoutLoading.value = true
  uni.showLoading({ title: '退出中' })

  try {
    const res = await logout()
    userStore.clearLogin()
    uni.showToast({ title: res?.message || '已退出登录', icon: 'none' })

    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }, 200)
  } catch (error) {
    console.error('logout error', error)
  } finally {
    logoutLoading.value = false
    uni.hideLoading()
  }
}

onShow(async () => {
  if (!requireLogin()) {
    return
  }
  await fetchProfile()
})
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  padding: 0 24rpx 120rpx;
  background: #f4f7fc;
}

.profile-header {
  margin: 0 -24rpx;
  padding: 0 24rpx 132rpx;
  background: linear-gradient(135deg, #2c66ff 0%, #1747d6 100%);
  border-bottom-left-radius: 34rpx;
  border-bottom-right-radius: 34rpx;
  box-shadow: 0 18rpx 44rpx rgba(36, 91, 238, 0.22);
}

.profile-header .status-bar {
  height: calc(var(--status-bar-height) + 56rpx + 40px);
}

/* #ifdef H5 */
.profile-header .status-bar {
  height: calc(var(--status-bar-height) + 56rpx + 10px);
}
/* #endif */

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0;
}

.header-title {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  color: #ffffff;
}

.header-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.88);
}

.header-action {
  width: 68rpx;
  height: 68rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-action-icon {
  width: 36rpx;
  height: 36rpx;
}

.profile-card {
  display: flex;
  align-items: center;
  margin-top: -86rpx;
  padding: 28rpx 24rpx;
  background: #ffffff;
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  border-radius: 28rpx;
  box-shadow: 0 16rpx 30rpx rgba(31, 50, 92, 0.09);
}

.avatar-wrap {
  width: 120rpx;
  height: 120rpx;
}

.avatar,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 999rpx;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5f8fff 0%, #2d67f6 100%);
  border: 4rpx solid rgba(235, 242, 255, 0.95);
  color: #ffffff;
  font-size: 42rpx;
  font-weight: 700;
}

.user-content {
  flex: 1;
  margin-left: 24rpx;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.username {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #0f172a;
}

.user-tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #edf4ff;
  color: #2d67f6;
  font-size: 22rpx;
  font-weight: 600;
}

.user-id {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.user-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #94a3b8;
}

.content-area {
  padding-top: 24rpx;
}

.section-block + .section-block {
  margin-top: 24rpx;
}

.section-head {
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.menu-card {
  padding: 4rpx 22rpx;
  background: #ffffff;
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  border-radius: 28rpx;
  box-shadow: 0 12rpx 28rpx rgba(31, 50, 92, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 4rpx;
}

.menu-item + .menu-item {
  border-top: 1rpx solid #eef3fb;
}

.menu-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.menu-icon-wrap {
  width: 78rpx;
  height: 78rpx;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #e5eeff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 40rpx;
  height: 40rpx;
}

.menu-text {
  min-width: 0;
  margin-left: 18rpx;
}

.menu-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.menu-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #94a3b8;
}

.menu-arrow {
  font-size: 28rpx;
  color: #bfd0f8;
}

.logout-wrap {
  margin-top: 28rpx;
}

.logout-btn {
  width: 100%;
  height: 92rpx;
  border-radius: 999rpx;
  border: 0;
  background: linear-gradient(135deg, #3b75ff 0%, #2d67f6 100%);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 92rpx;
  box-shadow: 0 12rpx 28rpx rgba(45, 103, 246, 0.22);
}

.logout-btn[disabled] {
  opacity: 0.7;
}
</style>
