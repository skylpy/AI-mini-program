import request from '../utils/request'

export function getOssUploadSettings(options = {}) {
  const querySuffix = `t=${Date.now()}`

  return request({
    url: `/api/conversions/oss-sts?${querySuffix}`,
    method: 'GET',
    header: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...(options.header || {})
    },
    ...options
  })
}
