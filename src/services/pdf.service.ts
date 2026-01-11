import { API_BASE_URL } from "./api";
import { ProcessResponse } from "../models/process-response";
import { supabase } from "./auth.service";

export async function processPdfDemo(file: File): Promise<Blob> {
    const form = new FormData();
    form.append("File", file);

    const res = await fetch(`${API_BASE_URL}/Pdf/demo`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw await res.json();
    }

    return res.json();
}

export async function processPdfAsync(file: File): Promise<ProcessResponse> {
    const form = new FormData();
    form.append("File", file);
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/Pdf/process`, {
        method: "POST",
        body: form, 
        headers: {
            Authorization: `Bearer ${session.data.session.access_token}`,
        },
    });

    if (!res.ok) {
        throw await res.json();
    }

    return res.json();
}
