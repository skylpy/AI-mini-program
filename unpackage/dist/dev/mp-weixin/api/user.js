"use strict";
const utils_request = require("../utils/request.js");
function getUserProfile(options = {}) {
  return utils_request.request({
    url: "/api/user/profile",
    method: "GET",
    ...options
  });
}
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
