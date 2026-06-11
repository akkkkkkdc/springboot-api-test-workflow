# 自检清单（v4 · 16 条）

报告生成后跑一遍，**每条都过才算交付**。

## 报告结构

- [ ] **1 行 1 接口**（不是 1 行 1 case）—— M.1 列表 / M.1 导出 是 2 行
- [ ] 行内 D / F / M 三个 chip 各自带状态色（PASS 绿 / WARN 黄 / FAIL 红 / UNK 灰）
- [ ] 点开展开后，**3 套入参 tab**（DEFAULT / FULL / MIN）可切换
- [ ] 每个 tab 里有 **REQUEST**（入参）和 **RESPONSE**（出参）双栏
- [ ] JSON 有 4 色语法高亮（key 蓝 / 字符串 绿 / 数字 黄 / null 红）

## 数据真实性

- [ ] **token 不脱敏**——直接显示在 meta-row 和展开的 REQUEST 里
- [ ] stat-strip 5 个数字 = `node probe.js` 跑出来的实际数（不是写死）
- [ ] callout 文案根据 FAIL/WARN/PASS 动态生成
- [ ] diff-note 正确反映"3 套入参 total 是否一致"（参数影响 SQL / 均空数据 / 一致）
- [ ] **未测接口 86 个**是从 `/v2/api-docs` diff 出来的（不是 hardcode）

## 视觉

- [ ] `<html lang="zh-CN">` 设置了
- [ ] 用了 Inter + PingFang SC 字体回退
- [ ] **单一主色** `#6F86FF`（不要 5 个色块争抢）
- [ ] 字号跨度 ≥ 4 倍（h1 56 → label 11）
- [ ] ep-head padding ≥ 28px 横向 / 24px 纵向（**不紧凑**）
- [ ] ep 间 gap ≥ 16px
- [ ] 状态用色块 + 左边 3px border-left，**不用 emoji**（diff-note 的 ⚡ 算功能性提示例外）
- [ ] 严重问题 callout 置顶（不是在 list 末尾）

## 工艺

- [ ] footer 写明生成时间 + skill 名 + 真实 token
- [ ] JS 错误控制台无报错（点 tab / 点 chip / 点 ep-head 不报错）
- [ ] Chrome 1440 宽度下右侧不空（container 1440 - padding 64 = 1312 内容宽）
- [ ] 滚动到底能看到"未测接口" section