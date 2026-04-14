"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const form = common_vendor.reactive({
      username: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    function validateEmail(email) {
      if (!email) {
        return true;
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validateForm() {
      if (!form.username) {
        common_vendor.index.showToast({ title: "用户名不能为空", icon: "none" });
        return false;
      }
      if (!/^1\d{10}$/.test(form.mobile)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return false;
      }
      if (!validateEmail(form.email)) {
        common_vendor.index.showToast({ title: "邮箱格式不正确", icon: "none" });
        return false;
      }
      if (!form.password || form.password.length < 6) {
        common_vendor.index.showToast({ title: "密码不少于 6 位", icon: "none" });
        return false;
      }
      if (form.password !== form.confirmPassword) {
        common_vendor.index.showToast({ title: "两次输入密码不一致", icon: "none" });
        return false;
      }
      return true;
    }
    async function handleRegister() {
      if (!validateForm()) {
        return;
      }
      common_vendor.index.showLoading({ title: "注册中" });
      try {
        const res = await api_auth.register({
          username: form.username,
          mobile: form.mobile,
          email: form.email,
          password: form.password
        });
        common_vendor.index.showToast({
          title: res.message || "注册成功",
          icon: "none"
        });
        setTimeout(() => {
          goLogin();
        }, 300);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/register/index.vue:114", "register error", error);
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function goLogin() {
      common_vendor.index.redirectTo({
        url: "/pages/login/index"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: form.username,
        b: common_vendor.o(common_vendor.m(($event) => form.username = $event.detail.value, {
          trim: true
        }), "c2"),
        c: form.mobile,
        d: common_vendor.o(common_vendor.m(($event) => form.mobile = $event.detail.value, {
          trim: true
        }), "41"),
        e: form.email,
        f: common_vendor.o(common_vendor.m(($event) => form.email = $event.detail.value, {
          trim: true
        }), "f5"),
        g: form.password,
        h: common_vendor.o(common_vendor.m(($event) => form.password = $event.detail.value, {
          trim: true
        }), "68"),
        i: form.confirmPassword,
        j: common_vendor.o(common_vendor.m(($event) => form.confirmPassword = $event.detail.value, {
          trim: true
        }), "63"),
        k: common_vendor.o(handleRegister, "42"),
        l: common_vendor.o(goLogin, "b3")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-46a64346"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/index.js.map
