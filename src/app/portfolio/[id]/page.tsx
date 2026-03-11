"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PORTFOLIO_TYPES, PortfolioStatus } from "@/lib/services/portfolio-service";

const statusColors: Record<PortfolioStatus, string> = { draft: "bg-gray-500/20 text-gray-400 border-gray-500/30", submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30", verified: "bg-green-500/20 text-green-400 border-green-500/30", rejected: "bg-red-500/20 text-red-400 border-red-500/30" };
const statusLabels: Record<PortfolioStatus, string> = { draft: "草稿", submitted: "待审核", verified: "已验证", rejected: "已退回" };

export default function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(`/api/portfolio/${id}?evidence=true`).then(r => r.ok && r.json()).then(d => { setP(d?.portfolio); setLoading(false); }).catch(() => setLoading(false)); }, [id]);

  const handleDelete = async () => {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    router.push("/portfolio");
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center text-slate-400">加载中...</div>;
  if (!p) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center"><Card className="bg-slate-800/50 border-slate-700"><CardContent className="py-12 text-center"><div className="text-5xl mb-4">📭</div><p className="text-slate-400 mb-4">作品不存在</p><Link href="/portfolio"><Button className="bg-cyan-500">返回</Button></Link></CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8"><Link href="/portfolio" className="text-cyan-400">← 返回</Link><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4"><div className="flex items-start justify-between"><div className="flex items-center gap-4"><div className="text-5xl">{PORTFOLIO_TYPES[p.type as keyof typeof PORTFOLIO_TYPES]?.icon}</div><div><h1 className="text-3xl font-bold text-white">{p.title}</h1><div className="flex items-center gap-3 mt-2"><Badge className={statusColors[p.status as PortfolioStatus]}>{statusLabels[p.status as PortfolioStatus]}</Badge><span className="text-slate-500">{PORTFOLIO_TYPES[p.type as keyof typeof PORTFOLIO_TYPES]?.label}</span></div></div></div>{p.status === "draft" && <Button variant="outline" onClick={handleDelete} className="border-red-500/50 text-red-400 hover:bg-red-500/20">删除</Button>}</div></motion.div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {p.description && <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">📝 描述</CardTitle></CardHeader><CardContent><p className="text-slate-300 whitespace-pre-wrap">{p.description}</p></CardContent></Card>}
            {p.content && <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">📄 内容</CardTitle></CardHeader><CardContent><div className="text-slate-300 whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg">{p.content}</div></CardContent></Card>}
            {p.fileUrl && <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">🔗 附件</CardTitle></CardHeader><CardContent><a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 break-all">{p.fileUrl}</a></CardContent></Card>}
            {p.reviewerNotes && <Card className="bg-slate-800/50 border-yellow-500/30"><CardHeader><CardTitle className="text-yellow-400 text-lg">💬 审核备注</CardTitle></CardHeader><CardContent><p className="text-slate-300">{p.reviewerNotes}</p></CardContent></Card>}
          </div>
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">ℹ️ 信息</CardTitle></CardHeader><CardContent className="space-y-4"><div><div className="text-slate-500 text-sm">创建时间</div><div className="text-slate-300">{new Date(p.createdAt).toLocaleString("zh-CN")}</div></div><div><div className="text-slate-500 text-sm">更新时间</div><div className="text-slate-300">{new Date(p.updatedAt).toLocaleString("zh-CN")}</div></div>{p.reviewedAt && <div><div className="text-slate-500 text-sm">审核时间</div><div className="text-slate-300">{new Date(p.reviewedAt).toLocaleString("zh-CN")}</div></div>}</CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
