// Used only when Cloudflare runs this site as a Worker.
// It serves the website files as they are and answers /api/pins (latest Pinterest pins).
import { onRequestGet } from "./functions/api/pins.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/pins") {
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
      return onRequestGet({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
