<template>
  <view class="page-container">
    <view class="page-head">
      <text class="page-title">我的浏览</text>
      <text class="page-subtitle">以下为模拟浏览记录，后续可替换为真实接口</text>
    </view>

    <view v-for="item in browseList" :key="item.id" class="card-block history-card section-gap">
      <text class="history-title">{{ item.title }}</text>
      <text class="history-time">{{ item.time }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { mockBrowseHistory } from '../../mock/data'

const browseList = ref(mockBrowseHistory)
</script>

<style scoped lang="scss">
.history-card {
  padding: 28rpx 24rpx;
}

.history-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.history-time {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
