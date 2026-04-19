<template>
  <view class="login-page">
    <view class="hero">
      <view class="status-bar"></view>
      <text class="hero-title">文档格式转换工具</text>
      <text class="hero-subtitle">登录后即可体验文档格式转换、模板浏览和转换记录等功能</text>
    </view>

    <view class="form-card">
      <view class="card-header">
        <text class="card-title">账号登录</text>
        <text class="card-desc">支持手机号或用户名登录</text>
      </view>

      <view class="field-wrap">
        <text class="field-label">手机号 / 用户名</text>
        <FormInput v-model.trim="form.account" placeholder="请输入手机号或用户名" />
      </view>

      <view class="field-wrap">
        <text class="field-label">密码</text>
        <FormInput v-model.trim="form.password" placeholder="请输入密码" :password-toggle="true" />
      </view>

      <view class="action-row">
        <button class="text-btn" @click="goForgotPassword">忘记密码？</button>
      </view>

      <button class="primary-btn" @click="handleLogin">登录</button>
      <button class="secondary-btn mt-20" @click="goRegister">去注册</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FormInput from '../../components/FormInput.vue'
import { login } from '../../api/auth'
import { goHome } from '../../utils/guard'
import { useUserStore } from '../../stores/user'

const form = reactive({
  account: '',
  password: ''
})

const userStore = useUserStore()

function validateForm() {
  if (!form.account) {
    uni.showToast({ title: '请输入手机号或用户名', icon: 'none' })
    return false
  }

  if (!form.password || form.password.length < 6) {
    uni.showToast({ title: '密码不少于 6 位', icon: 'none' })
    return false
  }

  return true
}

async function handleLogin() {
  if (!validateForm()) {
    return
  }

  uni.showLoading({ title: '登录中' })

  try {
    const res = await login({
      account: form.account,
      password: form.password
    })

    userStore.setLogin(res.data)
    uni.showToast({ title: res.message || '登录成功', icon: 'none' })

    setTimeout(() => {
      goHome()
    }, 250)
  } catch (error) {
    console.error('login error', error)
  } finally {
    uni.hideLoading()
  }
}

function goRegister() {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}

function goForgotPassword() {
  uni.navigateTo({
    url: '/pages/forgot-password/index'
  })
}

onLoad(() => {
  if (userStore.isLoggedIn()) {
    goHome()
  }
})
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  padding-bottom: 32rpx;
  background: #f4f7fc;
}

.hero {
  margin: 0 24rpx;
  padding: calc(var(--status-bar-height) + 48rpx) 28rpx 118rpx;
  background: linear-gradient(135deg, #2c66ff 0%, #1747d6 100%);
  border-bottom-left-radius: 34rpx;
  border-bottom-right-radius: 34rpx;
  border-top-left-radius: 34rpx;
  border-top-right-radius: 34rpx;
  box-shadow: 0 18rpx 44rpx rgba(36, 91, 238, 0.22);
}

.hero-title {
  display: block;
  margin-top: 16rpx;
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

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
}

.card-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #94a3b8;
}

.field-wrap {
  margin-bottom: 24rpx;
}

.field-label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  color: #374151;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  margin: -6rpx 0 24rpx;
}

.text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  min-width: 0;
  color: #2d67f6;
  font-size: 24rpx;
  line-height: 1;
}

.mt-20 {
  margin-top: 20rpx;
}
</style>
