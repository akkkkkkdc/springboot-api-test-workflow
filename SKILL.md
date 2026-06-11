---
name: springboot-api-test-workflow
description: Use when the user wants to batch-test a Spring Boot REST API''s report endpoints, says "跑一下接口" / "测试这 11 个接口" / "跑一遍 /report/pc/..." / wants an HTML report of POST list + GET export-excel style endpoints, or provides a markdown table of report endpoints to validate. Works on a real running Spring Boot service (localhost or LAN), produces a single-file HTML report with clickable rows showing real request/response. NOT for unit tests (JUnit), not for UI/E2E (use playwright skill), and not for mock self-tests.
---

# Spring Boot 报表接口批量测试工作流 v4

跑通"先 token → 再测试 → 出报告"全流程。**核心原则：永远先打真服务，绝不 mock 自测骗自己。**

## 启动条件

- Spring Boot 服务**已经跑起来**（不是本 skill 的事）
- 用户给：① **baseUrl** ② **token** ③ **接口清单**（md/表格/文字都行）
- Node 24+ / npm 11+

## 5 步工作流（严格按顺序）

### Step 1: 摸鉴权位置（**关键，5 分钟搞定**）

按下面顺序试，**不否认用户的 token**，**先怀疑放置位置**：

| 顺序 | 位置 | 怎么打 |
|---|---|---|
| ① | **请求体 body（json 字段）** | `POST` 任意接口 + body 加 `"token": "<user_token>"` |
| ② | **请求头 Authorization** | `Authorization: Bearer <user_token>"` |
| ③ | **请求头 X-Token / token** | `token: <user_token>"`（不带 Bearer） |
| ④ | **Cookie** | `Cookie: JSESSIONID=xxx; token=xxx` |
| ⑤ | **Query String** | `?token=<user_token>"`（GET 接口常见） |

**判断成功的标志**：响应里**业务码 = 0** 且有正常数据。**不是** 401 / "tokenlogin" / "登录过期" / code=10。

**如果 5 个位置都不行**：再考虑 token 真的过期了（**不要一开始就怀疑 token 失效**）。

### Step 2: 编辑 probe.js

打开 `scripts/probe.js`，把顶部 4 行填好：

```js
const OUT    = '';                 // 报告输出目录
const BASE   = '';                 // 服务地址（含端口）
const TOKEN  = '';                 // 完整 JWT
```

跑：

```bash
node scripts/probe.js
# 生成 probe.json
```

**会跑出**：
- 9 个 POST 列表接口 × **3 套入参** = 27 case
- 2 个 GET（详情 + 柏拉图） × 3 套入参 = 6 case
- 9 个 GET 导出 × **2 套入参** = 18 case
- **合计 51 case / 20 episode**

### 3 套入参（v4 核心改进）

| 套 | 含义 | 用在 |
|---|---|---|
| **min** | 最小必要参数（只分页 + token + 必填 ID） | 验证接口最少能跑通 |
| **default** | 默认推荐参数（如 keyword + 分页） | 用户日常用 |
| **full** | 满参数（时间区间 + 所有维度） | 验证 SQL 因参数而异 |

**对比 3 套的 total/records** → 自动生成 `diffNote`（大白话）：
- `数据条数因入参不同而变化：min=46 / default=46 / full=26` → 绿
- `3 套入参都查到 0 条数据（后端没数据）` → 黄
- `3 套入参都查到 N 条（参数不影响）` → 蓝

### Step 3: 生成 HTML 报告

```bash
node scripts/inject.js probe.json report.template.html test-report.html
```

报告**完全自包含**（无外部依赖，除 Google Fonts CDN）。**直接双击打开**。

报告特点（**参考 examples/test-report.html**）：
- 单文件 HTML，无构建
- 顶部 **4 个 stat 块**（接口数 / 通过 / 警告 / 失败）—— 按 episode 维度算（同一接口只要有 1 套入参挂了就计入对应状态）
- **1 行 1 接口**（20 episode） + D / F / M 三个 mini chip
- **点开 episode**：3 套入参 tab 可切，每个 tab 有 REQUEST + RESPONSE 双栏
- **真实 token 显示**（不脱敏）
- **4 种状态色**（PASS 绿 / WARN 黄 / FAIL 红 / UNK 灰）+ **2 种 method 色**（POST 琥珀 / GET 青绿）

### 视觉编码表（v4 颜色规则·已固化标准）

| 元素 | 颜色 | 语义 |
|---|---|---|
| **POST method chip** | 琥珀 `#F4B740` | 业务写操作（列表/查询） |
| **GET method chip** | 青绿 `#46D893` | 数据读取（详情/导出/柏拉图） |
| **接口路径** | 淡蓝 accent-soft | 关键信息提亮 |
| **size / elapsed / biz** | 淡蓝 accent-soft | 关键指标 |
| **PASS 状态** | 实色绿 | 测试通过 |
| **WARN 状态** | 实色黄 | 空数据 / 偏小 |
| **FAIL 状态** | 实色红 | 接口异常 |
| **接口名** | 主文字白 | 主信息 |
| **kind chip** | accent-bg 紫蓝 | 维度（list / detail / chart / xls） |

method 配色**低饱和 + 边框**，status 配色**高饱和 + 实心**，两层不会混。

> **重要：UI 已固化，不要再调 anti-ai-feel-design**
> 这套配色是用户已经确认的视觉标准，存放在 `scripts/report.template.html`。
> 不管本机有没有装 `anti-ai-feel-design` skill，**本 skill 都直接用 fallback 渲染**。
> 这样保证每次跑出来的报告 UI 100% 一致。

## 设计模式：单模式（v4 起固化）

本 skill 在 v4 终态时**不再自动检测 `anti-ai-feel-design`**：

- **唯一输出**：用本 skill 内置的 `scripts/report.template.html`（已含完整 design token）
- **不再调任何其他 design skill**
- **每次跑出来 UI 100% 一致**（除非你手动改 report.template.html）

设计 token 见 `references/default-design-system.md`，包含：
- 颜色（accent #6F86FF / success / warn / error / POST #F4B740 / GET #46D893）
- 字体（Inter + Noto Sans SC + JetBrains Mono）
- 字号（h1 56 / stat 56 / body 15 / label 11）
- 间距（8pt scale）
- 圆角（badge 6 / card 14 / pill 999）
- 装饰（dot grid 96px + 3 个 radial gradient + pulse 圆点）

## Step 4: 自检报告

按 `references/self-audit-checklist.md` 跑一遍（16 条），不通过就改。

## 调试原则（**踩过的坑**）

1. **不要一开始就否认用户的 token**——先试 5 个鉴权位置
2. **GET 接口的 token 必须拼到 query string**——POST 在 body 里。**两个都试**
3. **`probe.js` 里的 GET 构造必须有 `u.searchParams.set(''token'', token)`**——不然 GET 永远 401
4. **业务码解析要支持字符串**——后端可能 `"code": "-1"`（带引号）而不是 `"code": -1`
5. **详情接口 splitId 是必传**——3 套入参都必须带（v4 探针自动注入）
6. **JWT 没 exp 字段不等于 token 永久有效**——后端可能用 Redis 或 IP 绑定的 session
7. **同一 token 不能跨 session 用**——拿 token 立刻连打 51 个，别存起来分批跑
8. **导出 Excel 的 content-type 不一定是 `spreadsheetml`**——也可能是 `application/vnd.ms-excel`（xls 旧格式）
9. **PowerShell 写 JS 文件用 `node -e` 或 `Out-File` 转义很坑**——用 `node script.js` 跑独立脚本最稳
10. **method chip CSS 没生效？**——检查 JS 里 `class="ep-method"` 是否拼接了 method 名（必须是 `class="ep-method POST"`）

## 文件结构

```
springboot-api-test-workflow/
├── SKILL.md                                    # 本文件
├── scripts/
│   ├── probe.js                                # 跑 51 case（清单驱动）
│   ├── inject.js                               # probe.json → HTML
│   └── report.template.html                    # HTML 模板（含固化 UI 设计）
├── references/
│   ├── auth-5-positions.md                     # 鉴权 5 个位置详解
│   ├── default-design-system.md                # 内置设计 token（v4 终态）
│   ├── newman-vs-node-raw.md                   # 为什么不用 Newman
│   ├── self-audit-checklist.md                 # 16 条自检
│   └── what-is-mock-and-why-not.md             # 解释 mock ≠ 真测试
└── examples/
    ├── interfaces-mock.md                     # 示例接口清单（mock）
    ├── test-report.html                        # 生成的报告（最终态）
    └── test-report-top.png                     # 报告顶部截图
```

## 调用本 skill 的话术

当用户说以下任意一种时触发：
- "把这 11 个报表接口跑一遍" / "测一下销售订单 / 客户 / 订单明细"
- "给我出一份接口测试报告" / "要可点击看入参出参的"
- "http://localhost:9123 用这个 token 跑一下" / 提供 baseUrl + token + 接口清单
- "上次那个 springboot 接口测试 skill 跑一下"（指本 skill）

**不要**对以下场景使用：
- 单元测试（JUnit/Mockito）—— 那是 spring-bug-audit skill 范畴
- 前端 UI E2E（浏览器自动化）—— 那是 playwright skill
- 仅 mock 自测（没有真服务）—— 拒绝，明确说"没服务就没法测"