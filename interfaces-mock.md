# 接口清单（Demo / Mock）

> 这是一份 **mock 示例清单**,用于演示 `springboot-api-test-workflow` skill 的批量测试流程。
> 这是一份**完全虚构的**示例清单,用于演示 skill 批量测试流程。

## Base URL
`http://localhost:8080`

## 鉴权
所有 POST 接口在 JSON body 顶层带 `token` 字段(演示用占位 `demo.token.placeholder`)。

| # | Method | Path | 用途 | 入参维度 |
|---|---|---|---|---|
| 1 | POST | `/api/demo/sales-orders` | 销售订单列表 | pageNum/pageSize/keyword/status |
| 2 | POST | `/api/demo/customers` | 客户列表 | pageNum/pageSize/customerType/region |
| 3 | POST | `/api/demo/order-details` | 订单明细 | pageNum/pageSize/keyword/status |
| 4 | POST | `/api/demo/inventory` | 产品库存 | pageNum/pageSize/warehouseId/category |
| 5 | POST | `/api/demo/employee-performance` | 员工绩效 | pageNum/pageSize/deptId/dateRange |
| 6 | POST | `/api/demo/finance-reports` | 财务报表 | pageNum/pageSize/reportType/dateRange |
| 7 | POST | `/api/demo/quality-checks` | 质量检查 | pageNum/pageSize/inspectorId/result |
| 8 | POST | `/api/demo/equipment-maintenance` | 设备维护 | pageNum/pageSize/deviceId/maintenanceType |
| 9 | POST | `/api/demo/logistics-tracking` | 物流跟踪 | pageNum/pageSize/carrierId/dateRange |
| 10 | GET | `/api/demo/sales-orders/export` | 销售订单导出 | queryString 同 #1 |
| 11 | GET | `/api/demo/finance-reports/export` | 财务报表导出 | queryString 同 #6 |
| 12 | POST | `/api/demo/inventory-adjust` | 库存调整(新增) | warehouseId/skuId/qty/reason |
| 13 | GET | `/api/demo/health` | 健康检查 | 无 |
| 14 | POST | `/api/demo/login` | 登录 | username/password |
| 15 | GET | `/api/demo/logistics-tracking/export` | 物流跟踪导出 | queryString 同 #9 |
| 16 | GET | `/api/demo/quality-checks/export` | 质量检查导出 | queryString 同 #7 |
| 17 | GET | `/api/demo/equipment-maintenance/export` | 设备维护导出 | queryString 同 #8 |
| 18 | GET | `/api/demo/order-details/export` | 订单明细导出 | queryString 同 #3 |
| 19 | GET | `/api/demo/customers/export` | 客户列表导出 | queryString 同 #2 |
| 20 | GET | `/api/demo/employee-performance/export` | 员工绩效导出 | queryString 同 #5 |

## 字段维度(演示)
- 分页:`pageNum=1`、`pageSize=5` / `20`
- 业务筛选:`keyword`(模糊查询)、`status`(状态枚举)、`dateRange`(时间区间)
- 维度:`region` / `category` / `deptId` / `inspectorId` / `deviceId` / `carrierId` / `reportType`

> 真实使用时,字段按你的业务接口替换即可。
