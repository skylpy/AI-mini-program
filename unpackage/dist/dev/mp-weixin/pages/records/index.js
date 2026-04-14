"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_data = require("../../mock/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const recordList = common_vendor.ref(mock_data.mockRecords);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(recordList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.fileName),
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.status === "已完成" ? "status-success" : "status-pending"),
            d: common_vendor.t(item.id),
            e: common_vendor.t(item.targetType),
            f: common_vendor.t(item.time),
            g: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f1512143"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/records/index.js.map
