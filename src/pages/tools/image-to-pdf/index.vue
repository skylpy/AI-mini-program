<template>
  <view class="page-container tool-page">
    <PageNav title="图片转 PDF" />

    <view class="page-head">
      <text class="page-title">图片转 PDF</text>
      <text class="page-subtitle">选择多张图片后合并生成 PDF 文件，适合票据、拍照文档和资料整理。</text>
    </view>

    <view class="card-block upload-card">
      <view class="summary-row">
        <view class="summary-badge">
          <text class="summary-badge__label">已选择</text>
          <text class="summary-badge__value">{{ images.length }}/9 张</text>
        </view>
        <view class="support-tags">
          <text class="support-tag">JPG</text>
          <text class="support-tag">PNG</text>
          <text class="support-tag">WEBP</text>
        </view>
      </view>

      <button class="primary-btn" :disabled="loading || images.length >= 9" @click="chooseImages">
        {{ images.length ? '继续选择图片' : '选择图片' }}
      </button>

      <view v-if="!images.length" class="empty-state">
        <view class="empty-state__icon">IMG</view>
        <text class="empty-state__title">先选择要合并的图片</text>
        <text class="empty-state__desc">支持从相册或拍照选择，建议按最终 PDF 顺序依次添加。</text>
      </view>

      <view v-else class="preview-grid">
        <view v-for="(item, index) in images" :key="item.id" class="preview-item">
          <image class="preview-image" :src="item.url" mode="aspectFill" />
          <button class="remove-btn" :disabled="loading" @click="removeImage(index)">×</button>
          <view class="preview-mask">
            <text class="preview-name">{{ item.name }}</text>
            <text class="preview-size">{{ item.sizeText }}</text>
          </view>
        </view>
      </view>

      <button class="secondary-btn submit-btn" :disabled="loading || !images.length" @click="createPdf">
        {{ loading ? '生成中...' : '生成 PDF' }}
      </button>
    </view>

    <view v-if="result.fileName" class="card-block result-card section-gap">
      <text class="result-title">PDF 已生成</text>
      <text class="result-info">PDF 文件名：{{ result.fileName }}</text>
      <text class="result-info">PDF 大小：{{ formatFileSize(result.size) }}</text>
      <button class="secondary-btn result-btn" :disabled="loading" @click="openPdf(result.pdfUrl)">打开 PDF</button>
      <button class="secondary-btn result-btn" :disabled="loading" @click="copyPdfUrl(result.pdfUrl)">复制 PDF 链接</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import PageNav from '../../../components/PageNav.vue'
import { createImageToPdf } from '../../../api/conversion'
import { openRemoteFileUrl } from '../../../utils/pdf'
import { normalizeUploadFile } from '../../../utils/upload-file'

const images = ref([])
const loading = ref(false)
const result = reactive({
  recordId: '',
  pdfUrl: '',
  fileName: '',
  size: 0
})

function formatFileSize(size = 0) {
  const value = Number(size) || 0

  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

function normalizeImages(tempFiles = []) {
  return tempFiles.map((file, index) => {
    const normalizedFile = normalizeUploadFile(file, `image-${index + 1}`)

    return {
      ...normalizedFile,
      id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2, 8)}`,
      sizeText: formatFileSize(normalizedFile.size)
    }
  })
}

function chooseImages() {
  const remainCount = 9 - images.value.length

  if (remainCount <= 0) {
    uni.showToast({
      title: '最多只能选择 9 张图片',
      icon: 'none'
    })
    return
  }

  // #ifdef MP-WEIXIN
  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFiles = [] }) => {
      images.value = [...images.value, ...normalizeImages(tempFiles)]
    },
    fail: (error) => {
      if (!error?.errMsg?.includes('cancel')) {
        uni.showToast({ title: '选择图片失败', icon: 'none' })
      }
    }
  })
  // #endif

  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/jpg,image/png,image/webp'
  input.multiple = true

  input.onchange = () => {
    const nextFiles = Array.from(input.files || []).slice(0, remainCount)
    images.value = [
      ...images.value,
      ...normalizeImages(
        nextFiles.map((file) => ({
          name: file.name,
          size: file.size,
          file,
          path: URL.createObjectURL(file)
        }))
      )
    ]
  }

  input.click()
  // #endif
}

function removeImage(index) {
  images.value.splice(index, 1)
}

function resetResult() {
  result.recordId = ''
  result.pdfUrl = ''
  result.fileName = ''
  result.size = 0
}

async function uploadImages() {
  const response = await createImageToPdf({
    images: images.value,
    title: `图片转PDF-${Date.now()}`
  })

  return response?.data || {}
}

async function createPdf() {
  if (!images.value.length || loading.value) {
    return
  }

  resetResult()
  loading.value = true
  uni.showLoading({
    title: '生成中'
  })

  try {
    const data = await uploadImages()

    result.recordId = data.recordId || ''
    result.pdfUrl = data.pdfUrl || ''
    result.fileName = data.fileName || ''
    result.size = Number(data.size) || 0

    uni.showToast({
      title: 'PDF生成成功',
      icon: 'none'
    })
  } catch (error) {
    console.error('image to pdf error', error)
    uni.showToast({
      title: error.message || 'PDF 生成失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    uni.hideLoading()
  }
}

async function openPdf(pdfUrl) {
  if (!pdfUrl) {
    uni.showToast({
      title: 'PDF 地址不存在',
      icon: 'none'
    })
    return
  }

  try {
    await openRemoteFileUrl(pdfUrl, {
      fileType: 'pdf',
      fileName: result.fileName || 'image-to-pdf.pdf',
      title: result.fileName || 'PDF预览'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '打开 PDF 失败',
      icon: 'none'
    })
  }
}

function copyPdfUrl(pdfUrl) {
  if (!pdfUrl) {
    uni.showToast({
      title: 'PDF 地址不存在',
      icon: 'none'
    })
    return
  }

  uni.setClipboardData({
    data: pdfUrl,
    success: () => {
      uni.showToast({
        title: 'PDF 链接已复制',
        icon: 'none'
      })
    }
  })
}
</script>

<style scoped lang="scss">
.upload-card,
.result-card {
  padding: 32rpx 28rpx;
}

.summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.summary-badge {
  padding: 18rpx 20rpx;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #eff5ff 0%, #e9f1ff 100%);
  min-width: 220rpx;
}

.summary-badge__label {
  display: block;
  font-size: 22rpx;
  color: #6b7280;
}

.summary-badge__value {
  display: block;
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #1d4ed8;
}

.support-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10rpx;
}

.support-tag {
  padding: 10rpx 14rpx;
  border-radius: 999rpx;
  background: #f8fafc;
  border: 1rpx solid #e5e7eb;
  font-size: 22rpx;
  color: #64748b;
}

.empty-state {
  margin-top: 24rpx;
  padding: 40rpx 28rpx;
  border-radius: 24rpx;
  border: 2rpx dashed #d7e3fb;
  background: linear-gradient(180deg, #fbfdff 0%, #f6f9ff 100%);
  text-align: center;
}

.empty-state__icon {
  width: 92rpx;
  height: 92rpx;
  margin: 0 auto;
  border-radius: 24rpx;
  background: #edf4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d67f6;
  font-size: 24rpx;
  font-weight: 700;
}

.empty-state__title {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.empty-state__desc {
  display: block;
  margin-top: 12rpx;
  font-size: 23rpx;
  line-height: 1.7;
  color: #94a3b8;
}

.preview-grid {
  margin-top: 24rpx;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.preview-item {
  position: relative;
  overflow: hidden;
  min-height: 260rpx;
  border-radius: 24rpx;
  background: #eef2f7;
  box-shadow: inset 0 0 0 2rpx rgba(255, 255, 255, 0.4);
}

.preview-image {
  width: 100%;
  height: 260rpx;
  display: block;
}

.preview-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 44rpx 16rpx 16rpx;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.78) 100%);
}

.preview-name {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-size {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.76);
}

.remove-btn {
  position: absolute;
  top: 14rpx;
  right: 14rpx;
  z-index: 2;
  width: 52rpx;
  height: 52rpx;
  border-radius: 999rpx;
  background: rgba(15, 23, 42, 0.52);
  color: #ffffff;
  font-size: 34rpx;
  line-height: 1;
}

.submit-btn {
  margin-top: 24rpx;
}

.result-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.result-info {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.7;
  word-break: break-all;
}

.result-btn {
  margin-top: 20rpx;
}

@media (max-width: 360px) {
  .preview-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
