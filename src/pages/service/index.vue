<template>
  <view class="page-container">
    <PageNav title="联系客服" />
    <view class="page-head">
      <text class="page-title">联系客服</text>
      <text class="page-subtitle">当前为前端占位页，可替换为企微客服、在线会话或电话客服方案</text>
    </view>

    <view class="card-block service-card section-gap">
      <text class="service-title">服务时间</text>
      <text class="service-desc">周一至周日 09:00 - 21:00</text>
      <text class="service-title mt-24">联系方式</text>
      <text class="service-desc">微信客服：doc-helper-01</text>
      <text class="service-desc">邮箱：service@example.com</text>
      <!-- #ifdef MP-WEIXIN -->
      <button
        class="primary-btn mt-36 contact-btn"
        open-type="contact"
        show-message-card
        :send-message-title="contactMessageTitle"
        :send-message-path="contactMessagePath"
        :send-message-img="contactMessageImage"
      >
        立即联系
      </button>
      <!-- #endif -->

      <!-- #ifndef MP-WEIXIN -->
      <button class="primary-btn mt-36 contact-btn" @click="handleContact">立即联系</button>
      <!-- #endif -->
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import PageNav from '../../components/PageNav.vue'

const contactMessageTitle = ref('联系客服')
const contactMessagePath = ref('/pages/service/index')
const contactMessageImage = '/static/tabbar/profile-active.png'

function buildCurrentPagePath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]

  if (!currentPage?.route) {
    return '/pages/service/index'
  }

  const query = Object.entries(currentPage.options || {})
    .filter(([, value]) => value !== '' && value !== null && typeof value !== 'undefined')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return `/${currentPage.route}${query ? `?${query}` : ''}`
}

function syncContactMessage() {
  contactMessageTitle.value = '联系客服'
  contactMessagePath.value = buildCurrentPagePath()
}

function handleContact() {
  uni.showToast({
    title: '请在微信小程序中使用在线客服',
    icon: 'none'
  })
}

onShow(() => {
  syncContactMessage()
})
</script>

<style scoped lang="scss">
.service-card {
  padding: 32rpx 28rpx;
}

.service-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.service-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  color: #6b7280;
}

.mt-24 {
  margin-top: 24rpx;
}

.mt-36 {
  margin-top: 36rpx;
}

.contact-btn {
  width: 100%;
}
</style>
