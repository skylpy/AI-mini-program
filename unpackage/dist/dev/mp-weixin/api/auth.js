"use strict";
const utils_request = require("../utils/request.js");
function login(data) {
  return utils_request.request({
    url: "/api/auth/login",
    method: "POST",
    data
  });
}
function register(data) {
  return utils_request.request({
    url: "/api/auth/register",
    method: "POST",
    data
  });
}
exports.login = login;
exports.register = register;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
