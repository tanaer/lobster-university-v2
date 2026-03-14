import { Hero } from "@/components/home/hero";
import { Motto } from "@/components/home/motto";
import { CoreAdvantages } from "@/components/home/core-advantages";
import { Departments } from "@/components/home/departments";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 课程体系 — 面向岗位的学习路径
const courseSystems = [
  {
    title: "新媒体运营岗",
    icon: "📱",
    desc: "能独立运营品牌新媒体矩阵，覆盖小红书、抖音、微信、B站",
    courses: 5,
    duration: "8周",
  },
  {
    title: "电商运营岗",
    icon: "🛒",
    desc: "能独立运营电商店铺并完成大促策划，覆盖淘宝天猫京东拼多多",
    courses: 4,
    duration: "6周",
  },
  {
    title: "跨境电商岗",
    icon: "🌍",
    desc: "能独立完成品牌出海，覆盖 Amazon、Shopee、TikTok Shop",
    courses: 4,
    duration: "6周",
  },
  {
    title: "AI 开发工程师",
    icon: "🤖",
    desc: "能独立开发和部署 AI Agent 应用，掌握 MCP、RAG、多 Agent 协作",
    courses: 6,
    duration: "8周",
  },
  {
    title: "全栈开发工程师",
    icon: "⚡",
    desc: "能独立完成 Web 应用前后端开发，React + Node.js + 数据库",
    courses: 5,
    duration: "10周",
  },
  {
    title: "UI/UX 设计师",
    icon: "🎨",
    desc: "能独立完成产品界面设计和用户体验优化",
    courses: 5,
    duration: "8周",
  },
  {
    title: "项目管理专员",
    icon: "📋",
    desc: "能独立管理软件项目从立项到交付",
    courses: 4,
    duration: "6周",
  },
  {
    title: "销售精英",
    icon: "💼",
    desc: "能独立完成从获客到成交的全流程销售",
    courses: 5,
    duration: "6周",
  },
];

// 学院组织架构
const orgDepartments = [
  { name: "教务处", icon: "📚", desc: "课程设计、教学质量、课程体系规划" },
  { name: "研究院", icon: "🔬", desc: "行业研究、课程创新、技术前沿跟踪" },
  { name: "质量部", icon: "✅", desc: "课程质量审核、学员反馈处理" },
  { name: "督察部", icon: "🔍", desc: "SOP 执行监督、巡检管理" },
  { name: "招生办", icon: "🎓", desc: "学员入学、职业匹配" },
  { name: "学习部", icon: "📖", desc: "学习辅导、进度跟踪" },
  { name: "认证部", icon: "🏆", desc: "能力考核、证书发放" },
  { name: "IT部门", icon: "💻", desc: "系统开发、数据维护、自动化运维" },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* 校训 */}
      <Motto />

      {/* 核心优势 */}
      <CoreAdvantages />

      {/* 部门体系 */}
      <Departments />

      {/* 学院组织架构 */}
      <section className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              🏛️ 学院组织架构
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              各司其职，高效协同
            </p>
          </div>

          {/* 树形图：自上而下 */}
          <div className="flex flex-col items-center">
            {/* 顶层：校务委员会 */}
            <div className="px-8 py-4 rounded-xl bg-orange-500 text-white font-bold text-lg shadow-lg">
              👑 校务委员会
            </div>

            {/* 连接线 */}
            <div className="w-px h-8 bg-orange-300 dark:bg-orange-600" />

            {/* 中间横线 */}
            <div className="hidden md:block w-[80%] max-w-4xl h-px bg-orange-300 dark:bg-orange-600" />

            {/* 部门网格 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 w-full max-w-5xl">
              {orgDepartments.map((dept) => (
                <div key={dept.name} className="flex flex-col items-center">
                  {/* 连接线 */}
                  <div className="hidden md:block w-px h-4 bg-orange-300 dark:bg-orange-600" />
                  {/* 部门卡片 */}
                  <div className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all">
                    <div className="text-2xl mb-2">{dept.icon}</div>
                    <div className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                      {dept.name}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {dept.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 课程体系 */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              🎯 课程体系
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              面向岗位设计，跟着路径学就能上岗
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {courseSystems.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                  <span>📚 {item.courses} 门课程</span>
                  <span>⏱️ {item.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8">
                🦞 查看全部课程
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
