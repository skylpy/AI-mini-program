<template>
  <view class="register-page">
    <view class="hero">
      <PageNav title="注册" />
      <text class="hero-title">创建账号</text>
      <text class="hero-subtitle">完成注册后即可登录并使用文档转换相关功能</text>
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
          placeholder="请输入手机号"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">邮箱（选填）</text>
        <FormInput v-model.trim="form.email" placeholder="请输入邮箱地址" />
      </view>

      <view class="field-wrap">
        <text class="field-label">密码</text>
        <FormInput
          v-model.trim="form.password"
          placeholder="请输入密码，不少于 6 位"
          :password-toggle="true"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">确认密码</text>
        <FormInput
          v-model.trim="form.confirmPassword"
          placeholder="请再次输入密码"
          :password-toggle="true"
        />
      </view>

      <button class="primary-btn" @click="handleRegister">注册</button>
      <button class="secondary-btn mt-20" @click="goLogin">已有账号，去登录</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import FormInput from '../../components/FormInput.vue'
import { register } from '../../api/auth'
import PageNav from '../../components/PageNav.vue'

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

:deep(.page-nav) {
  background: linear-gradient(180deg, rgba(44, 102, 255, 0.94) 0%, rgba(23, 71, 214, 0.88) 100%);
}

:deep(.page-nav .nav-title) {
  color: #ffffff;
}

:deep(.page-nav-shell) {
  margin: 0 -28rpx 18rpx;
}

:deep(.page-nav .left-area) {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}

:deep(.page-nav .back-arrow),
:deep(.page-nav .back-text) {
  color: #ffffff;
}

.mt-20 {
  margin-top: 20rpx;
}
</style>
