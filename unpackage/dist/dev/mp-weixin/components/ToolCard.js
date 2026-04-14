"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "ToolCard",
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "TOOL"
    },
    iconBg: {
      type: String,
      default: "#f3f4f6"
    }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.icon),
        b: __props.iconBg,
        c: common_vendor.t(__props.title),
        d: common_vendor.t(__props.subtitle),
        e: common_vendor.o(($event) => _ctx.$emit("click"), "f7")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-59f88834"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ToolCard.js.map
