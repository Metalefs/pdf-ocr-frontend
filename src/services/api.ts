function getStoredLocale(): string {
    try {
        const stored = localStorage.getItem('locale');
        if (stored) return stored;
    } catch (e) {
        // ignore
    }

    const nav = (typeof navigator !== 'undefined' && navigator.language)
        ? String(navigator.language).toLowerCase()
        : '';

    if (nav.startsWith('pt')) return 'pt';
    return 'en';
}

export function getAcceptLanguageHeaderValue(): string {
    const locale = String(getStoredLocale()).toLowerCase();
    if (locale.startsWith('pt')) return 'pt-BR,pt;q=0.9,en;q=0.8';
    return 'en;q=1.0,pt;q=0.5';
}

export function withLanguageHeaders(init?: RequestInit): RequestInit {
    const headers = new Headers((init && init.headers) || undefined);
    if (!headers.has('Accept-Language')) {
        headers.set('Accept-Language', getAcceptLanguageHeaderValue());
    }
    return { ...(init || {}), headers };
}

export async function http<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    let res: Response;
    try {
        res = await fetch(input, withLanguageHeaders(init));
    } catch (e: any) {
        const err: any = new Error('API unavailable');
        err.code = 'API_UNAVAILABLE';
        err.status = 0;
        err.details = e?.message || String(e || 'Network error');
        throw err;
    }

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

        if (res.status >= 500) {
            err.code = 'API_UNAVAILABLE';
        }
        throw err;
    }

    return res.json();
}
