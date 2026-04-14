# 文档格式转换工具 uni-app 小程序前端

## 项目说明

- 技术栈：`uni-app + Vue3 + <script setup>`
- 运行形态：微信小程序前端
- 当前项目默认使用本地静态占位数据兜底：
  - Banner 拉取失败时回退到本地 mock 数据
  - 转换记录、模板、浏览记录、FAQ 为模拟数据
  - 文档转 PDF、图片压缩、花草识别、客服、反馈等页面为前端占位实现

## 项目结构

```text
.
├── App.vue
├── README.md
├── api
│   ├── auth.js
│   ├── common.js
│   └── user.js
├── components
│   ├── BannerCard.vue
│   ├── ListCell.vue
│   ├── SectionTitle.vue
│   └── ToolCard.vue
├── main.js
├── manifest.json
├── mock
│   └── data.js
├── pages
│   ├── browse-history
│   │   └── index.vue
│   ├── faq
│   │   └── index.vue
│   ├── feedback
│   │   └── index.vue
│   ├── login
│   │   └── index.vue
│   ├── records
│   │   └── index.vue
│   ├── register
│   │   └── index.vue
│   ├── service
│   │   └── index.vue
│   ├── tabbar
│   │   ├── home
│   │   │   └── index.vue
│   │   └── profile
│   │       └── index.vue
│   ├── templates
│   │   └── index.vue
│   └── tools
│       ├── doc-to-pdf
│       │   └── index.vue
│       ├── flower-recognition
│       │   └── index.vue
│       └── image-compress
│           └── index.vue
├── pages.json
├── static
│   └── tabbar
├── stores
│   └── user.js
├── uni.scss
└── utils
    ├── guard.js
    ├── request.js
    └── storage.js
```

## 如何安装依赖

本项目当前没有引入第三方 npm UI 组件库，也没有强依赖 pinia。

- 如果你使用 `HBuilderX` 打开项目，通常不需要额外执行 `npm install`
- 如果你后续要接入额外依赖（如 `pinia`、`uview-plus` 等），再执行：

```bash
npm install
```

## 如何运行到微信开发者工具

1. 使用 `HBuilderX` 打开项目根目录
2. 在 `manifest.json` 中将 `mp-weixin.appid` 替换为你自己的小程序 AppID
3. 点击 `运行 -> 运行到小程序模拟器 -> 微信开发者工具`
4. 首次运行时，确保本机已安装微信开发者工具并完成路径配置

## 接口地址配置

请求封装文件：

```text
utils/request.js
```

当前开发环境接口地址：

```js
const BASE_URL = 'http://localhost:3000'
```

后续如果要切换环境，直接修改这里即可。

## 登录态与权限说明

- token 存储：`uni.setStorageSync('token', token)`
- 用户信息存储：`uni.setStorageSync('userInfo', userInfo)`
- 未登录访问受保护页面时，会自动跳转登录页
- 接口返回 `401` 时，会自动清空登录态并回到登录页

## 后续对接建议

1. 将 `mock/data.js` 中的模拟数据逐步替换为真实接口数据
2. 为文档上传、图片压缩、识别等页面补充真实业务 API
3. 将 `manifest.json` 中的示例 AppID 替换为正式配置
4. 根据后端接口协议，补充请求签名、文件上传和异常日志上报

## 打包注意事项

- 微信小程序上线前，需要在微信公众平台配置业务域名与合法下载域名
- 如果你使用本地 `http://localhost:3000` 调试，真机预览通常无法直接访问本地服务
- 建议联调阶段使用局域网 IP 或测试环境 HTTPS 域名
- 发布前请检查 `manifest.json` 中的 AppID、版本号和页面权限配置
