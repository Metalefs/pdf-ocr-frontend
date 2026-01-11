import { API_BASE_URL } from "./api";
import { ProcessResponse } from "../models/process-response";

export async function processPdfSync(file: File): Promise<Blob> {
    const form = new FormData();
    form.append("File", file);

    const res = await fetch(`${API_BASE_URL}/api/Pdf/process-sync`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw await res.json();
    }

    return res.blob();
}

export async function processPdfAsync(file: File): Promise<ProcessResponse> {
    const form = new FormData();
    form.append("File", file);

    const res = await fetch(`${API_BASE_URL}/api/Pdf/process`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw await res.json();
    }

    return res.json();
}
