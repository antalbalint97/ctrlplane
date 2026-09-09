# CtrlPlane deployment on Vercel

Vercel runs both the Next.js website and its Node.js `POST /api/subscribe` function. The function connects directly to MongoDB Atlas and Resend. No Railway backend, local Mongo service, always-running server, or extra API deployment is required.

In **Vercel → CtrlPlane project → Settings → Environment Variables**, select **Production** and add:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Copy the tested Atlas URI from local `.env.local` privately |
| `MONGODB_DB_NAME` | `ctrlplane` |
| `RESEND_API_KEY` | Copy the tested Resend key privately |
| `RESEND_SEGMENT_ID` | Copy the tested CtrlPlane Newsletter Segment ID |

Keep existing public analytics configuration. MongoDB/Resend secrets must not use `NEXT_PUBLIC_` prefixes. The code reads `MONGODB_URI` exactly; `MONGO_URI` and `MONGO_URL` are not its configuration keys. Public controller details are maintained directly in the privacy page; no `PRIVACY_*` environment variables are needed.

The local `.env.local` is ignored by Git. Pushing code does not copy these values to Vercel. After saving the settings, go to **Deployments → latest Production deployment → Redeploy**. Environment changes apply to a new deployment. See [Vercel environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables) and [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

For Preview, use a separate test database and test Segment if signup testing is needed. Do not expose real subscriber credentials to untrusted preview builds. Atlas Network Access must permit Vercel's actual outgoing connections; existing local/Railway access does not prove Vercel access. Verify this with the deployed signup before changing access rules.

After deployment, test production signup with an operator-owned mailbox, inspect MongoDB directly, verify Segment membership and duplicate behavior. Keep editorial approval and manual delivery unchanged.

## Privacy completion

The notice now includes the operator-confirmed controller (Antal Bálint egyéni vállalkozó), address and `info@meniva.net` contact, effective 2026-09-10. It covers newsletter consent, unsubscribe requests, browser storage, analytics identifiers, Vercel/MongoDB/Resend/Google processing, international transfers, data rights and NAIH complaints. Retention is described using the current application's criteria: active subscriptions until withdrawal/service closure, unsubscribe records to maintain suppression, and provider-configured log/analytics retention. No unverified numeric retention periods or EU-only storage claims were invented. Keep these statements aligned with actual provider settings.

Handle mailbox unsubscribe requests by marking both Mongo (`status=unsubscribed`, `unsubscribed_at`) and Resend suppressed before the next issue; handle deletion requests in both systems. There is no automated retention or unsubscribe reconciliation job. Replies to data-rights requests are generally due within one month. Provider DPA/transfer terms and the current NAIH contact were checked against the primary sources linked from the notice. This content update does not verify compliance of every account setting or automate legal request handling.
