import axios, { AxiosError } from 'axios';
 
 
 
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://192.168.254.54:8085',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});



const formatAxiosError = (err: any) => {
  if (axios.isAxiosError(err)) {
    return {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
      method: err.config?.method,
    };
  }
  return { message: String(err) };
};

export default {
  post: async (url: string, data: any) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      const info = formatAxiosError(error);
      console.error('API POST Error:', info);
      throw info;
    }
  },
  get: async (url: string) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const info = formatAxiosError(error);
      console.error('API GET Error:', info);
      throw info;
    }
  },
  patch: async (url: string, data: any) => {
    try {
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      const info = formatAxiosError(error);
      console.error('API PATCH Error:', info);
      throw info;
    }
  },
  listPartnerNames: async (): Promise<string[]> => {
    try {
      
      const data = await api.get('/api/partner?page=0&size=500').then(r => r.data);
      const raw = Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data) ? data : [];
      const names = raw
        .map((p: any) => p?.partnerName)
        .filter((n: any): n is string => typeof n === 'string' && n.trim().length > 0);
      const unique = [...new Set(names)] as string[];
      return unique.sort((a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } catch (error) {
      const info = formatAxiosError(error);
      console.error('API listPartnerNames Error:', info);
      return [];
    }
  },
};
 