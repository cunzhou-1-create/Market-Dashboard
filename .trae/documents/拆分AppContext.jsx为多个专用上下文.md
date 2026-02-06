# 拆分AppContext.jsx为多个专用上下文的计划

## 1. 分析当前AppContext.jsx

首先，我需要分析当前AppContext.jsx文件，识别不同的功能域：

- **用户域**：用户状态、登录/注册/退出逻辑
- **市场数据域**：市场数据、观察列表、价格预警
- **设置域**：深色模式、邮件预警、语言设置
- **任务域**：订阅任务、链上事件

## 2. 创建专用上下文文件

### 2.1 UserContext.jsx
- 处理用户相关状态：user, isLoading, error
- 提供用户相关方法：login, register, logout, updateEmail
- 管理用户数据的本地存储

### 2.2 MarketContext.jsx
- 处理市场数据相关状态：marketData, watchlist, priceAlerts
- 提供市场数据相关方法：addToWatchlist, removeFromWatchlist
- 管理市场数据的模拟和获取

### 2.3 SettingsContext.jsx
- 处理设置相关状态：darkMode, emailAlerts, emailNotificationTypes, language
- 提供设置相关方法：toggleDarkMode, toggleEmailAlerts, updateEmailNotificationTypes, updateLanguage
- 管理设置的本地存储

### 2.4 TaskContext.jsx
- 处理任务相关状态：tasks
- 提供任务相关方法
- 管理任务的模拟和获取

## 3. 更新AppContext.jsx

- 导入并使用所有专用上下文
- 提供统一的接口，确保向后兼容性
- 移除重复的逻辑和状态

## 4. 更新组件

- 更新组件中的导入，使用新的专用上下文
- 优化组件中的状态管理逻辑
- 确保所有功能正常工作

## 5. 验证和测试

- 运行应用，确保所有功能正常
- 检查是否有任何错误或警告
- 验证本地存储功能是否正常工作

## 6. 性能优化

- 使用React.memo包装纯展示组件
- 使用useMemo缓存计算结果
- 优化状态更新逻辑，减少不必要的渲染

## 7. 代码风格统一

- 统一命名规范和注释风格
- 确保代码缩进一致
- 添加必要的JSDoc注释