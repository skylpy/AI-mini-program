"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function handleAction() {
      common_vendor.index.showToast({
        title: "请接入真实花草识别逻辑",
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleAction, "69")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7796904a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tools/flower-recognition/index.js.map
