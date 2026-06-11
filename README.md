NOT FOUND: - 已在开发中的 Spring Boot 项目（localhost / 内网 I NOT FOUND: - 任意 REST 接口的批量验证（查询/详情/导出） NOT FOUND: // 你的服务地址 NOT FOUND: # 跑 N case (N = 你的接口数) NOT FOUND: # 生成 probe.json (case 数 = 你的接口数 × 入参数) NOT FOUND: - 你的服务**已经跑起来**(任何 HTTP 后端都行,不是本 skill 的事)   ok: > 批量跑 Spring Boot 报表接口 · 3 套入参交叉验证 · 单文件 # springboot-api-test-workflow

> 批量测试任意 REST 接口 · 3 套入参交叉验证 · 单文件 HTML 报告 · 真服务测试（绝无 mock）

[![Node](https://img.shields.io/badge/Node-24%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skill](https://img.shields.io/badge/Codex-skill-6F86FF?logo=data:image/svg%2Bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzZGODZGRiIvPjwvc3ZnPg==)](https://github.com/)

---

## 报告长这样

**Hero — 顶部全貌**

![Hero](docs/images/report-hero.png)

**展开某条 episode — 3 套入参 tab + 真实 REQUEST/RESPONSE + ⚡ 数据条数对比**

![Expanded](docs/images/expanded-M.3.png)

**全长 — 全部 episode 一次展示**

![Full](docs/images/report-full.png)

---

## 是什么

一个 [Codex CLI skill](https://github.com/openai/codex)。把一组 REST 接口扔给它,真打后端,**每条查询接口用 3 套入参交叉验证**,跑完出一个**单文件 HTML 报告**(双击直接打开,无外部依赖)。

不限技术栈,不限业务类型。给前端 / 后端 / 测试 / 运维用都行,前提是**有真服务在跑**。

---

## 6 步快速跑起来

### 1. 装环境

- 你的服务**已经跑起来**(任何 HTTP 后端都行,不是本 skill 的事)
- Node 24+ / npm 11+
- 拿到 ① **baseUrl** ② **token** ③ **接口清单**（md/表格/文字都行）

### 2. 摸鉴权位置（5 分钟）

按 5 个位置依次试，**不要一开始就怀疑 token 过期**：

| 顺序 | 位置 | 怎么打 |
|---|---|---|
| ① | 请求体 body `json 字段` | `POST` body 加 `"token": "<user_token>"` |
| ② | 请求头 Authorization | `Authorization: Bearer <user_token>"` |
| ③ | 请求头 X-Token / token | `token: <user_token>"`（不带 Bearer） |
| ④ | Cookie | `Cookie: JSESSIONID=xxx; token=xxx` |
| ⑤ | Query String | `?token=<user_token>"`（GET 常见） |

**判断成功标志**：响应里**业务码 = 0** + 有数据。**不是** 401 / code=10。

### 3. 填 token（两种方式）

**方式 A · 环境变量（推荐）**：

```bash
# Windows PowerShell
$env:TEST_TOKEN = "eyJ0eXAiOiJKV1Q..."

# macOS / Linux
export TEST_TOKEN="eyJ0eXAiOiJKV1Q..."
```

**方式 B · 直接改 probe.js**（不推荐，会泄露）：

```js
// 顶部那行
const TOKEN = process.env.TEST_TOKEN || 'eyJ0eXAiOiJKV1Q...';
```

> 警告：不要把带真 token 的 probe.js / test-report.html 提交到 git。本仓库 .gitignore 已忽略常见 token 泄露路径，但请自觉。

### 4. 跑测试

```bash
# 编辑 probe.js 顶部 3 行：OUT / BASE（TOKEN 走环境变量）
node scripts/probe.js
# 生成 probe.json (case 数 = 你的接口数 × 入参数)
```

### 5. 出报告 + 打开

```bash
node scripts/inject.js probe.json scripts/report.template.html test-report.html
```

### 6. 看报告

```bash
# Windows
start examples/test-report.html
# macOS
open examples/test-report.html
# Linux
xdg-open examples/test-report.html
```

---

## 3 套入参详解

| 套 | 内容 | 用途 |
|---|---|---|
| **min** | `{ pageNum:1, pageSize:5, token }` | 验证接口最少能跑通 |
| **default** | `{ keyword:'TEST', pageNum:1, pageSize:5, token }` | 用户日常使用 |
| **full** | `{ keyword:'TEST', dateRange[2026-01-01, 2026-06-10], region, category, deptId, pageNum:1, pageSize:20, token }` | 验证 SQL 因参数不同而异 |

**对比 3 套的 total** → 自动生成 `diffNote`（大白话）：

- `数据条数因入参不同而变化：min=46 / default=46 / full=26` → 绿
- `3 套入参都查到 0 条数据（后端没数据）` → 黄
- `3 套入参都查到 N 条（参数不影响）` → 蓝

---

## 视觉编码表

| 元素 | 颜色 | 语义 |
|---|---|---|
| **POST method chip** | 琥珀 `#F4B740` | 业务写操作 |
| **GET method chip** | 青绿 `#46D893` | 数据读取 |
| **接口路径** | 淡蓝 accent-soft | 关键信息提亮 |
| **size / elapsed / biz** | 淡蓝 accent-soft | 关键指标 |
| **PASS 状态** | 实色绿 | 测试通过 |
| **WARN 状态** | 实色黄 | 空数据 / 偏小 |
| **FAIL 状态** | 实色红 | 接口异常 |
| **接口名** | 主文字白 | 主信息 |
| **kind chip** | accent-bg 紫蓝 | 维度（list / detail / chart / xls） |

**两层分开**：method 低饱和 + 边框（次要语义） vs status 高饱和 + 实色（主要语义），不会撞色。

---

## 报告结构

```
[H1] API 测试报告 (渐变)
  [sub] 批量测试 N 个 ... 3 套入参交叉验证
  [meta-row] BASE_URL · TOKEN (不脱敏) · 时间戳

[4 stat 块]
  接口数 20 | 通过 10 | 警告 10 | 失败 0

[callout] 严重问题摘要

[toolbar] 4 个 filter chip (全部 / 失败 / 警告 / 通过)

[episode list] 1 行 1 接口（20 行）
  [ep-head] id | 名字+URL | POST/GET | kind | D/F/M chip | ▶
  [ep-body] (点开展开)
    [param-tabs] DEFAULT · 默认推荐参数 | FULL · 满参数 | MIN · 最小必要参数
    [param-pane] REQUEST (左) | RESPONSE (右)  ← 双栏并排
    [diff-note] ⚡ 数据条数：min=46 / default=46 / full=26

[footer]
```

---

## 项目结构

```
springboot-api-test-workflow/
├── README.md                          ← 你正在看
├── SKILL.md                           ← Codex skill 配置入口
├── push.ps1                           ← 一键推 GitHub
├── LICENSE                            ← MIT
├── scripts/                           ← 核心脚本
│   ├── probe.js                       ← 跑 N case (N = 你的接口数)
│   ├── inject.js                      ← probe.json → HTML
│   └── report.template.html           ← HTML 模板（固化设计）
├── references/                        ← 知识库
│   ├── auth-5-positions.md            ← 鉴权 5 个位置详解
│   ├── default-design-system.md       ← 设计 token（颜色/字体/间距）
│   ├── self-audit-checklist.md        ← 16 条自检清单
│   ├── newman-vs-node-raw.md          ← 为什么不用 Newman
│   └── what-is-mock-and-why-not.md    ← mock ≠ 真测试
├── examples/                          ← 示例输出
│   ├── interfaces-mock.md             ← 示例接口清单（mock）
│   ├── test-report.html               ← 生成的报告（最终态）
│   └── test-report-top.png            ← 报告顶部截图
└── docs/images/                       ← README 截图
    ├── report-hero.png
    ├── expanded-M.3.png
    └── report-full.png
```

---



---

## 完整使用流程（30 秒跑通）

按下面 4 步，**从克隆到出报告**一气呵成：

### Step 1 · 准备接口清单

随便写一个 my-endpoints.md，最简格式：

```markdown
| # | Method | Path | 说明 |
|---|--------|------|------|
| 1 | POST   | /api/xxx/list   | xxx列表 |
| 2 | GET    | /api/xxx/export| xxx导出 |
| 3 | POST   | /api/yyy/list   | yyy列表 |
```

> 字段顺序无要求,只要含 Method + Path + name/说明。probe.js 会按行解析。

### Step 2 · 改 probe.js 的 3 处

打开 `scripts/probe.js`,改最顶上 3 行:

```js
const OUT  = 'C:/path/to/your/output-dir';   // 报告输出目录
const BASE = 'http://your-service:9123';      // 你的服务地址

// 接口清单改成你自己的 (probe.js 里有 demo, 全删了换)
const listEndpoints = [
  { n:'1', name:'xxx列表',   path:'/api/xxx/list'    },
  { n:'2', name:'xxx导出',   path:'/api/xxx/export'  },
  { n:'3', name:'yyy列表',   path:'/api/yyy/list'    }
];
// GET 详情/图表: getEndpoints
// 导出接口:    exportEndpoints

// 3 套入参改成你的业务字段
const PARAMS = {
  min:     { pageNum: 1, pageSize: 5, token: TOKEN },
  default: { keyword: 'TEST', pageNum: 1, pageSize: 5, token: TOKEN },
  full: {
    keyword: 'TEST', pageNum: 1, pageSize: 20,
    startTime: '2026-01-01', endTime: '2026-06-10',
    /* 这里放你接口的所有维度字段 */
    token: TOKEN
  }
};
```

### Step 3 · 设置 token + 跑

```powershell
# Windows PowerShell
$env:TEST_TOKEN = "eyJ0eXAiOiJKV1..."     # 你的真 token
node scripts/probe.js                                # 生成 probe.json
node scripts/inject.js probe.json scripts/report.template.html test-report.html
start examples/test-report.html                       # 双击打开
```

```bash
# macOS / Linux
export TEST_TOKEN="eyJ0eXAiOiJKV1..."
node scripts/probe.js
node scripts/inject.js probe.json scripts/report.template.html test-report.html
open examples/test-report.html
```

### Step 4 · 看报告

打开 `examples/test-report.html` 之后,直接看顶部 4 个统计块 + 下方折叠列表:

- **绿色 POST** = 查询接口
- **青色 GET**  = 导出/详情接口
- 点击任意一行 = 展开看该接口的 **3 套入参 + 真实响应**
- 顶部 callout 会自动汇总 "**N 个接口返回空数据**" 等系统性问题

> **如果一个接口都没识别到**: 99% 是鉴权位置没找对. 回去看 [5 个鉴权位点](#22-摸鉴权位置5-分钟)。

### 自定义:只跑 1 个接口调试

```js
// 在 probe.js 底部, 临时加一行
runOne({ n:'DEBUG', name:'xxx列表', path:'/api/xxx/list' }, 'default');
```

跑完会打 1 条 case 到控制台,确认 body / 鉴权 / SQL 都对再批量跑。

### 自定义:Token 在请求头

```js
// 改 probe.js 里的 httpPost / httpGet 函数
function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(BASE + path);
    const data = Buffer.from(JSON.stringify(body));
    const req = http.request({
      hostname: u.hostname, port: u.port,
      path: u.pathname, method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': data.length,
        'token':         TOKEN    // 改这里
      }
    }, res => {
      let chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}
```

> 所有自定义示例都在 `references/` 里 (`auth-5-positions.md` / `default-design-system.md`)。

## 注意事项

- **先试鉴权位置,别先怀疑 token** — 5 个位置(请求体 / Authorization 头 / X-Token 头 / Cookie / Query String)按顺序试,通常第三个就中。
- **GET 的 token 走 query string,POST 走 body** — 后端鉴权方式不固定,两种都准备。
- **跑完立刻看 diff-note** — 报告里每个 episode 都有 ⚡ 数据条数对比,min/default/full 三套入参 total 不一样才说明 SQL 在按参数走,完全一样可能是后端忽略参数。
- **遇到 401 别改 token** — 先去 `references/auth-5-positions.md` 对照看鉴权位点对不对。

---
## 设计模式

**单模式**（v4 起固化）：本 skill **不再检测 anti-ai-feel-design**，永远用内置的 `report.template.html` 渲染。

> 不管你电脑里装没装 anti-ai-feel-design，**报告 UI 100% 一致**。这是用户已经确认的视觉标准。

设计 token 见 `default-design-system.md`，包含：
- **颜色** accent `#6F86FF` / success `#46D893` / warn `#F4B740` / error `#FF6E6E` / POST `#F4B740` / GET `#46D893`
- **字体** Inter + Noto Sans SC + JetBrains Mono
- **字号** h1 56 / stat 56 / body 15 / label 11
- **间距** 8pt scale
- **圆角** badge 6 / card 14 / pill 999
- **装饰** dot grid 96px + 3 个 radial gradient + pulse 圆点

---

## 适用 vs 不适用

✅ **适用**：
- 任意 REST 接口的批量验证（查询/详情/导出）
- 想知道"参数是否真的影响 SQL"
- 想给开发/产品出一份"能点击看入参出参"的报告
- 已在开发中的任意 HTTP 服务 (localhost / 内网 IP / 公网都行)

❌ **不适用**：
- 单元测试 —— 那是 JUnit / Mockito 范畴
- 前端 UI E2E —— 那是 Playwright 范畴
- 仅 mock 自测 —— 没真服务就别测

---

## License

MIT