import App from './App'

import { createSSRApp } from 'vue'
import { initDebugConsole } from './utils/debug-console'

let vConsolePromise = null

function initVConsole() {
  // #ifdef H5
  if (!import.meta.env.DEV || typeof window === 'undefined' || window.__APP_VCONSOLE__) {
    return
  }

  if (!vConsolePromise) {
    vConsolePromise = import('vconsole')
      .then(({ default: VConsole }) => {
        window.__APP_VCONSOLE__ = new VConsole()
        return window.__APP_VCONSOLE__
      })
      .catch((error) => {
        console.error('vConsole init failed', error)
        return null
      })
  }
  // #endif
}

export function createApp() {
  let enableDebugConsole = import.meta.env.DEV

  // #ifdef MP-WEIXIN
  enableDebugConsole = true
  // #endif

  initDebugConsole({
    enabled: enableDebugConsole
  })
  initVConsole()
  const app = createSSRApp(App)
  return {
    app
  }
}
