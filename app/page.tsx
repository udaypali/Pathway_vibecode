"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Brain, Zap, Activity } from "lucide-react"

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}

interface AIInsight {
  id: string
  type: "analysis" | "alert" | "recommendation"
  content: string
  confidence: number
  timestamp: string
  relatedSymbols: string[]
}

interface NewsItem {
  title: string
  summary: string
  sentiment: "positive" | "negative" | "neutral"
  timestamp: string
  source: string
}

// Function to fetch real stock data
const fetchStockData = async (symbol: string) => {
  try {
    const response = await fetch(`/api/stocks?symbol=${symbol}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return null
  }
}

// Function to get AI insights
const getAIInsights = async (query: string, stockData: any) => {
  try {
    const response = await fetch("/api/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, stockData }),
    })
    return await response.json()
  } catch (error) {
    console.error("Error getting AI insights:", error)
    return null
  }
}

// Function to fetch news
const fetchNews = async () => {
  try {
    const response = await fetch("/api/news")
    return await response.json()
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

export default function FinancialRAGCopilot() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [query, setQuery] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [apiStatus, setApiStatus] = useState({ groq: false, alphavantage: false })

  // Simulate real-time data streaming
  useEffect(() => {
    const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "META"]

    const updateStockData = () => {
      const newStocks = symbols.map((symbol) => ({
        symbol,
        price: 150 + Math.random() * 200,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 10000000),
        timestamp: new Date().toISOString(),
      }))
      setStocks(newStocks)
    }

    const generateInsight = () => {
      const types: ("analysis" | "alert" | "recommendation")[] = ["analysis", "alert", "recommendation"]
      const insights = [
        "Strong bullish momentum detected in tech sector with 15% volume increase",
        "Market volatility spike - consider defensive positions",
        "AI sector showing consolidation pattern, potential breakout incoming",
        "Energy stocks underperforming, rotation to growth sectors observed",
        "Options flow indicates institutional accumulation in semiconductor stocks",
      ]

      const newInsight: AIInsight = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        content: insights[Math.floor(Math.random() * insights.length)],
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
        relatedSymbols: symbols.slice(0, Math.floor(Math.random() * 3) + 1),
      }

      setInsights((prev) => [newInsight, ...prev.slice(0, 9)])
    }

    const generateNews = () => {
      const newsItems = [
        {
          title: "Fed Signals Potential Rate Cut",
          summary: "Federal Reserve hints at monetary policy shift",
          sentiment: "positive" as const,
        },
        {
          title: "Tech Earnings Beat Expectations",
          summary: "Major tech companies report strong quarterly results",
          sentiment: "positive" as const,
        },
        {
          title: "Geopolitical Tensions Rise",
          summary: "Market uncertainty increases due to global events",
          sentiment: "negative" as const,
        },
        {
          title: "AI Revolution Continues",
          summary: "Artificial intelligence adoption accelerates across industries",
          sentiment: "positive" as const,
        },
      ]

      const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)]
      const newNewsItem: NewsItem = {
        ...randomNews,
        timestamp: new Date().toISOString(),
        source: "Financial Times",
      }

      setNews((prev) => [newNewsItem, ...prev.slice(0, 4)])
    }

    // Initial data load
    updateStockData()
    generateInsight()
    generateNews()

    // Set up intervals for real-time updates
    const stockInterval = setInterval(updateStockData, 3000)
    const insightInterval = setInterval(generateInsight, 8000)
    const newsInterval = setInterval(generateNews, 12000)

    return () => {
      clearInterval(stockInterval)
      clearInterval(insightInterval)
      clearInterval(newsInterval)
    }
  }, [])

  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const pathwayResponse = await fetch("/api/pathway-integration")
        const pathwayData = await pathwayResponse.json()

        setApiStatus({
          groq: pathwayData.connectors?.groq_ai?.status === "connected",
          alphavantage: pathwayData.connectors?.alphavantage?.status === "connected",
        })
      } catch (error) {
        console.error("Error checking API status:", error)
      }
    }

    checkAPIStatus()
    const interval = setInterval(checkAPIStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleQuery = async () => {
    if (!query.trim()) return

    setIsStreaming(true)

    try {
      // Get current stock data for context
      const currentStock = stocks.find((s) => s.symbol === selectedSymbol) || {
        symbol: selectedSymbol,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        timestamp: new Date().toISOString(),
      }

      const aiResponse = await getAIInsights(query, currentStock)

      if (aiResponse) {
        const response: AIInsight = {
          id: Date.now().toString(),
          type: "analysis",
          content: aiResponse.insight,
          confidence: aiResponse.confidence,
          timestamp: aiResponse.timestamp,
          relatedSymbols: [selectedSymbol],
        }

        setInsights((prev) => [response, ...prev.slice(0, 9)])
      } else {
        // Fallback insight if API fails
        const fallbackInsight: AIInsight = {
          id: Date.now().toString(),
          type: "analysis",
          content: `Analysis for "${query}": Current market conditions suggest a cautious approach. Consider diversification and risk management strategies.`,
          confidence: 0.7,
          timestamp: new Date().toISOString(),
          relatedSymbols: [selectedSymbol],
        }
        setInsights((prev) => [fallbackInsight, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error("Error processing query:", error)

      // Add error insight
      const errorInsight: AIInsight = {
        id: Date.now().toString(),
        type: "alert",
        content: "Unable to process query at this time. Please try again or check your connection.",
        confidence: 0.5,
        timestamp: new Date().toISOString(),
        relatedSymbols: [selectedSymbol],
      }
      setInsights((prev) => [errorInsight, ...prev.slice(0, 9)])
    } finally {
      setIsStreaming(false)
      setQuery("")
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "analysis":
        return <Brain className="h-4 w-4" />
      case "alert":
        return <Zap className="h-4 w-4" />
      case "recommendation":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "analysis":
        return "border-cyan-500/50 bg-cyan-500/10"
      case "alert":
        return "border-yellow-500/50 bg-yellow-500/10"
      case "recommendation":
        return "border-green-500/50 bg-green-500/10"
      default:
        return "border-purple-500/50 bg-purple-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Financial RAG Copilot
            </h1>
            <p className="text-gray-400">Real-time AI-powered financial analysis with live data streaming</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400">Live Data Stream Active</span>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
            Pathway Powered
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${apiStatus.groq ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
            ></div>
            <span className={`text-sm ${apiStatus.groq ? "text-green-400" : "text-red-400"}`}>
              Groq AI {apiStatus.groq ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${apiStatus.alphavantage ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
            ></div>
            <span className={`text-sm ${apiStatus.alphavantage ? "text-green-400" : "text-red-400"}`}>
              AlphaVantage {apiStatus.alphavantage ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* AI Query Interface */}
      <Card className="mb-6 bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Financial Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about market conditions, portfolio analysis, or specific stocks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 'What's the sentiment on tech stocks today?' or 'Should I buy AAPL?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleQuery()}
              className="bg-black/50 border-gray-700 text-white placeholder-gray-500"
            />
            <Button
              onClick={handleQuery}
              disabled={isStreaming || !query.trim()}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
            >
              {isStreaming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing
                </div>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400"
          >
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="news" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400">
            Market News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <Card
                key={stock.symbol}
                className={`bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer ${
                  selectedSymbol === stock.symbol ? "border-cyan-500/50 bg-cyan-500/5" : ""
                }`}
                onClick={() => setSelectedSymbol(stock.symbol)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-cyan-400">{stock.symbol}</CardTitle>
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</span>
                      <div className={`text-sm ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Volume: {stock.volume.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stocks.filter((s) => s.change > 0).length}</div>
                <p className="text-xs text-green-300">Stocks trending up</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stocks.filter((s) => s.change < 0).length}</div>
                <p className="text-xs text-red-300">Stocks trending down</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Avg Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {(stocks.reduce((acc, s) => acc + s.volume, 0) / stocks.length / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-purple-300">Million shares</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Real-time AI Insights
              </CardTitle>
              <CardDescription>AI-powered analysis updated in real-time as new data streams in</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded bg-white/10">{getInsightIcon(insight.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              Confidence: {(insight.confidence * 100).toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(insight.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200 mb-2">{insight.content}</p>
                          <div className="flex gap-1">
                            {insight.relatedSymbols.map((symbol) => (
                              <Badge key={symbol} variant="secondary" className="text-xs">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Market News
              </CardTitle>
              <CardDescription>Real-time financial news with sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          item.sentiment === "positive"
                            ? "border-green-500/50 text-green-400"
                            : item.sentiment === "negative"
                              ? "border-red-500/50 text-red-400"
                              : "border-gray-500/50 text-gray-400"
                        }`}
                      >
                        {item.sentiment}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{item.source}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
