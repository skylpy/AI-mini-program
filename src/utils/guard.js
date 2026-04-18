import { useUserStore } from '../stores/user'

const WHITE_LIST = ['/pages/login/index', '/pages/register/index', '/pages/forgot-password/index']
let initialized = false

function normalizeUrl(url = '') {
  return url.split('?')[0]
}

function isWhiteList(url = '') {
  return WHITE_LIST.includes(normalizeUrl(url))
}

function redirectToLogin() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]

  if (currentPage?.route === 'pages/login/index') {
    return
  }

  uni.reLaunch({
    url: '/pages/login/index'
  })
}

function authInterceptor(options = {}) {
  const url = normalizeUrl(options.url || '')
  const userStore = useUserStore()

  if (!url || isWhiteList(url) || userStore.isLoggedIn()) {
    return options
  }

  uni.showToast({
    title: '请先登录',
    icon: 'none'
  })

  setTimeout(() => {
    redirectToLogin()
  }, 200)

  return false
}

export function initRouteGuard() {
  if (initialized) {
    return
  }

  initialized = true

  // 对常用页面跳转方法统一做登录校验。
  ;['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].forEach((method) => {
    uni.addInterceptor(method, {
      invoke: authInterceptor
    })
  })
}

export function requireLogin() {
  const userStore = useUserStore()

  if (userStore.isLoggedIn()) {
    return true
  }

  redirectToLogin()
  return false
}

export function goHome() {
  uni.switchTab({
    url: '/pages/tabbar/home/index'
  })
}
