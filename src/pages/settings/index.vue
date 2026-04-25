<template>
  <view class="page-container">
    <PageNav title="设置" />
    <view class="page-head">
      <text class="page-title">设置</text>
      <text class="page-subtitle">管理账号安全与基础设置</text>
    </view>

    <view class="card-block section-gap">
      <!-- <ListCell
        title="调试日志"
        desc="查看应用内 console 输出"
        icon="LOG"
        @click="goDebugLogs"
      /> -->
      <ListCell
        title="修改密码"
        desc="更新当前账号登录密码"
        icon="PWD"
        @click="goChangePassword"
      />
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import ListCell from '../../components/ListCell.vue'
import PageNav from '../../components/PageNav.vue'
import { requireLogin } from '../../utils/guard'

function goChangePassword() {
  uni.navigateTo({
    url: '/pages/change-password/index'
  })
}

function goDebugLogs() {
  uni.navigateTo({
    url: '/pages/debug-logs/index'
  })
}

onLoad(() => {
  requireLogin()
})
</script>

<style scoped lang="scss">
.card-block {
  padding: 0 22rpx;
}
</style>
