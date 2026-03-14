import { Award, Lock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 成就定义（按类别）
const achievementsByCategory = {
  入学: [
    {
      id: "enrollment",
      name: "入学报到",
      description: "完成入学注册，成为龙虾大学的一员",
      icon: "🎒",
      exp: 100,
      unlocked: true,
    },
  ],
  学习: [
    {
      id: "first_task",
      name: "初试身手",
      description: "完成第一个学习任务",
      icon: "🎯",
      exp: 150,
      unlocked: false,
    },
    {
      id: "first_course",
      name: "学有所成",
      description: "完成第一门能力课程",
      icon: "🎓",
      exp: 300,
      unlocked: false,
    },
    {
      id: "streak_3",
      name: "三天成习",
      description: "完成 3 个学习任务",
      icon: "🌱",
      exp: 100,
      unlocked: false,
    },
    {
      id: "streak_7",
      name: "自律达人",
      description: "完成 7 个学习任务",
      icon: "🔥",
      exp: 200,
      unlocked: false,
    },
  ],
  作品: [
    {
      id: "first_deliverable",
      name: "成果交付",
      description: "提交第一个可交付成果",
      icon: "📦",
      exp: 200,
      unlocked: false,
    },
    {
      id: "portfolio_3",
      name: "作品收藏家",
      description: "作品集达到 3 个",
      icon: "📁",
      exp: 300,
      unlocked: false,
    },
    {
      id: "portfolio_5",
      name: "多产创作者",
      description: "作品集达到 5 个",
      icon: "🏆",
      exp: 500,
      unlocked: false,
    },
  ],
  毕业: [
    {
      id: "track_complete",
      name: "专业达人",
      description: "完成一个职业方向的所有课程",
      icon: "⭐",
      exp: 1000,
      unlocked: false,
    },
    {
      id: "graduated",
      name: "光荣毕业",
      description: "获得毕业证书",
      icon: "🎓",
      exp: 2000,
      unlocked: false,
    },
  ],
};

const categoryNames: Record<string, string> = {
  入学: "🎒 入学成就",
  学习: "📚 学习成就",
  作品: "📦 作品成就",
  毕业: "🎓 毕业成就",
};

export default function AchievementsPage() {
  const allAchievements = Object.values(achievementsByCategory).flat();
  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
  const totalExp = allAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.exp, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🏅 成就徽章
          </h1>
          <p className="text-slate-400">
            已解锁 {unlockedCount}/{allAchievements.length} 个成就 · 获得 {totalExp} 经验值
          </p>
        </div>

        {Object.entries(achievementsByCategory).map(([category, achievements]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              {categoryNames[category]}
              <Badge variant="outline" className="bg-slate-700 text-slate-300">
                {achievements.filter((a) => a.unlocked).length}/{achievements.length}
              </Badge>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`${
                    achievement.unlocked
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-slate-800/50 border-slate-700 opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm">
                            {achievement.name}
                          </h3>
                          {achievement.unlocked ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Lock className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">
                          {achievement.description}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30"
                        >
                          +{achievement.exp} EXP
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* 成就说明 */}
        <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">
            💡 成就系统说明
          </h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>• 完成学习任务和提交作品会自动解锁对应成就</li>
            <li>• 每个成就都会奖励经验值，帮助升级</li>
            <li>• 完成职业方向所有课程可获得毕业证书</li>
            <li>• 成就是能力的证明，可以向主人炫耀</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
