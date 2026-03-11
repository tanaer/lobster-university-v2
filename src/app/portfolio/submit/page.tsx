"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PORTFOLIO_TYPES, PortfolioType } from "@/lib/services/portfolio-service";

export default function SubmitPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState<{id: string; name: string}[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", type: "report" as PortfolioType, capabilityId: "", content: "", fileUrl: "" });

  useEffect(() => { fetch("/api/enrollment").then(r => r.json()).then(d => { if (d.profile?.careerTrackId) fetch(`/api/career-tracks/${d.profile.careerTrackId}`).then(r => r.json()).then(t => { try { setCapabilities(JSON.parse(t.track?.capabilities || "[]")); } catch(e) {} }); }).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type) { alert("请填写标题和选择类型"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, status: "submitted" }) });
      if (res.ok) router.push(`/portfolio/${(await res.json()).portfolio.id}`);
      else alert((await res.json()).error || "提交失败");
    } catch { alert("提交失败"); } finally { setLoading(false); }
  };

  const handleSaveDraft = async () => {
    if (!formData.title) { alert("请至少填写标题"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, status: "draft" }) });
      if (res.ok) router.push("/portfolio");
      else alert((await res.json()).error || "保存失败");
    } catch { alert("保存失败"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8"><Link href="/portfolio" className="text-cyan-400 hover:text-cyan-300">← 返回作品列表</Link><h1 className="text-3xl font-bold text-white mt-4">📝 提交作品</h1></div>
        <Card className="bg-slate-800/50 border-slate-700"><CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2"><Label className="text-white">作品标题 *</Label><Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="给作品起个名字" className="bg-slate-700 border-slate-600 text-white" required /></div>
            <div className="space-y-2"><Label className="text-white">作品类型 *</Label><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Object.entries(PORTFOLIO_TYPES).map(([k, v]) => <button key={k} type="button" onClick={() => setFormData({...formData, type: k as PortfolioType})} className={`p-3 rounded-lg border ${formData.type === k ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-slate-700/50 border-slate-600 text-slate-300"}`}><div className="text-2xl mb-1">{v.icon}</div><div className="text-sm">{v.label}</div></button>)}</div></div>
            {capabilities.length > 0 && <div className="space-y-2"><Label className="text-white">关联能力</Label><select value={formData.capabilityId} onChange={e => setFormData({...formData, capabilityId: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"><option value="">选择关联的能力</option>{capabilities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
            <div className="space-y-2"><Label className="text-white">作品描述</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="简要描述..." className="bg-slate-700 border-slate-600 text-white min-h-[100px]" /></div>
            <div className="space-y-2"><Label className="text-white">作品内容</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="内容或心得..." className="bg-slate-700 border-slate-600 text-white min-h-[150px]" /></div>
            <div className="space-y-2"><Label className="text-white">附件链接</Label><Input type="url" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://..." className="bg-slate-700 border-slate-600 text-white" /></div>
            <div className="flex gap-4 pt-4"><Button type="submit" disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">{loading ? "提交中..." : "提交作品"}</Button><Button type="button" variant="outline" onClick={handleSaveDraft} disabled={loading} className="border-slate-600 text-slate-300 hover:bg-slate-700">保存草稿</Button></div>
          </form>
        </CardContent></Card>
      </div>
    </div>
  );
}
