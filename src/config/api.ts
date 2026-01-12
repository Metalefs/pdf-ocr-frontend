/* Configura��o do cliente de API para o frontend PDF-OCR.
   Mantido simples e tipado para uso em todo o aplicativo. */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const envApiBase =
  // Compatibilidade com v�rios bundlers/ambientes (CRA, Vite, etc.)
  // Prioriza vari�veis de ambiente definidas pelo usu�rio.
  (typeof process !== 'undefined' && (process.env.REACT_APP_API_BASE || process.env.API_BASE)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) ||
  '/api';

export const API_BASE = envApiBase.replace(/\/+$/, ''); // remove barras finais

export interface ApiOptions extends AxiosRequestConfig {}

function createClient(baseURL: string, defaultOptions?: ApiOptions): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...defaultOptions,
  });
}

export const apiClient = createClient(API_BASE);

/**
 * Constr�i uma URL com query string a partir de um caminho e um objeto de par�metros.
 * Exemplo: buildUrl('/upload', { page: 1 }) => '/upload?page=1'
 */
export function buildUrl(path: string, params?: Record<string, unknown>): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!params || Object.keys(params).length === 0) {
    return cleanPath;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `${cleanPath}?${qs}` : cleanPath;
}

/* Opera��es HTTP utilit�rias com tipagem gen�rica */

export async function get<T = unknown>(path: string, params?: Record<string, unknown>, options?: ApiOptions): Promise<T> {
  const url = buildUrl(path, params);
  const res: AxiosResponse<T> = await apiClient.get(url, options);
  return res.data;
}

export async function post<T = unknown, B = unknown>(path: string, body?: B, options?: ApiOptions): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.post(path, body, options);
  return res.data;
}

export async function put<T = unknown, B = unknown>(path: string, body?: B, options?: ApiOptions): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.put(path, body, options);
  return res.data;
}

export async function del<T = unknown>(path: string, params?: Record<string, unknown>, options?: ApiOptions): Promise<T> {
  const url = buildUrl(path, params);
  const res: AxiosResponse<T> = await apiClient.delete(url, options);
  return res.data;
}

/* Export padr�o para conveni�ncia */
export default {
  apiClient,
  API_BASE,
  buildUrl,
  get,
  post,
  put,
  del,
};