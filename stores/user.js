import { reactive } from 'vue'
import { clearAuthStorage, getToken, getUserInfo, setToken, setUserInfo } from '../utils/storage'

const state = reactive({
  token: getToken(),
  userInfo: getUserInfo()
})

export function useUserStore() {
  const restore = () => {
    state.token = getToken()
    state.userInfo = getUserInfo()
  }

  // 登录成功后统一写入本地与内存态。
  const setLogin = (payload = {}) => {
    const token = payload.token || ''
    const user = payload.user || null

    state.token = token
    state.userInfo = user
    setToken(token)
    setUserInfo(user)
  }

  const updateUserInfo = (userInfo = {}) => {
    state.userInfo = {
      ...(state.userInfo || {}),
      ...userInfo
    }
    setUserInfo(state.userInfo)
  }

  const clearLogin = () => {
    state.token = ''
    state.userInfo = null
    clearAuthStorage()
  }

  const isLoggedIn = () => !!state.token

  return {
    state,
    restore,
    setLogin,
    updateUserInfo,
    clearLogin,
    isLoggedIn
  }
}
