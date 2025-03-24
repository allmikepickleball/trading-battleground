import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json

client = ApiClient()

def get_stock_chart(symbol, interval='1d', range='1mo', region='US'):
    """
    Fetch stock chart data from Yahoo Finance API
    
    Parameters:
    - symbol: Stock symbol (e.g., 'AAPL')
    - interval: Data interval ('1m', '2m', '5m', '15m', '30m', '60m', '1d', '1wk', '1mo')
    - range: Data range ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
    - region: Region code ('US', 'BR', 'AU', 'CA', 'FR', 'DE', 'HK', 'IN', 'IT', 'ES', 'GB', 'SG')
    
    Returns:
    - Dictionary containing chart data
    """
    try:
        response = client.call_api('YahooFinance/get_stock_chart', query={
            'symbol': symbol,
            'interval': interval,
            'range': range,
            'region': region,
            'includeAdjustedClose': True
        })
        return response
    except Exception as e:
        print(f"Error fetching stock chart data: {e}")
        return None

def get_stock_holders(symbol, region='US'):
    """
    Fetch stock holders information from Yahoo Finance API
    
    Parameters:
    - symbol: Stock symbol (e.g., 'AAPL')
    - region: Region code ('US', 'BR', 'AU', 'CA', 'FR', 'DE', 'HK', 'IN', 'IT', 'ES', 'GB', 'SG')
    
    Returns:
    - Dictionary containing stock holders data
    """
    try:
        response = client.call_api('YahooFinance/get_stock_holders', query={
            'symbol': symbol,
            'region': region
        })
        return response
    except Exception as e:
        print(f"Error fetching stock holders data: {e}")
        return None

def get_stock_insights(symbol):
    """
    Fetch stock insights from Yahoo Finance API
    
    Parameters:
    - symbol: Stock symbol (e.g., 'AAPL')
    
    Returns:
    - Dictionary containing stock insights data
    """
    try:
        response = client.call_api('YahooFinance/get_stock_insights', query={
            'symbol': symbol
        })
        return response
    except Exception as e:
        print(f"Error fetching stock insights data: {e}")
        return None

def format_chart_data(chart_data):
    """
    Format chart data for frontend consumption
    
    Parameters:
    - chart_data: Raw chart data from Yahoo Finance API
    
    Returns:
    - Dictionary with formatted chart data
    """
    if not chart_data or 'chart' not in chart_data or 'result' not in chart_data['chart'] or not chart_data['chart']['result']:
        return None
    
    result = chart_data['chart']['result'][0]
    
    # Extract meta information
    meta = result['meta']
    
    # Extract timestamp and indicators
    timestamps = result['timestamp']
    quote = result['indicators']['quote'][0]
    
    # Extract adjusted close if available
    adjclose = None
    if 'adjclose' in result['indicators'] and result['indicators']['adjclose']:
        adjclose = result['indicators']['adjclose'][0]['adjclose']
    
    # Format data for frontend charting
    formatted_data = {
        'meta': {
            'symbol': meta.get('symbol'),
            'currency': meta.get('currency'),
            'exchangeName': meta.get('exchangeName'),
            'instrumentType': meta.get('instrumentType'),
            'regularMarketPrice': meta.get('regularMarketPrice'),
            'previousClose': meta.get('chartPreviousClose'),
            'gmtoffset': meta.get('gmtoffset'),
            'timezone': meta.get('timezone')
        },
        'series': []
    }
    
    # Create data series for OHLC and volume
    for i in range(len(timestamps)):
        if i < len(quote['close']) and quote['close'][i] is not None:
            data_point = {
                'timestamp': timestamps[i],
                'date': format_timestamp(timestamps[i]),
                'open': quote['open'][i],
                'high': quote['high'][i],
                'low': quote['low'][i],
                'close': quote['close'][i],
                'volume': quote['volume'][i],
                'adjclose': adjclose[i] if adjclose and i < len(adjclose) else quote['close'][i]
            }
            formatted_data['series'].append(data_point)
    
    return formatted_data

def format_timestamp(timestamp):
    """Convert Unix timestamp to ISO date string"""
    from datetime import datetime
    return datetime.fromtimestamp(timestamp).isoformat()

def save_stock_data(symbol, interval='1d', range='1mo'):
    """
    Fetch and save stock data to JSON file
    
    Parameters:
    - symbol: Stock symbol (e.g., 'AAPL')
    - interval: Data interval ('1m', '2m', '5m', '15m', '30m', '60m', '1d', '1wk', '1mo')
    - range: Data range ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
    
    Returns:
    - Path to saved file
    """
    # Get chart data
    chart_data = get_stock_chart(symbol, interval, range)
    formatted_data = format_chart_data(chart_data)
    
    # Get insights data
    insights_data = get_stock_insights(symbol)
    
    # Combine data
    stock_data = {
        'chart': formatted_data,
        'insights': insights_data
    }
    
    # Save to file
    filename = f"/home/ubuntu/trade-arena/server/data/{symbol.lower()}_data.json"
    
    # Ensure directory exists
    import os
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w') as f:
        json.dump(stock_data, f, indent=2)
    
    print(f"Stock data for {symbol} saved to {filename}")
    return filename

if __name__ == "__main__":
    # Test with some popular stocks
    popular_stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']
    
    for symbol in popular_stocks:
        save_stock_data(symbol, interval='1d', range='1mo')
