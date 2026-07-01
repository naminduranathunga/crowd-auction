import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080';

// ── Types matching the backend DTOs ────────────────────────────────────────

export type AuctionStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export interface CreateAuctionPayload {
  userId: string;
  name: string;
  description: string;
  startTime: string;   // ISO-8601, e.g. "2025-07-01T14:00:00"
  endTime: string;     // derived from startTime + duration (minutes)
  status: AuctionStatus;
}

export interface CreateItemPayload {
  name: string;
  description: string;
  startPrice: number;
  currentPrice: number;
}

export interface ItemImageResponse {
  id: number;
  objectKey: string;
  imageUrl: string;
  originalFilename?: string;
  contentType?: string;
  sortOrder: number;
  primaryImage: boolean;
}

export interface AuctionResponse {
  id: number;
  userId: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  items: ItemResponse[];
}

export interface ItemResponse {
  id: number;
  name: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  coverImageUrl?: string;
  images: ItemImageResponse[];
}

// ── API calls ───────────────────────────────────────────────────────────────

/**
 * Step 1 – Create the auction (the "listing shell").
 * The JWT token is already attached globally by AuthContext via
 * axios.defaults.headers.common["Authorization"].
 */
export async function createAuction(
  payload: CreateAuctionPayload
): Promise<AuctionResponse> {
  const resp = await axios.post<AuctionResponse>(
    `${BASE_URL}/api/v1/auctions`,
    payload
  );
  return resp.data;
}

function buildItemFormData(payload: CreateItemPayload, images: File[] = []): FormData {
  const formData = new FormData();
  formData.append(
    'item',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );
  images.forEach((image) => formData.append('images', image));
  return formData;
}

/**
 * Step 2 – Add an item to the newly created auction.
 */
export async function createItem(
  auctionId: number,
  payload: CreateItemPayload,
  images: File[] = []
): Promise<ItemResponse> {
  const resp = await axios.post<ItemResponse>(
    `${BASE_URL}/api/v1/auctions/${auctionId}/items`,
    buildItemFormData(payload, images),
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return resp.data;
}

/**
 * Convenience helper: creates auction + item in one call.
 * Returns the full auction response.
 */
export async function createListing(
  auctionPayload: CreateAuctionPayload,
  itemPayload: CreateItemPayload,
  images: File[] = []
): Promise<AuctionResponse> {
  const auction = await createAuction(auctionPayload);
  await createItem(auction.id, itemPayload, images);
  return auction;
}

/**
 * Fetch all auctions.
 */
export async function getAuctions(): Promise<AuctionResponse[]> {
  const resp = await axios.get<AuctionResponse[]>(
    `${BASE_URL}/api/v1/auctions`
  );
  return resp.data;
}

/**
 * Fetch a single auction by ID.
 */
export async function getAuctionById(auctionId: number | string): Promise<AuctionResponse> {
  const resp = await axios.get<AuctionResponse>(
    `${BASE_URL}/api/v1/auctions/${auctionId}`
  );
  return resp.data;
}

/**
 * Update an existing auction.
 */
export async function updateAuction(
  auctionId: number | string,
  payload: Partial<CreateAuctionPayload>
): Promise<AuctionResponse> {
  const resp = await axios.patch<AuctionResponse>(
    `${BASE_URL}/api/v1/auctions/${auctionId}`,
    payload
  );
  return resp.data;
}

/**
 * Update an existing item.
 */
export async function updateItem(
  auctionId: number | string,
  itemId: number | string,
  payload: Partial<CreateItemPayload>,
  images: File[] = []
): Promise<ItemResponse> {
  if (images.length === 0) {
    const resp = await axios.patch<ItemResponse>(
      `${BASE_URL}/api/v1/auctions/${auctionId}/items/${itemId}`,
      payload
    );
    return resp.data;
  }

  const resp = await axios.patch<ItemResponse>(
    `${BASE_URL}/api/v1/auctions/${auctionId}/items/${itemId}`,
    buildItemFormData(payload as CreateItemPayload, images),
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return resp.data;
}

/**
 * Delete an auction by ID.
 */
export async function deleteAuction(auctionId: number | string): Promise<void> {
  await axios.delete(`${BASE_URL}/api/v1/auctions/${auctionId}`);
}
