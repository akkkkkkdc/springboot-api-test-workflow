# 鉴权 5 个位置详解

JWT 鉴权在不同 Spring Boot 项目里放置位置不一样。**不要一开始就否认 token 失效**，按下面顺序逐个试。

## 1. 请求体 body（最常见于国内项目）

```bash
curl -X POST http://host/api/list -H "Content-Type: application/json" -d '{"token": "eyJxxx", "pageNum":1, "pageSize":10}'
```

**判断**：响应 `code = 0` + 正常数据 → 通过。

## 2. 请求头 Authorization: Bearer

```bash
curl http://host/api/list -H "Authorization: Bearer eyJxxx"
```

## 3. 请求头 token / X-Token（不带 Bearer）

```bash
curl http://host/api/list -H "token: eyJxxx"
curl http://host/api/list -H "X-Token: eyJxxx"
```

## 4. Cookie

```bash
curl http://host/api/list -H "Cookie: JSESSIONID=xxx; token=eyJxxx"
```

## 5. Query String（GET 接口常见）

```bash
curl "http://host/api/export?token=eyJxxx"
```

---

## 关键判断逻辑

如果用户给的 token 在 5 个位置都 401，**才**考虑 token 真过期。**不是**先怀疑用户给错。

### 5 分钟搞定鉴权位置

```javascript
// 5 位置扫描
const positions = [
  {name: 'header-bearer', headers: {Authorization: 'Bearer <TOKEN>'}},
  {name: 'header-token',   headers: {token: '<TOKEN>'}},
  {name: 'header-xtoken',  headers: {'X-Token': '<TOKEN>'}},
  {name: 'body-token',      body: {token: '<TOKEN>'}},  // POST 才行
  {name: 'query-token',     query: {token: '<TOKEN>'}}
];
```

### 常见错误响应

| 业务码 | 含义 | 该做什么 |
|---|---|---|
| `0` | 成功 | 继续 |
| `10` / `1001` / `-1`/`401` | 未登录 / token 失效 | 换位置 / 重新登录 |
| `403` | 无权限 | 用更高权限账号 |
| `500` | 服务异常 | 报告给后端 |

### Spring Security 默认 401 vs 业务码 401

- Spring Security 的 `401 Unauthorized` 是 HTTP 层，body 可能是 `{}` 或 `<html>...`
- 业务码 `401` 在 body JSON 里，HTTP 仍是 200

**两种都算鉴权失败**。