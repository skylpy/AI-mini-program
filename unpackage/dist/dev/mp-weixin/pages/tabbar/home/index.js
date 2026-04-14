"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_common = require("../../../api/common.js");
const mock_data = require("../../../mock/data.js");
const utils_guard = require("../../../utils/guard.js");
if (!Math) {
  (BannerCard + SectionTitle + ToolCard)();
}
const BannerCard = () => "../../../components/BannerCard.js";
const SectionTitle = () => "../../../components/SectionTitle.js";
const ToolCard = () => "../../../components/ToolCard.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bannerList = common_vendor.ref([...mock_data.mockBannerList]);
    async function fetchBanners() {
      try {
        const res = await api_common.getBanners({ showError: false });
        if (Array.isArray(res == null ? void 0 : res.data) && res.data.length) {
          bannerList.value = res.data;
        } else {
          bannerList.value = [...mock_data.mockBannerList];
        }
      } catch (error) {
        bannerList.value = [...mock_data.mockBannerList];
      }
    }
    function navigate(url) {
      common_vendor.index.navigateTo({ url });
    }
    function handleCommonToolClick(item) {
      const routeMap = {
        "doc-to-pdf": "/pages/tools/doc-to-pdf/index",
        records: "/pages/records/index",
        templates: "/pages/templates/index",
        service: "/pages/service/index"
      };
      if (item.key === "more") {
        common_vendor.index.showToast({ title: "更多功能开发中", icon: "none" });
        return;
      }
      if (item.key === "share") {
        common_vendor.index.showToast({ title: "请点击右上角分享给好友", icon: "none" });
        return;
      }
      const url = routeMap[item.key];
      if (url) {
        navigate(url);
      }
    }
    function handleExtraToolClick(item) {
      const routeMap = {
        "image-compress": "/pages/tools/image-compress/index",
        "flower-recognition": "/pages/tools/flower-recognition/index"
      };
      const url = routeMap[item.key];
      if (url) {
        navigate(url);
      }
    }
    function handleBannerClick(item) {
      if (item.link) {
        common_vendor.index.navigateTo({
          url: item.link
        });
        return;
      }
      common_vendor.index.showToast({
        title: `${item.title} 敬请期待`,
        icon: "none"
      });
    }
    async function initPage() {
      if (!utils_guard.requireLogin()) {
        return;
      }
      await fetchBanners();
    }
    common_vendor.onLoad(async () => {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
      await initPage();
    });
    common_vendor.onPullDownRefresh(async () => {
      await fetchBanners();
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onShareAppMessage(() => ({
      title: "文档格式转换工具",
      path: "/pages/login/index"
    }));
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(bannerList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(handleBannerClick, item.id),
            b: "30d82312-0-" + i0,
            c: common_vendor.p({
              item
            }),
            d: item.id
          };
        }),
        b: common_vendor.p({
          title: "常用工具",
          desc: "高频功能入口"
        }),
        c: common_vendor.f(common_vendor.unref(mock_data.commonToolList), (item, k0, i0) => {
          return {
            a: item.key,
            b: common_vendor.o(($event) => handleCommonToolClick(item), item.key),
            c: "30d82312-2-" + i0,
            d: common_vendor.p({
              title: item.title,
              subtitle: item.subtitle,
              icon: item.icon,
              ["icon-bg"]: item.iconBg
            })
          };
        }),
        d: common_vendor.p({
          title: "更多工具",
          desc: "持续扩展中"
        }),
        e: common_vendor.f(common_vendor.unref(mock_data.extraToolList), (item, k0, i0) => {
          return {
            a: item.key,
            b: common_vendor.o(($event) => handleExtraToolClick(item), item.key),
            c: "30d82312-4-" + i0,
            d: common_vendor.p({
              title: item.title,
              subtitle: item.subtitle,
              icon: item.icon,
              ["icon-bg"]: item.iconBg
            })
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-30d82312"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabbar/home/index.js.map
