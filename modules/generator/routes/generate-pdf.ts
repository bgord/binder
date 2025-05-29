import hono from "hono";

export async function GeneratePDF(c: hono.Context, _next: hono.Next) {
  const body = await c.req.json();

  return new Response();
}
