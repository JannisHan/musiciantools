# 05 · 关键词 SERP 与 MVP 裁决

> 核验日期：2026-08-30
> 关键词数据来源：用户提供的 Semrush 数据
> 目的：把搜索量与 KD 还原为真实用户任务、页面边界和开发顺序。本文件不是流量承诺，也不把 KD 当作单一决策标准。

## 1. 执行结论

这 5 个关键词不应开发成 5 个页面，而应合并为 **3 个搜索意图集群、3 个 canonical 工具页**：

| 页面 | 覆盖关键词 | 用户提供的量 / KD | 裁决 | 角色 |
|---|---|---:|---|---|
| BPM / Delay | `bpm to ms`；`delay time calculator` | 1,000 / 3；480 / 20 | **P0，最先开发** | 低成本 SEO 获客验证 |
| Guitar String Tension | `guitar string tension calculator` | 1,900 / 31 | **P0，同一首发批次的商业核心** | 产品价值与联盟意图验证 |
| Fret Calculator | `fret calculator`；`fret spacing calculator` | 260 / 9；110 / 6 | **P1，暂不首发** | 面向制琴/维修的专业工具 |

最终建议不是“先做 KD 最低的三个简单计算器”，而是：

1. 先用一个高完成度的 BPM / Delay 页面验证新站能否获得非品牌搜索曝光；
2. 同时解决琴弦数据可用性，再用 String Tension Compare 验证是否存在分享、选弦和购买行为；
3. 只有能提供可实际制作的打印/导出工作流时，才开发 Fret Calculator。

## 2. 先正确解读 Semrush 数据

### 2.1 名义搜索量不是可直接相加的流量池

五个词的名义搜索量合计为 3,750/月，但不能把它当作可获得访问量：

- `bpm to ms` 与 `delay time calculator` 的结果页解决同一个任务——把 tempo 转成延迟、混响或调制所需的毫秒值；
- `fret calculator` 与 `fret spacing calculator` 同样是输入 scale length 后获得品丝位置；
- 同一用户、同一页面可能覆盖多个查询，关键词数据库的 volume 也不是点击数。

直接竞品已经用单页同时覆盖这些表达。例如 SoundGrail 的页面标题和功能就是“Delay Time Calculator - BPM to Milliseconds”，StewMac 的页面标题则是“Fret Position Calculator for Fret Spacing”。这比只看关键词字面更能说明页面边界：[SoundGrail Delay Calculator](https://soundgrail.com/tools/delay-calculator)、[StewMac Fret Position Calculator](https://www.stewmac.com/fret-calculator/)。

### 2.2 KD 只能表示相对竞争，不能代表产品机会

- KD 3 说明 `bpm to ms` 的链接竞争可能较低，不代表页面功能竞争低；当前已有大量即时计算、Tap Tempo、复制、Hz 和细分表工具。
- KD 31 不等于不值得做。琴弦张力更接近换弦、定制套弦和购买决策，商业价值明显高于一个通用毫秒换算器。
- KD 9 也不等于 Fret Calculator 容易赢。StewMac 有十年以上使用历史，FretFind2D 已覆盖多弦长、微分音和工程文件导出。

因此，优先级需要同时看 **搜索需求、意图商业性、SERP 强度、数据门槛、开发成本和可差异化程度**。

### 2.3 当前数据还缺少的口径

开始做流量预测前，应从 Semrush 导出并保留：

- 数据库国家（建议先固定 US）和设备类型；
- 拉取日期、12 个月趋势、CPC；
- 每个词的 SERP 前 10 URL、SERP Features；
- Phrase Match、Related、Questions 词表；
- 排名页级别的 referring domains，而不只看根域名。

在这些字段补齐之前，本文件只做优先级和产品裁决，不给“首年能获得多少访问”的承诺。

## 3. 集群一：Guitar String Tension Calculator

### 3.1 搜索意图

这是一个“配置决策”型工具词。用户通常不是想知道物理公式，而是在完成以下任务：

- 从标准调弦改为 Drop / Baritone / Extended Range 时选线径；
- 换弦长或 multiscale 后，保持接近原来的手感；
- 检查一套弦中各弦的相对张力；
- 组合 custom / hybrid set，并进一步购买单弦或套弦。

Stringjoy 的官方工具直接把计算结果连接到 “Build a custom set”，并明确说明其数据来自对自家琴弦的测量；D’Addario 的 String Tension Pro 也围绕乐器、弦长、调弦、线径和逐弦结果组织体验。这说明该查询既有工具意图，也非常接近商品决策：[Stringjoy String Tension Calculator](https://tension.stringjoy.com/)、[D’Addario String Tension Pro](https://www.daddario.com/en-au/pages/string-tension-pro-string-tension-calculator)。

### 3.2 代表性竞品

| 竞品 | 已有能力 | 对本项目的含义 |
|---|---|---|
| D’Addario String Tension Pro | 乐器、弦长、调弦、线径、逐弦即时张力和配置试验 | 厂商品牌、官方数据、商品生态均很强；SERP 不是“弱工具站” |
| Stringjoy | 逐弦弦长、音高、线径、总张力，并导向 custom set | 已经完成“计算 → 购买”的闭环 |
| AltTuningLab | 多弦数、标准/多弦长、调弦与线径输入、平均张力和张力离散度 | “支持 extended range / multiscale”本身已不是充分差异点 |

直接页面：[D’Addario](https://www.daddario.com/en-au/pages/string-tension-pro-string-tension-calculator)、[Stringjoy](https://tension.stringjoy.com/)、[AltTuningLab](https://www.alttuninglab.com/string-tension-calculator)。

### 3.3 真正机会

搜索量是五词中最高，且任务天然关联琴弦购买，应该从原计划的 Phase 2 提前到首发批次。但机会不在于再做一个“输入线径 → 输出磅数”的计算器，而在于完成一个中立的迁移决策：

> 我现在这把琴、这套弦和这个调弦是什么手感；换到目标琴/目标调弦后，应该选什么线径，才能尽量保持相似？

建议差异化：

1. **Current vs Target 双栏比较**，而不是单配置孤立结果；
2. 可选择“保持每弦接近原配置”或“保持总张力接近原配置”；
3. 显示逐弦变化量、总变化量和 set 内离散度，但不输出绝对“安全/危险”结论；
4. 每条数据展示品牌、系列、来源、版本和最后核验日期；
5. 生成可复制/分享的配置链接；
6. 结果附近推荐对应规格的套弦或单弦，并清晰披露 affiliate 关系。

### 3.4 最大风险：数据，而不是公式

D’Addario 给出的公式为：

`T = UW × (2 × L × F)² / 386.4`

其中 `UW` 是单位长度重量、`L` 是有效弦长、`F` 是频率。D’Addario 同时明确说明 tension 受 string construction 影响；Stringjoy 也明确说明不同公司的制造方式会产生不同数字。因此，**线径相同不代表单位重量相同，也不应声称跨品牌结果“精确”**：[D’Addario 公式与变量说明](https://www.daddario.com/blogs/guitar/all-about-string-tension)、[D’Addario Tension Chart PDF](https://daddario.com/upload/tension_chart_13934.pdf)、[Stringjoy 方法说明](https://tension.stringjoy.com/)。

上线前必须完成：

- 确认使用厂商数据的条款、授权或合理引用边界；
- 不把估算值包装成厂商规格；
- 首版宁可只支持一个可核验的数据系列，也不要拼出 20 套无法追溯的“数据库”；
- 删除“总张力比常规高 15% 就判断琴颈风险”之类无工程依据的提示；
- 把结果定位为配置比较和 setup 参考，不是对具体乐器结构安全的保证。

### 3.5 页面边界与建议文案

- URL：`/tools/string-tension-calculator/`
- Title：`Guitar String Tension Calculator & Gauge Comparison | Musician Tools`
- H1：`Guitar String Tension Calculator`
- 主词：`guitar string tension calculator`
- 次级意图：string gauge tension、drop tuning string tension、multiscale string tension、balanced tension set

不要按 Drop D、7-string、8-string 等预设批量建立近重复落地页。只有未来某一类用户拥有独立工作流、独立内容和足够查询证据时才拆页。Google 明确建议不要为了每一种查询表达创建单独内容，而应提供非商品化、对用户有实质增量的页面：[Google AI Search 内容指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)。

## 4. 集群二：BPM to MS + Delay Time Calculator

### 4.1 搜索意图

两个词的核心任务完全一致：把四分音符 BPM 转成设备或插件需要的时间参数。主要场景包括：

- delay / echo 的 straight、dotted、triplet 时间；
- reverb pre-delay / decay；
- compressor release、sidechain timing；
- tremolo、LFO、filter modulation 的 Hz；
- 不知道歌曲 BPM 时通过 Tap Tempo 获取 tempo。

Tuneform 将 BPM 转换用于 compressor、reverb 和 delay；SoundGrail 在同一页提供 BPM、Tap Tempo、straight/dotted/triplet 与点击复制。这些直接页面证明了两词是同一任务，不应分开建页：[Tuneform BPM to MS](https://tuneform.com/tools/time-tempo-bpm-to-milliseconds-ms)、[SoundGrail Delay Calculator](https://soundgrail.com/tools/delay-calculator)。

### 4.2 代表性竞品

| 竞品 | 已有能力 | 对本项目的含义 |
|---|---|---|
| SoundGrail | BPM、Tap Tempo、1/1–1/64、straight/dotted/triplet、点击复制 | 首发功能门槛已经高于“输入框 + 静态结果” |
| Tuneform | BPM→ms、多个音符细分、精度切换、使用场景与完整参考表 | 长文本和参考表也不构成独特壁垒 |
| FrequencyDetector | BPM↔ms、Hz、samples、bar timing、复制、CSV | “多输出格式”已有成熟竞品 |
| GuitarToneAdapt | 面向吉他踏板，BPM、slider、Tap Tempo、ms 与 Hz | “专门面向吉他手”已有直接竞争者 |

直接页面：[SoundGrail](https://soundgrail.com/tools/delay-calculator)、[Tuneform](https://tuneform.com/tools/time-tempo-bpm-to-milliseconds-ms)、[FrequencyDetector](https://frequencydetector.com/bpm-tempo-calculator/)、[GuitarToneAdapt](https://guitartoneadapt.com/tools/delay-time/)。

### 4.3 真实机会与风险

机会：`bpm to ms` 的 1,000/月和 KD 3 是当前最适合验证 SEO 的组合，公式简单、开发和测试成本低，可最快形成真实 Search Console 数据。

风险：这是高度商品化的计算。四分音符只需要 `60000 / BPM`，搜索引擎、AI 答案或 DAW 内置功能都可能直接满足用户，低 KD 不等于点击率高。大量 2026 年仍在新增的工具页也说明进入门槛低、同质化严重。

因此差异化应放在“更快完成真实设备设置”，而不是增加更多介绍文字：

1. BPM 输入、Tap Tempo、ms 反算 BPM；
2. straight / dotted / triplet 的 1/1–1/64 完整表；
3. 每个 ms / Hz 值一键复制；
4. Tap Tempo 使用最近有效间隔并过滤暂停和异常点击，展示稳定度；
5. 提供 audible rhythm preview，让用户听到 straight、dotted eighth 和 triplet 的区别；
6. 用户输入设备最大 delay time 后，标记当前 BPM 下可实现的 subdivision；
7. 结果通过 `?bpm=120` 等 URL 参数分享，所有状态 URL canonical 到干净主页。

设备限制是比“多一个小数位”更接近真实问题的差异化方向。BOSS/Roland 官方设备资料本身会同时使用毫秒范围、BPM 音符值和 dotted/triplet，并说明某些低速设置会因最大延迟范围受到限制：[BOSS DD-20 官方手册](https://static.roland.com/assets/media/pdf/DD-20_OM.pdf)、[Roland GX-100 参数说明](https://static.roland.com/manuals/gx-100_parameter/eng/25630241.html)。

### 4.4 页面边界与建议文案

- 唯一 URL：`/tools/bpm-delay-calculator/`
- Title：`BPM to MS & Delay Time Calculator | Musician Tools`
- H1：`BPM to MS & Delay Time Calculator`
- 主词：`bpm to ms`
- 次级词：`delay time calculator`、tempo to milliseconds、dotted eighth delay、triplet delay、BPM to Hz

**不要再建立 `/bpm-to-ms/` 和 `/delay-time-calculator/` 两个近重复页面。** 一个完整页面可以在 H2、说明和 FAQ 中自然满足两个措辞。Google 说明其系统能够理解页面与查询的相关性，即便页面没有为每个查询变体建立精确匹配页；批量建立查询变体页也不是长期有效策略：[Google AI Search 内容指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)。

## 5. 集群三：Fret Calculator + Fret Spacing Calculator

### 5.1 搜索意图

这不是普通乐手的知识查询，而是制琴、维修或改装用户的生产任务：

- 输入 scale length 和 fret count；
- 获得 nut-to-fret 与 fret-to-fret 距离；
- 正确放样、开槽、检查累计误差；
- 确定 bridge / compensation 参考位置；
- 对 multiscale、fanned fret 或非标准音律输出可制造图纸。

StewMac 在同一工具页同时使用 “Fret Position Calculator” 和 “Fret Spacing”，并且输出 fret 与 bridge placement；这直接说明两个查询属于同一页面意图：[StewMac Fret Calculator](https://www.stewmac.com/fret-calculator/)。

### 5.2 代表性竞品

| 竞品 | 已有能力 | 对本项目的含义 |
|---|---|---|
| StewMac | fret count、scale length、英/公制、乐器类型、nut-to-fret、fret-to-fret、bridge 位置 | 有行业品牌、工具销售和十年以上历史，不是“旧 UI = 弱竞争” |
| FretFind2D | 单/多/逐弦 scale、非平行品丝、微分音/Scala、完整几何模型 | 高级功能已经深入到专业制琴需求 |
| FretFind2D 导出 | DXF、单/多页 PDF、SVG、CSV、HTML、TAB | 简单增加导出按钮也不足以形成壁垒 |
| Liutaio Mottola | 12-TET 公式、17.817 常数、累计误差、extended range / multiscale / microtonal 说明 | 公式和专业解释已有可靠成熟来源 |

直接页面：[StewMac](https://www.stewmac.com/fret-calculator/)、[FretFind2D](https://www.ekips.org/tools/guitar/fretfind2d/)、[Liutaio Mottola Fret Position Calculation](https://www.liutaiomottola.com/formulae/fret.htm)。

### 5.3 真实机会与风险

名义上 260/KD 9 与 110/KD 6 很漂亮，但：

- 两词合并后仍是约 370/月的小型词族，且不能假定 volume 完全可加；
- StewMac 占据品牌和行业引用优势；
- FretFind2D 已经覆盖专业长尾；
- 制作用途对精度、打印比例和免责声明的要求比普通计算器高。

如果只输出位置表，产品价值不足。值得开发的最低门槛是：

1. 英寸 / 毫米实时换算；
2. 同时输出 nut-to-fret 和 fret-to-fret，并强调实际放样应以 nut 为共同基准；StewMac 明确解释逐品累加会放大误差：[StewMac Layout Notes](https://www.stewmac.com/fret-calculator/)；
3. 1:1 SVG / PDF 打印模板，带 100 mm / 1 inch 校准标尺、纸张拼接与打印缩放检查；
4. CSV / DXF 导出；
5. multiscale、neutral fret、左右手布局；
6. 理论 bridge 位置和 compensation 只作参考，不承诺最终 intonation。

标准 12-TET 的理想公式可写为：

`dₙ = L × (1 − 2^(−n/12))`

其中 `dₙ` 是第 n 品到琴枕的位置，`L` 是 scale length。Liutaio Mottola 给出了该公式、17.817 近似常数及误差讨论；实际音准还受按弦增张力、弦刚度等因素影响，所以几何位置不能包装成完整 intonation 保证：[Liutaio Mottola](https://www.liutaiomottola.com/formulae/fret.htm)、[Journal of the Acoustical Society of America 论文](https://doi.org/10.1121/10.0026483)。

### 5.4 页面边界与建议文案

- 唯一 URL：`/tools/fret-calculator/`
- Title：`Fret Calculator & Fret Spacing Template | Musician Tools`
- H1：`Fret Calculator`
- 主词：`fret calculator`
- 次级词：`fret spacing calculator`、fret position calculator、fret scale calculator、multiscale fret calculator

不要首期建立 ukulele、banjo、mandolin、bass 四个仅替换默认 scale length 的页面。品丝位置的基础数学由 scale length 与音律决定，换一个预设不等于新的搜索任务。乐器预设先放在同一工具内；未来只有在 GSC 显示独立需求，且页面能够提供对应制作说明和差异化输出时才拆页。

## 6. 三页的最终优先级

### P0-A：先开发 BPM / Delay

理由：

- 1,000/月、KD 3 是当前最佳低成本获客试验；
- 无外部数据库，可快速上线；
- 公式和边界条件容易建立单元测试；
- 可以用真实 GSC 数据验证域名、页面模板、索引和用户行为。

它不是商业核心，也不应投入数周做大而全。目标是以完整、顺手、无错误的体验尽快获得验证数据。

### P0-B：同批准备、第二个发布 String Tension Compare

理由：

- 搜索量最高；
- 复用和分享价值强于 BPM 工具；
- 与琴弦商品距离最近，最适合验证联盟点击；
- 但数据来源、条款和公式验证未解决前不能仓促发布。

这页的完成定义不是“公式能算”，而是“用户能从当前配置迁移到目标配置，并理解结果的来源和限制”。

### P1：最后开发 Fret Calculator

只有同时满足以下条件才进入开发：

- 可以提供可靠的 1:1 打印校准和至少一种工程导出；
- 愿意实现并测试 multiscale / neutral fret；
- 有制琴或维修用户参与验收；
- 前两页已经上线，不再需要用第三个工具掩盖尚未验证的获客问题。

## 7. 下一步执行计划

### Sprint 0：两天内完成决策输入

1. 从 Semrush 导出这 5 个词的 US 数据库、日期、趋势、CPC、SERP 前 10、Phrase Match、Related 和 Questions；
2. 将关键词映射固定为 3 个 URL，不再按词建立 5 页；
3. 审核 D’Addario / Stringjoy 数据的可使用范围，列出首版可核验的品牌、系列和 Unit Weight 字段；
4. 找 3–5 位有 Drop tuning、7/8-string 或换弦长经验的吉他手，验证 “current vs target” 是否比单配置计算更有用；
5. 找 1–2 位制琴/维修用户确认打印校准、DXF 和 bridge placement 中哪个是真正刚需。

### Sprint 1：开发并发布 BPM / Delay

MVP 验收清单：

- BPM ↔ quarter-note ms 双向计算；
- straight / dotted / triplet，1/1–1/64；
- Tap Tempo 异常间隔过滤与稳定度；
- ms / Hz 一键复制；
- URL 分享及干净 URL canonical；
- 移动端单手可操作；
- 公式单测、边界输入测试；
- 埋点：`tool_started`、`calculation_completed`、`tap_used`、`value_copied`、`share_clicked`；
- 提交 sitemap 到 Google Search Console。

上线后不要只看排名，先看：页面是否被索引、出现了哪些真实查询、计算完成率、Tap/Copy 使用率，以及用户是否返回。

### Sprint 2：完成 String Tension 数据可行性后再发布

MVP 验收清单：

- Current / Target 双配置；
- 逐弦和总张力变化；
- 标准、Drop D、半音降等预设；
- 至少一个完整、可核验的数据系列；
- 每个数据集有品牌、系列、来源、版本、最后核验日期；
- 与厂商样例交叉测试；
- 不输出琴颈安全结论；
- 分享配置与 affiliate 点击埋点。

如果无法合法、稳定地获得单位重量或厂商规格，暂停该页，不要用“线径近似单位重量”伪装成精确产品。

### 上线后 8–12 周的扩展门槛

- BPM 页有实际查询曝光，但 CTR 或使用率低：先改标题、首屏和任务完成速度，不新增工具；
- BPM 页有使用但曝光很少：补充真正相关的细分需求和内部链接，继续观察，不用批量生成变体页；
- String Tension 有比较、分享或 affiliate 点击：优先扩品牌数据与调弦工作流；
- Fret 相关词开始从首页或内容页获得曝光，且访谈确认打印/导出需求：再进入 P1；
- 两个首发工具都没有有效信号：回到关键词和分发渠道，不通过增加十几个低价值计算器掩盖问题。

## 8. SEO 实施原则

1. 一个用户任务对应一个完整页面，不为同义词复制页面；
2. 工具首屏可用，公式、方法、数据来源和限制紧随结果；
3. 页面标题准确、简洁，避免把所有变体堆进标题；Google 要求 title 描述页面且避免关键词堆砌：[Google Title Link 指南](https://developers.google.com/search/docs/appearance/title-link)；
4. 公开作者/审核者、计算方法、数据来源与更新记录；Google 的 people-first 指南强调原创增量、清晰来源、可验证的专业性和网站聚焦：[Google People-first Content 指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)；
5. 所有分享参数 URL canonical 到工具的干净 URL；Google 建议对重复或非常相似的 URL 指定 canonical，以集中信号和简化衡量：[Google Canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)；
6. 不以“必须写多少字、必须四条 FAQ、必须精确匹配每个词”为验收标准；验收标准应是用户能否准确、快速完成任务。

## 9. 最终裁决

用户提供的数据支持继续做这个方向，但不支持原文档中的“Fret 第一、String Tension 排后、按低 KD 批量铺页”。更合理的产品组合是：

- **BPM / Delay = 最快上线的获客实验**；
- **String Tension Compare = 首期真正的产品与商业核心**；
- **Fret Calculator = 有专业输出能力后再做的 P1 工具**。

这组数据最大的价值不是证明“可以做 5 个低竞争页”，而是帮助项目缩小为两个互补实验：一个验证 SEO，一个验证用户价值与购买意图。
