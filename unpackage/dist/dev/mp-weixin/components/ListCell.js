"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "ListCell",
  props: {
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "•"
    }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.icon),
        b: common_vendor.t(__props.title),
        c: __props.desc
      }, __props.desc ? {
        d: common_vendor.t(__props.desc)
      } : {}, {
        e: common_vendor.o(($event) => _ctx.$emit("click"), "f7")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-441e014f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ListCell.js.map
