import { API_BASE_URL } from "./api";
import { JobStatusResponse } from "../models/job-status-response";

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/Jobs/${jobId}/status`);
    if (!res.ok) throw await res.json();
    return res.json();
}
export function getJobDownloadUrl(jobId) {
    return `${API_BASE_URL}/Jobs/${jobId}/download`;
}