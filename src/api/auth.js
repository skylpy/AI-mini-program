import request from '../utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data
  })
}

export function wechatMiniProgramLogin(data) {
  return request({
    url: '/api/auth/wechat-mini-program/login',
    method: 'POST',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'POST',
    data
  })
}

export function forgotPassword(data) {
  return request({
    url: '/api/auth/forgot-password',
    method: 'POST',
    data
  })
}

export function logout(options = {}) {
  return request({
    url: '/api/auth/logout',
    method: 'POST',
    ...options
  })
}
