from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.trade import SimulatedTrader, TradeRecord, AITradeSignal, SimulationReport
from app.services.market_service import MarketService
from app.services.ai_service import AIService
from app.services.trade_service import TradeService
from app.schemas.trade import TradeRecordCreate
import time
import json
from datetime import datetime, timedelta


class SimulationService:
    """模拟交易服务类"""
    
    @staticmethod
    def execute_simulation_trade(db: Session, user_id: int, simulated_trader_id: int, signal: Dict) -> Optional[Dict]:
        """执行模拟交易"""
        try:
            # 获取模拟交易员信息
            trader = db.query(SimulatedTrader).filter(
                SimulatedTrader.id == simulated_trader_id,
                SimulatedTrader.user_id == user_id
            ).first()
            
            if not trader or not trader.is_active:
                return {"success": False, "message": "模拟交易员不存在或未激活"}
            
            # 验证信号格式
            required_fields = ['symbol', 'side', 'price', 'quantity']
            for field in required_fields:
                if field not in signal:
                    return {"success": False, "message": f"信号缺少必要字段: {field}"}
            
            # 计算交易总额
            total = signal['price'] * signal['quantity']
            
            # 检查余额是否足够
            account_info = TradeService.get_account_info(db, user_id, simulated_trader_id)
            if signal['side'] == 'buy' and total > account_info['available_balance']:
                return {"success": False, "message": "余额不足"}
            
            # 创建交易记录
            trade_data = TradeRecordCreate(
                symbol=signal['symbol'],
                side=signal['side'],
                price=signal['price'],
                quantity=signal['quantity'],
                total=total,
                is_ai_trade=True,
                ai_signal_id=signal.get('signal_id')
            )
            
            # 执行交易
            trade = TradeService.create_trade(db, user_id, trade_data)
            
            # 更新交易记录的模拟交易员ID
            trade.simulated_trader_id = simulated_trader_id
            db.commit()
            db.refresh(trade)
            
            # 更新AI信号的执行状态
            if 'signal_id' in signal:
                ai_signal = db.query(AITradeSignal).filter(
                    AITradeSignal.id == signal['signal_id']
                ).first()
                
                if ai_signal:
                    ai_signal.is_executed = True
                    ai_signal.executed_trade_id = trade.id
                    ai_signal.executed_at = datetime.utcnow()
                    db.commit()
            
            # 更新模拟交易员的当前余额
            new_account_info = TradeService.get_account_info(db, user_id, simulated_trader_id)
            trader.current_balance = new_account_info['total_balance']
            db.commit()
            db.refresh(trader)
            
            return {
                "success": True,
                "trade_id": trade.id,
                "message": f"成功执行{signal['side']}交易: {signal['symbol']}",
                "current_balance": trader.current_balance
            }
        except Exception as e:
            print(f"执行模拟交易失败: {str(e)}")
            return {"success": False, "message": f"执行交易失败: {str(e)}"}
    
    @staticmethod
    def calculate_balance_curve(db: Session, user_id: int, simulated_trader_id: int, days: int = 7) -> List[Dict]:
        """计算资金变动曲线"""
        try:
            # 获取模拟交易员信息
            trader = db.query(SimulatedTrader).filter(
                SimulatedTrader.id == simulated_trader_id,
                SimulatedTrader.user_id == user_id
            ).first()
            
            if not trader:
                return []
            
            # 计算起始时间
            start_time = datetime.utcnow() - timedelta(days=days)
            
            # 获取交易记录
            trades = db.query(TradeRecord).filter(
                TradeRecord.user_id == user_id,
                TradeRecord.simulated_trader_id == simulated_trader_id,
                TradeRecord.timestamp >= start_time
            ).order_by(TradeRecord.timestamp).all()
            
            # 计算资金变动曲线
            curve_data = []
            current_balance = trader.initial_balance
            last_timestamp = start_time
            
            # 添加起始点
            curve_data.append({
                "timestamp": last_timestamp.isoformat(),
                "balance": current_balance
            })
            
            # 遍历交易记录，计算余额变化
            for trade in trades:
                if trade.side == 'buy':
                    current_balance -= trade.total
                else:
                    current_balance += trade.total
                
                curve_data.append({
                    "timestamp": trade.timestamp.isoformat(),
                    "balance": current_balance,
                    "trade_id": trade.id,
                    "symbol": trade.symbol,
                    "side": trade.side,
                    "price": trade.price,
                    "quantity": trade.quantity
                })
                
                last_timestamp = trade.timestamp
            
            # 添加当前点
            if curve_data:
                current_account_info = TradeService.get_account_info(db, user_id, simulated_trader_id)
                curve_data.append({
                    "timestamp": datetime.utcnow().isoformat(),
                    "balance": current_account_info['total_balance']
                })
            
            return curve_data
        except Exception as e:
            print(f"计算资金变动曲线失败: {str(e)}")
            return []
    
    @staticmethod
    def generate_simulation_report(db: Session, user_id: int, simulated_trader_id: int, period: str = '7d') -> Optional[SimulationReport]:
        """生成模拟交易报告"""
        try:
            # 获取模拟交易员信息
            trader = db.query(SimulatedTrader).filter(
                SimulatedTrader.id == simulated_trader_id,
                SimulatedTrader.user_id == user_id
            ).first()
            
            if not trader:
                return None
            
            # 计算时间范围
            if period == '7d':
                days = 7
            elif period == '30d':
                days = 30
            elif period == '90d':
                days = 90
            else:
                days = 7
            
            start_time = datetime.utcnow() - timedelta(days=days)
            
            # 获取交易记录
            trades = db.query(TradeRecord).filter(
                TradeRecord.user_id == user_id,
                TradeRecord.simulated_trader_id == simulated_trader_id,
                TradeRecord.timestamp >= start_time
            ).all()
            
            # 计算报告数据
            start_balance = trader.initial_balance
            current_account_info = TradeService.get_account_info(db, user_id, simulated_trader_id)
            end_balance = current_account_info['total_balance']
            total_profit = end_balance - start_balance
            total_trades = len(trades)
            
            # 计算胜率
            winning_trades = 0
            for trade in trades:
                # 简单判断：买入后价格上涨，卖出后价格下跌
                # 实际应该根据后续交易计算
                winning_trades += 1  # 暂时假设所有交易都是盈利的
            
            win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
            
            # 计算最大回撤
            max_drawdown = 0.0  # 暂时设置为0
            
            # 构建详细报告数据
            report_data = {
                "trader_name": trader.name,
                "strategy": trader.strategy,
                "symbol": trader.symbol,
                "period": period,
                "start_balance": start_balance,
                "end_balance": end_balance,
                "total_profit": total_profit,
                "total_trades": total_trades,
                "win_rate": win_rate,
                "max_drawdown": max_drawdown,
                "trades": [
                    {
                        "id": trade.id,
                        "symbol": trade.symbol,
                        "side": trade.side,
                        "price": trade.price,
                        "quantity": trade.quantity,
                        "total": trade.total,
                        "timestamp": trade.timestamp.isoformat(),
                        "is_ai_trade": trade.is_ai_trade
                    }
                    for trade in trades
                ],
                "balance_curve": SimulationService.calculate_balance_curve(db, user_id, simulated_trader_id, days)
            }
            
            # 创建报告记录
            report = SimulationReport(
                user_id=user_id,
                simulated_trader_id=simulated_trader_id,
                period=period,
                start_balance=start_balance,
                end_balance=end_balance,
                total_profit=total_profit,
                total_trades=total_trades,
                win_rate=win_rate,
                max_drawdown=max_drawdown,
                report_data=report_data
            )
            
            db.add(report)
            db.commit()
            db.refresh(report)
            
            return report
        except Exception as e:
            print(f"生成模拟交易报告失败: {str(e)}")
            return None
    
    @staticmethod
    def run_simulation_trader(db: Session, user_id: int, simulated_trader_id: int) -> Dict:
        """运行单个模拟交易员"""
        try:
            # 获取模拟交易员信息
            trader = db.query(SimulatedTrader).filter(
                SimulatedTrader.id == simulated_trader_id,
                SimulatedTrader.user_id == user_id
            ).first()
            
            if not trader or not trader.is_active:
                return {"success": False, "message": "模拟交易员不存在或未激活"}
            
            # 获取K线数据和技术指标
            market_service = MarketService()
            klines_data = market_service.get_klines_data(trader.symbol, '30m', 50)
            indicators = market_service.get_technical_indicators(trader.symbol)
            
            # 生成交易信号
            signal = AIService.generate_trade_signal(db, user_id, trader.symbol, klines_data, indicators)
            
            if not signal:
                return {"success": False, "message": "无法生成交易信号"}
            
            # 执行模拟交易
            result = SimulationService.execute_simulation_trade(db, user_id, simulated_trader_id, signal)
            
            return result
        except Exception as e:
            print(f"运行模拟交易员失败: {str(e)}")
            return {"success": False, "message": f"运行失败: {str(e)}"}
    
    @staticmethod
    def run_all_simulation_traders(db: Session, user_id: int) -> List[Dict]:
        """运行所有激活的模拟交易员"""
        results = []
        
        # 获取所有激活的模拟交易员
        traders = db.query(SimulatedTrader).filter(
            SimulatedTrader.user_id == user_id,
            SimulatedTrader.is_active == True
        ).all()
        
        for trader in traders:
            try:
                result = SimulationService.run_simulation_trader(db, user_id, trader.id)
                result['trader_id'] = trader.id
                result['trader_name'] = trader.name
                results.append(result)
            except Exception as e:
                print(f"运行模拟交易员 {trader.name} 失败: {str(e)}")
                results.append({
                    "success": False,
                    "message": f"运行失败: {str(e)}",
                    "trader_id": trader.id,
                    "trader_name": trader.name
                })
        
        return results
    
    @staticmethod
    def get_simulation_reports(db: Session, user_id: int, simulated_trader_id: Optional[int] = None, limit: int = 20) -> List[SimulationReport]:
        """获取模拟交易报告"""
        query = db.query(SimulationReport).filter(
            SimulationReport.user_id == user_id
        )
        
        if simulated_trader_id:
            query = query.filter(SimulationReport.simulated_trader_id == simulated_trader_id)
        
        reports = query.order_by(
            SimulationReport.created_at.desc()
        ).limit(limit).all()
        
        return reports
