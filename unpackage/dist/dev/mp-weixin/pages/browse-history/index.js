"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_data = require("../../mock/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const browseList = common_vendor.ref(mock_data.mockBrowseHistory);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(browseList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-353ea7a5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/browse-history/index.js.map
