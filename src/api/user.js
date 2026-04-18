import request from '../utils/request'

export function getUserProfile(options = {}) {
  return request({
    url: '/api/user/profile',
    method: 'GET',
    ...options
  })
}

export function updatePassword(data, options = {}) {
  return request({
    url: '/api/user/password',
    method: 'PUT',
    data,
    ...options
  })
}
