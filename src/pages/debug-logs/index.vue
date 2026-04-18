<template>
  <view class="page-container">
    <PageNav title="调试日志" />
    <view class="page-head">
      <text class="page-title">调试日志</text>
      <text class="page-subtitle">查看应用内 console 输出，默认保留最近 200 条</text>
    </view>

    <view class="card-block toolbar section-gap">
      <view class="toolbar-top">
        <text class="log-count">共 {{ logs.length }} 条</text>
        <text class="log-tip">支持 log / info / warn / error / debug</text>
      </view>
      <view class="toolbar-actions">
        <button class="secondary-btn action-btn" @click="refreshLogs">刷新</button>
        <button class="secondary-btn action-btn" @click="copyLogs">复制</button>
        <button class="secondary-btn action-btn danger-btn" @click="clearLogs">清空</button>
      </view>
    </view>

    <view v-if="logs.length" class="log-list section-gap">
      <view v-for="item in logs" :key="item.id" class="card-block log-item">
        <view class="log-meta">
          <text class="log-level" :class="`level-${item.level}`">{{ item.level.toUpperCase() }}</text>
          <text class="log-time">{{ item.time }}</text>
        </view>
        <text class="log-message selectable">{{ item.message }}</text>
      </view>
    </view>

    <view v-else class="card-block empty-block section-gap">
      <text class="empty-text">暂无日志，执行 `console.log()` 后返回此页查看。</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import PageNav from '../../components/PageNav.vue'
import { clearDebugLogs, getDebugLogEventName, getDebugLogs } from '../../utils/debug-console'
import { requireLogin } from '../../utils/guard'

const logs = ref([])
const debugLogEventName = getDebugLogEventName()

function refreshLogs() {
  logs.value = getDebugLogs()
}

function copyLogs() {
  if (!logs.value.length) {
    uni.showToast({
      title: '暂无可复制日志',
      icon: 'none'
    })
    return
  }

  const content = logs.value
    .map((item) => `[${item.time}] [${item.level.toUpperCase()}] ${item.message}`)
    .join('\n')

  uni.setClipboardData({
    data: content,
    success: () => {
      uni.showToast({
        title: '日志已复制',
        icon: 'none'
      })
    }
  })
}

function clearLogs() {
  clearDebugLogs()
  uni.showToast({
    title: '日志已清空',
    icon: 'none'
  })
}

function handleLogsUpdated(nextLogs) {
  logs.value = Array.isArray(nextLogs) ? nextLogs : getDebugLogs()
}

onLoad(() => {
  if (!requireLogin()) {
    return
  }

  refreshLogs()

  if (typeof uni !== 'undefined' && typeof uni.$on === 'function') {
    uni.$on(debugLogEventName, handleLogsUpdated)
  }
})

onUnload(() => {
  if (typeof uni !== 'undefined' && typeof uni.$off === 'function') {
    uni.$off(debugLogEventName, handleLogsUpdated)
  }
})
</script>

<style scoped lang="scss">
.toolbar {
  padding: 24rpx;
}

.toolbar-top {
  display: flex;
  flex-direction: column;
}

.log-count {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.log-tip {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #6b7280;
}

.toolbar-actions {
  display: flex;
  margin-top: 24rpx;
}

.action-btn {
  flex: 1;
  height: 76rpx;
  font-size: 26rpx;
}

.action-btn + .action-btn {
  margin-left: 16rpx;
}

.danger-btn {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.18);
}

.log-list {
  display: flex;
  flex-direction: column;
}

.log-item + .log-item {
  margin-top: 20rpx;
}

.log-item {
  padding: 24rpx;
}

.log-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.log-level {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
}

.level-info {
  color: #0284c7;
  background: #ecfeff;
}

.level-warn {
  color: #b45309;
  background: #fff7ed;
}

.level-error {
  color: #dc2626;
  background: #fef2f2;
}

.level-debug {
  color: #7c3aed;
  background: #f5f3ff;
}

.log-time {
  flex: 1;
  font-size: 22rpx;
  color: #9ca3af;
  text-align: right;
}

.log-message {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #111827;
  word-break: break-all;
}

.selectable {
  user-select: text;
}

.empty-block {
  padding: 48rpx 32rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.7;
}
</style>
