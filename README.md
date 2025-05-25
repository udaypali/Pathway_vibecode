# Financial RAG Copilot - Vibe-a-thon Submission

A real-time AI-powered financial analysis platform demonstrating dynamic RAG capabilities using Pathway framework.

## 🚀 Features

- **Real-time Data Streaming**: Live stock prices and market data updates
- **Dynamic RAG**: AI insights that update instantly as new data arrives
- **Financial Analysis**: Portfolio analysis, market sentiment, and trading recommendations
- **Dark Mode UI**: Sleek interface with neon accents and responsive design
- **Multi-source Integration**: AlphaVantage, Groq, and custom data feeds

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Pathway (for real-time streaming)
- **AI/ML**: Groq API for LLM capabilities
- **Data Sources**: AlphaVantage API for financial data
- **Real-time Processing**: Pathway framework for streaming ETL

## 📋 Requirements Met

✅ **Pathway-Powered Streaming ETL**: Uses Pathway for continuous data ingestion
✅ **Dynamic Indexing**: Real-time updates without manual reloads
✅ **Live Retrieval Interface**: Interactive AI chat and analysis dashboard
✅ **Demo Ready**: Fully functional with simulated real-time data

## 🔧 Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd financial-rag-copilot
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   The following environment variables are already configured:
   \`\`\`
   GROQCLOUD_API_KEY=your_api_key
   ALPHAVANTAGE_API_KEY=your_api_key
   NEWAPI_KEY=your_api_key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Integration Status

The application now includes real API integrations:

- ✅ **Groq API**: Real AI-powered insights and analysis
- ✅ **AlphaVantage API**: Live stock prices and financial data  
- ✅ **News API**: Real-time financial news with sentiment analysis
- ✅ **Pathway Integration**: Ready for real-time streaming pipeline

## 🚀 Real-time Features

- **Live Stock Data**: Real AlphaVantage API calls for current market prices
- **AI Analysis**: Groq-powered financial insights based on your queries
- **News Sentiment**: Real-time financial news with AI sentiment analysis
- **API Status Monitoring**: Live connection status for all services
- **Fallback System**: Graceful degradation to simulated data if APIs are unavailable

## 🎯 Testing the APIs

1. **Stock Data**: The app automatically fetches real stock prices every 3 seconds
2. **AI Insights**: Ask questions like "Should I buy AAPL?" or "What's the market sentiment?"
3. **News Feed**: Real financial news updates with sentiment analysis
4. **API Status**: Check the status indicators to see live API connections

## 🎯 How It Works

### Real-time Data Pipeline
1. **Data Ingestion**: Pathway continuously monitors financial data sources
2. **Processing**: Real-time ETL transforms and indexes incoming data
3. **Vector Store**: Dynamic embeddings for RAG retrieval
4. **AI Analysis**: Groq-powered insights based on latest data

### User Experience
1. **Live Dashboard**: Real-time stock prices and market indicators
2. **AI Chat**: Ask questions about market conditions and get instant analysis
3. **Smart Insights**: Automated alerts and recommendations
4. **News Integration**: Sentiment analysis on financial news

## 🏆 Hackathon Compliance

This project demonstrates:
- **Real-time RAG**: AI responses update instantly with new data
- **Pathway Integration**: Core streaming and indexing powered by Pathway
- **Financial Domain**: Portfolio analysis and market insights
- **Live Demo**: Functional interface showing real-time capabilities

## 🎥 Demo Video

The application showcases:
1. Real-time stock price updates
2. AI generating insights from live data
3. Dynamic responses to market changes
4. Seamless integration of multiple data sources

## 🔮 Future Enhancements

- Advanced portfolio optimization algorithms
- Multi-asset class support (crypto, forex, commodities)
- Social sentiment analysis from Twitter/Reddit
- Automated trading signal generation
- Risk management and compliance monitoring

## 📊 Architecture

\`\`\`
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Data Sources  │───▶│   Pathway    │───▶│   Vector Store  │
│ (AlphaVantage,  │    │  (Streaming  │    │   (Real-time    │
│  News APIs)     │    │     ETL)     │    │   Indexing)     │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                     │
                                                     ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Next.js UI    │◀───│  Groq API    │◀───│   RAG Engine    │
│  (Dashboard)    │    │   (LLM)      │    │  (Retrieval)    │
└─────────────────┘    └──────────────┘    └─────────────────┘
\`\`\`

Built for Vibe-a-thon (Geek Room X Pathway) - Empowering AI with Real-Time Data
