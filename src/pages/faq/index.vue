<template>
  <view class="page-container">
    <PageNav title="常见问题" />
    <view class="page-head">
      <text class="page-title">{{ pageMeta.title }}</text>
      <text class="page-subtitle">{{ pageMeta.subtitle || '点击问题展开查看答案' }}</text>
    </view>

    <view v-if="loading && !faqList.length" class="card-block faq-card section-gap">
      <text class="faq-question">正在加载常见问题...</text>
    </view>

    <view
      v-for="(item, index) in faqList"
      :key="item.id"
      class="card-block faq-card section-gap"
      @click="toggle(index)"
    >
      <view class="faq-head">
        <view class="faq-title-wrap">
          <text v-if="item.category" class="faq-category">{{ item.category }}</text>
          <text class="faq-question">{{ item.question }}</text>
        </view>
        <text class="faq-arrow">{{ activeIndex === index ? '收起' : '展开' }}</text>
      </view>
      <text v-if="activeIndex === index" class="faq-answer">{{ item.answer }}</text>
    </view>

    <view v-if="!loading && !faqList.length" class="card-block faq-card section-gap">
      <text class="faq-question">暂无常见问题数据</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getFaqs } from '../../api/faq'
import PageNav from '../../components/PageNav.vue'

const faqList = ref([])
const loading = ref(false)
const activeIndex = ref(-1)
const pageMeta = reactive({
  title: '常见问题',
  subtitle: '',
  version: ''
})

function normalizeFaqItem(item = {}) {
  return {
    id: item.id || '',
    question: item.question || '',
    answer: item.answer || '',
    category: item.category || '',
    defaultExpanded: !!item.defaultExpanded
  }
}

async function fetchFaqs() {
  if (loading.value) {
    return
  }

  loading.value = true

  try {
    const response = await getFaqs({}, { showError: false })
    const list = Array.isArray(response?.data?.list) ? response.data.list : []
    const normalizedList = list.map((item) => normalizeFaqItem(item))

    faqList.value = normalizedList
    pageMeta.title = response?.data?.page?.title || '常见问题'
    pageMeta.subtitle = response?.data?.page?.subtitle || ''
    pageMeta.version = response?.data?.page?.version || ''

    const defaultIndex = normalizedList.findIndex((item) => item.defaultExpanded)
    activeIndex.value = defaultIndex
  } catch (error) {
    console.error('fetch faqs error', error)
    uni.showToast({
      title: '获取常见问题失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function toggle(index) {
  activeIndex.value = activeIndex.value === index ? -1 : index
}

onShow(() => {
  fetchFaqs()
})

onPullDownRefresh(async () => {
  await fetchFaqs()
  uni.stopPullDownRefresh()
})
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

.faq-title-wrap {
  flex: 1;
  min-width: 0;
}

.faq-category {
  display: inline-flex;
  margin-bottom: 12rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #edf4ff;
  color: #2563eb;
  font-size: 20rpx;
  font-weight: 600;
}

.faq-question {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.6;
}

.faq-arrow {
  margin-left: 18rpx;
  color: #9ca3af;
  font-size: 24rpx;
  flex-shrink: 0;
}

.faq-answer {
  display: block;
  margin-top: 18rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.8;
}
</style>
