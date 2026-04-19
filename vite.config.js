import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const uploadHost =
    env.VITE_OSS_UPLOAD_HOST ||
    (env.VITE_OSS_BUCKET && env.VITE_OSS_REGION
      ? `https://${env.VITE_OSS_BUCKET}.oss-${env.VITE_OSS_REGION}.aliyuncs.com`
      : 'https://doc-converter-pdf.oss-cn-shenzhen.aliyuncs.com')

  return {
    plugins: [uni()],
    server: uploadHost
      ? {
          proxy: {
            '/__oss_upload': {
              target: uploadHost,
              changeOrigin: true,
              secure: false,
              rewrite: () => '/'
            }
          }
        }
      : undefined
  }
})
