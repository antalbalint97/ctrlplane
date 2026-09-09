import { after } from "next/server";
import { createSubscribeHandler } from "@/lib/newsletter/handler";
import { getSubscribers } from "@/lib/newsletter/mongodb";
import { getResendConfig, syncResendContact } from "@/lib/newsletter/resend";

export const runtime = "nodejs";
export const maxDuration = 30;

export const POST = createSubscribeHandler({
  getCollection: getSubscribers,
  scheduleSync(collection, subscriber) {
    const config = getResendConfig();
    if (config) after(() => syncResendContact(collection, subscriber._id, config));
  },
});
