import request, { buildApiUrl } from '../utils/request'
import { useUserStore } from '../stores/user'
import { buildOssSourceKey } from '../utils/conversion'
import { uploadDocumentToOss } from '../utils/oss-upload'
import { hasValidUploadFilePath, normalizeUploadFile } from '../utils/upload-file'

export function createConversionByUrl(data, options = {}) {
  return request({
    url: '/api/conversions/create-by-url',
    method: 'POST',
    data,
    ...options
  })
}

export const createPdfConversionByUrl = createConversionByUrl

export async function createConversionByFile(fileInfo, data = {}, options = {}) {
  const userStore = useUserStore()
  const token = userStore.state.token
  const normalizedFileInfo = normalizeUploadFile(fileInfo, fileInfo?.name || 'file')

  // #ifdef H5
  const formData = new FormData()

  if (normalizedFileInfo?.file) {
    formData.append('file', normalizedFileInfo.file, normalizedFileInfo.name)
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== '' && value !== null && typeof value !== 'undefined') {
      formData.append(key, value)
    }
  })

  const response = await fetch(buildApiUrl('/api/conversions'), {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.header || {})
    },
    body: formData
  })

  const responseData = await response
    .json()
    .catch(() => ({ message: response.ok ? '' : '上传并转换失败' }))

  if (response.ok && (typeof responseData?.code === 'undefined' || responseData.code === 0)) {
    return responseData
  }

  throw new Error(responseData?.message || '上传并转换失败')
  // #endif

  // #ifdef MP-WEIXIN
  if (!hasValidUploadFilePath(normalizedFileInfo)) {
    console.error('文件路径不存在，当前文件对象：', fileInfo)
    throw new Error('文件路径不存在，请重新选择文件')
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: buildApiUrl('/api/conversions'),
      filePath: normalizedFileInfo.filePath,
      name: 'file',
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      formData: Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '' && value !== null && typeof value !== 'undefined')
      ),
      success: (response) => {
        let responseData = {}

        try {
          responseData = JSON.parse(response.data || '{}')
        } catch (error) {
          responseData = {}
        }

        if (
          response.statusCode >= 200 &&
          response.statusCode < 300 &&
          (typeof responseData?.code === 'undefined' || responseData.code === 0)
        ) {
          resolve(responseData)
          return
        }

        reject(new Error(responseData?.message || '上传并转换失败'))
      },
      fail: (error) => {
        reject(new Error(error?.errMsg || '上传并转换失败'))
      }
    })
  })
  // #endif
}

export function getConversionPdfUrl(id, options = {}) {
  return request({
    url: `/api/conversions/${id}/pdf-url`,
    method: 'GET',
    ...options
  })
}

export function getConversionResult(id, options = {}) {
  return request({
    url: `/api/conversions/${id}/result`,
    method: 'GET',
    ...options
  })
}

export function getConversionPreview(id, options = {}) {
  return request({
    url: `/api/conversions/${id}/preview`,
    method: 'GET',
    ...options
  })
}

export function createImageToPdf(data = {}, options = {}) {
  const { images = [], title = '' } = data
  const userStore = useUserStore()
  const token = userStore.state.token || uni.getStorageSync('token') || ''

  // #ifdef MP-WEIXIN
  if (!images.length) {
    return Promise.reject(new Error('请先选择图片'))
  }

  const normalizedImages = images.map((item, index) => ({
    item,
    image: normalizeUploadFile(item, `image-${index + 1}`)
  }))
  const invalidImage = normalizedImages.find(({ image }) => !hasValidUploadFilePath(image))

  if (invalidImage) {
    console.error('图片路径不存在，当前图片对象：', invalidImage.item)
    return Promise.reject(new Error('图片路径不存在，请重新选择图片'))
  }

  return Promise.all(
    normalizedImages.map(async ({ image }, index) => {
      const uploadResult = await uploadDocumentToOss(image, {
        sourceKey: buildOssSourceKey(image.name || `image-${index + 1}.jpg`, 'source/image-to-pdf')
      })

      return {
        name: image.name || `image-${index + 1}.jpg`,
        size: Number(image.size) || 0,
        mimeType: image.type || image.mimeType || '',
        url: uploadResult.sourceUrl,
        key: uploadResult.sourceKey
      }
    })
  ).then((uploadedImages) =>
    request({
      url: '/api/conversions/image-to-pdf',
      method: 'POST',
      data: {
        title,
        imageSources: uploadedImages
      },
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      ...options
    })
  )
  // #endif

  // #ifdef H5
  const formData = new FormData()

  images.forEach((item, index) => {
    const normalizedImage = normalizeUploadFile(item, `image-${index + 1}`)

    if (normalizedImage.file) {
      formData.append('images', normalizedImage.file, normalizedImage.name)
    }
  })

  if (title) {
    formData.append('title', title)
  }

  return fetch(buildApiUrl('/api/conversions/image-to-pdf'), {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.header || {})
    },
    body: formData
  }).then(async (response) => {
    const responseData = await response.json().catch(() => ({}))

    if (response.ok && (typeof responseData?.code === 'undefined' || responseData.code === 0)) {
      return responseData
    }

    throw new Error(responseData?.message || 'PDF 生成失败')
  })
  // #endif
}
