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
      <button class="primary-btn mt-36" @click="handleContact">立即联系</button>
    </view>
  </view>
</template>

<script setup>
import PageNav from '../../components/PageNav.vue'

function handleContact() {
  uni.showToast({
    title: '请接入真实客服能力',
    icon: 'none'
  })
}
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
</style>
