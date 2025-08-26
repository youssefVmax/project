"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Star, TrendingUp, Users, Target, Calendar, Zap, X } from "lucide-react"
import { getAgentAvatar, getTeamLogo, getInitialsAvatar } from "../utils/avatarUtils"

interface Deal {
  date: string
  customer_name: string
  phone_number: string
  email_address: string
  amount: number
  user: string
  address: string
  sales_agent: string
  closing_agent: string
  team: string
  duration: string
  type_program: string
  type_service: string
  invoice: string
  device_id: string
  device_key: string
  comment: string
  no_user: string
  status: string
  sales_agent_norm: string
  closing_agent_norm: string
  sales_agent_id: string
  closing_agent_id: string
  deal_id: string
}

interface AgentStats {
  id: string
  name: string
  deals: number
  totalAmount: number
  team: string
  avatar?: string
}

interface TeamStats {
  name: string
  deals: number
  totalAmount: number
  agents: number
}

export default function SalesCompetitionDashboard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [celebrating, setCelebrating] = useState(false)
  const [showWinnerCards, setShowWinnerCards] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [currentMonth] = useState(new Date().toLocaleString("default", { month: "long", year: "numeric" }))

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log("[v0] Starting to fetch deals from CSV...")
        const response = await fetch(
          "/data/aug-ids-new.csv",
        )
        const csvText = await response.text()
        console.log("[v0] CSV text length:", csvText.length)

        const parseCSVLine = (line: string): string[] => {
          const result: string[] = []
          let current = ""
          let inQuotes = false

          for (let i = 0; i < line.length; i++) {
            const char = line[i]

            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              result.push(current.trim())
              current = ""
            } else {
              current += char
            }
          }

          result.push(current.trim())
          return result
        }

        const lines = csvText.split("\n").filter((line) => line.trim())
        const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/"/g, ""))
        console.log("[v0] CSV headers:", headers)

        const parsedDeals: Deal[] = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = parseCSVLine(line).map((v) => v.trim().replace(/"/g, ""))

            let amount = 0
            const amountStr = values[4] || ""
            if (amountStr) {
              // Remove any currency symbols and parse
              const cleanAmount = amountStr.replace(/[$,]/g, "")
              amount = Number.parseFloat(cleanAmount) || 0
            }

            const deal = {
              date: values[0] || "",
              customer_name: values[1] || "",
              phone_number: values[2] || "",
              email_address: values[3] || "",
              amount: amount,
              user: values[5] || "",
              address: values[6] || "",
              sales_agent: values[7] || "",
              closing_agent: values[8] || "",
              team: values[9] || "",
              duration: values[10] || "",
              type_program: values[11] || "",
              type_service: values[12] || "",
              invoice: values[13] || "",
              device_id: values[14] || "",
              device_key: values[15] || "",
              comment: values[16] || "",
              no_user: values[17] || "",
              status: values[18] || "",
              sales_agent_norm: values[19] || "",
              closing_agent_norm: values[20] || "",
              sales_agent_id: values[21] || "",
              closing_agent_id: values[22] || "",
              deal_id: values[23] || "",
            }

            if (index < 3) {
              console.log(`[v0] Deal ${index + 1}:`, {
                customer: deal.customer_name,
                amount: deal.amount,
                sales_agent: deal.sales_agent,
                closing_agent: deal.closing_agent,
                team: deal.team,
              })
            }

            return deal
          })

        console.log("[v0] Total parsed deals:", parsedDeals.length)
        console.log(
          "[v0] Total revenue:",
          parsedDeals.reduce((sum, deal) => sum + deal.amount, 0),
        )

        setDeals(parsedDeals)
        setLastUpdate(new Date())
      } catch (error) {
        console.error("[v0] Error fetching deals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()

    const interval = setInterval(fetchDeals, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAgentStats = (type: "sales" | "closing"): AgentStats[] => {
    const agentMap = new Map<string, AgentStats>()

    deals.forEach((deal) => {
      const agentName = type === "sales" ? deal.sales_agent : deal.closing_agent
      const agentId = type === "sales" ? deal.sales_agent_id : deal.closing_agent_id

      if (!agentName || !agentId || agentName.trim() === "" || agentId.trim() === "") return

      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          id: agentId,
          name: agentName,
          deals: 0,
          totalAmount: 0,
          team: deal.team,
          avatar: `/placeholder.svg?height=40&width=40&query=${agentName.replace(/\s+/g, "+")}`,
        })
      }

      const agent = agentMap.get(agentId)!
      agent.deals += 1
      agent.totalAmount += deal.amount
    })

    const result = Array.from(agentMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
    console.log(`[v0] ${type} agents stats:`, result.slice(0, 3))
    return result
  }

  const getTeamStats = (): TeamStats[] => {
    const teamMap = new Map<string, TeamStats>()

    deals.forEach((deal) => {
      if (!deal.team || deal.team.trim() === "") return

      if (!teamMap.has(deal.team)) {
        teamMap.set(deal.team, {
          name: deal.team,
          deals: 0,
          totalAmount: 0,
          agents: 0,
        })
      }

      const team = teamMap.get(deal.team)!
      team.deals += 1
      team.totalAmount += deal.amount
    })

    teamMap.forEach((team, teamName) => {
      const agentSet = new Set<string>()
      deals.forEach((deal) => {
        if (deal.team === teamName) {
          if (deal.sales_agent && deal.sales_agent.trim()) agentSet.add(deal.sales_agent)
          if (deal.closing_agent && deal.closing_agent.trim()) agentSet.add(deal.closing_agent)
        }
      })
      team.agents = agentSet.size
    })

    const result = Array.from(teamMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
    console.log("[v0] Team stats:", result)
    return result
  }

  const salesAgents = getAgentStats("sales")
  const closingAgents = getAgentStats("closing")
  const teams = getTeamStats()

  const triggerCelebration = () => {
    setCelebrating(true)
    setShowWinnerCards(true)
    setTimeout(() => setCelebrating(false), 3000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const LeaderboardCard = ({
    title,
    icon: Icon,
    data,
    type,
  }: {
    title: string
    icon: any
    data: AgentStats[] | TeamStats[]
    type: "agent" | "team"
  }) => (
    <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4">
      <div className="pb-3 border-b mb-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </div>
      </div>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div
            key={type === "agent" ? (item as AgentStats).id : (item as TeamStats).name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 slide-up ${
              index === 0 ? "bg-accent/20 pulse-glow" : "bg-muted/50"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index === 0
                    ? "bg-accent text-accent-foreground"
                    : index === 1
                      ? "bg-chart-2 text-white"
                      : index === 2
                        ? "bg-chart-3 text-white"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {index === 0 ? (
                  <Trophy className="h-4 w-4" />
                ) : index === 1 ? (
                  <Medal className="h-4 w-4" />
                ) : index === 2 ? (
                  <Star className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {type === "agent" && (
                <img
                  src={(item as AgentStats).avatar || "/placeholder.svg"}
                  alt={(item as AgentStats).name}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div>
                <p className="font-medium text-foreground">
                  {type === "agent" ? (item as AgentStats).name : (item as TeamStats).name}
                </p>
                {type === "agent" && <p className="text-xs text-muted-foreground">{(item as AgentStats).team}</p>}
                {type === "team" && (
                  <p className="text-xs text-muted-foreground">{(item as TeamStats).agents} agents</p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-foreground">
                {type === "agent" ? (item as AgentStats).deals : (item as TeamStats).deals} deals
              </p>
              <p className="text-sm text-accent font-medium">
                {formatCurrency(type === "agent" ? (item as AgentStats).totalAmount : (item as TeamStats).totalAmount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const WinnerCard = ({
    agent,
    title,
    icon: Icon,
    color,
    bgColor,
  }: {
    agent: AgentStats | TeamStats
    title: string
    icon: any
    color: string
    bgColor: string
  }) => (
    <div className={`rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 ${bgColor} border-2 transform transition-all duration-500 hover:scale-105 winner-card-animate`}>
      <div className="p-8 text-center">
        <div className="relative">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="h-6 w-6 text-yellow-800" />
          </div>
          <Icon className={`h-16 w-16 ${color} mx-auto mb-6`} />

          {"avatar" in agent ? (
            <img
              src={agent.avatar || "/placeholder.svg"}
              alt={agent.name}
              className={`w-24 h-24 rounded-full mx-auto mb-6 border-4 ${color.replace("text-", "border-")} shadow-lg`}
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full mx-auto mb-6 border-4 ${color.replace("text-", "border-")} ${bgColor} flex items-center justify-center shadow-lg`}
            >
              <Users className={`h-12 w-12 ${color}`} />
            </div>
          )}

          <h3 className="text-3xl font-bold text-foreground mb-2">{agent.name}</h3>
          <p className={`${color} font-bold text-xl mb-2`}>{title}</p>
          {"team" in agent && agent.team && <p className="text-muted-foreground mb-4">{agent.team}</p>}
          {"agents" in agent && <p className="text-muted-foreground mb-4">{agent.agents} active agents</p>}

          <div className="space-y-2">
            <div className={`inline-block px-4 py-2 ${bgColor} rounded-full`}>
              <p className="text-3xl font-bold text-foreground">{agent.deals}</p>
              <p className="text-sm text-muted-foreground">DEALS WON</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{formatCurrency(agent.totalAmount)}</p>
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 text-yellow-400 fill-current animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading competition data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Celebration Effects */}
      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: i % 3 === 0 ? "var(--accent)" : i % 3 === 1 ? "var(--primary)" : "var(--chart-3)",
              }}
            />
          ))}
        </div>
      )}

      {showWinnerCards && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Trophy className="h-10 w-10 text-yellow-400" />🎉 COMPETITION WINNERS! 🎉
              </h2>
              <button type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowWinnerCards(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {salesAgents[0] && (
                <WinnerCard
                  agent={salesAgents[0]}
                  title="🏆 TOP SALES CHAMPION"
                  icon={TrendingUp}
                  color="text-yellow-400"
                  bgColor="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50"
                />
              )}

              {closingAgents[0] && (
                <WinnerCard
                  agent={closingAgents[0]}
                  title="🎯 CLOSING MASTER"
                  icon={Target}
                  color="text-blue-400"
                  bgColor="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50"
                />
              )}

              {teams[0] && (
                <WinnerCard
                  agent={teams[0]}
                  title="👑 TEAM CHAMPIONS"
                  icon={Users}
                  color="text-green-400"
                  bgColor="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50"
                />
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                Congratulations to all our amazing performers this month!
              </p>
              <button type="button"
                onClick={() => setShowWinnerCards(false)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-3 text-lg"
              >
                Continue Competition! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-accent" />
                <h1 className="text-2xl font-bold text-foreground">Sales Competition Dashboard</h1>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium mr-2">
                <Calendar className="h-3 w-3 mr-1" />
                {currentMonth}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <button type="button" onClick={triggerCelebration} className="bg-primary hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-2" />
                Celebrate!
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <p className="text-3xl font-bold text-primary">{deals.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-accent/20 border-accent/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(deals.reduce((sum, deal) => sum + deal.amount, 0))}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-chart-3/20 border-chart-3/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                  <p className="text-3xl font-bold text-chart-3">{teams.length}</p>
                </div>
                <Users className="h-8 w-8 text-chart-3" />
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-gradient-to-br from-chart-2/20 to-chart-2/5 border-chart-2/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                  <p className="text-3xl font-bold text-chart-2">
                    {formatCurrency(
                      deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.amount, 0) / deals.length : 0,
                    )}
                  </p>
                </div>
                <Star className="h-8 w-8 text-chart-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <LeaderboardCard title="Top Sales Agents" icon={TrendingUp} data={salesAgents} type="agent" />

          <LeaderboardCard title="Top Closing Agents" icon={Target} data={closingAgents} type="agent" />

          <LeaderboardCard title="Team Rankings" icon={Users} data={teams} type="team" />
        </div>

        {/* Winner Spotlight */}
        {(salesAgents.length > 0 || closingAgents.length > 0 || teams.length > 0) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
              Current Champions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {salesAgents[0] && (
                <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 pulse-glow">
                  <div className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-accent mx-auto mb-4" />
                    <img
                      src={salesAgents[0].avatar || "/placeholder.svg"}
                      alt={salesAgents[0].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-accent"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-2">{salesAgents[0].name}</h3>
                    <p className="text-accent font-medium mb-1">Top Sales Agent</p>
                    <p className="text-sm text-muted-foreground mb-3">{salesAgents[0].team}</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-accent">{salesAgents[0].deals} deals</p>
                      <p className="text-lg text-foreground">{formatCurrency(salesAgents[0].totalAmount)}</p>
                    </div>
                  </div>
                </div>
              )}

              {closingAgents[0] && (
                <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 pulse-glow">
                  <div className="p-6 text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <img
                      src={closingAgents[0].avatar || "/placeholder.svg"}
                      alt={closingAgents[0].name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-2">{closingAgents[0].name}</h3>
                    <p className="text-primary font-medium mb-1">Top Closing Agent</p>
                    <p className="text-sm text-muted-foreground mb-3">{closingAgents[0].team}</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">{closingAgents[0].deals} deals</p>
                      <p className="text-lg text-foreground">{formatCurrency(closingAgents[0].totalAmount)}</p>
                    </div>
                  </div>
                </div>
              )}

              {teams[0] && (
                <div className="rounded-xl shadow bg-white dark:bg-slate-800 border p-4 mb-4 bg-gradient-to-br from-chart-3/20 to-chart-3/5 border-chart-3/20 pulse-glow">
                  <div className="p-6 text-center">
                    <Users className="h-12 w-12 text-chart-3 mx-auto mb-4" />
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-chart-3 bg-chart-3/20 flex items-center justify-center">
                      <Users className="h-10 w-10 text-chart-3" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{teams[0].name}</h3>
                    <p className="text-chart-3 font-medium mb-1">Leading Team</p>
                    <p className="text-sm text-muted-foreground mb-3">{teams[0].agents} active agents</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-chart-3">{teams[0].deals} deals</p>
                      <p className="text-lg text-foreground">{formatCurrency(teams[0].totalAmount)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
