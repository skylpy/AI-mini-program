"use strict";
const common_vendor = require("../common/vendor.js");
const TOKEN_KEY = "token";
const USER_INFO_KEY = "userInfo";
function setToken(token) {
  common_vendor.index.setStorageSync(TOKEN_KEY, token || "");
}
function getToken() {
  return common_vendor.index.getStorageSync(TOKEN_KEY) || "";
}
function removeToken() {
  common_vendor.index.removeStorageSync(TOKEN_KEY);
}
function setUserInfo(userInfo) {
  common_vendor.index.setStorageSync(USER_INFO_KEY, userInfo || {});
}
function getUserInfo() {
  return common_vendor.index.getStorageSync(USER_INFO_KEY) || null;
}
function removeUserInfo() {
  common_vendor.index.removeStorageSync(USER_INFO_KEY);
}
function clearAuthStorage() {
  removeToken();
  removeUserInfo();
}
exports.clearAuthStorage = clearAuthStorage;
exports.getToken = getToken;
exports.getUserInfo = getUserInfo;
exports.setToken = setToken;
exports.setUserInfo = setUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/storage.js.map
