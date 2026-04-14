const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token || '')
}

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

export function setUserInfo(userInfo) {
  uni.setStorageSync(USER_INFO_KEY, userInfo || {})
}

export function getUserInfo() {
  return uni.getStorageSync(USER_INFO_KEY) || null
}

export function removeUserInfo() {
  uni.removeStorageSync(USER_INFO_KEY)
}

export function clearAuthStorage() {
  removeToken()
  removeUserInfo()
}
