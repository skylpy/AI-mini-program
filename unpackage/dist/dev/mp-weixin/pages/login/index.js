"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const utils_guard = require("../../utils/guard.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const form = common_vendor.reactive({
      account: "",
      password: ""
    });
    const userStore = stores_user.useUserStore();
    function validateForm() {
      if (!form.account) {
        common_vendor.index.showToast({ title: "请输入手机号或用户名", icon: "none" });
        return false;
      }
      if (!form.password || form.password.length < 6) {
        common_vendor.index.showToast({ title: "密码不少于 6 位", icon: "none" });
        return false;
      }
      return true;
    }
    async function handleLogin() {
      if (!validateForm()) {
        return;
      }
      common_vendor.index.showLoading({ title: "登录中" });
      try {
        const res = await api_auth.login({
          account: form.account,
          password: form.password
        });
        userStore.setLogin(res.data);
        common_vendor.index.showToast({ title: res.message || "登录成功", icon: "none" });
        setTimeout(() => {
          utils_guard.goHome();
        }, 250);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:79", "login error", error);
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function goRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/index"
      });
    }
    common_vendor.onLoad(() => {
      if (userStore.isLoggedIn()) {
        utils_guard.goHome();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: form.account,
        b: common_vendor.o(common_vendor.m(($event) => form.account = $event.detail.value, {
          trim: true
        }), "f9"),
        c: form.password,
        d: common_vendor.o(common_vendor.m(($event) => form.password = $event.detail.value, {
          trim: true
        }), "7c"),
        e: common_vendor.o(handleLogin, "fb"),
        f: common_vendor.o(goRegister, "e6")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
