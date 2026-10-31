export { SignalingRoom } from './SignalingRoom';
import { handleOgFetch } from '../og-fetch';
import { canonicalRedirect } from '../canonicalRedirect';

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const canonical = canonicalRedirect(request.url);
    if (canonical) return Response.redirect(canonical, 308);
    
    // We expect WebSocket connections at /api/collab/:roomId
    const match = url.pathname.match(/^\/api\/collab\/([^/]+)$/);
    if (match) {
      // Protect WebSocket endpoint from unauthorized domains and scripts
      const origin = request.headers.get("Origin");
      const allowedOrigins = [
        "https://devpantry.com",
        "https://www.devpantry.com",
        "http://localhost:3000",
        "http://localhost:5173"
      ];
      
      if (!origin || !allowedOrigins.includes(origin)) {
        return new Response("Forbidden: Invalid Origin", { status: 403 });
      }

      const roomId = match[1];
      
      // Get the Durable Object instance for this room
      const id = env.SIGNALING_ROOM.idFromName(roomId);
      const room = env.SIGNALING_ROOM.get(id);
      
      // Forward the request to the Durable Object
      return room.fetch(request);
    }

    // Proxy Open Graph requests for Social Preview tool
    if (url.pathname === '/api/og-fetch') {
      return handleOgFetch(request, ctx);
    }
    
    if (url.pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  }
};
