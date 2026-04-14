"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_data = require("../../mock/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const templateList = common_vendor.ref(mock_data.mockTemplates);
    function handlePreview(item) {
      common_vendor.index.showToast({
        title: `${item.title} 预览开发中`,
        icon: "none"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(templateList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.category),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.description),
            d: common_vendor.o(($event) => handlePreview(item), item.id),
            e: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-818172cc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/templates/index.js.map
