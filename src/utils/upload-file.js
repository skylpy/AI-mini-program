function pickFirstNonEmptyString(...values) {
  return (
    values.find((value) => typeof value === 'string' && value.trim()) || ''
  )
}

export function resolveUploadFilePath(item = {}) {
  return pickFirstNonEmptyString(item.filePath, item.path, item.tempFilePath, item.url)
}

export function resolveUploadFileName(item = {}, fallbackName = 'file') {
  const directName = pickFirstNonEmptyString(item.name)

  if (directName) {
    return directName
  }

  const filePath = resolveUploadFilePath(item)
  const pathName = filePath.split('?')[0].split('/').pop()

  return pathName || fallbackName
}

export function normalizeUploadFile(item = {}, fallbackName = 'file') {
  const filePath = resolveUploadFilePath(item)

  return {
    ...item,
    filePath,
    path: pickFirstNonEmptyString(item.path, filePath),
    tempFilePath: pickFirstNonEmptyString(item.tempFilePath, filePath),
    url: pickFirstNonEmptyString(item.url, filePath),
    name: resolveUploadFileName(item, fallbackName),
    size: Number(item.size) || 0,
    file: item.file || null
  }
}

export function hasValidUploadFilePath(item = {}) {
  return typeof item.filePath === 'string' && !!item.filePath.trim()
}
