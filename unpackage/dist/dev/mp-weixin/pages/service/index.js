"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function handleContact() {
      common_vendor.index.showToast({
        title: "请接入真实客服能力",
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleContact, "33")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f6ccea2d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/index.js.map
