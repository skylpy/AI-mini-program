"use strict";
const common_vendor = require("../common/vendor.js");
const utils_storage = require("../utils/storage.js");
const state = common_vendor.reactive({
  token: utils_storage.getToken(),
  userInfo: utils_storage.getUserInfo()
});
function useUserStore() {
  const restore = () => {
    state.token = utils_storage.getToken();
    state.userInfo = utils_storage.getUserInfo();
  };
  const setLogin = (payload = {}) => {
    const token = payload.token || "";
    const user = payload.user || null;
    state.token = token;
    state.userInfo = user;
    utils_storage.setToken(token);
    utils_storage.setUserInfo(user);
  };
  const updateUserInfo = (userInfo = {}) => {
    state.userInfo = {
      ...state.userInfo || {},
      ...userInfo
    };
    utils_storage.setUserInfo(state.userInfo);
  };
  const clearLogin = () => {
    state.token = "";
    state.userInfo = null;
    utils_storage.clearAuthStorage();
  };
  const isLoggedIn = () => !!state.token;
  return {
    state,
    restore,
    setLogin,
    updateUserInfo,
    clearLogin,
    isLoggedIn
  };
}
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
