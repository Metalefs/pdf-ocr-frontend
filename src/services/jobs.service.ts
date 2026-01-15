import { JobStatusResponse } from "../models/job-status-response";
import { withLanguageHeaders } from "./api";
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

async function readJsonSafe(res: Response): Promise<any | null> {
    try {
        return await res.json();
    } catch (e) {
        return null;
    }
}

function createApiError(res: Response, payload: any) {
    const err: any = new Error(
        (payload && (payload.error || payload.message)) || res.statusText || 'Request failed'
    );
    err.status = res.status;
    if (payload && (payload.details || payload.message)) err.details = payload.details || payload.message;
    if (payload && payload.upgradeUrl) err.upgradeUrl = payload.upgradeUrl;

    if (res.status === 404) {
        err.code = 'JOB_NOT_FOUND';
    }

    return err;
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/api/Jobs/${jobId}/status`, withLanguageHeaders());
    if (!res.ok) {
        const payload = await readJsonSafe(res);
        throw createApiError(res, payload);
    }
    return res.json();
}
export function getJobDownloadUrl(jobId: string) {
    return `${API_BASE_URL}/api/Jobs/${jobId}/download`;
}