<template>
  <view class="register-page">
    <view class="hero">
      <view class="status-bar"></view>
      <text class="hero-title">创建账号</text>
      <text class="hero-subtitle">完成注册后即可登录并使用文档转换相关功能</text>
    </view>

    <view class="form-card">
      <view class="field-wrap">
        <text class="field-label">用户名</text>
        <input v-model.trim="form.username" class="field-input" placeholder="请输入用户名" />
      </view>

      <view class="field-wrap">
        <text class="field-label">手机号</text>
        <input v-model.trim="form.mobile" class="field-input" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>

      <view class="field-wrap">
        <text class="field-label">邮箱（选填）</text>
        <input v-model.trim="form.email" class="field-input" placeholder="请输入邮箱地址" />
      </view>

      <view class="field-wrap">
        <text class="field-label">密码</text>
        <input v-model.trim="form.password" class="field-input" password placeholder="请输入密码，不少于 6 位" />
      </view>

      <view class="field-wrap">
        <text class="field-label">确认密码</text>
        <input v-model.trim="form.confirmPassword" class="field-input" password placeholder="请再次输入密码" />
      </view>

      <button class="primary-btn" @click="handleRegister">注册</button>
      <button class="secondary-btn mt-20" @click="goLogin">已有账号，去登录</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { register } from '../../api/auth'

const form = reactive({
  username: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function validateEmail(email) {
  if (!email) {
    return true
  }

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

  if (!validateEmail(form.email)) {
    uni.showToast({ title: '邮箱格式不正确', icon: 'none' })
    return false
  }

  if (!form.password || form.password.length < 6) {
    uni.showToast({ title: '密码不少于 6 位', icon: 'none' })
    return false
  }

  if (form.password !== form.confirmPassword) {
    uni.showToast({ title: '两次输入密码不一致', icon: 'none' })
    return false
  }

  return true
}

async function handleRegister() {
  if (!validateForm()) {
    return
  }

  uni.showLoading({ title: '注册中' })

  try {
    const res = await register({
      username: form.username,
      mobile: form.mobile,
      email: form.email,
      password: form.password
    })

    uni.showToast({
      title: res.message || '注册成功',
      icon: 'none'
    })

    setTimeout(() => {
      goLogin()
    }, 300)
  } catch (error) {
    console.error('register error', error)
  } finally {
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
.register-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff6f2 0%, #f5f5f5 38%);
}

.hero {
  padding: 0 36rpx 44rpx;
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
  margin: 0 24rpx 32rpx;
  padding: 32rpx 28rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 36rpx rgba(15, 23, 42, 0.08);
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
