"use strict";
const utils_request = require("../utils/request.js");
function getBanners(options = {}) {
  return utils_request.request({
    url: "/api/banners",
    method: "GET",
    ...options
  });
}
exports.getBanners = getBanners;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/common.js.map
