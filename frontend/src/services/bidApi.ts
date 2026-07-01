import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

export interface BidResponseDTO {
  id: number;
  itemId: number;
  userId: string;
  amount: number;
  createdAt: string;
}

export async function getBidsByItemId(itemId: number): Promise<BidResponseDTO[]> {
  const resp = await axios.get<BidResponseDTO[]>(`${BASE_URL}/api/v1/items/${itemId}/bids`);
  return resp.data;
}

export async function placeBid(itemId: number, amount: number, userId: string): Promise<BidResponseDTO> {
  const resp = await axios.post<BidResponseDTO>(`${BASE_URL}/api/v1/items/${itemId}/bids`, { amount, userId });
  return resp.data;
}
