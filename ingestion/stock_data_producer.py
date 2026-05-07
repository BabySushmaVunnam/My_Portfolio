"""
Real-time stock data fetcher and Kafka producer using yfinance and kafka-python.
Place this script in the ingestion/ directory.
"""

import time
import json
import yfinance as yf
from kafka import KafkaProducer

# Configuration
STOCK_SYMBOL = 'AAPL'  # Change to your preferred stock symbol
KAFKA_BROKER = 'localhost:9092'  # Update if your Kafka broker is elsewhere
KAFKA_TOPIC = 'stock-data'
FETCH_INTERVAL = 5  # seconds

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def fetch_stock_data(symbol):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period='1m', interval='1m')
    if not data.empty:
        last_row = data.iloc[-1]
        return {
            'symbol': symbol,
            'timestamp': str(last_row.name),
            'open': last_row['Open'],
            'high': last_row['High'],
            'low': last_row['Low'],
            'close': last_row['Close'],
            'volume': last_row['Volume']
        }
    return None

def main():
    print(f"Starting real-time stock data producer for {STOCK_SYMBOL}")
    while True:
        stock_data = fetch_stock_data(STOCK_SYMBOL)
        if stock_data:
            producer.send(KAFKA_TOPIC, stock_data)
            print(f"Sent: {stock_data}")
        else:
            print("No new data fetched.")
        time.sleep(FETCH_INTERVAL)

if __name__ == "__main__":
    main()
