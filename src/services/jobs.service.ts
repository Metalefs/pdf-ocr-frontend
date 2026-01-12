import { JobStatusResponse } from "../models/job-status-response";
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/api/Jobs/${jobId}/status`);
    if (!res.ok) {
        let payload: any = null;
        try { payload = await res.json(); } catch (e) { /* ignore */ }
        const err: any = new Error((payload && payload.error) || res.statusText || 'Request failed');
        err.status = res.status;
        if (payload && payload.details) err.details = payload.details;
        if (payload && payload.upgradeUrl) err.upgradeUrl = payload.upgradeUrl;
        throw err;
    }
    return res.json();
}
export function getJobDownloadUrl(jobId) {
    return `${API_BASE_URL}/api/Jobs/${jobId}/download`;
}