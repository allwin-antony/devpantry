export { SignalingRoom } from './SignalingRoom';
import { handleOgFetch } from '../og-fetch';

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // We expect WebSocket connections at /api/collab/:roomId
    const match = url.pathname.match(/^\/api\/collab\/([^/]+)$/);
    if (match) {
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
    
    return new Response('Not found', { status: 404 });
  }
};
