"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CERTIFICATION_LEVELS } from "@/lib/services/certification-service";

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(`/api/certification/verify/${id}`).then(r => r.ok && r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, [id]);

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center text-slate-400">加载中...</div>;
  if (!data?.valid) return <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center"><Card className="bg-slate-800/50 border-slate-700"><CardContent className="py-12 text-center"><div className="text-5xl mb-4">❌</div><h1 className="text-2xl font-bold text-white mb-2">验证失败</h1><p className="text-slate-400 mb-4">{data?.expired ? "已过期" : "证书不存在"}</p><Link href="/certification"><Button className="bg-cyan-500">返回</Button></Link></CardContent></Card></div>;

  const { certificate, profile, track } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8"><div className="text-6xl mb-4">🎓</div><h1 className="text-3xl font-bold text-white mb-2">龙虾大学</h1><p className="text-slate-400">能力认证证书</p></div>
              <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
                <div className="text-center">
                  <p className="text-slate-400 mb-4">兹证明</p>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">{profile?.name || "学员"}</h2>
                  <p className="text-slate-400 mb-4">学籍号: {profile?.studentId || "-"}</p>
                  <p className="text-slate-300 mb-4">通过{track?.icon} {track?.name}职业方向考核</p>
                  <p className="text-slate-300 mb-6">获得以下能力认证等级</p>
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3">
                    <span className="text-3xl">{certificate?.icon}</span>
                    <div className="text-left"><div className="text-yellow-400 font-bold text-lg">Lv.{certificate?.level} {certificate?.levelName}</div></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center mb-8">
                <div><div className="text-slate-500 text-sm mb-1">证书编号</div><div className="text-white font-mono text-sm">{certificate?.id}</div></div>
                <div><div className="text-slate-500 text-sm mb-1">颁发日期</div><div className="text-white">{new Date(certificate?.issuedAt).toLocaleDateString("zh-CN")}</div></div>
                {certificate?.expiresAt && <div className="col-span-2"><div className="text-slate-500 text-sm mb-1">有效期至</div><div className="text-white">{new Date(certificate?.expiresAt).toLocaleDateString("zh-CN")}</div></div>}
              </div>
              <div className="flex justify-center"><div className="w-24 h-24 rounded-full border-4 border-red-500/50 bg-red-500/10 flex items-center justify-center"><div className="text-center"><div className="text-red-400 text-xs font-bold">龙虾大学</div><div className="text-red-400 text-xs">认证专用章</div></div></div></div>
            </CardContent>
            <div className="h-2 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
          </Card>
        </motion.div>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/certification"><Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">返回认证中心</Button></Link>
          <Button onClick={() => window.print()} className="bg-cyan-500 hover:bg-cyan-600 text-white">打印证书</Button>
        </div>
      </div>
    </div>
  );
}
