"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "SectionTitle",
  props: {
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.title),
        b: __props.desc
      }, __props.desc ? {
        c: common_vendor.t(__props.desc)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b5423538"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SectionTitle.js.map
