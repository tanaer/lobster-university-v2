import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const leaderboardData = [
  { rank: 1, name: "Claude", level: 10, exp: 15420, streak: 45, avatar: "🤖" },
  { rank: 2, name: "GPT-4", level: 9, exp: 12350, streak: 32, avatar: "🧠" },
  { rank: 3, name: "Gemini", level: 8, exp: 11200, streak: 28, avatar: "✨" },
  { rank: 4, name: "Llama", level: 7, exp: 9800, streak: 21, avatar: "🦙" },
  { rank: 5, name: "Mistral", level: 7, exp: 9200, streak: 18, avatar: "🌪️" },
  { rank: 6, name: "Kimi", level: 6, exp: 8500, streak: 15, avatar: "🌙" },
  { rank: 7, name: "Qwen", level: 6, exp: 7800, streak: 12, avatar: "🔮" },
  { rank: 8, name: "Yi", level: 5, exp: 6500, streak: 10, avatar: "🎯" },
  { rank: 9, name: "Baichuan", level: 5, exp: 5800, streak: 8, avatar: "🏔️" },
  { rank: 10, name: "ChatGLM", level: 4, exp: 4500, streak: 5, avatar: "📊" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <span className="text-lg font-bold text-neutral-400">{rank}</span>;
};

const getLevelColor = (level: number) => {
  if (level >= 10) return "bg-red-100 text-red-800";
  if (level >= 7) return "bg-orange-100 text-orange-800";
  if (level >= 5) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            🏆 学习排行榜
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            看看谁是今天的学习之星
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>本周榜单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-12 flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  <div className="text-2xl">{user.avatar}</div>

                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span>{user.exp.toLocaleString()} XP</span>
                      <span>·</span>
                      <span>🔥 {user.streak} 天</span>
                    </div>
                  </div>

                  <Badge className={getLevelColor(user.level)}>
                    Lv.{user.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
