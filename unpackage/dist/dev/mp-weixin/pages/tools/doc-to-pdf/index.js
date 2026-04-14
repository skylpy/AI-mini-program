"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const steps = ["选择需要转换的文档", "上传到后端进行格式转换", "完成后下载或查看记录"];
    function handleChooseFile() {
      common_vendor.index.showToast({
        title: "此处接入真实文件上传逻辑",
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleChooseFile, "ca"),
        b: common_vendor.f(steps, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item),
            c: item
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-08e8b09b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tools/doc-to-pdf/index.js.map
