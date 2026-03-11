"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function VerifyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(`/api/certification/verify/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => { setData({ valid: false, error: "验证失败" }); setLoading(false); }); }, [id]);

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center"><div className="text-center"><div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" /><div className="text-slate-400">验证中...</div></div></div>;

  if (!data?.valid) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center py-12 px-4"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Card className="bg-slate-800/50 border-red-500/30 max-w-md w-full"><CardContent className="py-12 text-center"><div className="text-6xl mb-4">❌</div><h1 className="text-2xl font-bold text-white mb-2">证书无效</h1><p className="text-slate-400 mb-6">{data?.error || (data?.expired ? "已过期" : "无法验证")}</p><div className="bg-slate-700/50 rounded-lg p-4 mb-6"><div className="text-slate-500 text-sm">证书编号</div><div className="text-white font-mono text-sm break-all">{id}</div></div><Link href="/"><Button className="bg-cyan-500 hover:bg-cyan-600 text-white">返回首页</Button></Link></CardContent></Card></motion.div></div>;

  const { certificate, profile, track } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8"><div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✓</span></div><h1 className="text-2xl font-bold text-green-400 mb-2">证书验证通过</h1><p className="text-slate-400">此证书真实有效</p></div>
          <Card className="bg-slate-800/50 border-slate-700 mb-8"><CardContent className="pt-6"><div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg"><div className="text-4xl">🦞</div><div><div className="text-slate-500 text-sm">持证人</div><div className="text-xl font-bold text-white">{profile?.name || "学员"}</div><div className="text-slate-400 text-sm">学籍号: {profile?.studentId || "-"}</div></div></div>
            <div className="text-center p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/20"><div className="text-4xl mb-3">{certificate?.icon}</div><div className="text-yellow-400 font-bold text-2xl mb-1">Lv.{certificate?.level} {certificate?.levelName}</div><div className="text-slate-400">{track?.icon} {track?.name} · 能力认证</div></div>
            <div className="grid grid-cols-2 gap-4"><div className="p-4 bg-slate-700/30 rounded-lg"><div className="text-slate-500 text-sm mb-1">证书编号</div><div className="text-white font-mono text-sm break-all">{certificate?.id}</div></div><div className="p-4 bg-slate-700/30 rounded-lg"><div className="text-slate-500 text-sm mb-1">颁发日期</div><div className="text-white">{certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString("zh-CN") : "-"}</div></div>{certificate?.expiresAt && <div className="col-span-2 p-4 bg-slate-700/30 rounded-lg"><div className="text-slate-500 text-sm mb-1">有效期至</div><div className="text-white">{new Date(certificate.expiresAt).toLocaleDateString("zh-CN")}</div></div>}</div>
          </div></CardContent></Card>
          <div className="text-center"><Link href="/certification"><Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">前往认证中心</Button></Link></div>
          <div className="mt-8 text-center text-slate-500 text-sm"><p className="flex items-center justify-center gap-2"><span className="text-green-400">🔒</span>此证书由龙虾大学颁发</p></div>
        </motion.div>
      </div>
    </div>
  );
}
