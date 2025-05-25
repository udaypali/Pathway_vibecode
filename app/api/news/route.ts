import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Real financial news API integration
    const apiKey = process.env.ALPHAVANTAGE_API_KEY
    if (!apiKey) {
      throw new Error("AlphaVantage API key not configured")
    }

    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apiKey}&limit=10`)

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.feed || data.feed.length === 0) {
      // Fallback to simulated news
      return NextResponse.json(getSimulatedNews())
    }

    const newsItems = data.feed.slice(0, 5).map((item: any) => ({
      title: item.title,
      summary: item.summary.substring(0, 200) + "...",
      sentiment: getSentimentFromScore(item.overall_sentiment_score),
      timestamp: new Date(item.time_published).toISOString(),
      source: item.source,
      url: item.url,
    }))

    return NextResponse.json(newsItems)
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json(getSimulatedNews())
  }
}

function getSentimentFromScore(score: number): "positive" | "negative" | "neutral" {
  if (score > 0.1) return "positive"
  if (score < -0.1) return "negative"
  return "neutral"
}

function getSimulatedNews() {
  const newsItems = [
    {
      title: "Fed Signals Potential Rate Cut in Q2",
      summary:
        "Federal Reserve officials hint at monetary policy shift amid economic uncertainty and inflation concerns.",
      sentiment: "positive" as const,
      timestamp: new Date().toISOString(),
      source: "Financial Times",
      url: "#",
    },
    {
      title: "Tech Earnings Beat Expectations",
      summary: "Major technology companies report strong quarterly results, driving market optimism in the sector.",
      sentiment: "positive" as const,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: "Reuters",
      url: "#",
    },
    {
      title: "Geopolitical Tensions Impact Markets",
      summary: "Global market uncertainty increases due to ongoing international conflicts and trade disputes.",
      sentiment: "negative" as const,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: "Bloomberg",
      url: "#",
    },
    {
      title: "AI Revolution Accelerates",
      summary: "Artificial intelligence adoption continues across industries, creating new investment opportunities.",
      sentiment: "positive" as const,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      source: "Wall Street Journal",
      url: "#",
    },
  ]

  return newsItems
}
