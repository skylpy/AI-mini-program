"use strict";
const common_vendor = require("../../common/vendor.js");
const mock_data = require("../../mock/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const faqList = common_vendor.ref(mock_data.mockFaqList);
    const activeIndex = common_vendor.ref(0);
    function toggle(index) {
      activeIndex.value = activeIndex.value === index ? -1 : index;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(faqList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.question),
            b: common_vendor.t(activeIndex.value === index ? "-" : "+"),
            c: activeIndex.value === index
          }, activeIndex.value === index ? {
            d: common_vendor.t(item.answer)
          } : {}, {
            e: item.id,
            f: common_vendor.o(($event) => toggle(index), item.id)
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e1a022cb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/faq/index.js.map
