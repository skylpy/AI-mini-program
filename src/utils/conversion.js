const CONVERSION_GROUPS = [
  {
    sources: ['doc', 'docx', 'odt', 'rtf', 'txt', 'html', 'htm'],
    targets: ['pdf', 'docx', 'odt', 'html', 'txt']
  },
  {
    sources: ['xls', 'xlsx', 'ods', 'csv'],
    targets: ['pdf', 'xlsx', 'csv', 'html']
  },
  {
    sources: ['ppt', 'pptx', 'odp'],
    targets: ['pdf', 'pptx']
  },
  {
    sources: ['pdf'],
    targets: ['txt', 'docx']
  }
]

const FORMAT_LABEL_MAP = {
  pdf: 'PDF',
  doc: 'DOC',
  docx: 'DOCX',
  odt: 'ODT',
  rtf: 'RTF',
  txt: 'TXT',
  html: 'HTML',
  htm: 'HTM',
  xls: 'XLS',
  xlsx: 'XLSX',
  ods: 'ODS',
  csv: 'CSV',
  ppt: 'PPT',
  pptx: 'PPTX',
  odp: 'ODP'
}

const SUPPORTED_SOURCE_TYPES = [...new Set(CONVERSION_GROUPS.flatMap((item) => item.sources))]

const STATUS_META_MAP = {
  pending: {
    text: '排队中',
    className: 'status-pending'
  },
  processing: {
    text: '转换中',
    className: 'status-pending'
  },
  success: {
    text: '已完成',
    className: 'status-success'
  },
  failed: {
    text: '已失败',
    className: 'status-error'
  },
  error: {
    text: '已失败',
    className: 'status-error'
  }
}

export { SUPPORTED_SOURCE_TYPES }

function findConversionGroup(sourceType = '') {
  return CONVERSION_GROUPS.find((item) => item.sources.includes(String(sourceType || '').toLowerCase()))
}

export function getFileExtension(fileName = '') {
  const normalizedName = String(fileName || '').trim()
  const lastDotIndex = normalizedName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return ''
  }

  return normalizedName.slice(lastDotIndex + 1).toLowerCase()
}

export function getFileBaseName(fileName = '') {
  const normalizedName = String(fileName || '').trim()
  const lastDotIndex = normalizedName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return normalizedName
  }

  return normalizedName.slice(0, lastDotIndex)
}

export function isSupportedSourceType(sourceType = '') {
  return SUPPORTED_SOURCE_TYPES.includes(String(sourceType || '').toLowerCase())
}

export function getAllowedTargetFormats(sourceType = '') {
  const group = findConversionGroup(sourceType)
  return group ? group.targets.filter((target) => target !== String(sourceType || '').toLowerCase()) : []
}

export function getFormatLabel(format = '') {
  const normalizedFormat = String(format || '').toLowerCase()
  return FORMAT_LABEL_MAP[normalizedFormat] || normalizedFormat.toUpperCase()
}

export function validateDocumentFile(file = {}) {
  const fileName = file.name || ''
  const sourceType = getFileExtension(fileName)

  if (!fileName) {
    return {
      valid: false,
      message: '请选择需要转换的文档',
      sourceType: ''
    }
  }

  if (!isSupportedSourceType(sourceType)) {
    return {
      valid: false,
      message: `仅支持 ${SUPPORTED_SOURCE_TYPES.join('、')} 文件`,
      sourceType
    }
  }

  return {
    valid: true,
    message: '',
    sourceType
  }
}

export function formatFileSize(size = 0) {
  const numericSize = Number(size) || 0

  if (numericSize < 1024) {
    return `${numericSize} B`
  }

  if (numericSize < 1024 * 1024) {
    return `${(numericSize / 1024).toFixed(1)} KB`
  }

  if (numericSize < 1024 * 1024 * 1024) {
    return `${(numericSize / 1024 / 1024).toFixed(1)} MB`
  }

  return `${(numericSize / 1024 / 1024 / 1024).toFixed(1)} GB`
}

export function joinUrl(baseUrl = '', path = '') {
  const normalizedBase = String(baseUrl || '').replace(/\/+$/, '')
  const normalizedPath = String(path || '').replace(/^\/+/, '')

  if (!normalizedBase) {
    return normalizedPath
  }

  if (!normalizedPath) {
    return normalizedBase
  }

  return `${normalizedBase}/${normalizedPath}`
}

function normalizeDirectory(dir = 'source') {
  return String(dir || 'source').replace(/^\/+|\/+$/g, '') || 'source'
}

export function buildOssSourceKey(fileName = '', dir = 'source') {
  const sourceType = getFileExtension(fileName)
  const baseName = getFileBaseName(fileName).replace(/\s+/g, ' ').trim() || 'document'
  const safeName = encodeURIComponent(baseName).replace(/%/g, '_')
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`

  return `${normalizeDirectory(dir)}/${uniqueSuffix}-${safeName}.${sourceType}`
}

export function buildPdfFileName(fileName = '') {
  const baseName = getFileBaseName(fileName).replace(/\s+/g, ' ').trim() || 'converted'
  return `${baseName}.pdf`
}

export function buildTargetFileName(fileName = '', targetFormat = '') {
  const baseName = getFileBaseName(fileName).replace(/\s+/g, ' ').trim() || 'converted'
  const normalizedTargetFormat = String(targetFormat || '').trim().toLowerCase()
  return normalizedTargetFormat ? `${baseName}.${normalizedTargetFormat}` : baseName
}

export function formatDateTime(value = '') {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function getStatusMeta(status = '') {
  const normalizedStatus = String(status || '').toLowerCase()

  return (
    STATUS_META_MAP[normalizedStatus] || {
      text: normalizedStatus || '未知状态',
      className: 'status-pending'
    }
  )
}

export function normalizeConversionRecord(record = {}) {
  const statusMeta = getStatusMeta(record.status)

  return {
    id: record._id || record.id || '',
    sourceFileName: record.sourceFileName || record.fileName || '未命名文件',
    sourceUrl: record.sourceUrl || '',
    sourceKey: record.sourceKey || '',
    targetFileName: record.targetFileName || '',
    pdfUrl: record.pdfUrl || '',
    pdfKey: record.pdfKey || '',
    downloadUrl: record.downloadUrl || '',
    resultUrl: record.pdfUrl || record.downloadUrl || '',
    targetFormat: record.targetFormat || record.targetType || 'pdf',
    status: record.status || '',
    statusText: statusMeta.text,
    statusClassName: statusMeta.className,
    finishedAt: record.finishedAt || '',
    finishedAtText: formatDateTime(record.finishedAt),
    errorMsg: record.errorMsg || '',
    taskType: record.taskType || '',
    toolType: record.toolType || '',
    sourceType: getFileExtension(record.sourceFileName || record.fileName || '')
  }
}
