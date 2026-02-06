import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import Detail from './components/Detail';
import Task from './components/Task';
import Auth from './components/Auth';
import Trade from './components/Trade';
import AiMarket from './components/AiMarket';

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录注册路由 */}
        <Route path="/auth" element={<Auth />} />
        
        {/* 主页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/" 
          element={
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-24">
              <Header />
              <MainContent />
              <Navigation />
            </div>
          } 
        />
        
        {/* 设置页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/settings" 
          element={<Settings />} 
        />
        
        {/* 详情页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/detail" 
          element={<Detail />} 
        />
        
        {/* 任务页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/task" 
          element={<Task />} 
        />
        
        {/* 交易页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/trade" 
          element={<Trade />} 
        />
        
        {/* AI行情订阅页面路由 - 直接访问，不需要登录 */}
        <Route 
          path="/ai-market" 
          element={<AiMarket />} 
        />
      </Routes>
    </Router>
  );
}

export default App;