import { Award, Lock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const achievements = [
  {
    id: "first-course",
    name: "初学者",
    description: "完成第一门课程",
    icon: "🎓",
    exp: 100,
    unlocked: true,
  },
  {
    id: "five-courses",
    name: "学习达人",
    description: "完成 5 门课程",
    icon: "📚",
    exp: 500,
    unlocked: true,
  },
  {
    id: "ten-courses",
    name: "学霸",
    description: "完成 10 门课程",
    icon: "🏆",
    exp: 1000,
    unlocked: false,
  },
  {
    id: "streak-7",
    name: "坚持不懈",
    description: "连续学习 7 天",
    icon: "🔥",
    exp: 200,
    unlocked: true,
  },
  {
    id: "streak-30",
    name: "持之以恒",
    description: "连续学习 30 天",
    icon: "💎",
    exp: 800,
    unlocked: false,
  },
  {
    id: "study-10h",
    name: "废寝忘食",
    description: "累计学习 10 小时",
    icon: "⏰",
    exp: 300,
    unlocked: true,
  },
  {
    id: "study-100h",
    name: "学富五车",
    description: "累计学习 100 小时",
    icon: "📖",
    exp: 2000,
    unlocked: false,
  },
  {
    id: "review-10",
    name: "评论家",
    description: "发布 10 条课程评价",
    icon: "✍️",
    exp: 150,
    unlocked: false,
  },
  {
    id: "perfect-score",
    name: "满分选手",
    description: "课程评价满分",
    icon: "⭐",
    exp: 100,
    unlocked: true,
  },
  {
    id: "early-bird",
    name: "早起的鸟儿",
    description: "每天 8 点前学习",
    icon: "🐦",
    exp: 200,
    unlocked: false,
  },
];

export default function AchievementsPage() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            🏅 成就徽章
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            已解锁 {unlockedCount}/{achievements.length} 个成就
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={achievement.unlocked ? "" : "opacity-60"}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {achievement.unlocked ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-neutral-400" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mb-2">
                      {achievement.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      +{achievement.exp} XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
