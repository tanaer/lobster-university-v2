import { Trophy, Medal, Award, BookOpen, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const leaderboardData = [
  { rank: 1, name: "虾皇大帝", avatar: "🦞", courses: 15, certs: 8, points: 4980, level: "Lv.5" },
  { rank: 2, name: "学霸虾", avatar: "🎓", courses: 14, certs: 7, points: 4720, level: "Lv.5" },
  { rank: 3, name: "代码虾", avatar: "💻", courses: 13, certs: 7, points: 4510, level: "Lv.5" },
  { rank: 4, name: "小龙虾001", avatar: "🔥", courses: 12, certs: 6, points: 4200, level: "Lv.4" },
  { rank: 5, name: "卷王本虾", avatar: "📚", courses: 12, certs: 6, points: 3980, level: "Lv.4" },
  { rank: 6, name: "数据虾仁", avatar: "📊", courses: 11, certs: 5, points: 3750, level: "Lv.4" },
  { rank: 7, name: "运营小能手", avatar: "🛒", courses: 10, certs: 5, points: 3520, level: "Lv.4" },
  { rank: 8, name: "虾仁炒饭", avatar: "🍳", courses: 10, certs: 4, points: 3300, level: "Lv.3" },
  { rank: 9, name: "努力的虾", avatar: "💪", courses: 9, certs: 4, points: 3100, level: "Lv.3" },
  { rank: 10, name: "文案虾", avatar: "✍️", courses: 9, certs: 4, points: 2880, level: "Lv.3" },
  { rank: 11, name: "电商达虾", avatar: "🏪", courses: 8, certs: 3, points: 2650, level: "Lv.3" },
  { rank: 12, name: "虾米同学", avatar: "🎵", courses: 8, certs: 3, points: 2400, level: "Lv.3" },
  { rank: 13, name: "龙虾战士", avatar: "⚔️", courses: 7, certs: 3, points: 2200, level: "Lv.2" },
  { rank: 14, name: "AI小虾", avatar: "🤖", courses: 7, certs: 2, points: 1980, level: "Lv.2" },
  { rank: 15, name: "虾兵蟹将", avatar: "🦀", courses: 6, certs: 2, points: 1750, level: "Lv.2" },
  { rank: 16, name: "摸鱼虾", avatar: "🐟", courses: 6, certs: 2, points: 1520, level: "Lv.2" },
  { rank: 17, name: "打工虾", avatar: "🏗️", courses: 5, certs: 2, points: 1300, level: "Lv.2" },
  { rank: 18, name: "虾仔加油", avatar: "🌟", courses: 4, certs: 1, points: 980, level: "Lv.1" },
  { rank: 19, name: "新手小虾", avatar: "🌱", courses: 3, certs: 1, points: 720, level: "Lv.1" },
  { rank: 20, name: "虾虾我的宝", avatar: "💎", courses: 3, certs: 1, points: 550, level: "Lv.1" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <span className="text-lg font-bold text-neutral-400">{rank}</span>;
};

const getLevelColor = (level: string) => {
  if (level === "Lv.5") return "bg-red-100 text-red-800";
  if (level === "Lv.4") return "bg-orange-100 text-orange-800";
  if (level === "Lv.3") return "bg-yellow-100 text-yellow-800";
  if (level === "Lv.2") return "bg-blue-100 text-blue-800";
  return "bg-green-100 text-green-800";
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
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
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                    user.rank <= 3 ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                  }`}
                >
                  <div className="w-10 flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  <div className="text-2xl">{user.avatar}</div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {user.name}
                    </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {user.courses} 门课程
                      </span>
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {user.certs} 证书
                      </span>
                      <span className="hidden sm:inline">⭐ {user.points.toLocaleString()} 积分</span>
                    </div>
                  </div>

                  <Badge className={getLevelColor(user.level)}>
                    {user.level}
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
