"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, CheckCircle2, Loader2, AlertCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentInfo {
  id: string;
  name: string;
  level: string;
  careerTrack?: string;
  avatar?: string;
}

export default function ParentBindPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [bound, setBound] = useState(false);

  // 格式化输入：自动加 LX- 前缀
  function handleCodeChange(value: string) {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    setCode(cleaned);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");
    setStudent(null);

    try {
      const res = await fetch("/api/parent/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "邀请码验证失败");
        return;
      }

      setStudent(data.student);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmBind() {
    if (!student) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parent/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), confirm: true }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "绑定失败");
        return;
      }

      setBound(true);
      setTimeout(() => router.push("/parent/dashboard"), 2000);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  }

  if (bound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">绑定成功！</h2>
            <p className="text-neutral-500">正在跳转到家长面板...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <KeyRound className="h-7 w-7 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">绑定学员</CardTitle>
          <CardDescription>
            输入邀请码，绑定您孩子的学习账户
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!student ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">邀请码</Label>
                <Input
                  id="code"
                  placeholder="LX-XXXX"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={7}
                  autoFocus
                />
                <p className="text-xs text-neutral-400 text-center">
                  邀请码格式：LX- 加 4 位字母数字
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    验证中...
                  </>
                ) : (
                  "验证邀请码"
                )}
              </Button>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{student.avatar || "🦞"}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-neutral-500">
                      等级: {student.level}
                      {student.careerTrack && ` · ${student.careerTrack}`}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-500 text-center">
                确认绑定此学员？绑定后您可以查看其学习进度和成绩。
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStudent(null);
                    setCode("");
                  }}
                >
                  取消
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmBind}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-2" />
                  )}
                  确认绑定
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
