import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:8080';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

export async function getUserById(userId: string): Promise<UserDto> {
  const resp = await axios.get<UserDto>(`${BASE_URL}/api/v1/users/${userId}`);
  return resp.data;
}
