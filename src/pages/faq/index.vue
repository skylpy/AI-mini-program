<template>
  <view class="page-container">
    <PageNav title="常见问题" />
    <view class="page-head">
      <text class="page-title">常见问题</text>
      <text class="page-subtitle">以下为演示 FAQ 内容，可替换为后台配置</text>
    </view>

    <view v-for="(item, index) in faqList" :key="item.id" class="card-block faq-card section-gap" @click="toggle(index)">
      <view class="faq-head">
        <text class="faq-question">{{ item.question }}</text>
        <text class="faq-arrow">{{ activeIndex === index ? '-' : '+' }}</text>
      </view>
      <text v-if="activeIndex === index" class="faq-answer">{{ item.answer }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageNav from '../../components/PageNav.vue'
import { mockFaqList } from '../../mock/data'

const faqList = ref(mockFaqList)
const activeIndex = ref(0)

function toggle(index) {
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<style scoped lang="scss">
.faq-card {
  padding: 28rpx 24rpx;
}

.faq-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-question {
  flex: 1;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.6;
}

.faq-arrow {
  margin-left: 18rpx;
  color: #9ca3af;
  font-size: 34rpx;
}

.faq-answer {
  display: block;
  margin-top: 18rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.8;
}
</style>
