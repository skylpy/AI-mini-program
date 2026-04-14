<template>
  <view class="page-container tool-page">
    <PageNav title="文档转 PDF" />
    <view class="page-head">
      <text class="page-title">文档转 PDF</text>
      <text class="page-subtitle">当前页面为前端占位实现，后续可替换为真实上传和转换接口</text>
    </view>

    <view class="card-block upload-card">
      <view class="upload-icon">PDF</view>
      <text class="upload-title">选择需要转换的文档</text>
      <text class="upload-desc">支持 Word / Excel / PPT 等常见办公文档</text>
      <button class="primary-btn choose-btn" @click="handleChooseFile">选择文件</button>
    </view>

    <view class="card-block steps-card section-gap">
      <text class="block-title">使用步骤</text>
      <view v-for="(item, index) in steps" :key="item" class="step-item">
        <view class="step-index">{{ index + 1 }}</view>
        <text class="step-text">{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import PageNav from '../../../components/PageNav.vue'

const steps = ['选择需要转换的文档', '上传到后端进行格式转换', '完成后下载或查看记录']

function handleChooseFile() {
  uni.showToast({
    title: '此处接入真实文件上传逻辑',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.upload-card {
  padding: 40rpx 28rpx;
  text-align: center;
}

.upload-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  border-radius: 28rpx;
  background: #edf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 32rpx;
  font-weight: 700;
}

.upload-title {
  display: block;
  margin-top: 28rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}

.upload-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
}

.choose-btn {
  margin-top: 36rpx;
}

.steps-card {
  padding: 32rpx 28rpx;
}

.block-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.step-item {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
}

.step-index {
  width: 50rpx;
  height: 50rpx;
  border-radius: 999rpx;
  background: #fff1f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5a5f;
  font-size: 24rpx;
  font-weight: 700;
}

.step-text {
  margin-left: 18rpx;
  font-size: 28rpx;
  color: #374151;
}
</style>
