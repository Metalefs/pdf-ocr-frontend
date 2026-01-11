export const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7229/api"
        : "https://pdf-ocr-api-s4p9.onrender.com/api";

export async function http<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(input, init);

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }

    return res.json();
}
