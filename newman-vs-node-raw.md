# 为什么不直接用 Newman

`postmanlabs/newman` 是 Postman 官方 CLI runner，看起来适合接口测试。**但本 skill 不用它**，原因：

## Newman 的问题（实测踩到）

1. **GET 接口响应读取复杂**——导出 Excel 的二进制流，Newman 报告里只能看 200 OK，没法看真实数据
2. **断言逻辑调试困难**——Newman 失败只报"AssertionError: expected 200"，不知道是 token 错、参数错、还是 service 错
3. **环境依赖重**——需要 `npm install -g newman`，第一次跑要装 100+ 包
4. **PowerShell 兼容性差**——`spawn('npx')` 在 Windows Node 找不到，要用 `npx.cmd` + `shell: true`
5. **JSON 路径断言繁琐**——`pm.expect(json.data.list.length).to.be.at.least(1)` 比写原生 JS 啰嗦
6. **不能完整保存入参/出参**——`pm.response.json()` 取到的是 response 不是 raw 字节

## 我们用 Node raw HTTP

直接 `http.request()` / `http.get()` 跑：

- ✅ 每个请求的完整 raw 响应存进 `probe-full.json`
- ✅ 入参/出参都是原始字符串，方便后面生成报告
- ✅ 调试容易——`console.log(resp.statusCode, ct, size)` 一目了然
- ✅ 跨平台一致（Windows / macOS / Linux 行为一样）
- ✅ 0 依赖（除 Node 内置）

## 结论

- **给后端发的报告**用 `probe-full.js`（Node）+ HTML 模板
- **如果未来要 CI 集成**（Jenkins / GitHub Actions）再考虑 Newman，那时换 `scripts/probe-ci.js` 即可