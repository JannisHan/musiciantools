# Musician Tools MVP 实施决策

> 状态：已确认，作为实现阶段的优先依据。若本文与早期调研文档冲突，以本文为准。

## 1. 首发产品与验证目标

- 首发工具：`BPM to MS & Delay Time Calculator`。
- 首发路径：`/tools/bpm-delay-calculator/`。
- 首个 8–12 周目标：验证 Google 非品牌自然曝光、真实工具使用与回访趋势。
- 市场与文案：US English only。
- 暂不加入广告、付费功能、账号、PWA、麦克风 Tap Tempo 或设备数据库。

## 2. 用户任务

核心用户是需要为 delay、reverb、modulation 等效果设置节奏时间的吉他手、制作人和录音工程师。页面应让用户在几秒内完成：

1. 输入或敲击 BPM；
2. 立即看到最常用音符时值；
3. 复制具体毫秒值；
4. 可选输入设备最大延迟，判断哪些结果可用；
5. 需要时展开完整表格或分享当前配置。

## 3. 已确认的交互规则

### 3.1 BPM 与换算

- 默认 BPM：120.0。
- 有效范围：20–400 BPM，支持一位小数。
- 主输入是 BPM；`ms → BPM` 作为次级小工具，字段明确标注为 `Quarter-note duration`，并提供 `Use this BPM`。
- 支持 1/1–1/64、straight / dotted / triplet，并显示 Hz。
- 首屏突出常用结果卡片；完整表格默认折叠在 `View full timing table` 后。
- 完整表格采用固定音乐顺序，只提供 straight / dotted / triplet 过滤，不提供任意排序。

### 3.2 Tap Tempo

- 仅支持手动点击或键盘触发，不请求麦克风权限。
- 第二次有效敲击可显示 provisional BPM；第三次及以后显示稳定度反馈。
- 使用最近 8 个有效间隔并过滤明显离群值。
- 尚未估算 BPM 时，首个间隔最长允许约 4 秒，以覆盖 20 BPM。
- 已有估算后，自动重置阈值为 `2.5 × 最近间隔中位数`，并限制在 2–5 秒之间。
- 必须提供显式 `Reset`。

### 3.3 设备限制、复制与分享

- `Device max delay (ms)` 是可见但次要的可选输入，不依赖设备数据库。
- 超出设备上限的结果使用文字和图标双重表达，不能只依赖颜色。
- 提示当前设备可用的最长音符时值。
- 每个常用结果支持单独复制；分享链接编码 BPM 与设备上限。

## 4. 视觉与可访问性

- 定位：precision music workstation，而非通用 SaaS 仪表盘。
- 色彩：暖象牙白 / 炭黑双主题，琥珀为品牌主色，低饱和绿色表示稳定，铁锈红表示不可用。
- 字体：Instrument Sans（自托管）；数字使用 IBM Plex Mono 并启用 tabular numerals。
- 间距：4px 基础尺度，主要使用 8 / 12 / 16 / 24 / 32 / 48 / 64。
- 圆角：输入 4px、面板 8px；以边框和轻层级为主，仅保留两级微弱阴影。
- 动效：120–160ms，遵守 `prefers-reduced-motion`。
- 移动端单列、触控目标至少 44px；桌面端形成输入区与结果区工作台。
- 系统主题优先，并提供明确切换；状态信息满足键盘、焦点、对比度和非颜色表达要求。

## 5. 技术架构

- 包管理器：npm。
- 应用框架：TanStack Start（接受当前 RC 风险，锁定依赖并以测试覆盖核心行为）。
- 托管：Cloudflare Workers + Static Assets，使用 `@cloudflare/vite-plugin`；不是 Cloudflare Pages。
- 渲染：公开 SEO 路由预渲染，计算器客户端 hydration，Worker SSR 作为回退。
- 样式：Tailwind CSS + 项目自有组件，不采用默认 shadcn 视觉。
- 测试：Vitest + Playwright + 自动化可访问性检查 + 生产构建验证。
- 发布：先部署 Cloudflare Preview，由项目负责人验收后再发布生产环境。

## 6. SEO 与站点外壳

首发至少包含：首页、工具页、About、Methodology、Privacy、Terms。工具页需输出独立 title、description、canonical、结构化数据和可抓取的解释内容；sitemap 与 robots 必须区分生产和 Preview，Preview 不应被索引。

## 7. 隐私友好型分析

- 页面趋势：Cloudflare Web Analytics。
- 产品事件：浏览器向同源 `POST /api/events` 发送白名单事件，由 Worker 写入 Analytics Engine。
- 白名单事件：`tool_started`、`calculation_completed`、`tap_used`、`value_copied`、`share_clicked`。
- 不保存 IP、Cookie、完整 URL/查询串、referrer、user agent、原始输入、持久或随机访客 ID。
- 每个页面生命周期中，每类事件最多发送一次；事件端点拒绝未知字段和未知枚举。
- 产品转化比例仅在累计至少 100 次 tool starts 后解读，早期主要观察趋势而非任意流量门槛。

## 8. 公开测试接口

- `calculateDelayRows(bpm, deviceMaxDelayMs?)`
- `bpmFromQuarterNoteMs(ms)`
- Tap 状态机：`tap(timestampMs)`、`reset()`
- `POST /api/events`

首批固定用例包括 120 BPM 的 quarter = 500ms、dotted eighth = 375ms、eighth-note triplet = 166.667ms，以及 20 BPM、离群点击、8 间隔窗口、自适应重置、设备上限、复制、分享、主题、预渲染与 canonical。
