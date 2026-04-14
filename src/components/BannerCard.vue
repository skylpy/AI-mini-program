<template>
  <view class="banner-card" @click="$emit('click', item)">
    <image v-if="item.image" class="banner-image" :src="item.image" mode="aspectFill" />
    <view class="banner-mask"></view>
    <view class="banner-content">
      <text class="banner-title">{{ item.title }}</text>
      <text class="banner-tip">高效处理文档格式转换需求</text>
    </view>
  </view>
</template>

<script setup>
defineEmits(['click'])

defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.banner-card {
  position: relative;
  height: 280rpx;
  overflow: hidden;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #ffd6cf, #ff7f7f);
}

.banner-image {
  width: 100%;
  height: 100%;
}

.banner-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 90, 95, 0.08), rgba(15, 23, 42, 0.28));
}

.banner-content {
  position: absolute;
  left: 28rpx;
  right: 28rpx;
  bottom: 28rpx;
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #ffffff;
}

.banner-tip {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}
</style>
