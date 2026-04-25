<template>
  <view class="page-container">
    <PageNav title="我的下载" />
    <view class="page-head">
      <text class="page-title">我的下载</text>
      <text class="page-subtitle">显示您已下载的文档，点击即可再次打开</text>
    </view>

    <view v-if="loading && !downloadList.length" class="card-block history-card section-gap">
      <text class="history-title">正在加载下载记录...</text>
    </view>

    <view
      v-for="item in downloadList"
      :key="item.id"
      class="card-block history-card section-gap"
      @click="handleOpen(item)"
    >
      <view class="history-head">
        <text class="history-title">{{ item.fileName }}</text>
        <text class="history-type">{{ item.fileTypeLabel }}</text>
      </view>
      <text class="history-info">来源：{{ item.sourceName || item.sourcePageLabel }}</text>
      <text class="history-info">下载次数：{{ item.downloadCount }}</text>
      <text class="history-time">最近下载：{{ item.lastDownloadedAtText }}</text>
    </view>

    <view v-if="!loading && !downloadList.length" class="card-block history-card section-gap">
      <text class="history-title">暂无下载记录</text>
      <text class="history-time">下载成功后的文档会显示在这里</text>
    </view>

    <button v-if="hasMore" class="secondary-btn section-gap" :disabled="loading" @click="handleLoadMore">
      {{ loading ? '加载中...' : '加载更多' }}
    </button>

    <button v-if="downloadList.length" class="secondary-btn section-gap" :disabled="loading" @click="handleRefresh">
      刷新列表
    </button>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getDownloadHistory } from '../../api/download-history'
import PageNav from '../../components/PageNav.vue'
import { formatDateTime, getFormatLabel } from '../../utils/conversion'
import { openRemoteFileUrl } from '../../utils/pdf'
import { requireLogin } from '../../utils/guard'

const downloadList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const pagination = reactive({
  page: 1,
  pageSize: 10
})

function getDownloadListFromResponse(response = {}) {
  if (Array.isArray(response?.data?.list)) {
    return response.data.list
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  return []
}

function getSourcePageLabel(sourcePage = '') {
  const labelMap = {
    records: '转换记录',
    'doc-to-pdf': '文档格式转换'
  }

  return labelMap[sourcePage] || sourcePage || '我的下载'
}

function normalizeDownloadItem(item = {}) {
  return {
    id: item._id || item.id || '',
    recordId: item.recordId || '',
    fileName: item.fileName || '未命名文件',
    fileUrl: item.fileUrl || '',
    fileType: item.fileType || '',
    fileTypeLabel: getFormatLabel(item.fileType || 'file'),
    sourceName: item.sourceName || '',
    sourcePage: item.sourcePage || '',
    sourcePageLabel: getSourcePageLabel(item.sourcePage),
    downloadCount: Number(item.downloadCount) || 0,
    lastDownloadedAt: item.lastDownloadedAt || item.updatedAt || item.createdAt || '',
    lastDownloadedAtText: formatDateTime(item.lastDownloadedAt || item.updatedAt || item.createdAt)
  }
}

async function fetchDownloads({ refresh = false } = {}) {
  if (!requireLogin() || loading.value) {
    return
  }

  loading.value = true

  if (refresh) {
    pagination.page = 1
    hasMore.value = true
  }

  try {
    const response = await getDownloadHistory({
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    const list = getDownloadListFromResponse(response).map((item) => normalizeDownloadItem(item))

    if (refresh) {
      downloadList.value = list
    } else {
      downloadList.value = [...downloadList.value, ...list]
    }

    hasMore.value = list.length >= pagination.pageSize

    if (hasMore.value) {
      pagination.page += 1
    }
  } catch (error) {
    console.error('fetch download history error', error)
  } finally {
    loading.value = false
  }
}

async function handleOpen(item) {
  if (!item?.fileUrl) {
    uni.showToast({
      title: '文件地址不存在',
      icon: 'none'
    })
    return
  }

  try {
    await openRemoteFileUrl(item.fileUrl, {
      recordId: item.recordId,
      fileName: item.fileName,
      fileType: item.fileType,
      title: item.fileName
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '打开文件失败',
      icon: 'none'
    })
  }
}

function handleLoadMore() {
  fetchDownloads()
}

function handleRefresh() {
  fetchDownloads({ refresh: true })
}

onShow(() => {
  fetchDownloads({ refresh: true })
})

onPullDownRefresh(async () => {
  await fetchDownloads({ refresh: true })
  uni.stopPullDownRefresh()
})
</script>

<style scoped lang="scss">
.history-card {
  padding: 28rpx 24rpx;
}

.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.history-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.history-type {
  flex-shrink: 0;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #edf4ff;
  color: #2563eb;
  font-size: 20rpx;
  font-weight: 600;
}

.history-info {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.history-time {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
