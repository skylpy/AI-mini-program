import { useUserStore } from '../stores/user'
import { API_BASE_URL } from './request'

function downloadRemoteFile(url) {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore()
    const token = userStore.state.token

    uni.downloadFile({
      url,
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.tempFilePath)
          return
        }

        reject(new Error('下载文件失败'))
      },
      fail: (error) => {
        reject(new Error(error?.errMsg || '下载文件失败'))
      }
    })
  })
}

function openDocument(filePath) {
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath,
      fileType: 'pdf',
      showMenu: true,
      success: resolve,
      fail: (error) => reject(new Error(error?.errMsg || '打开 PDF 失败'))
    })
  })
}

function saveLocalFile(tempFilePath) {
  return new Promise((resolve, reject) => {
    uni.saveFile({
      tempFilePath,
      success: (response) => resolve(response.savedFilePath),
      fail: (error) => reject(new Error(error?.errMsg || '保存文件失败'))
    })
  })
}

function isProtectedApiFileUrl(url = '') {
  const normalizedUrl = String(url || '').trim()

  if (!normalizedUrl) {
    return false
  }

  if (normalizedUrl.startsWith('/api/')) {
    return true
  }

  return API_BASE_URL ? normalizedUrl.startsWith(`${API_BASE_URL}/`) : false
}

async function fetchProtectedFileBlob(url) {
  const userStore = useUserStore()
  const token = userStore.state.token
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!response.ok) {
    throw new Error('下载文件失败')
  }

  return response.blob()
}

async function createProtectedFileBlobUrl(url) {
  const blob = await fetchProtectedFileBlob(url)
  return URL.createObjectURL(blob)
}

export async function openPdfUrl(url) {
  if (!url) {
    throw new Error('PDF 地址不存在')
  }

  // #ifdef H5
  if (isProtectedApiFileUrl(url)) {
    const blobUrl = await createProtectedFileBlobUrl(url)
    window.open(blobUrl, '_blank', 'noopener')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000)
    return
  }

  window.open(url, '_blank', 'noopener')
  return
  // #endif

  const tempFilePath = await downloadRemoteFile(url)
  await openDocument(tempFilePath)
}

export async function downloadPdfUrl(url, fileName = 'converted.pdf') {
  if (!url) {
    throw new Error('PDF 地址不存在')
  }

  // #ifdef H5
  if (isProtectedApiFileUrl(url)) {
    const blobUrl = await createProtectedFileBlobUrl(url)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000)
    return blobUrl
  }

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.target = '_blank'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return url
  // #endif

  const tempFilePath = await downloadRemoteFile(url)
  return saveLocalFile(tempFilePath)
}
