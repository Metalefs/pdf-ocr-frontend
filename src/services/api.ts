export async function http<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(input, init);

    if (!res.ok) {
        let payload: any = null;
        try {
            payload = await res.json();
        } catch (e) {
            // ignore json parse errors
        }

        const err: any = new Error((payload && payload.error) || res.statusText || "Request failed");
        err.status = res.status;
        if (payload && payload.details) err.details = payload.details;
        if (payload && payload.upgradeUrl) err.upgradeUrl = payload.upgradeUrl;
        throw err;
    }

    return res.json();
}
