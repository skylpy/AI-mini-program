<template>
  <view class="page-container">
    <PageNav title="修改密码" />
    <view class="page-head">
      <text class="page-title">修改密码</text>
      <text class="page-subtitle">请输入旧密码，并设置新的登录密码</text>
    </view>

    <view class="card-block form-card section-gap">
      <view class="field-wrap">
        <text class="field-label">旧密码</text>
        <FormInput
          v-model.trim="form.oldPassword"
          placeholder="请输入旧密码"
          :password-toggle="true"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">新密码</text>
        <FormInput
          v-model.trim="form.newPassword"
          placeholder="请输入新密码"
          :password-toggle="true"
        />
      </view>

      <view class="field-wrap">
        <text class="field-label">确认新密码</text>
        <FormInput
          v-model.trim="confirmPassword"
          placeholder="请再次输入新密码"
          :password-toggle="true"
        />
      </view>

      <button class="primary-btn submit-btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '确认修改' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FormInput from '../../components/FormInput.vue'
import PageNav from '../../components/PageNav.vue'
import { updatePassword } from '../../api/user'
import { requireLogin } from '../../utils/guard'

const form = reactive({
  oldPassword: '',
  newPassword: ''
})

const confirmPassword = ref('')
const submitting = ref(false)

function validateForm() {
  if (!form.oldPassword) {
    uni.showToast({ title: '请输入旧密码', icon: 'none' })
    return false
  }

  if (!form.newPassword || form.newPassword.length < 6) {
    uni.showToast({ title: '新密码不少于 6 位', icon: 'none' })
    return false
  }

  if (form.oldPassword === form.newPassword) {
    uni.showToast({ title: '新密码不能与旧密码相同', icon: 'none' })
    return false
  }

  if (!confirmPassword.value) {
    uni.showToast({ title: '请确认新密码', icon: 'none' })
    return false
  }

  if (form.newPassword !== confirmPassword.value) {
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
    const res = await updatePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    })

    uni.showToast({
      title: res?.message || '密码修改成功',
      icon: 'none'
    })

    form.oldPassword = ''
    form.newPassword = ''
    confirmPassword.value = ''

    setTimeout(() => {
      uni.navigateBack()
    }, 250)
  } catch (error) {
    console.error('update password error', error)
  } finally {
    submitting.value = false
    uni.hideLoading()
  }
}

onLoad(() => {
  requireLogin()
})
</script>

<style scoped lang="scss">
.form-card {
  padding: 30rpx 24rpx;
}

.field-wrap + .field-wrap {
  margin-top: 24rpx;
}

.field-label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  color: #374151;
}

.submit-btn {
  margin-top: 36rpx;
}

.submit-btn[disabled] {
  opacity: 0.7;
}
</style>
