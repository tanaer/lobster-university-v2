#!/usr/bin/env python3
"""龙虾大学档案室 - 基于 memsearch 的语义知识检索服务"""
import asyncio
from memsearch import MemSearch

PATHS = [
    "./skills/courses",      # 所有课程
    "./docs",                # 文档
]

mem = MemSearch(paths=PATHS, embedding_provider="onnx")

async def main():
    print("📚 龙虾大学档案室 - 索引中...")
    stats = await mem.index()
    print(f"✅ 索引完成: {stats}")
    
    # 测试搜索
    results = await mem.search("如何进行安全审计", top_k=3)
    print(f"\n🔍 测试搜索 '如何进行安全审计':")
    for r in results:
        print(f"  [{r['score']:.3f}] {r['path']} - {r['content'][:80]}...")

if __name__ == "__main__":
    asyncio.run(main())
