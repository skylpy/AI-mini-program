"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function handleAction() {
      common_vendor.index.showToast({
        title: "请接入真实图片压缩逻辑",
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleAction, "ee")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2c6a0bf7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tools/image-compress/index.js.map
