<template>
  <view class="page-container">
    <PageNav title="转换记录" />
    <view class="page-head">
      <text class="page-title">转换记录</text>
      <text class="page-subtitle">以下为模拟数据，后续可替换为后端转换记录接口</text>
    </view>

    <view v-for="item in recordList" :key="item.id" class="card-block record-card section-gap">
      <view class="record-top">
        <text class="file-name">{{ item.fileName }}</text>
        <text class="status" :class="item.status === '已完成' ? 'status-success' : 'status-pending'">{{ item.status }}</text>
      </view>
      <text class="record-info">记录编号：{{ item.id }}</text>
      <text class="record-info">转换类型：{{ item.targetType }}</text>
      <text class="record-info">时间：{{ item.time }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageNav from '../../components/PageNav.vue'
import { mockRecords } from '../../mock/data'

const recordList = ref(mockRecords)
</script>

<style scoped lang="scss">
.record-card {
  padding: 28rpx 24rpx;
}

.record-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.status {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.status-success {
  background: #eefbf1;
  color: #16a34a;
}

.status-pending {
  background: #fff7ed;
  color: #ea580c;
}

.record-info {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
}
</style>
