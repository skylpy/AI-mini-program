import request, { buildApiUrl } from '../utils/request'
import { useUserStore } from '../stores/user'

export function getOssUploadSettings(options = {}) {
  const querySuffix = `t=${Date.now()}`

  return request({
    url: `/api/conversions/oss-sts?${querySuffix}`,
    method: 'GET',
    header: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...(options.header || {})
    },
    ...options
  })
}

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

  // #ifdef H5
  const formData = new FormData()

  if (fileInfo?.file) {
    formData.append('file', fileInfo.file, fileInfo.name)
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
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: buildApiUrl('/api/conversions'),
      filePath: fileInfo.path,
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
