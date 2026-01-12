import { API_BASE_URL } from "./api";
import { JobStatusResponse } from "../models/job-status-response";

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/Jobs/${jobId}/status`);
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
    return `${API_BASE_URL}/Jobs/${jobId}/download`;
}