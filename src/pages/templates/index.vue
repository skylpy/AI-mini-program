<template>
  <view class="page-container">
    <PageNav title="文档模板" />
    <view class="page-head">
      <text class="page-title">文档模板</text>
      <text class="page-subtitle">从服务端获取模板内容，支持一键复制正文</text>
    </view>

    <view v-if="loading && !templateList.length" class="card-block template-card section-gap">
      <text class="template-title">正在加载模板...</text>
    </view>

    <view v-for="item in templateList" :key="item.id" class="card-block template-card section-gap">
      <view class="template-meta">
        <view class="template-tag-wrap">
          <view class="template-tag">{{ item.categoryLabel }}</view>
          <view v-if="item.subCategoryLabel" class="template-tag template-tag-secondary">{{ item.subCategoryLabel }}</view>
        </view>
        <view class="template-badge" :class="{ 'template-badge-free': item.isFree, 'template-badge-paid': !item.isFree }">
          {{ item.isFree ? '免费' : '精选' }}
        </view>
      </view>
      <text class="template-title">{{ item.title }}</text>
      <text class="template-desc">{{ item.description }}</text>
      <text class="template-content">{{ item.contentPreview }}</text>
      <view v-if="item.tags.length" class="tag-list">
        <text v-for="tag in item.tags" :key="tag" class="tag-item">{{ tag }}</text>
      </view>
      <button class="secondary-btn preview-btn" @click="handleCopy(item)">复制内容</button>
    </view>

    <view v-if="!loading && !templateList.length" class="card-block template-card section-gap">
      <text class="template-title">暂无模板数据</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getTemplates } from '../../api/template'
import PageNav from '../../components/PageNav.vue'

const templateList = ref([])
const loading = ref(false)

function getCategoryLabel(value = '') {
  const labelMap = {
    work: '职场',
    office: '办公',
    hr: '人事',
    meeting: '会议',
    report: '汇报',
    project: '项目'
  }

  return labelMap[value] || value || '模板'
}

function normalizeTemplate(item = {}) {
  const content = String(item.content || '')

  return {
    id: item.id || item._id || '',
    title: item.title || '未命名模板',
    category: item.category || '',
    categoryLabel: getCategoryLabel(item.category),
    subCategory: item.subCategory || '',
    subCategoryLabel: getCategoryLabel(item.subCategory),
    description: item.description || '',
    content,
    contentPreview: content.length > 120 ? `${content.slice(0, 120)}...` : content,
    tags: Array.isArray(item.tags) ? item.tags : [],
    isFree: item.isFree !== false
  }
}

async function fetchTemplates() {
  if (loading.value) {
    return
  }

  loading.value = true

  try {
    const response = await getTemplates({}, { showError: false })
    const list = Array.isArray(response?.data) ? response.data : []
    templateList.value = list.map((item) => normalizeTemplate(item))
  } catch (error) {
    console.error('fetch templates error', error)
    uni.showToast({
      title: '获取模板失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function handleCopy(item) {
  if (!item?.content) {
    uni.showToast({
      title: '模板内容为空',
      icon: 'none'
    })
    return
  }

  uni.setClipboardData({
    data: item.content,
    success: () => {
      uni.showToast({
        title: '模板内容已复制',
        icon: 'none'
      })
    }
  })
}

onShow(() => {
  fetchTemplates()
})

onPullDownRefresh(async () => {
  await fetchTemplates()
  uni.stopPullDownRefresh()
})
</script>

<style scoped lang="scss">
.template-card {
  padding: 30rpx 24rpx;
}

.template-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.template-tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.template-tag {
  display: inline-flex;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #edf5ff;
  color: #2563eb;
  font-size: 22rpx;
}

.template-tag-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.template-badge {
  flex-shrink: 0;
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.template-badge-free {
  background: #ecfdf5;
  color: #059669;
}

.template-badge-paid {
  background: #fff7ed;
  color: #ea580c;
}

.template-title {
  display: block;
  margin-top: 20rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.template-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.7;
}

.template-content {
  display: block;
  margin-top: 18rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  color: #334155;
  font-size: 24rpx;
  line-height: 1.8;
  white-space: pre-wrap;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.tag-item {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  color: #64748b;
  font-size: 20rpx;
}

.preview-btn {
  margin-top: 28rpx;
}
</style>
