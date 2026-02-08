# 实现Binance Futures USDⓈ-M永续合约24h统计接口对接

## 项目现状分析

### 前端结构
- `MarketContext.jsx` 管理市场数据状态，包括 `marketType`（'spot' 或 'futures'）和 `futuresData`
- `MainContent.jsx` 提供现货/期货切换按钮
- 前端通过 `api.market.getMarketList()` 获取市场数据

### 后端结构
- `/market` API端点返回市场数据列表
- `MarketService.get_market_data()` 从数据库读取或调用外部API刷新数据
- `get_market_data()` 函数使用CCXT库从Binance获取现货数据

## 实现计划

### 1. 后端修改

#### 1.1 扩展crypto.py
- 添加 `get_futures_data()` 函数，使用CCXT库获取Binance Futures USDⓈ-M永续合约数据
- 确保获取的数据包含所需字段：symbol, volume, quoteVolume, lastPrice, highPrice, lowPrice等
- 添加错误处理和模拟数据回退

#### 1.2 扩展MarketService
- 添加 `get_futures_data()` 静态方法
- 修改 `update_market_data()` 方法以支持期货数据
- 确保数据模型支持期货数据的存储和查询

#### 1.3 扩展API端点
- 在 `market.py` 中添加 `/market/futures` 端点
- 确保返回格式与现货市场数据一致，便于前端统一处理

### 2. 前端修改

#### 2.1 扩展API调用
- 在 `api.js` 中添加 `getFuturesMarketList()` 方法
- 确保与后端新端点对应

#### 2.2 扩展MarketContext
- 修改 `fetchMarketData()` 函数，根据 `marketType` 调用不同的API
- 确保期货数据的格式化和处理与现货数据一致
- 添加期货数据的加载状态和错误处理

#### 2.3 验证前端切换功能
- 确保在MainContent中切换到期货市场时，能够正确加载和显示期货数据
- 验证数据显示的完整性和正确性

### 3. 数据处理

#### 3.1 数据格式统一
- 确保期货数据的格式与现货数据一致，便于前端统一处理
- 特别注意volume字段的处理，期货的volume是合约张数，不是币数量

#### 3.2 错误处理
- 添加适当的错误处理，确保在API调用失败时能够优雅降级
- 提供清晰的错误提示给用户

### 4. 测试和验证

#### 4.1 功能测试
- 测试现货/期货切换功能
- 验证期货数据的正确显示
- 测试API调用失败时的错误处理

#### 4.2 性能测试
- 确保数据加载速度合理
- 验证多次切换市场时的性能表现

## 技术要点

### 1. CCXT库使用
- 使用CCXT库的 `fetch_futures_tickers()` 方法获取期货数据
- 确保正确配置交易所参数，支持期货市场

### 2. 数据模型扩展
- 确保MarketData模型能够存储期货数据的所有必要字段
- 考虑数据存储的效率和查询性能

### 3. 前端状态管理
- 确保MarketContext能够正确管理不同市场类型的数据
- 提供一致的数据访问接口给组件使用

### 4. API设计
- 保持API设计的一致性和简洁性
- 确保前后端API调用的正确对应

## 预期结果

- 前端能够通过切换按钮在现货和期货市场之间切换
- 期货市场显示Binance Futures USDⓈ-M永续合约的24h统计数据
- 数据包含所有必要字段，显示正确
- 系统具有良好的错误处理和用户体验
