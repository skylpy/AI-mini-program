"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const form = common_vendor.reactive({
      content: "",
      contact: ""
    });
    function handleSubmit() {
      if (!form.content) {
        common_vendor.index.showToast({
          title: "请输入反馈内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "反馈已提交，感谢您的建议",
        icon: "none"
      });
      form.content = "";
      form.contact = "";
    }
    return (_ctx, _cache) => {
      return {
        a: form.content,
        b: common_vendor.o(common_vendor.m(($event) => form.content = $event.detail.value, {
          trim: true
        }), "6d"),
        c: form.contact,
        d: common_vendor.o(common_vendor.m(($event) => form.contact = $event.detail.value, {
          trim: true
        }), "82"),
        e: common_vendor.o(handleSubmit, "22")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2aa7bac2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/feedback/index.js.map
