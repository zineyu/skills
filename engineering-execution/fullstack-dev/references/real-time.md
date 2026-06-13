# Real-Time Patterns

SSE, WebSocket, and polling for live data.

## Option A: Server-Sent Events (One-Way Server → Client)

Best for: notifications, live feeds, streaming AI responses.

**Backend (Express):**
```typescript
app.get('/api/events', authenticate, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  const unsubscribe = eventBus.subscribe(req.user.id, (event) => {
    send(event.type, event.payload);
  });
  req.on('close', () => unsubscribe());
});
```

**Frontend:**
```typescript
function useServerEvents(userId: string) {
  useEffect(() => {
    const source = new EventSource(`/api/events?userId=${userId}`);
    source.addEventListener('notification', (e) => { showToast(JSON.parse(e.data).message); });
    source.onerror = () => { source.close(); setTimeout(() => /* reconnect */, 3000); };
    return () => source.close();
  }, [userId]);
}
```

## Option B: WebSocket (Bidirectional)

Best for: chat, collaborative editing, gaming.

**Backend (ws library):**
```typescript
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
wss.on('connection', (ws, req) => {
  const userId = authenticateWs(req);
  if (!userId) { ws.close(4001, 'Unauthorized'); return; }
  ws.on('message', (raw) => handleMessage(userId, JSON.parse(raw.toString())));
  ws.on('close', () => cleanupUser(userId));
  const interval = setInterval(() => ws.ping(), 30000);
  ws.on('close', () => clearInterval(interval));
});
```

**Frontend:**
```typescript
function useWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onopen = () => setWs(socket);
    socket.onclose = () => setTimeout(() => /* reconnect */, 3000);
    return () => socket.close();
  }, [url]);
  const send = useCallback((data: unknown) => ws?.send(JSON.stringify(data)), [ws]);
  return { ws, send };
}
```

## Option C: Polling (Simplest)

```typescript
function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ['order-status', orderId],
    queryFn: () => apiClient.get<Order>(`/api/orders/${orderId}`),
    refetchInterval: (query) => {
      if (query.state.data?.status === 'completed') return false;
      return 5000;
    },
  });
}
```

## Decision

| Method | Direction | Complexity | When |
|--------|-----------|------------|------|
| Polling | Client → Server | Low | Simple status checks, < 10 clients |
| SSE | Server → Client | Medium | Notifications, feeds, AI streaming |
| WebSocket | Bidirectional | High | Chat, collaboration, gaming |
