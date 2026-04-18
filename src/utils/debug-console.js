const STORAGE_KEY = 'debugLogs'
const EVENT_NAME = 'debug-log-updated'
const MAX_LOGS = 200

let installed = false
let writing = false
let logs = []

const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
}

function formatTime(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function ensureLogsLoaded() {
  if (typeof uni === 'undefined') {
    return
  }

  if (logs.length) {
    return
  }

  try {
    const cachedLogs = uni.getStorageSync(STORAGE_KEY)
    if (Array.isArray(cachedLogs)) {
      logs = cachedLogs
    }
  } catch (error) {
    originalConsole.warn('load debug logs failed', error)
  }
}

function persistLogs() {
  if (typeof uni === 'undefined') {
    return
  }

  try {
    uni.setStorageSync(STORAGE_KEY, logs)
  } catch (error) {
    originalConsole.warn('persist debug logs failed', error)
  }
}

function emitLogsUpdated() {
  if (typeof uni !== 'undefined' && typeof uni.$emit === 'function') {
    uni.$emit(EVENT_NAME, getDebugLogs())
  }
}

function stringifyValue(value, depth = 0) {
  if (depth > 2) {
    return '[Object]'
  }

  if (value instanceof Error) {
    return value.stack || `${value.name}: ${value.message}`
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null || typeof value === 'undefined') {
    return String(value)
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyValue(item, depth + 1)).join(', ')}]`
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      const plainObject = {}
      Object.keys(value).slice(0, 12).forEach((key) => {
        plainObject[key] = stringifyValue(value[key], depth + 1)
      })
      return JSON.stringify(plainObject)
    }
  }

  return String(value)
}

function appendLog(level, args = []) {
  if (writing) {
    return
  }

  writing = true

  try {
    ensureLogsLoaded()

    const nextLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      level,
      time: formatTime(),
      message: args.map((item) => stringifyValue(item)).join(' ')
    }

    logs = [...logs, nextLog].slice(-MAX_LOGS)
    persistLogs()
    emitLogsUpdated()
  } finally {
    writing = false
  }
}

export function initDebugConsole(options = {}) {
  const { enabled = true } = options

  if (installed || !enabled) {
    return
  }

  installed = true
  ensureLogsLoaded()

  ;['log', 'info', 'warn', 'error', 'debug'].forEach((level) => {
    const nativeMethod = originalConsole[level] || originalConsole.log

    console[level] = (...args) => {
      appendLog(level, args)
      nativeMethod.apply(console, args)
    }
  })
}

export function getDebugLogs() {
  ensureLogsLoaded()
  return [...logs].reverse()
}

export function clearDebugLogs() {
  logs = []
  persistLogs()
  emitLogsUpdated()
}

export function getDebugLogEventName() {
  return EVENT_NAME
}
