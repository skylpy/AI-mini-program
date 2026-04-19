import { SUPPORTED_SOURCE_TYPES, formatFileSize, validateDocumentFile } from './conversion'

function normalizeSelectedFile(file = {}) {
  const validation = validateDocumentFile(file)

  if (!validation.valid) {
    throw new Error(validation.message)
  }

  return {
    name: file.name,
    size: Number(file.size) || 0,
    sizeText: formatFileSize(file.size),
    path: file.path || '',
    file: file.file || null,
    sourceType: validation.sourceType
  }
}

function chooseMiniProgramDocumentFile() {
  return new Promise((resolve, reject) => {
    uni.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: SUPPORTED_SOURCE_TYPES,
      success: ({ tempFiles = [] }) => {
        try {
          const selectedFile = normalizeSelectedFile(tempFiles[0] || {})
          resolve(selectedFile)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        if (error?.errMsg?.includes('cancel')) {
          reject(new Error('已取消选择文件'))
          return
        }

        reject(new Error('选择文件失败，请稍后重试'))
      }
    })
  })
}

function chooseH5DocumentFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = SUPPORTED_SOURCE_TYPES.map((type) => `.${type}`).join(',')

    input.onchange = () => {
      try {
        const file = input.files?.[0]

        if (!file) {
          reject(new Error('未选择文件'))
          return
        }

        resolve(
          normalizeSelectedFile({
            name: file.name,
            size: file.size,
            file
          })
        )
      } catch (error) {
        reject(error)
      }
    }

    input.onerror = () => {
      reject(new Error('读取本地文件失败'))
    }

    input.click()
  })
}

export function chooseDocumentFile() {
  // #ifdef MP-WEIXIN
  return chooseMiniProgramDocumentFile()
  // #endif

  // #ifdef H5
  return chooseH5DocumentFile()
  // #endif

  return Promise.reject(new Error('当前平台暂不支持文档选择'))
}
