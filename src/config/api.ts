/* Configuração do cliente de API para o frontend PDF-OCR.
   Mantido simples e tipado para uso em todo o aplicativo. */
export const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://seu-app.up.railway.app";


import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const envApiBase =
  // Compatibilidade com vários bundlers/ambientes (CRA, Vite, etc.)
  // Prioriza variáveis de ambiente definidas pelo usuário.
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
 * Constrói uma URL com query string a partir de um caminho e um objeto de parâmetros.
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

/* Operações HTTP utilitárias com tipagem genérica */

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

/* Export padrão para conveniência */
export default {
  apiClient,
  API_BASE,
  buildUrl,
  get,
  post,
  put,
  del,
};