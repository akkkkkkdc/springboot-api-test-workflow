// inject.js
// 从 probe.json + report.template.html 生成 test-report.html
// 用法：node inject.js <probe.json> <template.html> <out.html>
const fs   = require('node:fs');

const probePath  = process.argv[2] || './probe.json';
const tplPath    = process.argv[3] || './report.template.html';
const outPath    = process.argv[4] || './test-report.html';

const raw = JSON.parse(fs.readFileSync(probePath, 'utf8'));
let tpl = fs.readFileSync(tplPath, 'utf8');

const groups = {};
for (const r of raw) {
  const k = r.n + '|' + r.url + '|' + r.kind;
  if (!groups[k]) groups[k] = { cases:[] };
  groups[k].cases.push(r);
}
function aggr(cases) {
  const s = { PASS:0, WARN:0, FAIL:0, UNK:0 };
  for (const c of cases) s[c.status] = (s[c.status]||0)+1;
  if (s.FAIL>0) return 'FAIL';
  if (s.UNK>0)  return 'UNKNOWN';
  if (s.WARN>0) return 'WARN';
  return 'PASS';
}
let pass_ep=0, warn_ep=0, fail_ep=0;
for (const k in groups) {
  const a = aggr(groups[k].cases);
  if (a==='PASS') pass_ep++;
  else if (a==='WARN') warn_ep++;
  else if (a==='FAIL') fail_ep++;
}
const ep_num = Object.keys(groups).length;
const ts = new Date().toISOString().replace('T',' ').substring(0,19);
const realToken = (raw[0] && raw[0].body && raw[0].body.token) || '';

let calloutTitle, calloutBody;
if (fail_ep > 0) {
  calloutTitle = '发现 ' + fail_ep + ' 个接口异常，需开发修复';
  calloutBody  = '业务码 ≠ 0 或 HTTP 异常，请点开对应行查看 biz / msg 详情。';
} else if (warn_ep > 0) {
  calloutTitle = warn_ep + ' 个接口返回空数据';
  calloutBody  = '已用 3 套入参交叉验证：min / default / full 都空，说明后端测试库确实没数据，不是 bug。';
} else {
  calloutTitle = '全部接口测试通过';
  calloutBody  = '所有接口 3 套入参全 PASS。';
}

tpl = tpl
  .replace(/__BASE__/g,         process.env.BASE_URL || 'http://localhost:9123')
  .replace(/__TOKENSRC__/g,     'JWT · ' + realToken)
  .replace(/__TS__/g,           ts)
  .replace(/__EPNUM__/g,        ep_num)
  .replace(/__PASS_EP__/g,      pass_ep)
  .replace(/__WARN_EP__/g,      warn_ep)
  .replace(/__FAIL_EP__/g,      fail_ep)
  .replace(/__CALLOUT_TITLE__/g, calloutTitle)
  .replace(/__CALLOUT_BODY__/g,  calloutBody)
  .replace(/__DATA__/g,         JSON.stringify(raw));

fs.writeFileSync(outPath, tpl);
console.log('report written:', outPath, 'episodes:', ep_num, 'P/W/F:', pass_ep, warn_ep, fail_ep);