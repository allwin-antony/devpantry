export { SignalingRoom } from './SignalingRoom';

interface Env {
  SIGNALING_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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
    
    return new Response('Not found', { status: 404 });
  }
};
