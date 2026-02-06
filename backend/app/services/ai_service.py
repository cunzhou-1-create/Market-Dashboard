import requests
import json
from typing import Dict, Optional, List, Tuple
from app.config import settings
from app.services.market_service import MarketService
from app.services.trade_service import TradeService
from sqlalchemy.orm import Session


class AIService:
    """AI服务类，用于千问API集成和交易信号生成"""
    
    @staticmethod
    def get_qwen_client() -> Dict:
        """获取千问API客户端配置"""
        return {
            "api_key": settings.QWEN_API_KEY,
            "api_url": settings.QWEN_API_URL
        }
    
    @staticmethod
    def generate_trade_signal(db: Session) -> Optional[Dict]:
        """生成交易信号"""
        try:
            # 获取市场数据
            market_service = MarketService()
            market_data = market_service.get_market_data(db)
            
            # 构建市场数据摘要
            market_summary = ""
            for item in market_data:
                market_summary += f"{item.symbol}: ${item.price}, 24h变化: {item.change}%\n"
            
            # 构建千问API请求
            client = AIService.get_qwen_client()
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {client['api_key']}"
            }
            
            payload = {
                "model": "qwen-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个专业的加密货币交易分析师。基于当前市场数据，生成明确的交易信号。每个信号应包含：币种符号、交易方向（buy/sell）、建议价格、建议数量。只返回JSON格式的信号，不要包含其他解释性文本。"
                    },
                    {
                        "role": "user",
                        "content": f"基于以下市场数据，生成交易信号：\n{market_summary}\n\n请返回JSON格式的交易信号，包含：symbol、side、price、quantity字段。"
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 200
            }
            
            # 调用千问API
            response = requests.post(client['api_url'], headers=headers, json=payload)
            response.raise_for_status()
            
            # 解析响应
            result = response.json()
            signal_text = result['choices'][0]['message']['content']
            
            # 尝试解析JSON信号
            try:
                signal = json.loads(signal_text)
                
                # 保存AI交易信号到数据库
                from app.models.trade import AITradeSignal
                import json as json_module
                
                ai_signal = AITradeSignal(
                    symbol=signal['symbol'],
                    side=signal['side'],
                    price=signal['price'],
                    quantity=signal['quantity'],
                    signal_data=json_module.dumps(signal)
                )
                
                db.add(ai_signal)
                db.commit()
                db.refresh(ai_signal)
                
                # 添加信号ID到返回结果
                signal['signal_id'] = ai_signal.id
                
                return signal
            except json.JSONDecodeError:
                # 如果千问返回的不是纯JSON，尝试提取JSON部分
                import re
                json_match = re.search(r'\{[^}]*\}', signal_text)
                if json_match:
                    try:
                        signal = json.loads(json_match.group(0))
                        
                        # 保存AI交易信号到数据库
                        from app.models.trade import AITradeSignal
                        import json as json_module
                        
                        ai_signal = AITradeSignal(
                            symbol=signal['symbol'],
                            side=signal['side'],
                            price=signal['price'],
                            quantity=signal['quantity'],
                            signal_data=json_module.dumps(signal)
                        )
                        
                        db.add(ai_signal)
                        db.commit()
                        db.refresh(ai_signal)
                        
                        # 添加信号ID到返回结果
                        signal['signal_id'] = ai_signal.id
                        
                        return signal
                    except json.JSONDecodeError:
                        pass
            
            return None
        except Exception as e:
            print(f"生成交易信号失败: {str(e)}")
            return None
    
    @staticmethod
    def execute_trade_signal(db: Session, user_id: int, signal: Dict) -> Optional[Dict]:
        """执行交易信号"""
        try:
            # 验证信号格式
            required_fields = ['symbol', 'side', 'price', 'quantity']
            for field in required_fields:
                if field not in signal:
                    raise ValueError(f"信号缺少必要字段: {field}")
            
            # 创建交易记录
            trade_service = TradeService()
            from app.schemas.trade import TradeRecordCreate
            from app.models.trade import TradeRecord
            
            trade_data = TradeRecordCreate(
                symbol=signal['symbol'],
                side=signal['side'],
                price=signal['price'],
                quantity=signal['quantity'],
                total=signal['price'] * signal['quantity']
            )
            
            # 执行交易
            trade = trade_service.create_trade(db, user_id, trade_data)
            
            # 更新交易记录为AI交易
            trade.is_ai_trade = True
            if 'signal_id' in signal:
                trade.ai_signal_id = signal['signal_id']
            db.commit()
            db.refresh(trade)
            
            # 更新AI信号的执行状态
            if 'signal_id' in signal:
                from app.models.trade import AITradeSignal
                from datetime import datetime
                
                ai_signal = db.query(AITradeSignal).filter(
                    AITradeSignal.id == signal['signal_id']
                ).first()
                
                if ai_signal:
                    ai_signal.is_executed = True
                    ai_signal.executed_trade_id = trade.id
                    ai_signal.executed_at = datetime.utcnow()
                    db.commit()
            
            return {
                "success": True,
                "trade_id": trade.id,
                "message": f"成功执行{signal['side']}交易: {signal['symbol']}"
            }
        except Exception as e:
            print(f"执行交易信号失败: {str(e)}")
            return {
                "success": False,
                "message": f"执行交易失败: {str(e)}"
            }
    
    @staticmethod
    def analyze_market(db: Session) -> Optional[Dict]:
        """分析市场情况"""
        try:
            # 获取市场数据
            market_service = MarketService()
            market_data = market_service.get_market_data(db)
            
            # 构建市场数据摘要
            market_summary = ""
            for item in market_data:
                market_summary += f"{item.symbol}: ${item.price}, 24h变化: {item.change}%\n"
            
            # 构建千问API请求
            client = AIService.get_qwen_client()
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {client['api_key']}"
            }
            
            payload = {
                "model": "qwen-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个专业的加密货币市场分析师。基于当前市场数据，提供简洁的市场分析和趋势预测。"
                    },
                    {
                        "role": "user",
                        "content": f"基于以下市场数据，提供市场分析：\n{market_summary}"
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 300
            }
            
            # 调用千问API
            response = requests.post(client['api_url'], headers=headers, json=payload)
            response.raise_for_status()
            
            # 解析响应
            result = response.json()
            analysis = result['choices'][0]['message']['content']
            
            return {
                "analysis": analysis
            }
        except Exception as e:
            print(f"市场分析失败: {str(e)}")
            return None
