import { getOssUploadSettings } from '../api/oss'
import { buildOssSourceKey, joinUrl } from './conversion'
import { hasValidUploadFilePath, normalizeUploadFile } from './upload-file'

function getEnvironmentUploadConfig() {
  return {
    bucket: import.meta.env.VITE_OSS_BUCKET,
    region: import.meta.env.VITE_OSS_REGION,
    dir: import.meta.env.VITE_OSS_DIR,
    uploadHost: import.meta.env.VITE_OSS_UPLOAD_HOST,
    publicBaseUrl: import.meta.env.VITE_OSS_PUBLIC_BASE_URL,
    accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID,
    policy: import.meta.env.VITE_OSS_POLICY,
    signature: import.meta.env.VITE_OSS_SIGNATURE,
    securityToken: import.meta.env.VITE_OSS_SECURITY_TOKEN,
    callback: import.meta.env.VITE_OSS_CALLBACK
  }
}

function pickFirstValue(...values) {
  return values.find((value) => value !== '' && value !== null && typeof value !== 'undefined') || ''
}

function compactConfig(config = {}) {
  return Object.fromEntries(
    Object.entries(config).filter(([, value]) => value !== '' && value !== null && typeof value !== 'undefined')
  )
}

function normalizeUploadConfig(config = {}) {
  const nestedConfig = {
    ...(config.oss || {}),
    ...(config.ossConfig || {}),
    ...(config.upload || {}),
    ...(config.sts || {}),
    ...(config.formData || {}),
    ...(config.fields || {}),
    ...(config.credentials || {})
  }

  const mergedConfig = {
    ...config,
    ...nestedConfig
  }

  const uploadHost =
    pickFirstValue(mergedConfig.uploadHost, mergedConfig.host, mergedConfig.endpoint) ||
    (mergedConfig.bucket && mergedConfig.region ? `https://${mergedConfig.bucket}.oss-${mergedConfig.region}.aliyuncs.com` : '')

  const publicBaseUrl =
    pickFirstValue(mergedConfig.publicBaseUrl, mergedConfig.baseUrl, mergedConfig.cdnUrl, uploadHost).replace(/\/+$/, '')

  return {
    bucket: pickFirstValue(mergedConfig.bucket),
    region: pickFirstValue(mergedConfig.region),
    dir: pickFirstValue(mergedConfig.dir, mergedConfig.sourceDir, 'source'),
    uploadHost: uploadHost.replace(/\/+$/, ''),
    publicBaseUrl,
    accessKeyId: pickFirstValue(
      mergedConfig.accessKeyId,
      mergedConfig.AccessKeyId,
      mergedConfig.accessid,
      mergedConfig.OSSAccessKeyId
    ),
    policy: pickFirstValue(mergedConfig.policy, mergedConfig.Policy),
    signature: pickFirstValue(mergedConfig.signature, mergedConfig.Signature),
    securityToken: pickFirstValue(
      mergedConfig.securityToken,
      mergedConfig.SecurityToken,
      mergedConfig['x-oss-security-token']
    ),
    callback: pickFirstValue(mergedConfig.callback, mergedConfig.Callback)
  }
}

function assertUploadConfig(config = {}) {
  const missingFields = []

  if (!config.uploadHost) {
    missingFields.push('uploadHost')
  }

  if (!config.accessKeyId) {
    missingFields.push('accessKeyId')
  }

  if (!config.policy) {
    missingFields.push('policy')
  }

  if (!config.signature) {
    missingFields.push('signature')
  }

  if (missingFields.length) {
    throw new Error(`当前 OSS 上传配置缺少 ${missingFields.join('、')}`)
  }
}

export async function getOssUploadConfig() {
  let remoteConfig = {}

  try {
    const response = await getOssUploadSettings({ showError: false })
    remoteConfig = response?.data || {}
  } catch (error) {
    remoteConfig = {}
  }

  return normalizeUploadConfig({
    ...remoteConfig,
    ...compactConfig(getEnvironmentUploadConfig())
  })
}

function createUploadFormData(config = {}, key = '') {
  const formData = {
    key,
    OSSAccessKeyId: config.accessKeyId,
    policy: config.policy,
    signature: config.signature,
    success_action_status: '200'
  }

  if (config.securityToken) {
    formData['x-oss-security-token'] = config.securityToken
  }

  if (config.callback) {
    formData.callback = config.callback
  }

  return formData
}

function uploadFileByMiniProgram(uploadUrl, fileInfo, formData) {
  const normalizedFileInfo = normalizeUploadFile(fileInfo, fileInfo?.name || 'file')

  if (!hasValidUploadFilePath(normalizedFileInfo)) {
    console.error('文件路径不存在，当前文件对象：', fileInfo)
    throw new Error('文件路径不存在，请重新选择文件')
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadUrl,
      filePath: normalizedFileInfo.filePath,
      name: 'file',
      formData,
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response)
          return
        }

        reject(new Error('上传源文件到 OSS 失败'))
      },
      fail: (error) => {
        reject(new Error(error?.errMsg || '上传源文件到 OSS 失败'))
      }
    })
  })
}

async function uploadFileByH5(uploadUrl, fileInfo, formData) {
  const normalizedFileInfo = normalizeUploadFile(fileInfo, fileInfo?.name || 'file')
  const payload = new FormData()

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== '' && value !== null && typeof value !== 'undefined') {
      payload.append(key, value)
    }
  })

  payload.append('file', normalizedFileInfo.file, normalizedFileInfo.name)

  const requestUrl = import.meta.env.DEV ? '/__oss_upload' : uploadUrl

  const response = await fetch(requestUrl, {
    method: 'POST',
    body: payload
  })

  if (!response.ok) {
    throw new Error('上传源文件到 OSS 失败')
  }

  return response
}

export async function uploadDocumentToOss(fileInfo, options = {}) {
  const normalizedFileInfo = normalizeUploadFile(fileInfo, fileInfo?.name || 'file')
  const config = options.config || (await getOssUploadConfig())
  assertUploadConfig(config)

  const sourceKey = options.sourceKey || buildOssSourceKey(normalizedFileInfo.name, config.dir)
  const formData = createUploadFormData(config, sourceKey)

  // #ifdef MP-WEIXIN
  await uploadFileByMiniProgram(config.uploadHost, normalizedFileInfo, formData)
  // #endif

  // #ifdef H5
  await uploadFileByH5(config.uploadHost, normalizedFileInfo, formData)
  // #endif

  return {
    sourceKey,
    sourceUrl: joinUrl(config.publicBaseUrl || config.uploadHost, sourceKey)
  }
}
