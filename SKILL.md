---
name: springboot-api-test-workflow
description: Use when the user wants to batch-test a Spring Boot REST API''s report endpoints, says "璺戜竴涓嬫帴鍙? / "娴嬭瘯杩?11 涓帴鍙? / "璺戜竴閬?/report/pc/..." / wants an HTML report of POST list + GET export-excel style endpoints, or provides a markdown table of report endpoints to validate. Works on a real running Spring Boot service (localhost or LAN), produces a single-file HTML report with clickable rows showing real request/response. NOT for unit tests (JUnit), not for UI/E2E (use playwright skill), and not for mock self-tests.
---

# Spring Boot 鎶ヨ〃鎺ュ彛鎵归噺娴嬭瘯宸ヤ綔娴?v4

璺戦€?鍏?token 鈫?鍐嶆祴璇?鈫?鍑烘姤鍛?鍏ㄦ祦绋嬨€?*鏍稿績鍘熷垯锛氭案杩滃厛鎵撶湡鏈嶅姟锛岀粷涓?mock 鑷祴楠楄嚜宸便€?*

## 鍚姩鏉′欢

- Spring Boot 鏈嶅姟**宸茬粡璺戣捣鏉?*锛堜笉鏄湰 skill 鐨勪簨锛?- 鐢ㄦ埛缁欙細鈶?**baseUrl** 鈶?**token** 鈶?**鎺ュ彛娓呭崟**锛坢d/琛ㄦ牸/鏂囧瓧閮借锛?- Node 24+ / npm 11+


## Step 0: 鏄庣‘杈撳叆绫诲瀷锛堢豸鐪? 鍒嗛挓閬垮厤杩婃枾锛?
鐢ㄦ埛缁欑殑鍙兘鏄?4 绉嶄箣涓?姣忕璧板娍涓嶅悓):

| 鐢ㄦ埛缁?| 瀹為檯鏄?| 涓嬩竴姝?| 
|---|---|---|
| http://x.x.x.x:port | 鍚庣绔aseUrl | 璺擄紝鐩存帴鎽搁噺 |
| *.apipost.net/swagger/... | **Apipost 鏂囨。椤?*锛堜笉鏄湇鍔★級| 鎶?HTML 瑙ｆ瀯鍑烘帴鍙ｈ皟鍚э紝浣嗚繕瑕佹槑 aseUrl 鍜?	oken |
| localhost:port 甯﹀浘鐗?| dev 鏈嶅姟 | 闇€鐪嬪浘纭疉PI 璺緞鍓嶇紑锛圖ontext-path锛夛紝**涓嶈繃 skill 鑲畾鐢?9123** |
| 鎺ュ彛鍚?+ 璺緞 琛ㄦ牸 | 鐢ㄦ埛鎵嬪啓 | 鐩存帴鎸夎〃鏍艰蛋 |

> 缁忛獙: 鐢ㄦ埛缁?Swagger URL 鏃跺挨鍏跺父瑙併€傚彧鑳界‘瀹氭枃妗ｈВ鏋愬嚭鏉?*鍝釜**鍚庣绔璐熻矗锛岃�?aseUrl 杩樿鍐嶆暡銆?


## Step 0.5: 鍚姩鍓嶇‘璁や笅闈?3 椤癸紙**杈撳嚭缁欑敤鎴风‘璁?*锛?

> **鍘熷洜**: 鐢ㄦ埛缁欑殑 baseUrl / token / 椤圭洰璺緞, 杩欎簺闇€姝ｇ‘鎵嶈兘璺戦€氥€備笉绔?/ 閿欒繑鍥?/ 鎵撶粨鏋?code:10 閮芥槸鐢变簬杩?3 椤逛笉瀵广€?

杈撳嚭鐨勬牸寮?:
`
[skill: springboot-api-test-workflow] 鍚姩鍓嶇‘璁?  =
1. 椤圭洰璺緞 (鐢ㄤ簬鑷姩璇诲彇鍚庣绔鏃ュ織 / 婧愮爜):
   榛樿: C:\\ideaProject\\companyProject\\backupIMaster\\IMasterR\\iMaster-Api
   -> 纭疅鐢?Y 缁х画 / 缂栬緫 / 鎻愪緵鏂板湴鍧€?
2. baseUrl:
   榛樿: http://localhost:9123
   -> 纭疅鐢?Y / 鎻愪緵鏂?baseUrl?
3. token 鏉ユ簮 (token 涓嶆寔涔? 姣¤窇璁?涓€娆℃柊鐧诲綍):
   閫夋嫨:
     A) 鐢ㄩ粯璁ょ櫥褰曡处鍙?chunjiang / chunjiang@123) 鐜板満鐧诲綍鎷垮埌 (鎺ㄨ崘)
     B) 浣犻紶鏂?JWT 缁?鎴
   -> A/B?
`

### AI 蹇呴』鎵ц鐨勫姩浣?
1. **鎵撳嵃**涓婇潰鐨勫崰浣嶇瓑寰呬綘绛? *娌℃湁绛旀涓嶈缁х画*
2. 绛変綘璇?Y" / "A" / "B <token>" 鎴栨彁渚涙柊鍦板潃, **鎵嶈繘 Step 1**
3. 濡傛灉浣犻€夋嫨 A (榛樿鐧诲綍), 闇€绔嬪嵆璋?POST /auth/login 鑾峰彇鏂?token (涓嶅瓨鐩樺瓙)
4. 濡傛灉浣犻€夋嫨 B, 浣犱細缁?JWT, 鎴?AI 鍐嶈繍琛?Step 1-2

绛夌敤鎴风‘璁? 鎴栫洿鎺ヨ "Y A" / "A" / "B <token>" 缁х画銆?/ 璇箰鍚庡啀寮€濮嬫祴璇曘€?

### 璁板綍浣犵殑閰嶇疆
- 濡傛灉鐢ㄦ埛纭疅 "Y" 浣跨敤榛樿椤圭洰璺緞, 鍚?~/.codex/memories/project.md 涓湁璁板綍锛堜笅嬈″彲浠ヨ嚜鍔ㄨ鍙栵級
- 濡傛灉鐢ㄦ埛鎻愪緵浜嗘柊椤圭洰 / 鏂?baseUrl, **璁板綍涓?project.md** 涓?iMaster-Api 椤圭洰 鑺傜渷, 涓嬫¤嚜鍔ㄥ彇

### 閿欒繑鍥?code:10 鏃剁殑蹇?鍒ゆ柇
- 濡傛灉**鎵€鏈夌晫 test 閮芥槸 code:10** -> 涓?99% 鏄?baseUrl / token / 椤圭洰璺緞 閫変腑 涓? 閿欎簡
- 涓嶈鐩存帴鎸?Step 5 璋冭瘯 token 鏃堕棿鎴?* 浠?code:10 = 鐧诲綍杩囨湡

## 5 姝ュ伐浣滄祦锛堜弗鏍兼寜椤哄簭锛?
### Step 1: 鎽搁壌鏉冧綅缃紙**鍏抽敭锛? 鍒嗛挓鎼炲畾**锛?
鎸変笅闈㈤『搴忚瘯锛?*涓嶅惁璁ょ敤鎴风殑 token**锛?*鍏堟€€鐤戞斁缃綅缃?*锛?
| 椤哄簭 | 浣嶇疆 | 鎬庝箞鎵?|
|---|---|---|
| 鈶?| **璇锋眰浣?body锛坖son 瀛楁锛?* | `POST` 浠绘剰鎺ュ彛 + body 鍔?`"token": "<user_token>"` |
| 鈶?| **璇锋眰澶?Authorization** | `Authorization: Bearer <user_token>"` |
| 鈶?| **璇锋眰澶?X-Token / token** | `token: <user_token>"`锛堜笉甯?Bearer锛?|
| 鈶?| **Cookie** | `Cookie: JSESSIONID=xxx; token=xxx` |
| 鈶?| **Query String** | `?token=<user_token>"`锛圙ET 鎺ュ彛甯歌锛?|

**鍒ゆ柇鎴愬姛鐨勬爣蹇?*锛氬搷搴旈噷**涓氬姟鐮?= 0** 涓旀湁姝ｅ父鏁版嵁銆?*涓嶆槸** 401 / "tokenlogin" / "鐧诲綍杩囨湡" / code=10銆?
**濡傛灉 5 涓綅缃兘涓嶈**锛氬啀鑰冭檻 token 鐪熺殑杩囨湡浜嗭紙**涓嶈涓€寮€濮嬪氨鎬€鐤?token 澶辨晥**锛夈€?
### Step 2: 缂栬緫 probe.js

鎵撳紑 `scripts/probe.js`锛屾妸椤堕儴 4 琛屽～濂斤細

```js
const OUT    = '';                 // 鎶ュ憡杈撳嚭鐩綍
const BASE   = '';                 // 鏈嶅姟鍦板潃锛堝惈绔彛锛?const TOKEN  = '';                 // 瀹屾暣 JWT
```

璺戯細

```bash
node scripts/probe.js
# 鐢熸垚 probe.json
```

**浼氳窇鍑?*锛?- 9 涓?POST 鍒楄〃鎺ュ彛 脳 **3 濂楀叆鍙?* = 27 case
- 2 涓?GET锛堣鎯?+ 鏌忔媺鍥撅級 脳 3 濂楀叆鍙?= 6 case
- 9 涓?GET 瀵煎嚭 脳 **2 濂楀叆鍙?* = 18 case
- **鍚堣 51 case / 20 episode**

### 3 濂楀叆鍙傦紙v4 鏍稿績鏀硅繘锛?
| 濂?| 鍚箟 | 鐢ㄥ湪 |
|---|---|---|
| **min** | 鏈€灏忓繀瑕佸弬鏁帮紙鍙垎椤?+ token + 蹇呭～ ID锛?| 楠岃瘉鎺ュ彛鏈€灏戣兘璺戦€?|
| **default** | 榛樿鎺ㄨ崘鍙傛暟锛坧lanStatusList + 鍒嗛〉锛?| 鐢ㄦ埛鏃ュ父鐢?|
| **full** | 婊″弬鏁帮紙鏃堕棿鍖洪棿 + 鎵€鏈夌淮搴︼級 | 楠岃瘉 SQL 鍥犲弬鏁拌€屽紓 |

**瀵规瘮 3 濂楃殑 total/records** 鈫?鑷姩鐢熸垚 `diffNote`锛堝ぇ鐧借瘽锛夛細
- `鏁版嵁鏉℃暟鍥犲叆鍙備笉鍚岃€屽彉鍖栵細min=46 / default=46 / full=26` 鈫?缁?- `3 濂楀叆鍙傞兘鏌ュ埌 0 鏉℃暟鎹紙鍚庣娌℃暟鎹級` 鈫?榛?- `3 濂楀叆鍙傞兘鏌ュ埌 N 鏉★紙鍙傛暟涓嶅奖鍝嶏級` 鈫?钃?
### Step 3: 鐢熸垚 HTML 鎶ュ憡

```bash
node scripts/inject.js probe.json report.template.html test-report.html
```

鎶ュ憡**瀹屽叏鑷寘鍚?*锛堟棤澶栭儴渚濊禆锛岄櫎 Google Fonts CDN锛夈€?*鐩存帴鍙屽嚮鎵撳紑**銆?
鎶ュ憡鐗圭偣锛?*鍙傝€?examples/test-report.html**锛夛細
- 鍗曟枃浠?HTML锛屾棤鏋勫缓
- 椤堕儴 **4 涓?stat 鍧?*锛堟帴鍙ｆ暟 / 閫氳繃 / 璀﹀憡 / 澶辫触锛夆€斺€?鎸?episode 缁村害绠楋紙鍚屼竴鎺ュ彛鍙鏈?1 濂楀叆鍙傛寕浜嗗氨璁″叆瀵瑰簲鐘舵€侊級
- **1 琛?1 鎺ュ彛**锛?0 episode锛?+ D / F / M 涓変釜 mini chip
- **鐐瑰紑 episode**锛? 濂楀叆鍙?tab 鍙垏锛屾瘡涓?tab 鏈?REQUEST + RESPONSE 鍙屾爮
- **鐪熷疄 token 鏄剧ず**锛堜笉鑴辨晱锛?- **4 绉嶇姸鎬佽壊**锛圥ASS 缁?/ WARN 榛?/ FAIL 绾?/ UNK 鐏帮級+ **2 绉?method 鑹?*锛圥OST 鐞ョ弨 / GET 闈掔豢锛?
### 瑙嗚缂栫爜琛紙v4 棰滆壊瑙勫垯路宸插浐鍖栨爣鍑嗭級

| 鍏冪礌 | 棰滆壊 | 璇箟 |
|---|---|---|
| **POST method chip** | 鐞ョ弨 `#F4B740` | 涓氬姟鍐欐搷浣滐紙鍒楄〃/鏌ヨ锛?|
| **GET method chip** | 闈掔豢 `#46D893` | 鏁版嵁璇诲彇锛堣鎯?瀵煎嚭/鏌忔媺鍥撅級 |
| **鎺ュ彛璺緞** | 娣¤摑 accent-soft | 鍏抽敭淇℃伅鎻愪寒 |
| **size / elapsed / biz** | 娣¤摑 accent-soft | 鍏抽敭鎸囨爣 |
| **PASS 鐘舵€?* | 瀹炶壊缁?| 娴嬭瘯閫氳繃 |
| **WARN 鐘舵€?* | 瀹炶壊榛?| 绌烘暟鎹?/ 鍋忓皬 |
| **FAIL 鐘舵€?* | 瀹炶壊绾?| 鎺ュ彛寮傚父 |
| **鎺ュ彛鍚?* | 涓绘枃瀛楃櫧 | 涓讳俊鎭?|
| **kind chip** | accent-bg 绱摑 | 缁村害锛坙ist / detail / chart / xls锛?|

method 閰嶈壊**浣庨ケ鍜?+ 杈规**锛宻tatus 閰嶈壊**楂橀ケ鍜?+ 瀹炲績**锛屼袱灞備笉浼氭贩銆?
> **閲嶈锛歎I 宸插浐鍖栵紝涓嶈鍐嶈皟 anti-ai-feel-design**
> 杩欏閰嶈壊鏄敤鎴峰凡缁忕‘璁ょ殑瑙嗚鏍囧噯锛屽瓨鏀惧湪 `scripts/report.template.html`銆?> 涓嶇鏈満鏈夋病鏈夎 `anti-ai-feel-design` skill锛?*鏈?skill 閮界洿鎺ョ敤 fallback 娓叉煋**銆?> 杩欐牱淇濊瘉姣忔璺戝嚭鏉ョ殑鎶ュ憡 UI 100% 涓€鑷淬€?
## 璁捐妯″紡锛氬崟妯″紡锛坴4 璧峰浐鍖栵級

鏈?skill 鍦?v4 缁堟€佹椂**涓嶅啀鑷姩妫€娴?`anti-ai-feel-design`**锛?
- **鍞竴杈撳嚭**锛氱敤鏈?skill 鍐呯疆鐨?`scripts/report.template.html`锛堝凡鍚畬鏁?design token锛?- **涓嶅啀璋冧换浣曞叾浠?design skill**
- **姣忔璺戝嚭鏉?UI 100% 涓€鑷?*锛堥櫎闈炰綘鎵嬪姩鏀?report.template.html锛?
璁捐 token 瑙?`references/default-design-system.md`锛屽寘鍚細
- 棰滆壊锛坅ccent #6F86FF / success / warn / error / POST #F4B740 / GET #46D893锛?- 瀛椾綋锛圛nter + Noto Sans SC + JetBrains Mono锛?- 瀛楀彿锛坔1 56 / stat 56 / body 15 / label 11锛?- 闂磋窛锛?pt scale锛?- 鍦嗚锛坆adge 6 / card 14 / pill 999锛?- 瑁呴グ锛坉ot grid 96px + 3 涓?radial gradient + pulse 鍦嗙偣锛?

## Step 4: 鑷鎶ュ憡
鎸? `references/self-audit-checklist.md` 璺戜竴閬嶏紙16 鏉★級锛屼笉閫氳繃灏辨敼銆?

## Step 5: 鍚庣绔鏃ュ織鑱旂郴锛堝彧褰撴棦鏈夐」鐩?鏃?*锛?

> 鐢ㄦ埛缁欎簡椤圭洰璺緞 (姣斿 \C:\ideaProject\companyProject\backupIMaster\IMasterR\iMaster-Api\) 鏃跺惎鐢ㄣ€傝繖鏄?skill 鐨勬牳蹇冨�涓句箟, 浣跨▼搴忚兘鑷姩鎶婂悗绔鐪熷疄閿欒鎻愪緵缁欑敤鎴枫€?

### 5.1 鍚姩鏃剁‘璁ら」鐩槸鍚︽湁鏃ュ織
- 娴?iMaster-Api/logs/industry-error.log\ (Spring Boot + Logback)
- 濡傛灉鏃ュ織鍦ㄥ叾浠栦綅缃, 璁╃敤鎴锋寚, 鎴栫敤 Glob \logs/**/error*.log\ 鎵捐

### 5.2 璺戝嚭鏃跺悓姝ユ挙鏃ュ織
\\\js
// probe 鐨?run 涓?/ 璺戝畬鍚?+ 绛?500ms~1500ms 绛?Logback flush
// 鐒跺悗 read + grep 鏈€杩?5s-15s 瀹氭椂绐楀彛涓?ExceotionHandlerConfig / ERROR 琛?/
\\\

### 5.3 瑙ｆ瀯 ERROR 鍧?
鏃ュ織鏍煎紡锛?
\\\
2026-06-30 11:28:24.618 [http-nio-9123-exec-7] ERROR c.w.i.config.ExceotionHandlerConfig - 
### Error querying database.  Cause: java.sql.SQLSyntaxErrorException: Unknown column 'u.employee_no' in 'field list'
### The error may exist in file [C:\ideaProject\...\mapper\ProductionPlanDetailMapper.xml]
### SQL: select u.id as userId , u.employee_no as employeeNo , ...
### Cause: java.sql.SQLSyntaxErrorException: Unknown column 'u.employee_no' in 'field list'
\\\

鎻愬彇 3 涓瓧娉? mapperFile / unknownColumn / SQL / cause) 鍏?backendDiag\ 瀛楁, 褰?report.template.html 閲?\enderBackendDiag(c)\ 鎵撳嚭鐣岄潰銆?

### 5.4 鑱旂郴绛栫暐
| 鎯呭喌 | 鑱旂郴绛栫暐 |
|---|---|
| 4 涓?FAIL 閮芥槸 mapper 鐩稿悓 (鍚?com.wuyuan.industry.mapper.XxxMapper.xml\) | 鍏?1 涓?diag, 澶氫釜 case 鍏辫祫婧?/ 澶嶇敤 mapperFile / unknownColumn |
| 澶氫釜 mapper | 1 mapper = 1 diag, 鎸?url 鍓?Path 鎴?controller 娣峰悎鍒? |
| 闈炲父瑙? (mapper 澶氫釜 + 鐩稿悓鏍峰紡) | 鎶?Path 缁?1-2 灞?Mapper 鍏宠仈, 涓嶈寮哄埗鍏? |

### 5.5 鎶ュ憡鏄剧ず
- **FAIL episode 灞曞紑** 鍚?RESPONSE 鍧椾笅澶氫竴娈?\"鍚庣绔 ERROR 鏃ュ織鎻愬綍\" 灞? 鍐呭 = mapperFile + unknownColumn + SQL + cause, 椤哄簳涓?\"澶嶅埗璇婃柇\" 鎸夐挳 (绛惧?Claude Code 鐢ㄧ殑 markdown)
- **callout 椤堕儴** 涓?\"鍏ㄩ儴澶嶅埗\" 鎸夐挳, 涓€閿皐鏁?N 涓?FAIL 鐨勬墍鏈夎瘖鏂?
- 澶嶅埗鐨勫叿浣撳瓧娉曪細
\\\
# 18.6.1 鍛樺伐宸ヨ祫缁熻(鍒楄〃) 澶辫触
鐣?: GET /report/pc/staff-salary-statistics
鍝嶅簲: {code:-1, msg: 鎶辨瓑, 妫€绱㈣鍙ュ紓甯?..}
鍚庣绔 cause: java.sql.SQLSyntaxErrorException: Unknown column 'u.employee_no' in field list
mapper: com\\wuyuan\\industry\\mapper\\ProductionPlanDetailMapper.xml
\\\


> 濡傛灉鐢ㄦ埛纭疅浜嗛」鐩牴璺緞, **璺戞帴娴佺▼浼氳嚜鍔ㄨ鍙栧悗绔鏃ュ織** 鍏?Step 5 (鍚庣绔鏃ュ織鑱旂郴), 涓嶈璺宠繃銆?## Step 4: 鑷鎶ュ憡

鎸?`references/self-audit-checklist.md` 璺戜竴閬嶏紙16 鏉★級锛屼笉閫氳繃灏辨敼銆?

## PowerShell 缂栫爜閾捐矾 (Windows 鐜洿)
- **姘镐箙涓嶈**鐢?Set-Content -Encoding utf8 鍐欏惈涓枃鐨?JS 鑴氭湰锛堜細鎹?GBK锛?
- 鎺ㄨ崘:
  - Out-File -Encoding utf8 -FilePath path
  - [System.IO.File]::WriteAllText(, , [System.Text.UTF8Encoding]::new(True)) (甯?BOM)
  - Here-String (@"..."@) + Out-File
- irm 鏄?PowerShell 7+ 鐨?Invoke-RestMethod 缂╁啓, **5.x 娌℃湁**
- curl 鏄?Invoke-WebRequest 缂╁啓, **query string 涓殑 ?locale=zh-cn 浼氳褰撴垚鍙橀噺**, 鐢?--Uri 鍙傛暟鎴?{ } 鎷兼帴


## Excel 导出响应处理 (v4 必看)
- **不要** 鎶?Excel 浜岃繘鍒舵暟鎹?(Buffer) 褰?utf-8 瀛楃涓茬敤 uf.toString('utf8') 鍐嶅瓨 esponseText
  - 鍘熷洜: Excel 鍐呮枃浣撳寘鍚?<!DOCTYPE <html> } ) 绛夊瓧绗? 浼氭埅鏂?JS 瀛楃涓? 瀵艰嚧 const RAW = [...] 璇彞璇娉曢敊璇? 鏁翠釜鎶ュ憡娓叉煋宕?  8 涓?episode 涓€涓兘涓嶆樉绀?
- **姝ｇ‘鍋氭硶**: 妫?Content-Type 鍖?excel / spreadsheetml 鏃? 璁?esponseText = '<binary Excel ' + buf.length + ' bytes>' 鍗冲彲
- judge 鍑芥暟: Excel 绫诲瀷 case 鐩存帴 size > 800 璁?PASS, < 800 璁?WARN, **涓嶈 JSON.parse**

## 璋冭瘯鍘熷垯锛?*韪╄繃鐨勫潙**锛?
1. **涓嶈涓€寮€濮嬪氨鍚﹁鐢ㄦ埛鐨?token**鈥斺€斿厛璇?5 涓壌鏉冧綅缃?2. **GET 鎺ュ彛鐨?token 蹇呴』鎷煎埌 query string**鈥斺€擯OST 鍦?body 閲屻€?*涓や釜閮借瘯**
3. **`probe.js` 閲岀殑 GET 鏋勯€犲繀椤绘湁 `u.searchParams.set(''token'', token)`**鈥斺€斾笉鐒?GET 姘歌繙 401
4. **涓氬姟鐮佽В鏋愯鏀寔瀛楃涓?*鈥斺€斿悗绔彲鑳?`"code": "-1"`锛堝甫寮曞彿锛夎€屼笉鏄?`"code": -1`
5. **璇︽儏鎺ュ彛 splitId 鏄繀浼?*鈥斺€? 濂楀叆鍙傞兘蹇呴』甯︼紙v4 鎺㈤拡鑷姩娉ㄥ叆锛?6. **JWT 娌?exp 瀛楁涓嶇瓑浜?token 姘镐箙鏈夋晥**鈥斺€斿悗绔彲鑳界敤 Redis 鎴?IP 缁戝畾鐨?session
7. **鍚屼竴 token 涓嶈兘璺?session 鐢?*鈥斺€旀嬁 token 绔嬪埢杩炴墦 51 涓紝鍒瓨璧锋潵鍒嗘壒璺?8. **瀵煎嚭 Excel 鐨?content-type 涓嶄竴瀹氭槸 `spreadsheetml`**鈥斺€斾篃鍙兘鏄?`application/vnd.ms-excel`锛坸ls 鏃ф牸寮忥級
9. **PowerShell 鍐?JS 鏂囦欢鐢?
ode -e 鎴?Out-File 杞箟寰堝潙**鈥斺€旂敤 
ode script.js 璺戠嫭绔嬭剼鏈渶绋?
10. **method chip CSS 娌＄敓鏁堬紵**鈥斺€旀鏌?JS 閲?class=ep-method` 鏄惁鎷兼帴浜?method 鍚嶏紙蹇呴』鏄?class=ep-method POST`锛?
11. **WARN 严格模式**: 3 套入参 (DEFAULT/FULL/MIN) 全部 WARN 才判 WARN, 有任一 PASS 即算 PASS. 原因: 实际数据中参数变化常触发空数据, 接口本身没问题; 只有 3 套都拿不到数据才视为可疑. aggr 函数实现:
```js
function aggrStrict(cases) {
  const s = { PASS:0, WARN:0, FAIL:0, UNK:0 };
  for (const c of cases) s[c.status] = (s[c.status]||0)+1;
  if (s.FAIL > 0) return "FAIL";
  if (s.PASS > 0) return "PASS";                 // 有一条 PASS 即算 PASS
  if (s.WARN > 0 && s.UNK === 0) return "WARN";  // 全部 WARN 才算 WARN
  if (s.UNK > 0) return "UNKNOWN";
  return "PASS";
}
```

```
springboot-api-test-workflow/
鈹溾攢鈹€ SKILL.md                                    # 鏈枃浠?鈹溾攢鈹€ scripts/
鈹?  鈹溾攢鈹€ probe.js                                # 璺?51 case锛堟竻鍗曢┍鍔級
鈹?  鈹溾攢鈹€ inject.js                               # probe.json 鈫?HTML
鈹?  鈹斺攢鈹€ report.template.html                    # HTML 妯℃澘锛堝惈鍥哄寲 UI 璁捐锛?鈹溾攢鈹€ references/
鈹?  鈹溾攢鈹€ auth-5-positions.md                     # 閴存潈 5 涓綅缃瑙?鈹?  鈹溾攢鈹€ default-design-system.md                # 鍐呯疆璁捐 token锛坴4 缁堟€侊級
鈹?  鈹溾攢鈹€ newman-vs-node-raw.md                   # 涓轰粈涔堜笉鐢?Newman
鈹?  鈹溾攢鈹€ self-audit-checklist.md                 # 16 鏉¤嚜妫€
鈹?  鈹斺攢鈹€ what-is-mock-and-why-not.md             # 瑙ｉ噴 mock 鈮?鐪熸祴璇?鈹斺攢鈹€ examples/
    鈹溾攢鈹€ interfaces-18.3.md                      # 绀轰緥鎺ュ彛娓呭崟
    鈹溾攢鈹€ test-report.html                        # 鐢熸垚鐨勬姤鍛婏紙鏈€缁堟€侊級
    鈹斺攢鈹€ test-report-top.png                     # 鎶ュ憡椤堕儴鎴浘
```

## 璋冪敤鏈?skill 鐨勮瘽鏈?
褰撶敤鎴疯浠ヤ笅浠绘剰涓€绉嶆椂瑙﹀彂锛?- "鎶婅繖 11 涓姤琛ㄦ帴鍙ｈ窇涓€閬? / "娴嬩竴涓?18.3.1~18.3.11"
- "缁欐垜鍑轰竴浠芥帴鍙ｆ祴璇曟姤鍛? / "瑕佸彲鐐瑰嚮鐪嬪叆鍙傚嚭鍙傜殑"
- "http://localhost:9123 鐢ㄨ繖涓?token 璺戜竴涓? / 鎻愪緵 baseUrl + token + 鎺ュ彛娓呭崟
- "涓婃閭ｄ釜 springboot 鎺ュ彛娴嬭瘯 skill 璺戜竴涓?锛堟寚鏈?skill锛?
**涓嶈**瀵逛互涓嬪満鏅娇鐢細
- 鍗曞厓娴嬭瘯锛圝Unit/Mockito锛夆€斺€?閭ｆ槸 spring-bug-audit skill 鑼冪暣
- 鍓嶇 UI E2E锛堟祻瑙堝櫒鑷姩鍖栵級鈥斺€?閭ｆ槸 playwright skill
- 浠?mock 鑷祴锛堟病鏈夌湡鏈嶅姟锛夆€斺€?鎷掔粷锛屾槑纭"娌℃湇鍔″氨娌℃硶娴?