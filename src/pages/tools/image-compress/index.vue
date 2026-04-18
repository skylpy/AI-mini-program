<template>
  <view class="page-container">
    <PageNav title="图片压缩" />
    <view class="page-head">
      <text class="page-title">图片压缩</text>
      <text class="page-subtitle">当前为占位页，后续接入压缩接口或本地压缩能力</text>
    </view>

    <view class="card-block placeholder-card section-gap">
      <view class="placeholder-icon">IMG</view>
      <text class="placeholder-title">图片压缩能力预留</text>
      <text class="placeholder-desc">支持选择图片、压缩比例设置与结果下载等功能扩展。</text>
      <button class="primary-btn mt-36" @click="handleAction">选择图片</button>
    </view>
  </view>
</template>

<script setup>
import PageNav from '../../../components/PageNav.vue'

function handleAction() {
  uni.showToast({
    title: '请接入真实图片压缩逻辑',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.placeholder-card {
  padding: 40rpx 28rpx;
  text-align: center;
}

.placeholder-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  border-radius: 30rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #e5eeff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d67f6;
  font-size: 30rpx;
  font-weight: 700;
}

.placeholder-title {
  display: block;
  margin-top: 28rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}

.placeholder-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #6b7280;
}

.mt-36 {
  margin-top: 36rpx;
}
</style>
