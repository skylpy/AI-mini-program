<template>
  <view class="list-cell" @click="$emit('click')">
    <view class="left-content">
      <view class="icon-wrap">
        <text class="icon-text">{{ icon }}</text>
      </view>
      <view class="text-group">
        <text class="title">{{ title }}</text>
        <text v-if="desc" class="desc">{{ desc }}</text>
      </view>
    </view>
    <text class="arrow">></text>
  </view>
</template>

<script setup>
defineEmits(['click'])

defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '•'
  }
})
</script>

<style scoped lang="scss">
.list-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 8rpx;
}

.left-content {
  display: flex;
  align-items: center;
}

.icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #e5eeff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #2563eb;
}

.text-group {
  margin-left: 18rpx;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 30rpx;
  color: #0f172a;
  font-weight: 700;
}

.desc {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #94a3b8;
}

.arrow {
  font-size: 28rpx;
  color: #bfd0f8;
}
</style>
