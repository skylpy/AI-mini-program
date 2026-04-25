// 当前文件中的数据均为前端演示用 mock 数据，后续可替换为真实接口返回。
export const mockBannerList = [
  {
    id: '1',
    title: '文档格式转换',
    image: '',
    link: ''
  },
  {
    id: '2',
    title: '职场文档模板',
    image: '',
    link: ''
  }
]

export const commonToolList = [
  {
    key: 'doc-to-pdf',
    title: '文档格式转换',
    subtitle: '多种文档格式互转',
    icon: 'PDF',
    iconBg: '#eaf3ff'
  },
  {
    key: 'image-to-pdf',
    title: '图片转 PDF',
    subtitle: '多图合并生成 PDF',
    icon: 'IMG',
    iconBg: '#fff7ed'
  },
  {
    key: 'records',
    title: '转换记录',
    subtitle: '我的文档转换记录',
    icon: 'REC',
    iconBg: '#fff5e8'
  },
  {
    key: 'templates',
    title: '文档模板',
    subtitle: '职场常用文档模板',
    icon: 'TMP',
    iconBg: '#eefbf1'
  },
  {
    key: 'more',
    title: '更多功能',
    subtitle: '正在开发敬请期待',
    icon: 'NEW',
    iconBg: '#f3efff'
  },
  {
    key: 'service',
    title: '联系客服',
    subtitle: '解答使用问题',
    icon: 'CS',
    iconBg: '#fff1f2'
  },
  {
    key: 'share',
    title: '好用分享',
    subtitle: '分享给您好友',
    icon: 'SHR',
    iconBg: '#edf7ff'
  }
]

export const extraToolList = [
  {
    key: 'flower-recognition',
    title: '花草识别',
    subtitle: '拍照识别花草',
    icon: 'AI',
    iconBg: '#eefcf0'
  }
]

export const mockRecords = [
  {
    id: 'R20260414001',
    fileName: '项目方案.docx',
    status: '已完成',
    time: '2026-04-14 20:18',
    targetType: 'PDF'
  },
  {
    id: 'R20260413002',
    fileName: '财务月报.xlsx',
    status: '转换中',
    time: '2026-04-13 18:32',
    targetType: 'PDF'
  },
  {
    id: 'R20260412003',
    fileName: '求职简历.pptx',
    status: '已完成',
    time: '2026-04-12 10:06',
    targetType: 'PDF'
  }
]

export const mockTemplates = [
  {
    id: 'T001',
    title: '工作周报模板',
    category: '办公协作',
    description: '适合团队复盘、工作同步和进度汇总。'
  },
  {
    id: 'T002',
    title: '个人简历模板',
    category: '求职资料',
    description: '简洁专业版式，适合校招与社招快速投递。'
  },
  {
    id: 'T003',
    title: '会议纪要模板',
    category: '办公协作',
    description: '记录会议主题、参与人、结论与待办项。'
  }
]

export const mockBrowseHistory = [
  {
    id: 'B001',
    title: '文档格式转换功能介绍',
    time: '2026-04-14 09:10'
  },
  {
    id: 'B002',
    title: '图片压缩使用说明',
    time: '2026-04-13 16:45'
  },
  {
    id: 'B003',
    title: '花草识别体验页',
    time: '2026-04-12 11:20'
  }
]

export const mockFaqList = [
  {
    id: 'Q001',
    question: '支持哪些文档格式互转？',
    answer: '当前支持的源格式与目标格式会根据后端能力动态展示，具体可转换组合以后端实际支持矩阵为准。'
  },
  {
    id: 'Q002',
    question: '转换失败后如何处理？',
    answer: '请先检查文件格式与大小限制，若仍失败，可通过联系客服或反馈页面提交问题。'
  },
  {
    id: 'Q003',
    question: '模板和转换记录会长期保存吗？',
    answer: '当前演示版使用的是模拟数据。正式环境下请根据后端策略配置保存时长与清理规则。'
  }
]
