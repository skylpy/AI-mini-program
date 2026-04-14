import request from '../utils/request'

export function getUserProfile(options = {}) {
  return request({
    url: '/api/user/profile',
    method: 'GET',
    ...options
  })
}
