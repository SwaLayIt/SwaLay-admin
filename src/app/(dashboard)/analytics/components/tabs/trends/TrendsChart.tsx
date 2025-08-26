"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiGet } from "@/helpers/axiosRequest"
import { ApiResponse } from "@/interfaces/api.interface"
import { TrendingUp } from "lucide-react"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import useSWR from "swr"

interface TrendsChartProps {
  selectedState: string
}

interface TrendData {
  [state: string]: {
    [month: number]: number
  }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const trendFetcher = (apiPath:string)=>apiGet<ApiResponse<TrendData>>(apiPath)

export function TrendsChart({ selectedState="all" }: TrendsChartProps) {
  const currentYear = new Date().getFullYear()

  const {data : trendDataResponse} = useSWR("/api/analytics/trendDetails",trendFetcher,{
    revalidateIfStale : false,
    refreshInterval : 10*1000*60
  })


  // Convert API state data into chart-friendly format
  const chartData = useMemo(() => {
    const stateData = trendDataResponse?.data && trendDataResponse?.data[selectedState] || {}
    return Object.entries(stateData).map(([monthNum, count]) => ({
      month: monthNames[parseInt(monthNum) - 1],
      subscriptions: count,
      year: currentYear,
    }))
  }, [trendDataResponse, selectedState,trendDataResponse?.data])

  // Stats
  const totalSubscriptions = chartData.reduce((sum, item) => sum + item.subscriptions, 0)
  const averagePerMonth = chartData.length ? Math.round(totalSubscriptions / chartData.length) : 0
  const currentMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const monthlyGrowth =
    previousMonth && currentMonth
      ? (((currentMonth.subscriptions - previousMonth.subscriptions) / previousMonth.subscriptions) * 100).toFixed(1)
      : "0"

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total This Year</p>
                <p className="text-2xl font-bold">{totalSubscriptions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold">{averagePerMonth.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                <p className="text-2xl font-bold text-green-600">+{monthlyGrowth}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Subscription Trends {currentYear}
          </CardTitle>
          <CardDescription>
            {selectedState === "all"
              ? "Subscription distribution across all states"
              : `Subscription trends for ${selectedState}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
                <YAxis className="text-sm" tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{`${label} ${currentYear}`}</p>
                          <p className="text-blue-600">{`Subscriptions: ${payload[0].value?.toLocaleString()}`}</p>
                          {selectedState !== "all" && (
                            <p className="text-sm text-muted-foreground">State: {selectedState}</p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
