<template>
  <view class="page-container tool-page">
    <PageNav title="文档格式转换" />
    <view class="page-head">
      <text class="page-title">文档格式转换</text>
      <text class="page-subtitle">根据源文件格式动态选择可转换的目标格式，提交后直接生成结果文件</text>
    </view>

    <view class="card-block upload-card">
      <view class="upload-icon">{{ selectedTargetLabel || 'FMT' }}</view>
      <text class="upload-title">选择需要转换的文档</text>
      <text class="upload-desc">支持 Word / Excel / PPT / PDF 等常见文档格式</text>
      <view v-if="selectedFile" class="selected-file">
        <text class="selected-name">{{ selectedFile.name }}</text>
        <text class="selected-meta">{{ selectedFile.sourceType.toUpperCase() }} · {{ selectedFile.sizeText }}</text>
      </view>
      <picker
        mode="selector"
        :range="targetFormatOptions"
        range-key="label"
        :value="selectedTargetIndex"
        :disabled="busy || !targetFormatOptions.length"
        @change="handleTargetFormatChange"
      >
        <view class="format-picker" :class="{ 'format-picker-disabled': !targetFormatOptions.length }">
          <text class="format-picker-label">目标格式</text>
          <text class="format-picker-value">{{ selectedTargetLabel || '请先选择文件' }}</text>
        </view>
      </picker>
      <button class="primary-btn choose-btn" :disabled="busy" @click="handleChooseFile">
        {{ selectedFile ? '重新选择文件' : '选择文件' }}
      </button>
      <button class="secondary-btn action-btn" :disabled="!canSubmit" @click="handleStartConversion">
        {{ actionButtonText }}
      </button>
      <button v-if="canOpenPdf" class="secondary-btn action-btn" :disabled="busy" @click="handleOpenPdf">
        打开 PDF
      </button>
      <button v-if="canDownloadResult" class="secondary-btn action-btn" :disabled="busy" @click="handleDownloadResult">
        下载结果
      </button>
      <button class="secondary-btn action-btn" :disabled="busy" @click="handleViewRecords">查看记录</button>
    </view>

    <view v-if="selectedFile || taskStatus !== 'idle'" class="card-block status-card section-gap">
      <text class="block-title">任务状态</text>
      <view class="status-row">
        <text class="status-label">当前状态</text>
        <text class="status-badge" :class="statusMeta.className">{{ statusMeta.text }}</text>
      </view>
      <text v-if="selectedFile?.sourceType" class="status-desc">源格式：{{ selectedFile.sourceType.toUpperCase() }}</text>
      <text v-if="selectedTargetLabel" class="status-desc">目标格式：{{ selectedTargetLabel }}</text>
      <text v-if="statusHint" class="status-desc">{{ statusHint }}</text>
      <text v-if="resultRecord?.id" class="status-desc">记录 ID：{{ resultRecord.id }}</text>
      <text v-if="resultRecord?.sourceUrl" class="status-desc url-text">源文件地址：{{ resultRecord.sourceUrl }}</text>
      <text v-if="resultRecord?.resultUrl" class="status-desc url-text">
        {{ resultRecord.targetFormat === 'pdf' ? 'PDF 地址' : '结果地址' }}：{{ resultRecord.resultUrl }}
      </text>
      <text v-if="resultRecord?.targetFileName" class="status-desc">结果文件：{{ resultRecord.targetFileName }}</text>
      <text v-if="resultRecord?.finishedAt" class="status-desc">完成时间：{{ resultRecord.finishedAtText }}</text>
      <text v-if="errorMessage" class="status-error-text">{{ errorMessage }}</text>
    </view>

    <view class="card-block steps-card section-gap">
      <text class="block-title">使用步骤</text>
      <view v-for="(item, index) in steps" :key="item" class="step-item">
        <view class="step-index">{{ index + 1 }}</view>
        <text class="step-text">{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import PageNav from '../../../components/PageNav.vue'
import { createConversionByUrl } from '../../../api/conversion'
import { chooseDocumentFile } from '../../../utils/file-picker'
import {
  buildTargetFileName,
  getAllowedTargetFormats,
  getFormatLabel,
  getStatusMeta,
  normalizeConversionRecord
} from '../../../utils/conversion'
import { uploadDocumentToOss } from '../../../utils/oss-upload'
import { downloadPdfUrl, openPdfUrl } from '../../../utils/pdf'
import { requireLogin } from '../../../utils/guard'

const steps = ['选择需要转换的文档', '上传源文件到 OSS', '选择目标格式并发起转换']
const selectedFile = ref(null)
const selectedTargetFormat = ref('')
const busy = ref(false)
const taskStatus = ref('idle')
const resultRecord = ref(null)
const errorMessage = ref('')

const targetFormatOptions = computed(() =>
  getAllowedTargetFormats(selectedFile.value?.sourceType).map((format) => ({
    value: format,
    label: getFormatLabel(format)
  }))
)

const selectedTargetIndex = computed(() => {
  const index = targetFormatOptions.value.findIndex((item) => item.value === selectedTargetFormat.value)
  return index === -1 ? 0 : index
})

const selectedTargetLabel = computed(() => getFormatLabel(selectedTargetFormat.value))
const canSubmit = computed(() => !!selectedFile.value && !!selectedTargetFormat.value && !busy.value)
const statusMeta = computed(() => getStatusMeta(taskStatus.value))
const canOpenPdf = computed(() => resultRecord.value?.targetFormat === 'pdf' && !!resultRecord.value?.resultUrl)
const canDownloadResult = computed(() => !!resultRecord.value?.resultUrl)

const actionButtonText = computed(() => {
  if (taskStatus.value === 'uploading') {
    return '上传中...'
  }

  if (taskStatus.value === 'processing') {
    return '转换中...'
  }

  if (taskStatus.value === 'success') {
    return '重新转换'
  }

  return selectedTargetLabel.value ? `转换为 ${selectedTargetLabel.value}` : '开始转换'
})

const statusHint = computed(() => {
  if (taskStatus.value === 'uploading') {
    return '正在上传源文件到 OSS。'
  }

  if (taskStatus.value === 'processing') {
    return '源文件已上传到 OSS，后端正在执行格式转换。'
  }

  if (taskStatus.value === 'success') {
    return resultRecord.value?.targetFormat === 'pdf' ? '转换完成，可直接打开或下载 PDF。' : '转换完成，可直接下载结果文件。'
  }

  if (taskStatus.value === 'failed') {
    return '转换失败，请检查文件格式或后端服务状态。'
  }

  if (!selectedFile.value) {
    return ''
  }

  if (!selectedTargetFormat.value) {
    return '当前文件暂无可用目标格式。'
  }

  return `已选择 ${selectedFile.value.sourceType.toUpperCase()} 文件，准备转换为 ${selectedTargetLabel.value}。`
})

function resetTaskState() {
  taskStatus.value = 'idle'
  resultRecord.value = null
  errorMessage.value = ''
}

function syncTargetFormat() {
  const allowedTargets = targetFormatOptions.value

  if (!allowedTargets.length) {
    selectedTargetFormat.value = ''
    return
  }

  if (!allowedTargets.some((item) => item.value === selectedTargetFormat.value)) {
    selectedTargetFormat.value = allowedTargets[0].value
  }
}

async function handleChooseFile() {
  if (!requireLogin() || busy.value) {
    return
  }

  try {
    const file = await chooseDocumentFile()
    selectedFile.value = file
    resetTaskState()
    syncTargetFormat()
  } catch (error) {
    if (error?.message && error.message !== '已取消选择文件' && error.message !== '未选择文件') {
      uni.showToast({
        title: error.message,
        icon: 'none'
      })
    }
  }
}

function handleTargetFormatChange(event) {
  const index = Number(event?.detail?.value)
  const nextFormat = targetFormatOptions.value[index]

  if (!nextFormat) {
    return
  }

  selectedTargetFormat.value = nextFormat.value
  resetTaskState()
}

function updateRecord(record = {}) {
  resultRecord.value = normalizeConversionRecord(record)
  taskStatus.value = resultRecord.value.status || taskStatus.value
  errorMessage.value = resultRecord.value.errorMsg || ''
}

async function handleStartConversion() {
  if (!requireLogin() || !selectedFile.value || !selectedTargetFormat.value || busy.value) {
    return
  }

  busy.value = true
  errorMessage.value = ''
  resultRecord.value = null

  try {
    taskStatus.value = 'uploading'
    const uploadResult = await uploadDocumentToOss(selectedFile.value)
    taskStatus.value = 'processing'
    const response = await createConversionByUrl({
      fileName: selectedFile.value.name,
      sourceType: selectedFile.value.sourceType,
      sourceUrl: uploadResult.sourceUrl,
      sourceKey: uploadResult.sourceKey,
      targetFormat: selectedTargetFormat.value
    })

    updateRecord(response?.data?.record || {})

    if (resultRecord.value?.status === 'success' && resultRecord.value?.resultUrl) {
      uni.showToast({
        title: '转换成功',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('create pdf conversion error', error)
    taskStatus.value = 'failed'
    errorMessage.value = error?.message || '发起转换失败'
  } finally {
    busy.value = false
  }
}

async function handleOpenPdf() {
  if (!canOpenPdf.value || busy.value) {
    return
  }

  busy.value = true

  try {
    await openPdfUrl(resultRecord.value.resultUrl)
  } catch (error) {
    uni.showToast({
      title: error.message || '打开 PDF 失败',
      icon: 'none'
    })
  } finally {
    busy.value = false
  }
}

async function handleDownloadResult() {
  if (!canDownloadResult.value || busy.value) {
    return
  }

  busy.value = true

  try {
    const savedFilePath = await downloadPdfUrl(
      resultRecord.value.resultUrl,
      resultRecord.value.targetFileName || buildTargetFileName(selectedFile.value?.name || '', resultRecord.value.targetFormat)
    )

    // #ifdef MP-WEIXIN
    uni.showToast({
      title: savedFilePath ? '结果文件已保存到本地' : '结果文件下载成功',
      icon: 'none'
    })
    // #endif

    // #ifdef H5
    uni.showToast({
      title: '已开始下载结果文件',
      icon: 'none'
    })
    // #endif
  } catch (error) {
    uni.showToast({
      title: error.message || '下载结果文件失败',
      icon: 'none'
    })
  } finally {
    busy.value = false
  }
}

function handleViewRecords() {
  if (!requireLogin()) {
    return
  }

  uni.navigateTo({
    url: '/pages/records/index'
  })
}
</script>

<style scoped lang="scss">
.upload-card {
  padding: 40rpx 28rpx;
  text-align: center;
}

.upload-icon {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto;
  border-radius: 28rpx;
  background: #edf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-size: 32rpx;
  font-weight: 700;
}

.upload-title {
  display: block;
  margin-top: 28rpx;
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}

.upload-desc {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
}

.choose-btn {
  margin-top: 36rpx;
}

.action-btn {
  margin-top: 20rpx;
}

.selected-file {
  margin-top: 26rpx;
  padding: 22rpx 20rpx;
  border-radius: 22rpx;
  background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
  text-align: left;
}

.selected-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.5;
  word-break: break-all;
}

.selected-meta {
  display: block;
  margin-top: 10rpx;
  font-size: 23rpx;
  color: #6b7280;
}

.format-picker {
  margin-top: 22rpx;
  padding: 22rpx 24rpx;
  border-radius: 22rpx;
  border: 2rpx solid #dbe7ff;
  background: #ffffff;
  text-align: left;
}

.format-picker-disabled {
  opacity: 0.6;
}

.format-picker-label {
  display: block;
  font-size: 23rpx;
  color: #6b7280;
}

.format-picker-value {
  display: block;
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
}

.status-card {
  padding: 32rpx 28rpx;
}

.steps-card {
  padding: 32rpx 28rpx;
}

.block-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
}

.status-label {
  font-size: 28rpx;
  color: #374151;
}

.status-badge {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.status-success {
  background: #eefbf1;
  color: #16a34a;
}

.status-pending {
  background: #eff6ff;
  color: #2563eb;
}

.status-error {
  background: #fff1f2;
  color: #dc2626;
}

.status-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.7;
}

.status-error-text {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #dc2626;
  line-height: 1.7;
}

.url-text {
  word-break: break-all;
}

.step-item {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
}

.step-index {
  width: 50rpx;
  height: 50rpx;
  border-radius: 999rpx;
  background: #edf4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d67f6;
  font-size: 24rpx;
  font-weight: 700;
}

.step-text {
  margin-left: 18rpx;
  font-size: 28rpx;
  color: #374151;
}

button[disabled] {
  opacity: 0.6;
}
</style>
