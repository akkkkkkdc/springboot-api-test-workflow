# 閴存潈 5 涓綅缃瑙?
JWT 閴存潈鍦ㄤ笉鍚?Spring Boot 椤圭洰閲屾斁缃綅缃笉涓€鏍枫€?*涓嶈涓€寮€濮嬪氨鍚﹁ token 澶辨晥**锛屾寜涓嬮潰椤哄簭閫愪釜璇曘€?
## 1. 璇锋眰浣?body锛堟渶甯歌浜庡浗鍐呴」鐩級

```bash
curl -X POST http://host/api/list -H "Content-Type: application/json" -d '{"token": "eyJxxx", "pageNum":1, "pageSize":10}'
```

**鍒ゆ柇**锛氬搷搴?`code = 0` + 姝ｅ父鏁版嵁 鈫?閫氳繃銆?
## 2. 璇锋眰澶?Authorization: Bearer

```bash
curl http://host/api/list -H "Authorization: Bearer eyJxxx"
```

## 3. 璇锋眰澶?token / X-Token锛堜笉甯?Bearer锛?
```bash
curl http://host/api/list -H "token: eyJxxx"
curl http://host/api/list -H "X-Token: eyJxxx"
```

## 4. Cookie

```bash
curl http://host/api/list -H "Cookie: JSESSIONID=xxx; token=eyJxxx"
```

## 5. Query String锛圙ET 鎺ュ彛甯歌锛?
```bash
curl "http://host/api/export?token=eyJxxx"
```

---

## 鍏抽敭鍒ゆ柇閫昏緫

濡傛灉鐢ㄦ埛缁欑殑 token 鍦?5 涓綅缃兘 401锛?*鎵?*鑰冭檻 token 鐪熻繃鏈熴€?*涓嶆槸**鍏堟€€鐤戠敤鎴风粰閿欍€?
### 5 鍒嗛挓鎼炲畾閴存潈浣嶇疆

```javascript
// 5 浣嶇疆鎵弿
const positions = [
  {name: 'header-bearer', headers: {Authorization: 'Bearer <TOKEN>'}},
  {name: 'header-token',   headers: {token: '<TOKEN>'}},
  {name: 'header-xtoken',  headers: {'X-Token': '<TOKEN>'}},
  {name: 'body-token',      body: {token: '<TOKEN>'}},  // POST 鎵嶈
  {name: 'query-token',     query: {token: '<TOKEN>'}}
];
```

### 甯歌閿欒鍝嶅簲

| 涓氬姟鐮?| 鍚箟 | 璇ュ仛浠€涔?|
|---|---|---|
| `0` | 鎴愬姛 | 缁х画 |
| `10` / `1001` / `-1`/`401` | 鏈櫥褰?/ token 澶辨晥 | 鎹綅缃?/ 閲嶆柊鐧诲綍 |
| `403` | 鏃犳潈闄?| 鐢ㄦ洿楂樻潈闄愯处鍙?|
| `500` | 鏈嶅姟寮傚父 | 鎶ュ憡缁欏悗绔?|

### Spring Security 榛樿 401 vs 涓氬姟鐮?401

- Spring Security 鐨?`401 Unauthorized` 鏄?HTTP 灞傦紝body 鍙兘鏄?`{}` 鎴?`<html>...`
- 涓氬姟鐮?`401` 鍦?body JSON 閲岋紝HTTP 浠嶆槸 200

**涓ょ閮界畻閴存潈澶辫触**銆
## 閴存潈澶辫触鐨?3 绉嶇湡瀹氭剰涔夛紙**閬垮厤璇墠鍚?token**锛?

| 鍝嶅簲鐗瑰緛 | 鐪熷疄鎰忎箟 | 涓嬩竴姝?| 
|---|---|---|
| HTTP 401 / 403 | **缃戝叧灞傛嫤鎴?| 鎹綅缃? 涓嶈鎬€鐤?token |
| HTTP 200 + code:10 + "鐧诲綍杩囨湡" | **鍚庣绔涓氬姟閴存潈鎷?| 鎬€鐤?token 澶辨晥, **浣嗗厛楠岃瘉鑳藉惁鐧诲綍** |
| HTTP 200 + code:"-1" + "妫€绱㈣鍙ユ牳寮?| **閴存潈杩囦簡, 涓氬姟灞?SQL 鎸備簡** | **杩欏氨鏄?token 浣嶇疆瀵逛簡** 涓嶈鍐嶆崲浣嶇疆, 鍘荤湅 SQL |

绗?3 绉嶆渶瀹规槗璇墠鍒ゆ�銆傚洜涓?-1 鐪嬩笂鍘诲儚閿欒鐮侊紝浣嗗疄闄呮槸"閴存潈閫氳繃 + 涓氬姟灞傛寔"銆?

> **瀹炴垬璁板綍** (2026-06-30): 鐢ㄦ埛缁?token 涓?1972-11-14 鏃堕棿鎴筹紝浣嗗湪?/auth/login 鐜板満鐧诲綍鎴愬姛鍚庡彇鏂扮殑 token 涔熶細鍦ㄥ悓涓€涓満鍣ㄤ笂琚?code:10 鎷︺€傝繖鏄彂鐜?localhost:9123 涓嶆槸鐪熸鐨勪笟鍔℃帴鍙ｈ矾寰勶紝鑰??token= 鏄剧ず code:-1 琛ㄦ槑**閴存潈瀹為檯涓婅繃浜?*锛屽彧鏄?SQL 鎸兼帴鏈?bug 銆?
