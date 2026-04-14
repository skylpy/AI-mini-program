<template>
  <view class="page-container">
    <view class="page-head">
      <text class="page-title">花草识别</text>
      <text class="page-subtitle">当前为占位页，后续可接入 AI 图像识别接口</text>
    </view>

    <view class="card-block placeholder-card section-gap">
      <view class="placeholder-icon green">AI</view>
      <text class="placeholder-title">拍照识别花草</text>
      <text class="placeholder-desc">支持拍照上传、图片识别结果、相似植物推荐等能力扩展。</text>
      <button class="primary-btn mt-36" @click="handleAction">立即体验</button>
    </view>
  </view>
</template>

<script setup>
function handleAction() {
  uni.showToast({
    title: '请接入真实花草识别逻辑',
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 700;
}

.green {
  background: #eefcf0;
  color: #16a34a;
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
