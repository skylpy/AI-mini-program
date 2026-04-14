import request from '../utils/request'

export function getBanners(options = {}) {
  return request({
    url: '/api/banners',
    method: 'GET',
    ...options
  })
}
