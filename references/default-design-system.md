# Fallback Design System（内置版 · v4）

> 当 `anti-ai-feel-design` skill **不在** `$CODEX_HOME/skills/anti-ai-feel-design/` 时，
> 本 skill 用本文件里的 token 自渲染 v4 报告。
> 当 `anti-ai-feel-design` **在** 时，先尝试调它；它产出的版式会和本文件等价的 v4 不同，但报告功能相同（一样点开看入参出参、一样状态徽章）。

## 设计哲学

- **科技感 + 简洁不紧凑**（用户要求）
- 1 个主色（不要 5 个）
- 字号跨度大（h1 56 / stat-num 56 / body 15 / mono 12.5）
- 留白克制但段间距放够（ep-head 30px padding 36px / ep 间 18px）
- 圆角克制（badge 6 / card 14 / pill 999）

## 颜色 token（与 v4 报告 HTML 一致）

```yaml
bg-page:        "#0A0B0F"   # 页面底
bg-surface:     "#131419"   # ep card
bg-surface-2:   "#1A1C24"   # ep-body 内底
bg-elevated:    "#23262F"   # 嵌套 card / code block header
border:         "#2C2F3A"   # hairline
border-strong:  "#3D4050"   # 强分隔

text:           "#F2F3F7"   # 主文字
text-soft:      "#C8CAD4"   # 次文字
text-muted:     "#8C8F9E"   # 标签 / 描述
text-faint:     "#5A5C6A"   # 元数据 / url

accent:         "#6F86FF"   # 主色
accent-soft:    "#98ABFF"
accent-bg:      "#1A2240"
accent-grad-to: "#46D893"   # 标题渐变收尾色

success:        "#46D893"
success-bg:     "#0E2A1F"
warn:           "#F4B740"
warn-bg:        "#2C1F0A"
error:          "#FF6E6E"
error-bg:       "#2D1014"
unknown:        "#7A7E8B"
unknown-bg:     "#1A1C24"

# JSON 语法高亮
key: "#6F86FF"  # JSON 字段
str: "#46D893"  # JSON 字符串
num: "#F4B740"  # JSON 数字
bool:"#FF6E6E"  # null / true / false
```

## 字体

```yaml
sans:    '"Inter", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif'
mono:    '"JetBrains Mono", "Consolas", "Menlo", monospace'

h1:         56px / 1.08 / -0.035em / 600
h2:         32px / 1.20 / -0.020em / 600
stat-num:   56px / 1.00 / -0.025em / 600
body:       15px / 1.65
code:       12.5px / 1.70
label:      11px / 1.00 / 0.16em uppercase
```

## 间距 / 圆角

```yaml
container:   1440px
container-pad: 64px

radius:    10px    # 通用
radius-lg: 14px    # ep card
radius-pill: 999   # filter chip / status pill

# 8pt scale
spacing: 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 44 / 56 / 64 / 80 / 96 / 104 / 120

ep-head-padding: 30px 36px
ep-body-padding: 0 36px 36px
ep-gap: 18px
```

## 装饰

- **dot grid** 背景（96px 间距，2% 透明）
- **顶部 3 个 radial gradient**（蓝/绿/蓝紫）
- **pulse 圆点**（成功色 2.4s 循环）
- **状态条** 在 ep 左侧 3px solid
- 无 box-shadow，全靠 tonal layers + 1px border

## 报告布局（v4 形态）

```
[.eyebrow] API TEST REPORT · v4 · 3-PARAM-SET
h1 (56px) API 测试报告 (渐变)
.sub 批量测试 N 个 ... 3 套入参
.meta-row BASE_URL / TOKEN (不脱敏) / 时间戳

[.stat-strip] 5 列 56px 大数字
[.callout] 严重问题摘要
[.toolbar] 4 个 filter chip

[.ep-list]
  每个 ep: id | name+url | method | kind | D/F/M chip | ▶
  点开 ep-body: 
    [param-tabs] DEFAULT | FULL | MIN (带状态 pill)
    [param-pane] REQUEST | RESPONSE (双栏)
    [diff-note] 跨入参对比

[.untested-section] h2 + grid (扩展扫描发现)
[footer]
```

## 7 条反 AI 味规则（v4 都遵守）

1. **字体别用系统默认** — Inter + PingFang SC fallback
2. **1 个主色** — `#6F86FF` 只用 1 个
3. **留白克制但段间距大** — ep-head 30px / 36px 横向 / 18px ep-gap
4. **动画别装饰** — pulse 圆点 + 1 个 transition 0.15s
5. **排版要诚实** — 字号跨度 ~4.5 倍（h1 56 → label 11）
6. **文案要具体** — 不用"继续" / "Submit" 之类
7. **UI 不用 emoji** — 状态用色块，diff-note 里的"⚡" 是个例外（功能性提示）