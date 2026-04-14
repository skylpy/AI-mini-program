<template>
  <view class="page-container">
    <view class="page-head">
      <text class="page-title">我要反馈</text>
      <text class="page-subtitle">当前为前端示例表单，后续可接入反馈接口</text>
    </view>

    <view class="card-block form-card section-gap">
      <text class="field-label">反馈内容</text>
      <textarea v-model.trim="form.content" class="feedback-textarea" maxlength="300" placeholder="请输入您遇到的问题或建议" />

      <text class="field-label mt-24">联系方式（选填）</text>
      <input v-model.trim="form.contact" class="field-input" placeholder="请输入手机号或邮箱" />

      <button class="primary-btn mt-36" @click="handleSubmit">提交反馈</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  content: '',
  contact: ''
})

function handleSubmit() {
  if (!form.content) {
    uni.showToast({
      title: '请输入反馈内容',
      icon: 'none'
    })
    return
  }

  uni.showToast({
    title: '反馈已提交，感谢您的建议',
    icon: 'none'
  })

  form.content = ''
  form.contact = ''
}
</script>

<style scoped lang="scss">
.form-card {
  padding: 30rpx 24rpx;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #374151;
}

.feedback-textarea {
  width: 100%;
  height: 260rpx;
  margin-top: 18rpx;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 24rpx;
  font-size: 28rpx;
}

.field-input {
  width: 100%;
  height: 92rpx;
  margin-top: 18rpx;
  padding: 0 24rpx;
  background: #f8fafc;
  border-radius: 22rpx;
  font-size: 28rpx;
}

.mt-24 {
  margin-top: 24rpx;
}

.mt-36 {
  margin-top: 36rpx;
}
</style>
