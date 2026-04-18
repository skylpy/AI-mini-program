import { useUserStore } from '../stores/user'

const BASE_URL = 'http://120.79.144.54:3001'
// const BASE_URL = 'http://localhost:3000'
// http://lin-aini.xyz/api/health

function showToast(title) {
  uni.showToast({
    title,
    icon: 'none'
  })
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
    uni.request({
      url: `${BASE_URL}${url}`,
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
          showToast('网络异常，请检查服务是否启动')
        }
        reject(error)
      }
    })
  })
}
