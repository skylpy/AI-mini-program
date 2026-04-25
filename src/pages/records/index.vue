<template>
  <view class="page-container">
    <PageNav title="转换记录" />
    <view class="page-head">
      <text class="page-title">转换记录</text>
      <text class="page-subtitle">展示源文件、目标格式、结果文件、完成时间和转换状态</text>
    </view>

    <view v-if="loading && !recordList.length" class="card-block empty-card section-gap">
      <text class="empty-text">正在加载转换记录...</text>
    </view>

    <view v-for="item in recordList" :key="item.id" class="card-block record-card section-gap">
      <view class="record-top">
        <text class="file-name">{{ item.sourceFileName }}</text>
        <text class="status" :class="item.statusClassName">{{ item.statusText }}</text>
      </view>
      <text class="record-info">记录编号：{{ item.id }}</text>
      <text class="record-info">转换类型：{{ item.toolType || `${item.sourceType || '文档'}-to-${item.targetFormat || 'unknown'}` }}</text>
      <text class="record-info">目标格式：{{ getTargetLabel(item) }}</text>
      <text class="record-info">任务类型：{{ item.taskType || '--' }}</text>
      <text class="record-info">完成时间：{{ item.finishedAtText }}</text>
      <text class="record-info">结果文件：{{ item.targetFileName || '--' }}</text>
      <text v-if="item.errorMsg" class="record-error">失败原因：{{ item.errorMsg }}</text>
      <view class="record-actions">
        <button
          class="secondary-btn action-btn"
          :disabled="actionLoadingMap[item.id] || !canOpenResult(item)"
          @click="handleOpenResult(item)"
        >
          打开结果
        </button>
        <button
          class="secondary-btn action-btn"
          :disabled="actionLoadingMap[item.id] || !item.resultUrl"
          @click="handleDownloadResult(item)"
        >
          下载结果
        </button>
        <button
          class="secondary-btn action-btn"
          :disabled="actionLoadingMap[item.id]"
          @click="handleRefreshRecord(item)"
        >
          刷新状态
        </button>
      </view>
    </view>

    <view v-if="!loading && !recordList.length" class="card-block empty-card section-gap">
      <text class="empty-text">暂无转换记录</text>
    </view>

    <button v-if="hasMore" class="secondary-btn section-gap" :disabled="loading" @click="handleLoadMore">
      {{ loading ? '加载中...' : '加载更多' }}
    </button>

    <button v-if="recordList.length" class="secondary-btn section-gap" :disabled="loading" @click="handleRefresh">
      刷新列表
    </button>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import PageNav from '../../components/PageNav.vue'
import { getConversionResult } from '../../api/conversion'
import { getConversionRecords } from '../../api/records'
import { buildTargetFileName, getFormatLabel, normalizeConversionRecord } from '../../utils/conversion'
import { canOpenRemoteFile, downloadRemoteFileUrl, openRemoteFileUrl } from '../../utils/pdf'
import { requireLogin } from '../../utils/guard'

const recordList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pagination = reactive({
  page: 1,
  pageSize: 10
})
const actionLoadingMap = reactive({})

function getRecordsFromResponse(response = {}) {
  if (Array.isArray(response?.data?.list)) {
    return response.data.list
  }

  if (Array.isArray(response?.data?.records)) {
    return response.data.records
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

async function fetchRecords({ refresh = false } = {}) {
  if (!requireLogin() || loading.value) {
    return
  }

  loading.value = true

  if (refresh) {
    pagination.page = 1
    hasMore.value = true
  }

  try {
    const response = await getConversionRecords({
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    const records = getRecordsFromResponse(response).map((item) => normalizeConversionRecord(item))

    if (refresh) {
      recordList.value = records
    } else {
      recordList.value = [...recordList.value, ...records]
    }

    hasMore.value = records.length >= pagination.pageSize

    if (hasMore.value) {
      pagination.page += 1
    }
  } catch (error) {
    console.error('fetch records error', error)
  } finally {
    loading.value = false
  }
}

function updateRecordItem(recordId, nextRecord) {
  const index = recordList.value.findIndex((item) => item.id === recordId)

  if (index === -1) {
    return
  }

  recordList.value.splice(index, 1, normalizeConversionRecord({
    ...recordList.value[index],
    ...nextRecord
  }))
}

function getTargetLabel(item = {}) {
  return getFormatLabel(item.targetFormat)
}

function canOpenResult(item = {}) {
  return canOpenRemoteFile({
    url: item.resultUrl,
    fileName: item.targetFileName,
    fileType: item.targetFormat
  })
}

async function handleRefreshRecord(item) {
  if (!item?.id || actionLoadingMap[item.id]) {
    return
  }

  actionLoadingMap[item.id] = true

  try {
    const response = await getConversionResult(item.id, { showError: false })
    updateRecordItem(item.id, {
      _id: response?.data?.id || item.id,
      resultUrl: response?.data?.resultUrl || item.resultUrl,
      pdfUrl: response?.data?.pdfUrl || item.pdfUrl,
      pdfKey: response?.data?.pdfKey || item.pdfKey,
      downloadUrl: response?.data?.downloadUrl || item.downloadUrl,
      targetFileName: response?.data?.targetFileName || item.targetFileName,
      targetFormat: response?.data?.targetFormat || item.targetFormat,
      finishedAt: response?.data?.finishedAt || item.finishedAt,
      status: response?.data?.status || item.status
    })

    uni.showToast({
      title: '状态已刷新',
      icon: 'none'
    })
  } catch (error) {
    console.error('refresh record error', error)
    uni.showToast({
      title: '刷新状态失败',
      icon: 'none'
    })
  } finally {
    actionLoadingMap[item.id] = false
  }
}

async function handleOpenResult(item) {
  if (!canOpenResult(item) || actionLoadingMap[item.id]) {
    return
  }

  actionLoadingMap[item.id] = true

  try {
    await openRemoteFileUrl(item.resultUrl, {
      recordId: item.id,
      fileName: item.targetFileName,
      fileType: item.targetFormat,
      title: item.targetFileName || item.sourceFileName || '结果预览'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '打开结果文件失败',
      icon: 'none'
    })
  } finally {
    actionLoadingMap[item.id] = false
  }
}

async function handleDownloadResult(item) {
  if (!item?.resultUrl || actionLoadingMap[item.id]) {
    return
  }

  actionLoadingMap[item.id] = true

  try {
    const savedFilePath = await downloadRemoteFileUrl(
      item.resultUrl,
      item.targetFileName || buildTargetFileName(item.sourceFileName || '', item.targetFormat)
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
    actionLoadingMap[item.id] = false
  }
}

function handleLoadMore() {
  fetchRecords()
}

function handleRefresh() {
  fetchRecords({ refresh: true })
}

onShow(() => {
  fetchRecords({ refresh: true })
})

onPullDownRefresh(async () => {
  try {
    await fetchRecords({ refresh: true })
  } finally {
    uni.stopPullDownRefresh()
  }
})
</script>

<style scoped lang="scss">
.record-card {
  padding: 28rpx 24rpx;
}

.record-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  flex: 1;
  padding-right: 24rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  word-break: break-all;
}

.status {
  padding: 10rpx 18rpx;
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

.record-info {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
}

.record-error {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #dc2626;
  line-height: 1.6;
}

.record-actions {
  margin-top: 20rpx;
}

.action-btn {
  margin-top: 16rpx;
}

.empty-card {
  padding: 40rpx 28rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #6b7280;
}

button[disabled] {
  opacity: 0.6;
}
</style>
