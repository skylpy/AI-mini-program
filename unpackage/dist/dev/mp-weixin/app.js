"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_guard = require("./utils/guard.js");
const stores_user = require("./stores/user.js");
if (!Math) {
  "./pages/login/index.js";
  "./pages/register/index.js";
  "./pages/tabbar/home/index.js";
  "./pages/tabbar/profile/index.js";
  "./pages/tools/doc-to-pdf/index.js";
  "./pages/records/index.js";
  "./pages/templates/index.js";
  "./pages/service/index.js";
  "./pages/feedback/index.js";
  "./pages/faq/index.js";
  "./pages/browse-history/index.js";
  "./pages/tools/image-compress/index.js";
  "./pages/tools/flower-recognition/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      const userStore = stores_user.useUserStore();
      userStore.restore();
      utils_guard.initRouteGuard();
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
