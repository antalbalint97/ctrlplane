import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";

async function main() {
  const mongo = await MongoMemoryServer.create();
  await mkdir(".local", { recursive: true });
  await writeFile(".local/newsletter-test-mongo.json", JSON.stringify({ uri: mongo.getUri() }));
  const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100"], {
    stdio: "inherit", windowsHide: true,
    env: { ...process.env, MONGODB_URI: mongo.getUri(), MONGODB_DB_NAME: "ctrlplane", RESEND_API_KEY: "", RESEND_SEGMENT_ID: "", RESEND_FROM_EMAIL: "", NEXT_PUBLIC_ENABLE_ANALYTICS: "false" },
  });
  const stop = async () => { next.kill(); await mongo.stop(); };
  process.on("SIGINT", () => { void stop(); });
  process.on("SIGTERM", () => { void stop(); });
  next.on("exit", async (code) => { await mongo.stop(); process.exit(code ?? 0); });
}
main().catch(() => { console.error("newsletter_test_server_failed"); process.exitCode = 1; });
