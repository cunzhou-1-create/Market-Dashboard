import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 私有路由组件
 * 目前暂时跳过认证验证，直接允许访问所有页面
 * 未来可以添加认证逻辑，只允许已登录用户访问
 */
const PrivateRoute = () => {
  // 暂时跳过认证验证，直接允许访问所有页面
  return <Outlet />;
};

export default PrivateRoute;