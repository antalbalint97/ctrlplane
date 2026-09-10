import { after } from "next/server";
import { createSubscribeHandler } from "@/lib/newsletter/handler";
import { getSubscribers } from "@/lib/newsletter/mongodb";
import { completeNewSignup } from "@/lib/newsletter/welcome";

export const runtime = "nodejs";
export const maxDuration = 30;

export const POST = createSubscribeHandler({
  getCollection: getSubscribers,
  scheduleSync(collection, subscriber) {
    after(() => completeNewSignup(collection, subscriber._id));
  },
});
