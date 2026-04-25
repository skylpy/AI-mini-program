import { useUserStore } from '../stores/user'
import { API_BASE_URL } from './request'

const OPEN_DOCUMENT_FILE_TYPES = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'])
const WEB_VIEW_FILE_TYPES = new Set(['html', 'htm', 'txt', 'csv'])

function getFileExtension(value = '') {
  const rawValue = String(value || '').trim()

  if (!rawValue) {
    return ''
  }

  const normalizedValue = rawValue.split('?')[0].split('#')[0]
  const lastSlashIndex = normalizedValue.lastIndexOf('/')
  const fileName = lastSlashIndex === -1 ? normalizedValue : normalizedValue.slice(lastSlashIndex + 1)
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return ''
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase()
}

function resolveFileType(url = '', fileName = '', fileType = '') {
  const explicitType = String(fileType || '').trim().toLowerCase()

  if (explicitType) {
    return explicitType
  }

  return getFileExtension(fileName) || getFileExtension(url)
}

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

function openDocument(filePath, fileType = '') {
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath,
      ...(fileType ? { fileType } : {}),
      showMenu: true,
      success: resolve,
      fail: (error) => reject(new Error(error?.errMsg || '打开文件失败'))
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

function canOpenByDocument(fileType = '') {
  return OPEN_DOCUMENT_FILE_TYPES.has(String(fileType || '').toLowerCase())
}

function canOpenByWebView(fileType = '') {
  return WEB_VIEW_FILE_TYPES.has(String(fileType || '').toLowerCase())
}

export function canOpenRemoteFile({ url = '', fileName = '', fileType = '' } = {}) {
  if (!url) {
    return false
  }

  const resolvedType = resolveFileType(url, fileName, fileType)
  return canOpenByDocument(resolvedType) || canOpenByWebView(resolvedType)
}

function navigateToFilePreview(url, title = '文件预览') {
  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url,
      success: resolve,
      fail: (error) => reject(new Error(error?.errMsg || '打开预览页失败'))
    })
  })
}

export async function openRemoteFileUrl(url, options = {}) {
  if (!url) {
    throw new Error('结果文件地址不存在')
  }

  const { fileName = '', fileType = '', title = '', recordId = '' } = options
  const resolvedFileType = resolveFileType(url, fileName, fileType)
  const previewTitle = title || fileName || '文件预览'

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

  if (canOpenByWebView(resolvedFileType)) {
    if (!recordId) {
      throw new Error('缺少预览记录标识')
    }

    await navigateToFilePreview(
      `/pages/file-preview/index?id=${encodeURIComponent(recordId)}&title=${encodeURIComponent(previewTitle)}`
    )
    return
  }

  if (!canOpenByDocument(resolvedFileType)) {
    throw new Error('当前文件类型暂不支持直接打开，请先下载后查看')
  }

  const tempFilePath = await downloadRemoteFile(url)
  await openDocument(tempFilePath, resolvedFileType)
}

export async function downloadRemoteFileUrl(url, fileName = 'converted.file') {
  if (!url) {
    throw new Error('结果文件地址不存在')
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

export async function openPdfUrl(url, options = {}) {
  return openRemoteFileUrl(url, {
    ...options,
    fileType: options.fileType || 'pdf'
  })
}

export async function downloadPdfUrl(url, fileName = 'converted.pdf') {
  return downloadRemoteFileUrl(url, fileName)
}
