<template>
  <view class="page-container page-with-tabbar home-page">
    <view class="home-hero">
      <view class="home-header">
        <view>
          <text class="home-title">首页</text>
          <text class="home-tip">效益提升文档格式转换工具</text>
        </view>
        <view class="header-action" @click="goSettings">
          <image class="header-action-icon" :src="settingsIcon" mode="aspectFit" />
        </view>
      </view>
    </view>

    <view class="feature-card" @click="handleBannerClick(featuredBanner)">
      <view class="feature-backdrop"></view>
      <view class="feature-glow"></view>
      <view class="feature-content">
        <text class="feature-title">{{ featuredBanner.title || '文件格式转换' }}</text>
        <text class="feature-subtitle">高效快速安全格式转换工具</text>
      </view>
    </view>

    <view class="tool-section">
      <view class="section-head">
        <text class="section-title">常用工具</text>
        <view class="section-link" @click="handleViewAll">
          <text class="section-link-text">查看全部</text>
          <text class="section-link-arrow">></text>
        </view>
      </view>

      <view class="tool-grid">
        <view
          v-for="item in homeToolList"
          :key="item.key"
          class="tool-card"
          @click="handleCommonToolClick(item)"
        >
          <view class="tool-icon-wrap">
            <image class="tool-icon" :src="toolIconMap[item.key]" mode="aspectFit" />
          </view>
          <text class="tool-title">{{ item.title }}</text>
          <text class="tool-subtitle">{{ item.subtitle }}</text>
        </view>
      </view>
    </view>

    <view class="tool-section extra-section">
      <view class="section-head">
        <text class="section-title">更多工具</text>
        <text class="section-muted">持续增加中</text>
      </view>

      <view class="tool-grid">
        <view
          v-for="item in extraToolList"
          :key="item.key"
          class="tool-card"
          @click="handleExtraToolClick(item)"
        >
          <view class="tool-icon-wrap">
            <image class="tool-icon" :src="toolIconMap[item.key]" mode="aspectFit" />
          </view>
          <text class="tool-title">{{ item.title }}</text>
          <text class="tool-subtitle">{{ item.subtitle }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
import { getBanners } from '../../../api/common'
import { mockBannerList } from '../../../mock/data'
import { requireLogin } from '../../../utils/guard'

const bannerList = ref([...mockBannerList])
const homeToolList = [
  {
    key: 'doc-to-pdf',
    title: '文档转 PDF',
    subtitle: '各种文档转 PDF'
  },
  {
    key: 'records',
    title: '转换记录',
    subtitle: '查看文档转换记录'
  },
  {
    key: 'templates',
    title: '文档模板',
    subtitle: '即选即用文档模板'
  },
  {
    key: 'more',
    title: '更多功能',
    subtitle: '正在开发更新中'
  },
  {
    key: 'service',
    title: '联系客服',
    subtitle: '解答使用问题'
  },
  {
    key: 'share',
    title: '好友分享',
    subtitle: '分享给您的好友'
  }
]

const extraToolList = [
  {
    key: 'image-compress',
    title: '图片压缩',
    subtitle: '图片大小压缩'
  },
  {
    key: 'flower-recognition',
    title: '花费说明',
    subtitle: '功能收费说明'
  }
]

const featuredBanner = computed(() => bannerList.value[0] || {})

function svgToDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const toolIconMap = {
  'doc-to-pdf': svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M21 12h16l10 10v28a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" stroke="#3B6FF6" stroke-width="3.2" stroke-linejoin="round"/><path d="M37 12v12h10" stroke="#3B6FF6" stroke-width="3.2" stroke-linejoin="round"/><path d="M25 35h14M25 42h14" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  records: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="18" stroke="#3B6FF6" stroke-width="3.2"/><path d="M32 22v11l7 5" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 10h14" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  templates: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="18" y="14" width="24" height="34" rx="4" stroke="#3B6FF6" stroke-width="3.2"/><path d="M26 24h8M26 31h10M26 38h7" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/><path d="M42 20h4a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H26" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  more: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="20" cy="24" r="4" fill="#3B6FF6"/><circle cx="43" cy="18" r="4" fill="#3B6FF6"/><circle cx="45" cy="42" r="4" fill="#3B6FF6"/><path d="M24 23l15-4M23 27l18 12" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  service: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M20 33a12 12 0 0 1 24 0v7a5 5 0 0 1-5 5h-2v-9h9" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 45h-1a5 5 0 0 1-5-5v-7a18 18 0 0 1 36 0" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 49h8" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  share: svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="20" cy="32" r="5" stroke="#3B6FF6" stroke-width="3.2"/><circle cx="43" cy="20" r="5" stroke="#3B6FF6" stroke-width="3.2"/><circle cx="43" cy="44" r="5" stroke="#3B6FF6" stroke-width="3.2"/><path d="M25 30l13-7M25 34l13 7" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  ),
  'image-compress': svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="16" y="14" width="32" height="36" rx="6" stroke="#3B6FF6" stroke-width="3.2"/><path d="M24 24h16M24 32h12M24 40h9" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/><path d="m42 18 6 6-6 6" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  ),
  'flower-recognition': svgToDataUri(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M22 18c6 0 10 4 10 10-6 0-10-4-10-10ZM42 18c0 6-4 10-10 10 0-6 4-10 10-10Z" stroke="#3B6FF6" stroke-width="3.2" stroke-linejoin="round"/><path d="M32 28v18" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/><path d="M24 46c0-5 3.6-9 8-9s8 4 8 9" stroke="#3B6FF6" stroke-width="3.2" stroke-linecap="round"/></svg>'
  )
}

const settingsIcon = svgToDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M22 16.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" stroke="#EAF2FF" stroke-width="2.2"/><path d="M35 24.2v-4.4l-3.1-.6a10.3 10.3 0 0 0-1.2-2.9l1.8-2.6-3.1-3.1-2.6 1.8a10.3 10.3 0 0 0-2.9-1.2L23.2 8h-4.4l-.6 3.1a10.3 10.3 0 0 0-2.9 1.2l-2.6-1.8-3.1 3.1 1.8 2.6a10.3 10.3 0 0 0-1.2 2.9L7 19.8v4.4l3.1.6a10.3 10.3 0 0 0 1.2 2.9l-1.8 2.6 3.1 3.1 2.6-1.8a10.3 10.3 0 0 0 2.9 1.2l.6 3.1h4.4l.6-3.1a10.3 10.3 0 0 0 2.9-1.2l2.6 1.8 3.1-3.1-1.8-2.6a10.3 10.3 0 0 0 1.2-2.9l3.1-.6Z" stroke="#EAF2FF" stroke-width="2.2" stroke-linejoin="round"/></svg>'
)

async function fetchBanners() {
  try {
    const res = await getBanners({ showError: false })
    if (Array.isArray(res?.data) && res.data.length) {
      bannerList.value = res.data
    } else {
      bannerList.value = [...mockBannerList]
    }
  } catch (error) {
    bannerList.value = [...mockBannerList]
  }
}

function navigate(url) {
  uni.navigateTo({ url })
}

function handleCommonToolClick(item) {
  const routeMap = {
    'doc-to-pdf': '/pages/tools/doc-to-pdf/index',
    records: '/pages/records/index',
    templates: '/pages/templates/index',
    service: '/pages/service/index'
  }

  if (item.key === 'more') {
    uni.showToast({ title: '更多功能开发中', icon: 'none' })
    return
  }

  if (item.key === 'share') {
    uni.showToast({ title: '请点击右上角分享给好友', icon: 'none' })
    return
  }

  const url = routeMap[item.key]
  if (url) {
    navigate(url)
  }
}

function handleBannerClick(item) {
  if (!item) {
    return
  }

  if (item.link) {
    uni.navigateTo({
      url: item.link
    })
    return
  }

  uni.showToast({
    title: `${item.title} 敬请期待`,
    icon: 'none'
  })
}

function handleViewAll() {
  uni.showToast({ title: '更多工具开发中', icon: 'none' })
}

function handleExtraToolClick(item) {
  const routeMap = {
    'image-compress': '/pages/tools/image-compress/index'
  }

  const url = routeMap[item.key]
  if (url) {
    navigate(url)
    return
  }

  uni.showToast({ title: '功能说明整理中', icon: 'none' })
}

function goSettings() {
  navigate('/pages/settings/index')
}

async function initPage() {
  if (!requireLogin()) {
    return
  }

  await fetchBanners()
}

onLoad(async () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  await initPage()
})

onPullDownRefresh(async () => {
  await fetchBanners()
  uni.stopPullDownRefresh()
})

onShareAppMessage(() => ({
  title: '文档格式转换工具',
  path: '/pages/login/index'
}))
</script>

<style scoped lang="scss">
.home-page {
  padding-top: 0;
  background: #f4f7fc;
}

.home-hero {
  margin: calc(-1 * (var(--status-bar-height) + 24rpx)) -24rpx 0;
  padding: calc(var(--status-bar-height) + 108rpx + 40px) 24rpx 120rpx;
  background: linear-gradient(135deg, #2c66ff 0%, #1747d6 100%);
  border-bottom-left-radius: 34rpx;
  border-bottom-right-radius: 34rpx;
  box-shadow: 0 18rpx 44rpx rgba(36, 91, 238, 0.22);
}

/* #ifdef H5 */
.home-hero {
  padding-top: calc(var(--status-bar-height) + 108rpx + 10px);
}
/* #endif */

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
}

.home-tip {
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

.feature-card {
  position: relative;
  margin-top: -72rpx;
  height: 292rpx;
  overflow: hidden;
  border-radius: 30rpx;
  background:
    radial-gradient(circle at 58% 72%, rgba(102, 153, 255, 0.28), transparent 28%),
    radial-gradient(circle at 18% 14%, rgba(255, 196, 90, 0.12), transparent 20%),
    linear-gradient(180deg, #111621 0%, #05070b 100%);
  box-shadow: 0 22rpx 40rpx rgba(8, 14, 28, 0.22);
}

.feature-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 52% 70%, rgba(90, 130, 255, 0.18), transparent 28%),
    radial-gradient(circle at 64% 80%, rgba(255, 255, 255, 0.08), transparent 14%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.04) 0%, transparent 38%);
}

.feature-backdrop::before {
  content: '';
  position: absolute;
  left: -12%;
  right: -12%;
  top: 12%;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, rgba(153, 188, 255, 0.5), transparent);
  transform: rotate(8deg);
}

.feature-backdrop::after {
  content: '';
  position: absolute;
  left: 36%;
  bottom: -14%;
  width: 360rpx;
  height: 180rpx;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 40%, rgba(92, 137, 255, 0.46), rgba(35, 58, 112, 0.18) 48%, transparent 70%);
  filter: blur(2rpx);
}

.feature-glow {
  position: absolute;
  inset: auto 0 0;
  height: 132rpx;
  background: linear-gradient(180deg, rgba(5, 7, 11, 0) 0%, rgba(5, 7, 11, 0.62) 100%);
}

.feature-content {
  position: absolute;
  left: 28rpx;
  right: 28rpx;
  bottom: 28rpx;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.feature-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #ffffff;
}

.feature-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.tool-section {
  margin-top: 26rpx;
}

.extra-section {
  margin-top: 30rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #101828;
}

.section-link {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.section-link-text {
  font-size: 24rpx;
  color: #2d67f6;
  font-weight: 600;
}

.section-link-arrow {
  font-size: 24rpx;
  color: #87a7ff;
}

.section-muted {
  font-size: 22rpx;
  color: #b3bfda;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.tool-card {
  min-height: 188rpx;
  padding: 24rpx 22rpx 20rpx;
  background: #ffffff;
  border-radius: 26rpx;
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  box-shadow: 0 12rpx 24rpx rgba(31, 50, 92, 0.07);
}

.tool-icon-wrap {
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #e5eeff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-icon {
  width: 42rpx;
  height: 42rpx;
}

.tool-title {
  display: block;
  margin-top: 24rpx;
  font-size: 31rpx;
  font-weight: 700;
  color: #1f2937;
}

.tool-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.55;
  color: #6b7280;
}
</style>
