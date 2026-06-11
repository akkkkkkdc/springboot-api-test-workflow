# springboot-api-test-workflow

> 批量测试任意 REST 接口 · 3 套入参交叉验证 · 单文件 HTML 报告 · 真服务测试（绝无 mock）

[![Node](https://img.shields.io/badge/Node-24%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skill](https://img.shields.io/badge/Codex-skill-6F86FF)](https://github.com/)

---

## 报告长这样

**Hero — 顶部全貌**

![Hero](docs/images/report-hero.png)

**展开某条 episode — 3 套入参 tab + 真实 REQUEST/RESPONSE + ⚡ 数据条数对比**

![Expanded](docs/images/expanded-M.3.png)

**全长 — 全部 episode 一次展示**

![Full](docs/images/report-full.png)

---


---

## 是什么

一个 [Codex CLI skill](https://github.com/openai/codex)。把一组 REST 接口扔给它,真打后端,**每条查询接口用 3 套入参交叉验证**,跑完出一个**单文件 HTML 报告**(双击直接打开,无外部依赖)。

不限技术栈,不限业务类型。给前端 / 后端 / 测试 / 运维用都行,前提是**有真服务在跑**。

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





## 适用 vs 不适用

**✅ 适用**
- 任意 REST 接口的批量验证(查询 / 详情 / 导出)
- 想知道"参数是否真的影响 SQL"
- 想给开发 / 产品出一份"能点击看入参出参"的报告
- 已在开发中的任意 HTTP 服务 (localhost / 内网 IP / 公网都行)

**❌ 不适用**
- 单元测试 — 那是 JUnit / Mockito 范畴
- 前端 UI E2E — 那是 Playwright 范畴
- 仅 mock 自测 — 没真服务就别测

---
## License

MIT