import { shortLinkDestination } from "@/lib/short-links";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const destination = shortLinkDestination(slug);
  if (!destination) return new Response("Not found", { status: 404 });

  return new Response(null, {
    status: 307,
    headers: { Location: destination, "Cache-Control": "no-store" },
  });
}
