import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "AAPL"

  try {
    // Real AlphaVantage API integration
    const apiKey = process.env.ALPHAVANTAGE_API_KEY
    if (!apiKey) {
      console.warn("AlphaVantage API key not configured, using simulated data")
      return NextResponse.json(getSimulatedStockData(symbol))
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }, // Cache for 1 minute
    )

    if (!response.ok) {
      console.error(`AlphaVantage API error: ${response.status}`)
      return NextResponse.json(getSimulatedStockData(symbol))
    }

    const data = await response.json()

    // Check for API limit or error response
    if (data["Error Message"] || data["Note"]) {
      console.warn("AlphaVantage API limit reached or error:", data["Error Message"] || data["Note"])
      return NextResponse.json(getSimulatedStockData(symbol))
    }

    // Parse AlphaVantage response format
    const quote = data["Global Quote"]
    if (!quote || !quote["01. symbol"]) {
      console.warn("Invalid AlphaVantage response format")
      return NextResponse.json(getSimulatedStockData(symbol))
    }

    const stockData = {
      symbol: quote["01. symbol"],
      price: Number.parseFloat(quote["05. price"]),
      change: Number.parseFloat(quote["09. change"]),
      changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
      volume: Number.parseInt(quote["06. volume"]),
      timestamp: new Date().toISOString(),
      source: "alphavantage",
    }

    return NextResponse.json(stockData)
  } catch (error) {
    console.error("Stock API error:", error)
    return NextResponse.json(getSimulatedStockData(symbol))
  }
}

function getSimulatedStockData(symbol: string) {
  const basePrice = symbol === "AAPL" ? 175 : symbol === "GOOGL" ? 140 : symbol === "MSFT" ? 380 : 150
  return {
    symbol,
    price: basePrice + (Math.random() - 0.5) * 20,
    change: (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
    volume: Math.floor(Math.random() * 10000000),
    timestamp: new Date().toISOString(),
    source: "simulated",
  }
}
