"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, Users } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"student" | "parent">("student");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "登录失败，请检查邮箱和密码");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("登录失败，请检查邮箱和密码");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setIsLoading(true);
    setError("");
    try {
      await signIn.social({
        provider,
        callbackURL: "/parent/bind",
      });
    } catch {
      setError(`${provider} 登录失败，请重试`);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-4xl">🦞</span>
              <span className="font-bold text-xl">龙虾大学</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>
            登录你的账户，继续学习之旅
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 角色切换 */}
          <div className="flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "student"
                  ? "bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              🦞 学员登录
            </button>
            <button
              type="button"
              onClick={() => setMode("parent")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "parent"
                  ? "bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <Users className="h-4 w-4" />
              家长登录
            </button>
          </div>

          {mode === "student" ? (
            <>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密码</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      忘记密码？
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="输入密码"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登录中..." : "登录"}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-neutral-600">还没有账户？</span>{" "}
                <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  立即注册
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                使用社交账号登录，查看孩子的学习进度
              </p>

              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google 登录
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub 登录
              </Button>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              )}

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500">
                    微信登录即将上线
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 text-center">
                首次登录后需要输入邀请码绑定学员
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
