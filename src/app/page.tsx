import { Hero } from "@/components/home/hero";
import { Motto } from "@/components/home/motto";
import { CoreAdvantages } from "@/components/home/core-advantages";
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

// 学院组织架构 — 8 部
const orgCommittee = { name: "校务委员会", icon: "", desc: "教学标准制定、课程体系规划、政策发布", slogan: "方向对了，路就不会远" };

const orgDepartments = [
  { name: "教学质量监控中心", icon: "🔍", desc: "课程审核、毕业审核、质量封驳", slogan: "每一条反馈都是进化的燃料" },
  { name: "教务处", icon: "📚", desc: "教务协调、选课管理、资源分配", slogan: "紧跟行业需求，严选课程内容，确保每一门课都经得起市场检验" },
  { name: "招生办公室", icon: "🎓", desc: "入学审核、学籍管理、等级晋升", slogan: "不挑最聪明的，只选最想学的" },
  { name: "学生工作处", icon: "👥", desc: "学员管理、学习预警、奖惩管理", slogan: "没有差学员，只有没跟上的节奏" },
  { name: "考试中心", icon: "📝", desc: "能力考核、成绩评定、认证考试", slogan: "考的不是记忆力，是真本事" },
  { name: "纪检监察室", icon: "⚖️", desc: "违纪处理、学员申诉", slogan: "规矩不是束缚，是底线" },
  { name: "实践教学中心", icon: "🔧", desc: "实践任务、作品集、就业推荐", slogan: "不怕出错，怕的是没练过出错" },
];

export default function Home() {
  const topRow = orgDepartments.slice(0, 4);
  const bottomRow = orgDepartments.slice(4);

  return (
    <>
      <Hero />

      {/* 校训 */}
      <Motto />

      {/* 核心优势 */}
      <CoreAdvantages />

      {/* 学院组织架构 */}
      <section className="relative py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/20 to-amber-200/20 dark:from-orange-900/10 dark:to-amber-900/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              学院组织架构
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300">
              各司其职，高效协同
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* 顶层：校务委员会 — 大卡片 */}
            <div className="group">
              <div className="relative px-10 py-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{orgCommittee.name}</div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">{orgCommittee.desc}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 italic">&ldquo;{orgCommittee.slogan}&rdquo;</p>
                </div>
              </div>
            </div>

            {/* 主连接线 */}
            <div className="w-px h-10 bg-gradient-to-b from-orange-400 to-orange-300 dark:from-orange-500 dark:to-orange-700" />

            {/* 横向分支线 — 桌面端 */}
            <div className="hidden md:block relative w-full max-w-5xl">
              <div className="h-px bg-orange-300 dark:bg-orange-700 mx-[12.5%]" />
            </div>

            {/* 第一行：4 个部门 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mt-0 w-full max-w-5xl">
              {topRow.map((dept) => (
                <div key={dept.name} className="flex flex-col items-center">
                  <div className="hidden md:block w-px h-5 bg-orange-300 dark:bg-orange-700" />
                  <div className="w-full group">
                    <div className="w-full p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-orange-500/10 group-hover:border-orange-300 dark:group-hover:border-orange-600">
                      <div className="text-3xl mb-2">{dept.icon}</div>
                      <div className="font-bold text-base text-neutral-900 dark:text-white mb-1">
                        {dept.name}
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2">
                        {dept.desc}
                      </p>
                      <p className="text-[11px] text-orange-600 dark:text-orange-400 italic leading-relaxed">
                        &ldquo;{dept.slogan}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 第二行连接线 — 桌面端 */}
            <div className="hidden md:block relative w-full max-w-5xl mt-4">
              <div className="h-px bg-orange-300 dark:bg-orange-700 mx-[20%]" />
            </div>

            {/* 第二行：3 个部门 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-0 w-full max-w-4xl">
              {bottomRow.map((dept) => (
                <div key={dept.name} className="flex flex-col items-center">
                  <div className="hidden md:block w-px h-5 bg-orange-300 dark:bg-orange-700" />
                  <div className="w-full group">
                    <div className="w-full p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-center transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-orange-500/10 group-hover:border-orange-300 dark:group-hover:border-orange-600">
                      <div className="text-3xl mb-2">{dept.icon}</div>
                      <div className="font-bold text-base text-neutral-900 dark:text-white mb-1">
                        {dept.name}
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2">
                        {dept.desc}
                      </p>
                      <p className="text-[11px] text-orange-600 dark:text-orange-400 italic leading-relaxed">
                        &ldquo;{dept.slogan}&rdquo;
                      </p>
                    </div>
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
              课程体系
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
