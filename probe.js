// ════════════════════════════════════════════════════════════════════
// ⚠️ 公开仓库示例 - 请改为你自己的接口清单
// ════════════════════════════════════════════════════════════════════
// 下面的 listEndpoints / getEndpoints / exportEndpoints
// 是 demo 演示用的占位 (M.1 ~ M.9, fake /api/demo/... 路径)。
// 真实使用时请:
//   1) 改成你自己的接口路径 + 鉴权字段 (keyword / status / dateRange 等)
//   2) PARAMS 里的 min/default/full 三个档位, 按你的业务字段填充
//   3) TOKEN 通过环境变量传入: TEST_TOKEN=eyJ... node probe.js
// ════════════════════════════════════════════════════════════════════
// Spring Boot 报表接口批量测试 v4
// - 每个查询接口测 3 遍入参 (min / default / full)
// - 导出接口测 2 遍 (default / full)
// - 详情接口 splitId 强制带入
// - 不脱敏 token
// 不做 swagger 扩展扫描（清单驱动，不假设后端有 swagger）
const http = require('node:http');
const fs   = require('node:fs');

const OUT  = 'C:/Users/wuyuan-002/Documents/项目/springboot-api-test-demo';
const BASE = 'http://localhost:9123';
const TOKEN = process.env.TEST_TOKEN || '<PASTE_YOUR_TOKEN_HERE>';

const PARAMS = {
  // ⚠️ 公开仓库 demo: 改成你自己的三档入参
  min:     { pageNum: 1, pageSize: 5, token: TOKEN },
  default: { keyword: 'TEST', pageNum: 1, pageSize: 5, token: TOKEN },
  full: {
    keyword:   'TEST',
    pageNum:   1,
    pageSize:  20,
    startTime: '2026-01-01',
    endTime:   '2026-06-10',
    region:    'EAST',
    category:  'A',
    deptId:    1,
    splitId:   1,
    token:     TOKEN
  }
};

const listEndpoints = [
  // ⚠️ 公开仓库 demo: 改成你自己的接口清单
  { n:'M.1', name:'销售订单-列表',     path:'/api/demo/sales-orders' },
  { n:'M.2', name:'客户列表',         path:'/api/demo/customers' },
  { n:'M.3', name:'订单明细',         path:'/api/demo/order-details' },
  { n:'M.4', name:'产品库存',         path:'/api/demo/inventory' },
  { n:'M.5', name:'员工绩效',         path:'/api/demo/employee-performance' },
  { n:'M.6', name:'财务报表-列表',     path:'/api/demo/finance-reports' },
  { n:'M.7', name:'质量检查',         path:'/api/demo/quality-checks' },
  { n:'M.8', name:'设备维护',         path:'/api/demo/equipment-maintenance' },
  { n:'M.9', name:'物流跟踪',         path:'/api/demo/logistics-tracking' },
];

const getEndpoints = [
  // ⚠️ 公开仓库 demo: 改成你自己的 GET 详情/图表
  { n:'M.7', name:'质量检查-详情', path:'/api/demo/quality-checks/detail', kind:'detail', needsSplitId:true  },
  { n:'M.6', name:'财务报表-图表', path:'/api/demo/finance-reports/chart', kind:'chart',  needsSplitId:false }
];

const exportEndpoints = [
  // ⚠️ 公开仓库 demo: 改成你自己的导出接口
  { n:'M.1', name:'销售订单-导出Excel',  path:'/api/demo/sales-orders/export-excel'    },
  { n:'M.3', name:'订单明细-导出Excel',  path:'/api/demo/order-details/export-excel'   },
  { n:'M.6', name:'财务报表-导出Excel',  path:'/api/demo/finance-reports/export-excel' },
  { n:'M.7', name:'质量检查-导出Excel',  path:'/api/demo/quality-checks/export-excel'  },
  { n:'M.9', name:'物流跟踪-导出Excel',  path:'/api/demo/logistics-tracking/export-excel' }
];

function httpRequest(method, urlPath, body) {
  return new Promise(function(resolve){
    var opts = { hostname:'localhost', port:9123, path:urlPath, method:method, headers:{}, timeout:15000 };
    var bodyStr = null;
    if (method === 'POST') {
      bodyStr = JSON.stringify(body);
      opts.headers['Content-Type']  = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    var startedAt = Date.now();
    var req = http.request(opts, function(resp){
      var chunks=[]; resp.on('data',function(d){chunks.push(d);});
      resp.on('end',function(){
        var buf = Buffer.concat(chunks);
        var ct  = resp.headers['content-type']||'';
        var isExcel = ct.indexOf('spreadsheetml')>=0 || ct.indexOf('ms-excel')>=0 || ct.indexOf('octet-stream')>=0;
        var bodyText = buf.toString('utf8');
        var m1 = bodyText.match(/"code"\s*:\s*["'']?(-?\d+)["'']?/);
        var biz = m1 ? m1[1] : '';
        var m2 = bodyText.match(/"(?:message|msg)"\s*:\s*"([^"]+)"/);
        var msg = m2 ? m2[1] : '';
        var m3 = bodyText.match(/"total"\s*:\s*(\d+)/);
        var total = m3 ? m3[1] : '-';
        var m4 = bodyText.match(/"records"\s*:\s*\[([^\]]*)\]/);
        var recordsLen = m4 ? m4[1].replace(/\s/g,'').length : 0;
        resolve({ http:resp.statusCode, ct:ct, size:buf.length, elapsed:Date.now()-startedAt, isExcel:isExcel, body:bodyText, biz:biz, msg:msg, total:total, recordsLen:recordsLen });
      });
    });
    req.on('error', function(e){ resolve({http:'ERR', ct:'', size:0, elapsed:0, isExcel:false, body:'', biz:'', msg:e.message, total:'-', recordsLen:0}); });
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function judge(r, kind) {
  if (r.http !== 200) return { status:'FAIL', extra:'HTTP '+r.http };
  if (r.biz && r.biz !== '0') {
    if (r.biz === '10') return { status:'UNKNOWN', extra:'token 失效 (biz=10) '+(r.msg||'') };
    return { status:'FAIL', extra:'业务码='+r.biz+' '+(r.msg||'') };
  }
  if (kind === 'chart' && !r.body.match(/item/)) return { status:'WARN', extra:'响应无 item 字段(空数据?)' };
  if (kind === 'detail' && r.size < 80)          return { status:'WARN', extra:'详情响应 '+r.size+'B 偏小' };
  if (kind === 'xls' && !r.isExcel)              return { status:'FAIL', extra:'非 Excel 流: '+r.ct };
  if (kind === 'xls' && r.size < 500)            return { status:'WARN', extra:'Excel 流 '+r.size+'B 偏小(空?)' };
  if (kind === 'list' && /"records"\s*:\s*\[\s*\]/.test(r.body)) return { status:'WARN', extra:'空数据(records=[])' };
  return { status:'PASS', extra:'total='+r.total+', records.len='+r.recordsLen };
}

function buildQuery(body) {
  var qs = [];
  for (var k in body) {
    var v = body[k];
    if (Array.isArray(v)) qs.push(encodeURIComponent(k)+'='+encodeURIComponent(v.join(',')));
    else if (typeof v === 'string') qs.push(encodeURIComponent(k)+'='+encodeURIComponent(v));
    else qs.push(encodeURIComponent(k)+'='+encodeURIComponent(String(v)));
  }
  return qs.join('&');
}

var results = [];
var t0 = Date.now();

async function runList(c) {
  for (var i=0; i<3; i++) {
    var paramSet = ['min','default','full'][i];
    var body = PARAMS[paramSet];
    var r = await httpRequest('POST', c.path, body);
    var j = judge(r, 'list');
    results.push({ n:c.n, name:c.name, method:'POST', url:c.path, kind:'list', paramSet:paramSet, body:body, requestBody:JSON.stringify(body), http:r.http, ct:r.ct, size:r.size, elapsed:r.elapsed, isExcel:r.isExcel, responseText:r.body, biz:r.biz, msg:r.msg, total:r.total, recordsLen:r.recordsLen, status:j.status, extra:j.extra });
  }
}

async function runGet(c) {
  for (var i=0; i<3; i++) {
    var paramSet = ['min','default','full'][i];
    var body = Object.assign({}, PARAMS[paramSet]);
    if (c.needsSplitId) body.splitId = PARAMS.full.splitId;
    var query = buildQuery(body);
    var r = await httpRequest('GET', c.path + '?' + query, null);
    var j = judge(r, c.kind);
    results.push({ n:c.n, name:c.name, method:'GET', url:c.path, kind:c.kind, paramSet:paramSet, body:body, requestQuery:query, http:r.http, ct:r.ct, size:r.size, elapsed:r.elapsed, isExcel:r.isExcel, responseText:r.body, biz:r.biz, msg:r.msg, total:r.total, recordsLen:r.recordsLen, status:j.status, extra:j.extra });
  }
}

async function runExport(c) {
  for (var i=0; i<2; i++) {
    var paramSet = ['default','full'][i];
    var body = PARAMS[paramSet];
    var query = buildQuery(body);
    var r = await httpRequest('GET', c.path + '?' + query, null);
    var j = judge(r, 'xls');
    results.push({ n:c.n, name:c.name, method:'GET', url:c.path, kind:'xls', paramSet:paramSet, body:body, requestQuery:query, http:r.http, ct:r.ct, size:r.size, elapsed:r.elapsed, isExcel:r.isExcel, responseText:r.body, biz:r.biz, msg:r.msg, total:r.total, recordsLen:r.recordsLen, status:j.status, extra:j.extra });
  }
}

(async function(){
  for (var i=0; i<listEndpoints.length; i++)   await runList(listEndpoints[i]);
  for (var i=0; i<getEndpoints.length; i++)    await runGet(getEndpoints[i]);
  for (var i=0; i<exportEndpoints.length; i++) await runExport(exportEndpoints[i]);

  // 跨入参 SQL 差异分析
  var groups = {};
  for (var i=0; i<results.length; i++) {
    var r = results[i];
    if (r.kind === 'xls') continue;
    var k = r.n+'|'+r.method+'|'+r.url;
    if (!groups[k]) groups[k] = [];
    groups[k].push({ paramSet:r.paramSet, total:r.total, status:r.status });
  }
  for (var k in groups) {
    var g = groups[k];
    var totals = g.map(function(x){return x.total;});
    var distinct = Array.from(new Set(totals));
    var sqlSensitive = distinct.length > 1;
    var diffNote = sqlSensitive
      ? '参数影响 SQL: '+g.map(function(x){return x.paramSet+'='+x.total;}).join(' / ')
      : (distinct[0] === '0' ? '3 套入参均空数据' : '3 套入参 total 一致 ('+distinct[0]+')');
    for (var j=0; j<g.length; j++) {
      var item = g[j];
      for (var n=0; n<results.length; n++) {
        if (results[n].n+'|'+results[n].method+'|'+results[n].url === k && results[n].paramSet === item.paramSet) {
          results[n].diffNote = diffNote;
        }
      }
    }
  }
  // xls 的 diffNote
  var xlsGroups = {};
  for (var i=0; i<results.length; i++) {
    var r = results[i];
    if (r.kind !== 'xls') continue;
    var k = r.n+'|'+r.url;
    if (!xlsGroups[k]) xlsGroups[k] = [];
    xlsGroups[k].push({ paramSet:r.paramSet, size:r.size, status:r.status });
  }
  for (var k in xlsGroups) {
    var g = xlsGroups[k];
    var sizes = g.map(function(x){return x.size;});
    var distinct = Array.from(new Set(sizes));
    var diffNote = distinct.length > 1
      ? '参数影响 Excel 内容: '+g.map(function(x){return x.paramSet+'='+(x.size||0)+'B';}).join(' / ')
      : (distinct[0] < 1000 ? '2 套入参 Excel 都很小(可能空)' : '2 套入参 Excel 大小一致 ('+distinct[0]+'B)');
    for (var j=0; j<g.length; j++) {
      var item = g[j];
      for (var n=0; n<results.length; n++) {
        if (results[n].n+'|'+results[n].url === k && results[n].paramSet === item.paramSet) {
          results[n].diffNote = diffNote;
        }
      }
    }
  }

  fs.writeFileSync(OUT+'/probe-v4.json', JSON.stringify(results, null, 2));
  console.log('done, cases:', results.length, 'elapsed:', Date.now()-t0, 'ms');
  var byStatus = {};
  for (var i=0;i<results.length;i++) byStatus[results[i].status] = (byStatus[results[i].status]||0)+1;
  console.log('by status:', byStatus);
})();
