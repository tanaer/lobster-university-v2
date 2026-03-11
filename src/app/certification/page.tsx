"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CERTIFICATION_LEVELS, CERTIFICATION_REQUIREMENTS } from "@/lib/services/certification-service";

interface CertificationStatus { currentLevel: number; certifications: any[]; eligibility: { eligible: boolean; requirements: any[] }; nextLevel: number; }

export default function CertificationPage() {
  const [status, setStatus] = useState<CertificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => { fetch("/api/certification").then(r => r.ok && r.json()).then(d => { setStatus(d?.status); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const handleApply = async () => {
    if (!status?.eligibility.eligible) return;
    setApplying(true);
    try {
      const profileRes = await fetch("/api/enrollment");
      const profileData = await profileRes.json();
      const trackId = profileData.profile?.careerTrackId;
      if (!trackId) { alert("请先选择职业方向"); return; }
      const res = await fetch("/api/certification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackId, level: status.nextLevel }) });
      if (res.ok) { alert("申请已提交！"); fetch("/api/certification").then(r => r.json()).then(d => setStatus(d.status)); }
      else alert((await res.json()).error || "申请失败");
    } catch { alert("申请失败"); } finally { setApplying(false); }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center text-slate-400">加载中...</div>;

  const currentInfo = status ? CERTIFICATION_LEVELS[status.currentLevel as keyof typeof CERTIFICATION_LEVELS] : null;
  const nextInfo = status ? CERTIFICATION_LEVELS[status.nextLevel as keyof typeof CERTIFICATION_LEVELS] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12"><h1 className="text-3xl font-bold text-white mb-2">🎓 能力认证</h1><p className="text-slate-400">展示你的专业能力</p></div>
        <Card className="bg-slate-800/50 border-slate-700 mb-8"><CardContent className="pt-6"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="text-5xl">{currentInfo?.icon}</div><div><div className="text-slate-400 text-sm">当前等级</div><div className="text-2xl font-bold text-white">Lv.{status?.currentLevel} {currentInfo?.name}</div></div></div><Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-lg">{currentInfo?.icon} {currentInfo?.name}</Badge></div></CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700 mb-8"><CardHeader><CardTitle className="text-white">认证等级</CardTitle></CardHeader><CardContent><div className="space-y-3">{Object.entries(CERTIFICATION_LEVELS).map(([l, i]) => { const n = parseInt(l); const isCurrent = status?.currentLevel === n; const isAchieved = (status?.currentLevel || 1) >= n; return <div key={l} className={`flex items-center justify-between p-4 rounded-lg border ${isCurrent ? "bg-cyan-500/20 border-cyan-500/30" : isAchieved ? "bg-green-500/10 border-green-500/20" : "bg-slate-700/30 border-slate-600"}`}><div className="flex items-center gap-3"><div className="text-2xl">{i.icon}</div><div><div className={`font-medium ${isAchieved ? "text-white" : "text-slate-400"}`}>Lv.{l} {i.name}</div><div className="text-xs text-slate-500">{CERTIFICATION_REQUIREMENTS[n as keyof typeof CERTIFICATION_REQUIREMENTS]?.requirements.map(r => r.label).join(" · ")}</div></div></div>{isCurrent && <Badge className="bg-cyan-500 text-white">当前</Badge>}{isAchieved && !isCurrent && <Badge className="bg-green-500/20 text-green-400">✓ 已获得</Badge>}</div>})}</div></CardContent></Card>
        {status && status.nextLevel <= 5 && <Card className="bg-slate-800/50 border-slate-700 mb-8"><CardHeader><CardTitle className="text-white">{nextInfo?.icon} 升级到 Lv.{status.nextLevel} {nextInfo?.name}</CardTitle></CardHeader><CardContent><div className="space-y-4">{status.eligibility.requirements.map(r => <div key={r.key} className={`flex items-center justify-between p-3 rounded-lg ${r.met ? "bg-green-500/10 border border-green-500/20" : "bg-slate-700/30 border border-slate-600"}`}><div className="flex items-center gap-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${r.met ? "bg-green-500" : "bg-slate-600"}`}>{r.met ? "✓" : ""}</div><span className={r.met ? "text-green-400" : "text-slate-300"}>{r.label}</span></div><div className="text-sm text-slate-400">{r.current} / {r.min}</div></div>)}</div>{status.eligibility.eligible ? <Button onClick={handleApply} disabled={applying} className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600">{applying ? "申请中..." : "申请认证"}</Button> : <div className="mt-6 text-center text-slate-400 text-sm">完成条件后申请</div>}</CardContent></Card>}
        {status && status.certifications.length > 0 && <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white">📜 我的认证</CardTitle></CardHeader><CardContent><div className="space-y-3">{status.certifications.map(c => { const i = CERTIFICATION_LEVELS[c.level as keyof typeof CERTIFICATION_LEVELS]; const approved = c.status === "approved"; return <div key={c.id} className={`flex items-center justify-between p-4 rounded-lg border ${approved ? "bg-green-500/10 border-green-500/20" : c.status === "pending" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20"}`}><div className="flex items-center gap-3"><div className="text-2xl">{i?.icon}</div><div><div className="font-medium text-white">Lv.{c.level} {i?.name}</div><div className="text-xs text-slate-500">{new Date(c.appliedAt).toLocaleDateString("zh-CN")}</div></div></div><div className="flex items-center gap-3"><Badge className={approved ? "bg-green-500/20 text-green-400" : c.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}>{approved ? "已通过" : c.status === "pending" ? "审核中" : "已拒绝"}</Badge>{c.certificateId && <Link href={`/certification/certificate/${c.certificateId}`}><Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">查看</Button></Link>}</div></div>})}</div></CardContent></Card>}
      </div>
    </div>
  );
}
