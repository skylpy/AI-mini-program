"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
const WHITE_LIST = ["/pages/login/index", "/pages/register/index"];
let initialized = false;
function normalizeUrl(url = "") {
  return url.split("?")[0];
}
function isWhiteList(url = "") {
  return WHITE_LIST.includes(normalizeUrl(url));
}
function redirectToLogin() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if ((currentPage == null ? void 0 : currentPage.route) === "pages/login/index") {
    return;
  }
  common_vendor.index.reLaunch({
    url: "/pages/login/index"
  });
}
function authInterceptor(options = {}) {
  const url = normalizeUrl(options.url || "");
  const userStore = stores_user.useUserStore();
  if (!url || isWhiteList(url) || userStore.isLoggedIn()) {
    return options;
  }
  common_vendor.index.showToast({
    title: "请先登录",
    icon: "none"
  });
  setTimeout(() => {
    redirectToLogin();
  }, 200);
  return false;
}
function initRouteGuard() {
  if (initialized) {
    return;
  }
  initialized = true;
  ["navigateTo", "redirectTo", "reLaunch", "switchTab"].forEach((method) => {
    common_vendor.index.addInterceptor(method, {
      invoke: authInterceptor
    });
  });
}
function requireLogin() {
  const userStore = stores_user.useUserStore();
  if (userStore.isLoggedIn()) {
    return true;
  }
  redirectToLogin();
  return false;
}
function goHome() {
  common_vendor.index.switchTab({
    url: "/pages/tabbar/home/index"
  });
}
exports.goHome = goHome;
exports.initRouteGuard = initRouteGuard;
exports.requireLogin = requireLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/guard.js.map
