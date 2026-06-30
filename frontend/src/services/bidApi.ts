import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export interface BidResponseDTO {
  id: number;
  itemId: number;
  userId: string;
  amount: number;
  createdAt: string;
}

export async function getBidsByItemId(itemId: number): Promise<BidResponseDTO[]> {
  const resp = await axios.get<BidResponseDTO[]>(`${BASE_URL}/api/item/${itemId}/bid`);
  return resp.data;
}
