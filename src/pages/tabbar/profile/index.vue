<template>
  <view class="profile-page">
    <view class="profile-header">
      <view class="status-bar"></view>
      <view class="header-top">
        <text class="header-title">我的</text>
        <view class="capsule-btn">胶囊区</view>
      </view>

      <view class="user-card">
        <view class="avatar-wrap">
          <image v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" mode="aspectFill" />
          <view v-else class="avatar-placeholder">{{ userInitial }}</view>
        </view>
        <view class="user-content">
          <text class="username">{{ userInfo.username || '微信用户' }}</text>
          <text class="user-id">ID：{{ userInfo.id || '--' }}</text>
        </view>
      </view>
    </view>

    <view class="content-area">
      <view class="menu-card">
        <ListCell
          v-for="item in firstGroup"
          :key="item.key"
          :title="item.title"
          :desc="item.desc"
          :icon="item.icon"
          @click="handleMenuClick(item)"
        />
      </view>

      <view class="menu-card section-gap">
        <ListCell
          v-for="item in secondGroup"
          :key="item.key"
          :title="item.title"
          :desc="item.desc"
          :icon="item.icon"
          @click="handleMenuClick(item)"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ListCell from '../../../components/ListCell.vue'
import { getUserProfile } from '../../../api/user'
import { requireLogin } from '../../../utils/guard'
import { useUserStore } from '../../../stores/user'

const userStore = useUserStore()

const firstGroup = [
  { key: 'records', title: '转换记录', desc: '查看最近转换历史', icon: 'REC' },
  { key: 'browse-history', title: '我的浏览', desc: '查看最近访问内容', icon: 'HIS' },
  { key: 'faq', title: '常见问题', desc: '快速获取使用帮助', icon: 'FAQ' }
]

const secondGroup = [
  { key: 'service', title: '联系客服', desc: '联系人工客服', icon: 'CSR' },
  { key: 'feedback', title: '我要反馈', desc: '提交建议与问题', icon: 'FDB' },
  { key: 'share', title: '好用分享', desc: '分享给更多好友', icon: 'SHR' }
]

const userInfo = computed(() => userStore.state.userInfo || {})
const userInitial = computed(() => (userInfo.value.username || 'U').slice(0, 1))

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
  background: #f5f5f5;
}

.profile-header {
  padding: 0 24rpx 40rpx;
  background: linear-gradient(180deg, #ff7872 0%, #ff5a5f 100%);
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
}

.header-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #ffffff;
}

.capsule-btn {
  padding: 18rpx 26rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
  font-size: 24rpx;
}

.user-card {
  display: flex;
  align-items: center;
  margin-top: 52rpx;
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
  background: rgba(255, 255, 255, 0.25);
  border: 4rpx solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  font-size: 42rpx;
  font-weight: 700;
}

.user-content {
  margin-left: 24rpx;
}

.username {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #ffffff;
}

.user-id {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.88);
}

.content-area {
  margin-top: -20rpx;
  padding: 0 24rpx 120rpx;
}

.menu-card {
  padding: 0 22rpx;
  background: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.06);
}
</style>
