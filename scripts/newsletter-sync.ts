import { loadEnvConfig } from "@next/env";
import { getMongoClient, getSubscribers } from "../src/lib/newsletter/mongodb";
import { getResendConfig, syncResendContact } from "../src/lib/newsletter/resend";

async function main() {
  loadEnvConfig(process.cwd());
  const config = getResendConfig();
  if (!config) throw new Error("missing_resend_configuration");
  try {
    const collection = await getSubscribers();
    const subscribers = await collection.find({ status: "active", resend_sync_status: { $in: ["pending", "failed"] } }).limit(100).toArray();
    let failed = 0;
    for (const subscriber of subscribers) {
      await syncResendContact(collection, subscriber._id, config);
      const current = await collection.findOne({ _id: subscriber._id });
      if (current?.resend_sync_status === "failed" || current?.resend_sync_status === "pending") failed++;
      // Two API calls per subscriber; pace this manual batch for provider limits.
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
    console.log(JSON.stringify({ attempted: subscribers.length, failed }));
    if (failed) process.exitCode = 1;
  } finally { await (await getMongoClient()).close(); }
}

main().catch(() => { console.error("newsletter_sync_command_failed"); process.exitCode = 1; });
