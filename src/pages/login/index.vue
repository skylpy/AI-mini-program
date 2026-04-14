<template>
  <view class="login-page">
    <view class="hero">
      <view class="status-bar"></view>
      <text class="hero-title">文档格式转换工具</text>
      <text class="hero-subtitle">登录后即可体验文档转 PDF、模板浏览和转换记录等功能</text>
    </view>

    <view class="form-card">
      <view class="card-header">
        <text class="card-title">账号登录</text>
        <text class="card-desc">支持手机号或用户名登录</text>
      </view>

      <view class="field-wrap">
        <text class="field-label">手机号 / 用户名</text>
        <input v-model.trim="form.account" class="field-input" placeholder="请输入手机号或用户名" />
      </view>

      <view class="field-wrap">
        <text class="field-label">密码</text>
        <input v-model.trim="form.password" class="field-input" password placeholder="请输入密码" />
      </view>

      <button class="primary-btn" @click="handleLogin">登录</button>
      <button class="secondary-btn mt-20" @click="goRegister">去注册</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
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

onLoad(() => {
  if (userStore.isLoggedIn()) {
    goHome()
  }
})
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff4f0 0%, #f5f5f5 38%);
}

.hero {
  padding: 0 36rpx 48rpx;
}

.hero-title {
  display: block;
  margin-top: 36rpx;
  font-size: 52rpx;
  font-weight: 700;
  color: #111827;
}

.hero-subtitle {
  display: block;
  margin-top: 18rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.7;
}

.form-card {
  margin: 0 24rpx;
  padding: 32rpx 28rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 36rpx rgba(15, 23, 42, 0.08);
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
  color: #9ca3af;
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

.field-input {
  width: 100%;
  height: 92rpx;
  padding: 0 28rpx;
  background: #f8fafc;
  border-radius: 22rpx;
  font-size: 28rpx;
  color: #111827;
}

.mt-20 {
  margin-top: 20rpx;
}
</style>
