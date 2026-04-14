<template>
  <view class="page-container page-with-tabbar home-page">
    <view class="home-header">
      <view>
        <text class="home-title">首页</text>
        <text class="home-tip">欢迎使用文档格式转换工具</text>
      </view>
      <view class="capsule-btn">胶囊区</view>
    </view>

    <view class="section-gap">
      <swiper class="banner-swiper" autoplay circular indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#ffffff">
        <swiper-item v-for="item in bannerList" :key="item.id">
          <BannerCard :item="item" @click="handleBannerClick" />
        </swiper-item>
      </swiper>
    </view>

    <view class="section-gap">
      <SectionTitle title="常用工具" desc="高频功能入口" />
      <view class="tool-grid">
        <ToolCard
          v-for="item in commonToolList"
          :key="item.key"
          :title="item.title"
          :subtitle="item.subtitle"
          :icon="item.icon"
          :icon-bg="item.iconBg"
          @click="handleCommonToolClick(item)"
        />
      </view>
    </view>

    <view class="section-gap">
      <SectionTitle title="更多工具" desc="持续扩展中" />
      <view class="tool-grid">
        <ToolCard
          v-for="item in extraToolList"
          :key="item.key"
          :title="item.title"
          :subtitle="item.subtitle"
          :icon="item.icon"
          :icon-bg="item.iconBg"
          @click="handleExtraToolClick(item)"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
import BannerCard from '../../../components/BannerCard.vue'
import SectionTitle from '../../../components/SectionTitle.vue'
import ToolCard from '../../../components/ToolCard.vue'
import { getBanners } from '../../../api/common'
import { commonToolList, extraToolList, mockBannerList } from '../../../mock/data'
import { requireLogin } from '../../../utils/guard'

const bannerList = ref([...mockBannerList])

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

function handleExtraToolClick(item) {
  const routeMap = {
    'image-compress': '/pages/tools/image-compress/index',
    'flower-recognition': '/pages/tools/flower-recognition/index'
  }

  const url = routeMap[item.key]
  if (url) {
    navigate(url)
  }
}

function handleBannerClick(item) {
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
  background: #f5f5f5;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-title {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  color: #111827;
}

.home-tip {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.capsule-btn {
  padding: 18rpx 26rpx;
  border-radius: 999rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.05);
  color: #6b7280;
  font-size: 24rpx;
}

.banner-swiper {
  height: 280rpx;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}
</style>
