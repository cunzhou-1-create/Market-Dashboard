import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'

/**
 * 应用入口文件
 * 负责渲染App组件并提供AppProvider上下文
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 提供应用上下文 */}
    <AppProvider>
      {/* 渲染主应用组件 */}
      <App />
    </AppProvider>
  </React.StrictMode>,
)