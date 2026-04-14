"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "BannerCard",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.item.image
      }, __props.item.image ? {
        b: __props.item.image
      } : {}, {
        c: common_vendor.t(__props.item.title),
        d: common_vendor.o(($event) => _ctx.$emit("click", __props.item), "f7")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-efa61ef8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BannerCard.js.map
