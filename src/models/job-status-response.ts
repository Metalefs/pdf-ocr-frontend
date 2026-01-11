export interface JobStatusResponse {
    jobId?: string;
    status?: string;
    logs?: string[];
    error?: string;
    progress?: number;
    downloadUrl?: string;
}
