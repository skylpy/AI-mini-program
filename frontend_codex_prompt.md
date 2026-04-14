# UniApp 前端代码生成说明（可直接复制给 Codex）

你现在是一名资深前端工程师，请直接为我生成一个 **可运行的 uni-app 项目代码**，用于开发一个“文档格式转换工具”微信小程序前端。

## 一、技术要求

- 前端框架：**uni-app（Vue3 + `<script setup>`）**
- 状态管理：可使用 `pinia`，如果你觉得简单场景不需要，也可以直接封装 `store`
- 网络请求：统一封装 `utils/request.js`
- UI 风格：尽量贴近我提供的页面截图风格
- 代码要求：
  - 直接输出完整项目结构
  - 每个关键文件都给出完整代码
  - 不要只给片段
  - 保证能直接运行
  - 代码要带必要注释
  - 页面样式尽量移动端友好
  - 使用假数据的地方要明确标注，方便后续替换为后端接口

## 二、项目目标

做一个小程序，包含：

1. 注册页
2. 登录页
3. 登录后进入主界面
4. 主界面底部有两个 tab：
   - 首页
   - 我的

## 三、页面与功能说明

### 1）注册页面

页面字段：
- 用户名
- 手机号
- 邮箱（可选）
- 密码
- 确认密码
- 注册按钮
- 跳转登录按钮

交互要求：
- 前端表单校验：
  - 用户名不能为空
  - 手机号格式校验
  - 密码不少于 6 位
  - 两次密码一致
- 注册成功后提示，并跳转登录页
- 调用后端接口：`POST /api/auth/register`

### 2）登录页面

页面字段：
- 手机号/用户名（任一方式登录，前端可统一用一个输入框）
- 密码
- 登录按钮
- 跳转注册按钮

交互要求：
- 表单校验
- 登录成功后：
  - 保存 token
  - 保存用户信息
  - 跳转到 tab 页面首页
- 调用后端接口：`POST /api/auth/login`

### 3）首页 Tab

请按我提供截图的风格实现，整体风格为：
- 顶部标题：`首页`
- 顶部右侧有一个胶囊风格占位按钮区域（可不做真实功能）
- 中间有一个 banner 横幅
- 下方有“常用工具”“更多工具”等模块
- 卡片式宫格布局
- 背景浅灰，卡片白色，圆角，轻阴影

#### 首页功能模块

##### 常用工具
1. **文档转 PDF**
   - 副标题：各种文档转 PDF
   - 点击进入一个占位页 `pages/tools/doc-to-pdf/index`

2. **转换记录**
   - 副标题：我的文档转换记录
   - 点击进入转换记录页

3. **文档模板**
   - 副标题：职场常用文档模板
   - 点击进入模板页

4. **更多功能**
   - 副标题：正在开发敬请期待
   - 点击只弹 toast

5. **联系客服**
   - 副标题：解答使用问题
   - 点击进入联系客服页

6. **好用分享**
   - 副标题：分享给您好友
   - 点击调用分享或做占位逻辑

##### 更多工具
1. **图片压缩**
   - 副标题：图片大小压缩
   - 点击进入占位页

2. **花草识别**
   - 副标题：拍照识别花草
   - 点击进入占位页

#### 首页接口需求
- Banner 列表：`GET /api/banners`
- 首页工具列表：可先本地静态渲染，也可以预留接口

### 4）我的 Tab

请按截图风格实现：
- 顶部红色渐变/纯色头部区域
- 用户头像
- 用户昵称
- 用户 ID
- 右上角胶囊按钮占位
- 下方两个白色圆角卡片列表

#### 我的页面功能区

##### 第一组
1. 转换记录
2. 我的浏览
3. 常见问题

##### 第二组
4. 联系客服
5. 我要反馈
6. 好用分享

交互要求：
- 用户信息从登录信息中读取
- 页面加载时也可调用用户详情接口刷新：`GET /api/user/profile`
- 每个列表项带右箭头
- 未实现功能先进入占位页或 toast

## 四、必须包含的页面

请直接生成以下页面：

- `pages/login/index.vue`
- `pages/register/index.vue`
- `pages/tabbar/home/index.vue`
- `pages/tabbar/profile/index.vue`
- `pages/tools/doc-to-pdf/index.vue`
- `pages/records/index.vue`
- `pages/templates/index.vue`
- `pages/service/index.vue`
- `pages/feedback/index.vue`
- `pages/faq/index.vue`
- `pages/browse-history/index.vue`
- `pages/tools/image-compress/index.vue`
- `pages/tools/flower-recognition/index.vue`

此外还要有：
- `App.vue`
- `main.js`
- `pages.json`
- `manifest.json`（如需示例可提供基础版）
- `uni.scss`
- `utils/request.js`
- `utils/storage.js`
- `stores/user.js`（如果使用 pinia）
- `api/auth.js`
- `api/user.js`
- `api/common.js`

## 五、路由和权限要求

- 未登录时：
  - 默认进入登录页
  - 如果访问需要登录的页面，跳回登录页
- 已登录时：
  - 登录成功进入首页 tab
- 需要提供简单的登录态校验逻辑
- token 建议存储到 `uni.setStorageSync('token', token)`
- 用户信息存储到 `uni.setStorageSync('userInfo', userInfo)`

## 六、请求封装要求

封装统一请求模块，要求：
- 自动拼接 baseURL
- 自动携带 token
- 统一处理 401：
  - 清空本地登录态
  - 跳转登录页
- 统一错误提示 `uni.showToast`

假设后端基础地址：
- 开发环境：`http://localhost:3000`

## 七、数据结构约定

### 登录成功返回格式
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "123456",
      "username": "微信用户",
      "mobile": "13800138000",
      "avatar": "",
      "email": "test@example.com"
    }
  }
}
```

### Banner 返回格式
```json
{
  "code": 0,
  "data": [
    {
      "id": "1",
      "title": "文档格式转换",
      "image": "https://example.com/banner1.png",
      "link": ""
    }
  ]
}
```

### 用户详情返回格式
```json
{
  "code": 0,
  "data": {
    "id": "123456",
    "username": "微信用户",
    "mobile": "13800138000",
    "avatar": "",
    "email": "test@example.com"
  }
}
```

## 八、UI 细节要求

### 首页视觉参考
- 页面背景：`#f5f5f5`
- 卡片背景：白色
- 标题偏黑色加粗
- 副标题灰色
- 宫格两列布局
- banner 圆角明显
- 模块标题左侧有浅蓝色竖条装饰
- 底部 tabbar：
  - 首页高亮偏红色
  - 我的未选中灰色

### 我的页视觉参考
- 顶部背景主色：偏珊瑚红/粉红色，如 `#ff5a5f`
- 头像为圆形
- 用户昵称和 ID 为白色文字
- 内容区域卡片白色，圆角较大
- 列表项有蓝色图标 + 标题 + 右箭头

### 图标处理
- 可优先使用 uni-app 内置、文本图标、或本地简单占位图标
- 不要因为图标资源缺失导致代码无法运行

## 九、额外要求

1. 请提供一个 `README.md`，内容包括：
   - 如何安装依赖
   - 如何运行到微信开发者工具
   - 接口地址如何配置
   - 打包注意事项

2. 如果某些页面暂时没有真实业务逻辑，也必须生成页面和基础 UI

3. 对于“转换记录”“我的浏览”等页面，先使用模拟数据展示列表

4. 页面代码要尽量模块化，避免全部写在一个文件里

5. 如果你认为需要新增组件，请补充：
   - `components/ToolCard.vue`
   - `components/SectionTitle.vue`
   - `components/ListCell.vue`
   - `components/BannerCard.vue`

## 十、输出要求（非常重要）

请你直接输出：

1. 完整项目目录结构
2. 每个文件的完整代码
3. 所有代码必须可复制
4. 不要只解释思路，直接给代码
5. 不要省略关键文件
6. 默认我会把你输出的内容直接保存为项目文件运行

请开始生成完整的 uni-app 项目代码。
