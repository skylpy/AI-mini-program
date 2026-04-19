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

新增环境变量文件：

```bash
cp .env.example .env
```

`.env` 示例：

```bash
VITE_API_BASE_URL=https://api.example.com
```

注意事项：

- 微信小程序真机，尤其 iOS，不允许直接请求 `http://` 地址
- 微信小程序真机不应直接请求裸 IP，如 `http://120.79.144.54:3001`
- 必须使用已备案、证书正常的 `HTTPS` 域名
- 该域名还必须配置到微信公众平台的“开发管理 -> 开发设置 -> request 合法域名”
- `project.config.json` 中的 `urlCheck: false` 只对开发者工具调试有效，不能绕过 iOS 真机校验

如果未配置 `VITE_API_BASE_URL`，当前项目仍会回退到代码中的旧地址，便于本地排查；但在微信小程序真机中，这个旧地址会被前端直接识别为非法配置并给出明确提示。

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
- 小程序 iOS 真机联调必须使用测试环境 HTTPS 域名，不要继续使用 HTTP 或裸 IP
- 如果页面中要展示远程图片，也需要同步检查微信后台的合法下载域名配置
- 发布前请检查 `manifest.json` 中的 AppID、版本号和页面权限配置

## 本次排查结论

当前项目在微信小程序 iOS 上出现“没有权限”，实际根因主要有两项：

1. `src/utils/request.js` 中硬编码了 `http://120.79.144.54:3001`
2. `src/manifest.json` 中仍是示例 AppID `wx1234567890abcdef`

其中第 1 项会直接导致微信小程序真机网络请求被拦截；第 2 项会导致真机预览和正式能力配置不稳定。当前仓库已将请求地址改为环境变量优先，并在小程序端对非法网络配置做了前置提示。
