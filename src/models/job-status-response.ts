export interface JobStatusResponse {
    jobId?: string;
    status?: string;
    logs?: string[];
    error?: string;
    progress?: number;
    downloadUrl?: string;
    message?: string;
    stage?: string;
    totalPages?: number;
    processedPages?: number;
    activePages?: number[];
}
