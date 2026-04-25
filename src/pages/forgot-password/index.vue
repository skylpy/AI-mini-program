<template>
  <view class="reset-page">
    <view class="hero">
      <view class="status-bar"></view>
      <!-- <PageNav title="忘记密码" /> -->
      <text class="hero-title">重置密码</text>
      <text class="hero-subtitle">请填写注册时的用户信息，并设置一个新的登录密码</text>
    </view>

    <view class="form-card">
      <view class="field-wrap">
        <text class="field-label">用户名</text>
        <FormInput v-model.trim="form.username" placeholder="请输入用户名" />
      </view>

      <view class="field-wrap">
        <text class="field-label">手机号</text>
        <FormInput
          v-model.trim="form.mobile"
          type="number"
          maxlength="11"
          placeholder="请输入注册手机号"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">邮箱</text>
        <FormInput v-model.trim="form.email" placeholder="请输入注册邮箱" />
      </view>

      <view class="field-wrap">
        <text class="field-label">新密码</text>
        <FormInput
          v-model.trim="form.newPassword"
          placeholder="请输入新密码，不少于 6 位"
          :password-toggle="true"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">确认新密码</text>
        <FormInput
          v-model.trim="form.confirmPassword"
          placeholder="请再次输入新密码"
          :password-toggle="true"
        />
      </view>

      <button class="primary-btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '确认重置' }}
      </button>
      <button class="secondary-btn mt-20" @click="goLogin">返回登录</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import FormInput from '../../components/FormInput.vue'
import PageNav from '../../components/PageNav.vue'
import { forgotPassword } from '../../api/auth'

const form = reactive({
  username: '',
  mobile: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const submitting = ref(false)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateForm() {
  if (!form.username) {
    uni.showToast({ title: '用户名不能为空', icon: 'none' })
    return false
  }

  if (!/^1\d{10}$/.test(form.mobile)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }

  if (!form.email || !validateEmail(form.email)) {
    uni.showToast({ title: '请输入正确的邮箱', icon: 'none' })
    return false
  }

  if (!form.newPassword || form.newPassword.length < 6) {
    uni.showToast({ title: '新密码不少于 6 位', icon: 'none' })
    return false
  }

  if (form.newPassword !== form.confirmPassword) {
    uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
    return false
  }

  return true
}

async function handleSubmit() {
  if (submitting.value || !validateForm()) {
    return
  }

  submitting.value = true
  uni.showLoading({ title: '提交中' })

  try {
    const res = await forgotPassword({
      username: form.username,
      mobile: form.mobile,
      email: form.email,
      newPassword: form.newPassword
    })

    uni.showToast({
      title: res?.message || '密码重置成功',
      icon: 'none'
    })

    setTimeout(() => {
      goLogin()
    }, 300)
  } catch (error) {
    console.error('forgot password error', error)
  } finally {
    submitting.value = false
    uni.hideLoading()
  }
}

function goLogin() {
  uni.redirectTo({
    url: '/pages/login/index'
  })
}
</script>

<style scoped lang="scss">
.reset-page {
  min-height: 100vh;
  padding-bottom: 32rpx;
  background: #f4f7fc;
}

.hero {
  margin: 0 24rpx;
  padding: 0 28rpx 112rpx;
  background: linear-gradient(135deg, #2c66ff 0%, #1747d6 100%);
  border-radius: 34rpx;
  box-shadow: 0 18rpx 44rpx rgba(36, 91, 238, 0.22);
}

.hero-title {
  display: block;
  margin-top: 18rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #ffffff;
}

.hero-subtitle {
  display: block;
  margin-top: 18rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.7;
}

.form-card {
  margin: -76rpx 24rpx 0;
  padding: 32rpx 28rpx;
  background: #ffffff;
  border: 2rpx solid rgba(228, 236, 250, 0.9);
  border-radius: 32rpx;
  box-shadow: 0 16rpx 36rpx rgba(31, 50, 92, 0.09);
}

.field-wrap {
  margin-bottom: 22rpx;
}

.field-label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  color: #374151;
}

.primary-btn[disabled] {
  opacity: 0.7;
}

.mt-20 {
  margin-top: 20rpx;
}

:deep(.page-nav) {
  margin-bottom: 18rpx;
}

:deep(.page-nav .nav-title) {
  color: #ffffff;
}
</style>
