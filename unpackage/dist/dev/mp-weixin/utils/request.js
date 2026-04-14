"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
const BASE_URL = "http://localhost:3000";
function showToast(title) {
  common_vendor.index.showToast({
    title,
    icon: "none"
  });
}
function handleUnauthorized(message = "登录已过期，请重新登录") {
  const userStore = stores_user.useUserStore();
  userStore.clearLogin();
  showToast(message);
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if ((currentPage == null ? void 0 : currentPage.route) !== "pages/login/index") {
    setTimeout(() => {
      common_vendor.index.reLaunch({
        url: "/pages/login/index"
      });
    }, 200);
  }
}
function request(options = {}) {
  const {
    url = "",
    method = "GET",
    data = {},
    header = {},
    // 某些页面允许静默失败后回退本地 mock 数据。
    showError = true
  } = options;
  const userStore = stores_user.useUserStore();
  const token = userStore.state.token;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {},
        ...header
      },
      success: (response) => {
        const { statusCode, data: responseData } = response;
        if (statusCode === 401 || (responseData == null ? void 0 : responseData.code) === 401) {
          handleUnauthorized(responseData == null ? void 0 : responseData.message);
          reject(responseData);
          return;
        }
        if (statusCode >= 200 && statusCode < 300) {
          if (typeof (responseData == null ? void 0 : responseData.code) === "undefined" || (responseData == null ? void 0 : responseData.code) === 0) {
            resolve(responseData);
            return;
          }
          if (showError) {
            showToast((responseData == null ? void 0 : responseData.message) || "请求失败");
          }
          reject(responseData);
          return;
        }
        if (showError) {
          showToast((responseData == null ? void 0 : responseData.message) || "服务异常，请稍后重试");
        }
        reject(responseData);
      },
      fail: (error) => {
        if (showError) {
          showToast("网络异常，请检查服务是否启动");
        }
        reject(error);
      }
    });
  });
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
