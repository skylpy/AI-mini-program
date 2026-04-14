<template>
  <view class="page-container">
    <view class="page-head">
      <text class="page-title">文档模板</text>
      <text class="page-subtitle">以下为模拟模板数据，后续可替换为真实模板接口</text>
    </view>

    <view v-for="item in templateList" :key="item.id" class="card-block template-card section-gap">
      <view class="template-tag">{{ item.category }}</view>
      <text class="template-title">{{ item.title }}</text>
      <text class="template-desc">{{ item.description }}</text>
      <button class="secondary-btn preview-btn" @click="handlePreview(item)">预览模板</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { mockTemplates } from '../../mock/data'

const templateList = ref(mockTemplates)

function handlePreview(item) {
  uni.showToast({
    title: `${item.title} 预览开发中`,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.template-card {
  padding: 30rpx 24rpx;
}

.template-tag {
  display: inline-flex;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #edf5ff;
  color: #2563eb;
  font-size: 22rpx;
}

.template-title {
  display: block;
  margin-top: 20rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.template-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.7;
}

.preview-btn {
  margin-top: 28rpx;
}
</style>
