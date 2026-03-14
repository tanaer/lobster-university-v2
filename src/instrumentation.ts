export async function register() {
  // 仅在 Node.js 运行时启动事件消费者（不在 Edge 运行时）
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startEventConsumer } = await import(
      "@/lib/services/event-service"
    );
    startEventConsumer();
  }
}
