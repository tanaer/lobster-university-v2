"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PORTFOLIO_TYPES, PortfolioType, PortfolioStatus } from "@/lib/services/portfolio-service";

interface Portfolio { id: string; title: string; description: string | null; type: PortfolioType; status: PortfolioStatus; createdAt: string; }

const statusColors: Record<PortfolioStatus, string> = { draft: "bg-gray-500/20 text-gray-400 border-gray-500/30", submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30", verified: "bg-green-500/20 text-green-400 border-green-500/30", rejected: "bg-red-500/20 text-red-400 border-red-500/30" };
const statusLabels: Record<PortfolioStatus, string> = { draft: "草稿", submitted: "已提交", verified: "已验证", rejected: "已退回" };

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [stats, setStats] = useState({ total: 0, draft: 0, submitted: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPortfolios(); }, []);
  const fetchPortfolios = async () => {
    try {
      const [pRes, sRes] = await Promise.all([fetch("/api/portfolio"), fetch("/api/portfolio?action=stats")]);
      if (pRes.ok) setPortfolios((await pRes.json()).portfolios || []);
      if (sRes.ok) setStats((await sRes.json()).stats);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold text-white mb-2">📦 作品集</h1><p className="text-slate-400">展示你的学习成果</p></div>
          <Link href="/portfolio/submit"><Button className="bg-cyan-500 hover:bg-cyan-600 text-white">+ 提交作品</Button></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[["全部", stats.total, "white"], ["草稿", stats.draft, "gray"], ["待审核", stats.submitted, "blue"], ["已验证", stats.verified, "green"], ["已退回", stats.rejected, "red"]].map(([l, v, c]) => <Card key={l} className="bg-slate-800/50 border-slate-700"><CardContent className="pt-4 text-center"><div className={`text-2xl font-bold text-${c === 'white' ? 'white' : c === 'gray' ? 'gray-400' : c === 'blue' ? 'blue-400' : c === 'green' ? 'green-400' : 'red-400'}`}>{v}</div><div className="text-slate-400 text-sm">{l}</div></CardContent></Card>)}
        </div>
        {loading ? <div className="text-center py-12 text-slate-400">加载中...</div> : portfolios.length === 0 ? <Card className="bg-slate-800/50 border-slate-700"><CardContent className="py-12 text-center"><div className="text-5xl mb-4">📭</div><p className="text-slate-400 mb-4">还没有作品</p><Link href="/portfolio/submit"><Button className="bg-cyan-500 hover:bg-cyan-600 text-white">提交第一个作品</Button></Link></CardContent></Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{portfolios.map((p, i) => <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><Link href={`/portfolio/${p.id}`}><Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 h-full"><CardContent className="pt-6"><div className="flex items-start justify-between mb-3"><div className="text-3xl">{PORTFOLIO_TYPES[p.type]?.icon || "📁"}</div><Badge className={statusColors[p.status]}>{statusLabels[p.status]}</Badge></div><h3 className="font-semibold text-white mb-2 line-clamp-1">{p.title}</h3><p className="text-slate-400 text-sm line-clamp-2 mb-3">{p.description || "暂无描述"}</p><div className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString("zh-CN")}</div></CardContent></Card></Link></motion.div>)}</div>}
      </div>
    </div>
  );
}
