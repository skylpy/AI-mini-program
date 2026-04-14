"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_user = require("../../../api/user.js");
const utils_guard = require("../../../utils/guard.js");
const stores_user = require("../../../stores/user.js");
if (!Math) {
  ListCell();
}
const ListCell = () => "../../../components/ListCell.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const firstGroup = [
      { key: "records", title: "转换记录", desc: "查看最近转换历史", icon: "REC" },
      { key: "browse-history", title: "我的浏览", desc: "查看最近访问内容", icon: "HIS" },
      { key: "faq", title: "常见问题", desc: "快速获取使用帮助", icon: "FAQ" }
    ];
    const secondGroup = [
      { key: "service", title: "联系客服", desc: "联系人工客服", icon: "CSR" },
      { key: "feedback", title: "我要反馈", desc: "提交建议与问题", icon: "FDB" },
      { key: "share", title: "好用分享", desc: "分享给更多好友", icon: "SHR" }
    ];
    const userInfo = common_vendor.computed(() => userStore.state.userInfo || {});
    const userInitial = common_vendor.computed(() => (userInfo.value.username || "U").slice(0, 1));
    async function fetchProfile() {
      try {
        const res = await api_user.getUserProfile({ showError: false });
        if (res == null ? void 0 : res.data) {
          userStore.updateUserInfo(res.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/tabbar/profile/index.vue:80", "profile error", error);
      }
    }
    function handleMenuClick(item) {
      const routeMap = {
        records: "/pages/records/index",
        "browse-history": "/pages/browse-history/index",
        faq: "/pages/faq/index",
        service: "/pages/service/index",
        feedback: "/pages/feedback/index"
      };
      if (item.key === "share") {
        common_vendor.index.showToast({ title: "请点击右上角分享", icon: "none" });
        return;
      }
      const url = routeMap[item.key];
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    }
    common_vendor.onShow(async () => {
      if (!utils_guard.requireLogin()) {
        return;
      }
      await fetchProfile();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar
      }, userInfo.value.avatar ? {
        b: userInfo.value.avatar
      } : {
        c: common_vendor.t(userInitial.value)
      }, {
        d: common_vendor.t(userInfo.value.username || "微信用户"),
        e: common_vendor.t(userInfo.value.id || "--"),
        f: common_vendor.f(firstGroup, (item, k0, i0) => {
          return {
            a: item.key,
            b: common_vendor.o(($event) => handleMenuClick(item), item.key),
            c: "4cb51321-0-" + i0,
            d: common_vendor.p({
              title: item.title,
              desc: item.desc,
              icon: item.icon
            })
          };
        }),
        g: common_vendor.f(secondGroup, (item, k0, i0) => {
          return {
            a: item.key,
            b: common_vendor.o(($event) => handleMenuClick(item), item.key),
            c: "4cb51321-1-" + i0,
            d: common_vendor.p({
              title: item.title,
              desc: item.desc,
              icon: item.icon
            })
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4cb51321"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabbar/profile/index.js.map
