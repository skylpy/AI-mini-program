import request from '../utils/request'

function buildQuery(params = {}) {
  const pairs = Object.entries(params)
    .filter(([, value]) => value !== '' && value !== null && typeof value !== 'undefined')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

  return pairs.length ? `?${pairs.join('&')}` : ''
}

export function getConversionRecords(params = {}, options = {}) {
  return request({
    url: `/api/records${buildQuery(params)}`,
    method: 'GET',
    ...options
  })
}
