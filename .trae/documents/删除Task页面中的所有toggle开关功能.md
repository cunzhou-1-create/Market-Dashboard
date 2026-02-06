## 计划：删除Task页面中的所有toggle开关功能

### 目标
删除Task页面下所有类似的toggle开关功能，包括邮件通知、Telegram通知、Webhook通知和自定义价格预警中的开关。

### 具体修改内容

#### 1. 修改 NotificationSettings.jsx 文件
- **删除邮件通知设置中的toggle开关**
  - 删除 `emailEnabled` 状态
  - 删除 `handleEmailNotificationTypeChange` 函数
  - 删除邮件通知部分的toggle开关HTML代码

- **删除Telegram通知设置中的toggle开关**
  - 删除 `telegramEnabled` 状态
  - 删除 `handleTelegramNotificationTypeChange` 函数
  - 删除Telegram通知部分的toggle开关HTML代码

- **删除Webhook通知设置中的toggle开关**
  - 删除 `webhookEnabled` 状态
  - 删除 `handleWebhookNotificationTypeChange` 函数
  - 删除Webhook通知部分的toggle开关HTML代码

- **删除自定义价格预警中的toggle开关**
  - 删除 `customPriceAlerts` 中的 `enabled` 属性
  - 删除 `handleCustomPriceAlertToggle` 函数
  - 删除自定义价格预警部分的所有toggle开关HTML代码

- **保留其他功能**
  - 保留所有通知类型的复选框设置
  - 保留所有输入框和选择框
  - 保留测试按钮和添加预警按钮

### 技术实现
1. 打开 NotificationSettings.jsx 文件
2. 逐步删除上述提到的代码部分
3. 确保代码语法正确，没有遗留的引用
4. 验证修改后的页面功能正常

### 预期结果
Task页面中的通知设置部分将不再包含任何toggle开关，所有通知渠道默认保持启用状态，用户可以通过其他设置项进行配置。