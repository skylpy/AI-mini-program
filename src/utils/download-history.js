import { createDownloadHistory } from '../api/download-history'
import { useUserStore } from '../stores/user'

function getFileExtension(value = '') {
  const normalizedValue = String(value || '').trim().split('?')[0].split('#')[0]
  const fileName = normalizedValue.split('/').pop() || ''
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return ''
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase()
}

export async function trackDownloadHistory(payload = {}) {
  const userStore = useUserStore()

  if (!userStore.isLoggedIn()) {
    return null
  }

  const fileName = String(payload.fileName || '').trim()
  const fileUrl = String(payload.fileUrl || '').trim()

  if (!fileName || !fileUrl) {
    return null
  }

  try {
    const response = await createDownloadHistory({
      recordId: payload.recordId || '',
      fileName,
      fileUrl,
      fileType: String(payload.fileType || '').trim().toLowerCase() || getFileExtension(fileName) || getFileExtension(fileUrl),
      sourceType: String(payload.sourceType || '').trim().toLowerCase(),
      sourcePage: String(payload.sourcePage || '').trim(),
      sourceName: String(payload.sourceName || '').trim()
    }, {
      showError: false
    })

    return response?.data || null
  } catch (error) {
    console.error('track download history error', error)
    return null
  }
}
