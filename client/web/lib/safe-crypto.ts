/** UUID v4-style id; works when `crypto.randomUUID` is missing or throws (e.g. HTTP on LAN / some mobile Safari). */
export function safeRandomUuid(): string {
    try {
        const c = globalThis.crypto
        if (c && typeof c.randomUUID === "function") {
            return c.randomUUID()
        }
    } catch {
        /* non-secure context or restricted crypto */
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
        const r = (Math.random() * 16) | 0
        const v = ch === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
