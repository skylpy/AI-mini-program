<template>
  <view class="page-container preview-page">
    <PageNav :title="pageTitle" />

    <view v-if="loading" class="card-block preview-state">
      <text class="preview-state__text">正在加载预览内容...</text>
    </view>

    <view v-else-if="errorMessage" class="card-block preview-state">
      <text class="preview-state__error">{{ errorMessage }}</text>
    </view>

    <view v-else-if="previewType === 'html'" class="card-block preview-card rich-card">
      <rich-text :nodes="htmlContent" />
    </view>

    <view v-else-if="isCsvPreview" class="card-block preview-card table-card">
      <scroll-view scroll-x class="table-scroll">
        <view class="table-wrap">
          <view v-for="(row, rowIndex) in csvRows" :key="`${rowIndex}-${row.length}`" class="table-row">
            <text
              v-for="(cell, cellIndex) in row"
              :key="`${rowIndex}-${cellIndex}`"
              class="table-cell"
              :class="{ 'table-cell--head': rowIndex === 0 }"
            >
              {{ cell || '--' }}
            </text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view v-else class="card-block preview-card text-card">
      <text class="text-content">{{ textContent }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageNav from '../../components/PageNav.vue'
import { getConversionPreview } from '../../api/conversion'

const loading = ref(true)
const errorMessage = ref('')
const previewType = ref('text')
const targetFormat = ref('')
const pageTitle = ref('文件预览')
const htmlContent = ref('')
const textContent = ref('')
const csvRows = ref([])

const isCsvPreview = computed(() => targetFormat.value === 'csv' && csvRows.value.length > 0)

async function loadPreview(recordId = '') {
  if (!recordId) {
    loading.value = false
    errorMessage.value = '缺少预览记录标识'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getConversionPreview(recordId)
    const data = response?.data || {}

    previewType.value = data.previewType || 'text'
    targetFormat.value = data.targetFormat || ''
    htmlContent.value = data.previewType === 'html' ? data.content || '' : ''
    textContent.value = data.previewType === 'text' ? data.content || '' : ''
    csvRows.value = Array.isArray(data.rows) ? data.rows : []
  } catch (error) {
    console.error('load preview error', error)
    errorMessage.value = error?.message || '加载预览内容失败'
  } finally {
    loading.value = false
  }
}

onLoad((query) => {
  pageTitle.value = query?.title ? decodeURIComponent(query.title) : '文件预览'
  loadPreview(query?.id ? decodeURIComponent(query.id) : '')
})
</script>

<style scoped lang="scss">
.preview-page {
  min-height: 100vh;
}

.preview-state,
.preview-card {
  padding: 32rpx 28rpx;
}

.preview-state__text {
  font-size: 28rpx;
  color: #6b7280;
}

.preview-state__error {
  font-size: 28rpx;
  line-height: 1.7;
  color: #dc2626;
}

.rich-card {
  line-height: 1.8;
}

.text-card {
  background: #ffffff;
}

.text-content {
  font-size: 26rpx;
  line-height: 1.8;
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-word;
}

.table-card {
  padding: 24rpx 0;
}

.table-scroll {
  width: 100%;
}

.table-wrap {
  min-width: 100%;
  padding: 0 24rpx;
}

.table-row {
  display: flex;
  border-bottom: 1rpx solid #e5e7eb;
}

.table-row:first-child {
  border-top: 1rpx solid #e5e7eb;
}

.table-cell {
  min-width: 220rpx;
  padding: 20rpx 16rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #374151;
  border-right: 1rpx solid #e5e7eb;
  word-break: break-word;
}

.table-cell--head {
  font-weight: 700;
  color: #111827;
  background: #f8fafc;
}
</style>
