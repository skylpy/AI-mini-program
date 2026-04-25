import { useUserStore } from '../stores/user'

const DEFAULT_BASE_URL = 'http://localhost:3000'
// const DEFAULT_BASE_URL = 'http://120.79.144.54:3001'
// const DEFAULT_BASE_URL = 'https://api.lin-aini.xyz'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '')
let shownConfigError = false

export const API_BASE_URL = BASE_URL

export function buildApiUrl(url = '') {
  return `${BASE_URL}${url}`
}

function isIpHost(hostname = '') {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')
}

function getMiniProgramConfigError() {
  if (!BASE_URL) {
    return '未配置 VITE_API_BASE_URL。微信小程序真机需要 HTTPS 合法域名接口。'
  }

  try {
    const parsed = new URL(BASE_URL)

    if (parsed.protocol !== 'https:') {
      return `当前接口地址为 ${BASE_URL}。微信小程序 iOS 真机只允许 HTTPS 请求地址。`
    }

    if (isIpHost(parsed.hostname)) {
      return `当前接口地址为 ${BASE_URL}。微信小程序真机不应直接使用 IP，请改为已备案并配置到微信后台的 HTTPS 域名。`
    }
  } catch (error) {
    return `当前接口地址 ${BASE_URL} 无效，请检查 VITE_API_BASE_URL 配置。`
  }

  return ''
}

function ensureMiniProgramNetworkConfig() {
  // #ifndef MP-WEIXIN
  return true
  // #endif

  // #ifdef MP-WEIXIN
  const configError = getMiniProgramConfigError()

  return true	
  if (!configError) {
    return true
  }

  if (!shownConfigError) {
    shownConfigError = true
    console.error('[request] invalid mp-weixin network config:', configError)
    uni.showModal({
      title: '接口权限配置错误',
      content: `${configError}\n\n还需要在微信公众平台配置 request 合法域名。`,
      showCancel: false
    })
  }

  return false
  // #endif
}

function showToast(title) {
  uni.showToast({
    title,
    icon: 'none'
  })
}

function getRequestFailMessage(error) {
  const errMsg = error?.errMsg || ''

  if (/url not in domain list/i.test(errMsg)) {
    return '当前接口域名未配置到微信 request 合法域名'
  }

  if (/ssl|certificate/i.test(errMsg)) {
    return '当前接口 HTTPS 证书异常，请检查证书链与域名配置'
  }

  if (/invalid url/i.test(errMsg)) {
    return '当前接口地址无效，请检查 VITE_API_BASE_URL'
  }

  if (/timeout/i.test(errMsg)) {
    return '接口请求超时，请检查服务状态'
  }

  return '网络异常，请检查服务是否启动'
}

function handleUnauthorized(message = '登录已过期，请重新登录') {
  const userStore = useUserStore()
  userStore.clearLogin()
  showToast(message)

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]

  if (currentPage?.route !== 'pages/login/index') {
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }, 200)
  }
}

export default function request(options = {}) {
  const {
    url = '',
    method = 'GET',
    data = {},
    header = {},
    // 某些页面允许静默失败后回退本地 mock 数据。
    showError = true
  } = options

  const userStore = useUserStore()
  const token = userStore.state.token

  return new Promise((resolve, reject) => {
    if (!ensureMiniProgramNetworkConfig()) {
      reject({
        code: 'INVALID_MP_WEIXIN_NETWORK_CONFIG',
        message: getMiniProgramConfigError()
      })
      return
    }

    uni.request({
      url: buildApiUrl(url),
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header
      },
      success: (response) => {
        const { statusCode, data: responseData } = response

        if (statusCode === 401 || responseData?.code === 401) {
          handleUnauthorized(responseData?.message)
          reject(responseData)
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          if (typeof responseData?.code === 'undefined' || responseData?.code === 0) {
            resolve(responseData)
            return
          }

          if (showError) {
            showToast(responseData?.message || '请求失败')
          }
          reject(responseData)
          return
        }

        if (showError) {
          showToast(responseData?.message || '服务异常，请稍后重试')
        }
        reject(responseData)
      },
      fail: (error) => {
        if (showError) {
          showToast(getRequestFailMessage(error))
        }
        reject(error)
      }
    })
  })
}
