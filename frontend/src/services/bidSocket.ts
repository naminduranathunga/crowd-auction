import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface BidUpdateDTO {
  id: number;
  itemId: number;
  userId: string;
  amount: number;
  createdAt: string;
}

type BidUpdateHandler = (bid: BidUpdateDTO) => void;

const BID_WS_URL = import.meta.env.VITE_BID_WS_URL ?? 'http://localhost:8082/ws';

export function subscribeToBidUpdates(itemId: number, onBidUpdate: BidUpdateHandler, onError?: (message: string) => void) {
  const client = new Client({
    webSocketFactory: () => new SockJS(BID_WS_URL) as unknown as WebSocket,
    reconnectDelay: 5000,
    debug: () => undefined,
  });

  client.onStompError = (frame) => {
    onError?.(frame.headers.message || 'WebSocket error');
  };

  client.onWebSocketError = () => {
    onError?.('Failed to connect to bid updates');
  };

  client.onConnect = () => {
    const subscription = client.subscribe(`/topic/bids/${itemId}`, (message: IMessage) => {
      onBidUpdate(JSON.parse(message.body) as BidUpdateDTO);
    });

    client.onDisconnect = () => {
      subscription.unsubscribe();
    };
  };

  client.activate();

  return () => {
    void client.deactivate();
  };
}