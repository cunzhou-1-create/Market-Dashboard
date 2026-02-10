import requests
import json
from typing import Dict, Optional, List, Tuple
from app.config import settings
from app.services.market_service import MarketService
from app.services.trade_service import TradeService
from sqlalchemy.orm import Session
from app.models.trade import ApiKey
from app.utils.security import verify_api_key


class AIService:
    """AI服务类，用于千问API集成和交易信号生成"""
    
    @staticmethod
    def get_user_api_key(db: Session, user_id: int, provider: str) -> Optional[str]:
        """获取用户的API密钥"""
        from app.utils.security import verify_api_key
        
        # 查询用户的API密钥
        api_key = db.query(ApiKey).filter(
            ApiKey.user_id == user_id,
            ApiKey.provider == provider,
            ApiKey.is_connected == True
        ).first()
        
        if api_key:
            # 这里简化处理，实际应该从哈希中恢复API密钥
            # 由于我们只存储了哈希值，这里需要从其他地方获取原始密钥
            # 暂时返回配置中的API密钥
            if provider == 'qwen':
                return settings.QWEN_API_KEY
            elif provider == 'openai':
                return settings.OPENAI_API_KEY
            elif provider == 'anthropic':
                return settings.ANTHROPIC_API_KEY
        
        return None
    
    @staticmethod
    def get_qwen_client(user_id: Optional[int] = None, db: Optional[Session] = None) -> Dict:
        """获取千问API客户端配置"""
        api_key = settings.QWEN_API_KEY
        
        # 如果提供了用户ID和数据库会话，优先使用用户的API密钥
        if user_id and db:
            user_api_key = AIService.get_user_api_key(db, user_id, 'qwen')
            if user_api_key:
                api_key = user_api_key
        
        return {
            "api_key": api_key,
            "api_url": settings.QWEN_API_URL
        }
    
    @staticmethod
    def generate_trade_signal(db: Session, user_id: Optional[int] = None, symbol: Optional[str] = None, klines_data: Optional[List[Dict]] = None, indicators: Optional[Dict] = None) -> Optional[Dict]:
        """生成交易信号，支持传入K线数据和技术指标"""
        try:
            # 构建市场数据和技术指标摘要
            market_summary = ""
            
            if symbol:
                # 如果指定了币对，获取该币对的详细数据
                market_service = MarketService()
                
                # 获取K线数据
                if not klines_data:
                    klines_data = market_service.get_klines_data(symbol, '30m', 50)
                
                # 获取技术指标
                if not indicators:
                    indicators = market_service.get_technical_indicators(symbol)
                
                # 构建K线数据摘要
                recent_klines = klines_data[-10:]  # 最近10根K线
                kline_summary = "最近K线数据（30分钟周期）：\n"
                for i, kline in enumerate(reversed(recent_klines)):
                    kline_summary += f"K线{i+1}: 开={kline['open']:.2f}, 高={kline['high']:.2f}, 低={kline['low']:.2f}, 收={kline['close']:.2f}, 量={kline['volume']:.2f}\n"
                
                # 构建技术指标摘要
                indicator_summary = "技术指标：\n"
                indicator_summary += f"RSI: {indicators.get('rsi', 0):.2f}\n"
                indicator_summary += f"ATR: {indicators.get('atr', 0):.2f}\n"
                indicator_summary += f"EMA20: {indicators.get('ema', {}).get('ema20', 0):.2f}\n"
                indicator_summary += f"EMA50: {indicators.get('ema', {}).get('ema50', 0):.2f}\n"
                indicator_summary += f"MA20: {indicators.get('ma', {}).get('ma20', 0):.2f}\n"
                indicator_summary += f"MA50: {indicators.get('ma', {}).get('ma50', 0):.2f}\n"
                indicator_summary += f"布林带: 上轨={indicators.get('bollinger', {}).get('upper', 0):.2f}, 中轨={indicators.get('bollinger', {}).get('middle', 0):.2f}, 下轨={indicators.get('bollinger', {}).get('lower', 0):.2f}\n"
                indicator_summary += f"支撑位: {indicators.get('support_levels', [])}\n"
                indicator_summary += f"压力位: {indicators.get('resistance_levels', [])}\n"
                indicator_summary += f"24小时成交量: {indicators.get('volume', 0):.2f}\n"
                
                market_summary = f"交易对: {symbol}\n{kline_summary}\n{indicator_summary}"
            else:
                # 否则获取整体市场数据
                market_service = MarketService()
                market_data = market_service.get_market_data(db)
                
                # 构建市场数据摘要
                for item in market_data[:10]:  # 只使用前10个币对
                    market_summary += f"{item.symbol}: ${item.price}, 24h变化: {item.change}%\n"
            
            # 构建千问API请求
            client = AIService.get_qwen_client(user_id, db)
            
            # 检查API密钥是否存在
            if not client['api_key']:
                print("千问API密钥未配置")
                return None
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {client['api_key']}"
            }
            
            payload = {
                "model": "qwen-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "你是一个专业的加密货币交易分析师。基于K线数据和技术指标，生成明确的交易信号。每个信号应包含：币种符号、交易方向（buy/sell）、建议价格、建议数量。只返回JSON格式的信号，不要包含其他解释性文本。"
                    },
                    {
                        "role": "user",
                        "content": f"基于以下市场数据和技术指标，生成交易信号：\n{market_summary}\n\n请返回JSON格式的交易信号，包含：symbol、side、price、quantity字段。"
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
    def generate_batch_trade_signals(db: Session, user_id: int, symbols: List[str]) -> List[Dict]:
        """批量生成交易信号，支持多交易员同时运行"""
        signals = []
        
        for symbol in symbols:
            try:
                signal = AIService.generate_trade_signal(db, user_id, symbol)
                if signal:
                    signals.append(signal)
            except Exception as e:
                print(f"为{symbol}生成交易信号失败: {str(e)}")
        
        return signals
    
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
                total=signal['price'] * signal['quantity'],
                is_ai_trade=True,
                ai_signal_id=signal.get('signal_id')
            )
            
            # 执行交易
            trade = trade_service.create_trade(db, user_id, trade_data)
            
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
    def analyze_market(db: Session, user_id: Optional[int] = None) -> Optional[Dict]:
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
            client = AIService.get_qwen_client(user_id, db)
            
            # 检查API密钥是否存在
            if not client['api_key']:
                print("千问API密钥未配置")
                return None
            
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
