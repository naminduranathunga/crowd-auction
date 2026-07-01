import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080';

export interface WalletDto {
  id: number;
  userId: number;
  balance: number;
  reservedBalance: number;
}

export interface TransactionDto {
  id: number;
  walletId: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'RESERVE' | 'RELEASE' | 'DEDUCT' | 'REFUND';
  description: string;
  createdAt: string;
}

export interface ReservedBalanceResponse {
  userId: number;
  reservedBalance: number;
}

export async function getWalletDetails(userId: string | number): Promise<WalletDto> {
  const resp = await axios.get<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}`);
  return resp.data;
}

export async function depositFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/deposit`, {
    amount,
    description
  });
  return resp.data;
}

export async function withdrawFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/withdraw`, {
    amount,
    description
  });
  return resp.data;
}

export async function getTransactionHistory(userId: string | number): Promise<TransactionDto[]> {
  const resp = await axios.get<TransactionDto[]>(`${BASE_URL}/api/v1/wallets/${userId}/transactions`);
  return resp.data;
}

export async function reserveFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/reserve`, {
    amount,
    description
  });
  return resp.data;
}

export async function releaseFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/release`, {
    amount,
    description
  });
  return resp.data;
}

export async function deductFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/deduct`, {
    amount,
    description
  });
  return resp.data;
}

export async function refundFunds(
  userId: string | number,
  amount: number,
  description?: string
): Promise<WalletDto> {
  const resp = await axios.post<WalletDto>(`${BASE_URL}/api/v1/wallets/${userId}/refund`, {
    amount,
    description
  });
  return resp.data;
}

export async function getReservedBalance(userId: string | number): Promise<ReservedBalanceResponse> {
  const resp = await axios.get<ReservedBalanceResponse>(`${BASE_URL}/api/v1/wallets/${userId}/reserved-balance`);
  return resp.data;
}
