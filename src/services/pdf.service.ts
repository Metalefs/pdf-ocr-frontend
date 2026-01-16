import { ProcessResponse } from "../models/process-response";
import type { OcrTextResponse } from "../models/ocr-text-response";
import { authService, supabase } from "./auth.service";
import { withLanguageHeaders } from "./api";
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

async function readJsonSafe(res: Response): Promise<any | null> {
    try {
        return await res.json();
    } catch (e) {
        return null;
    }
}

function isDemoLimitError(status: number, payload: any): boolean {
    if (status === 429) return true;

    const errorText = String(payload?.error || '').toLowerCase();
    const detailsText = String(payload?.details || payload?.message || '').toLowerCase();

    // Back-end pode retornar PT-BR ("Demo limitado a 1MB") ou EN ("Demo limit exceeded")
    if (errorText.includes('demo limit')) return true;
    if (errorText.includes('demo limitado')) return true;
    if (detailsText.includes('demo') && detailsText.includes('limit')) return true;
    if (detailsText.includes('demo') && detailsText.includes('limite')) return true;

    return false;
}

function createApiError(res: Response, payload: any) {
    const err: any = new Error(
        (payload && (payload.error || payload.message)) || res.statusText || 'Request failed'
    );

    err.status = res.status;
    if (payload && (payload.details || payload.message)) err.details = payload.details || payload.message;
    if (payload && payload.upgradeUrl) err.upgradeUrl = payload.upgradeUrl;

    if (isDemoLimitError(res.status, payload)) {
        err.code = 'DEMO_LIMIT';
        if (!err.upgradeUrl) err.upgradeUrl = '/plans';
    }

    // Treat server errors as a temporarily unavailable API.
    if (res.status >= 500) {
        err.code = 'API_UNAVAILABLE';
    }

    return err;
}

function createNetworkError(originalError: any) {
    const err: any = new Error('API unavailable');
    err.code = 'API_UNAVAILABLE';
    err.status = 0;
    err.details = originalError?.message || String(originalError || 'Network error');
    return err;
}

export async function processPdfDemo(file: File): Promise<ProcessResponse> {
    const form = new FormData();
    form.append("File", file);
    let res: Response;
    try {
        res = await fetch(
            `${API_BASE_URL}/api/Pdf/demo`,
            withLanguageHeaders({
                method: "POST",
                body: form,
            })
        );
    } catch (e) {
        throw createNetworkError(e);
    }

    if (!res.ok) {
        const payload = await readJsonSafe(res);
        throw createApiError(res, payload);
    }

    return res.json();
}

export async function processPdfTextDemo(file: File): Promise<OcrTextResponse> {
    const form = new FormData();
    form.append("File", file);

    let res: Response;
    try {
        res = await fetch(
            `${API_BASE_URL}/api/Pdf/process-text-demo`,
            withLanguageHeaders({
                method: "POST",
                body: form,
            })
        );
    } catch (e) {
        throw createNetworkError(e);
    }

    if (!res.ok) {
        const payload = await readJsonSafe(res);
        throw createApiError(res, payload);
    }

    return res.json();
}

export async function processPdfAsync(file: File): Promise<ProcessResponse> {
    const form = new FormData();
    form.append("File", file);
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    let res: Response;
    try {
        res = await fetch(
            `${API_BASE_URL}/api/Pdf/process`,
            withLanguageHeaders({
                method: "POST",
                body: form,
                headers: {
                    Authorization: `Bearer ${session.data.session.access_token}`,
                },
            })
        );
    } catch (e) {
        throw createNetworkError(e);
    }

    if (!res.ok) {
        const payload = await readJsonSafe(res);
        throw createApiError(res, payload);
    }

    authService.refreshUserData();

    return res.json();
}

export async function processPdfText(file: File): Promise<OcrTextResponse> {
    const form = new FormData();
    form.append("File", file);

    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    let res: Response;
    try {
        res = await fetch(
            `${API_BASE_URL}/api/Pdf/process-text`,
            withLanguageHeaders({
                method: "POST",
                body: form,
                headers: {
                    Authorization: `Bearer ${session.data.session.access_token}`,
                },
            })
        );
    } catch (e) {
        throw createNetworkError(e);
    }

    if (!res.ok) {
        const payload = await readJsonSafe(res);
        throw createApiError(res, payload);
    }

    authService.refreshUserData();
    return res.json();
}
