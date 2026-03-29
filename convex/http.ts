import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return Response.json({
      ok: true,
      service: "mediflow-convex",
      mode: "placeholder-friendly",
      message: "Convex HTTP actions are configured locally.",
    });
  }),
});

http.route({
  path: "/meal-analysis",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.length > 0 ? body.title : "Balanced meal";
    return Response.json({
      title,
      estimatedCalories: 540,
      detectedItems: ["Chicken", "Avocado", "Leafy greens", "Olive oil"],
      analyzer: "mock-ai-v1",
      confidence: 0.88,
      todo: "Replace this mock analyzer with a real multimodal AI integration.",
    });
  }),
});

http.route({
  path: "/message-preview",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    const body = await request.json().catch(() => ({}));
    const phone = typeof body.phone === "string" ? body.phone : "+84 93 555 0182";
    const message = typeof body.message === "string" ? body.message : "Reminder ready to send.";
    return Response.json({
      phone,
      preview: `Hi ${phone}, ${message}`,
      status: "ready",
      todo: "Wire this preview action to a real delivery provider later.",
    });
  }),
});

export default http;
