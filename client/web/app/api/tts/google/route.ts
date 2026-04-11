import { NextRequest, NextResponse } from "next/server"

const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

const MAX_CHUNK = 180

function chunkAtWordBoundary(text: string, maxLen: number): string[] {
    const t = text.trim()
    if (t.length <= maxLen) return t ? [t] : []
    const out: string[] = []
    let i = 0
    while (i < t.length) {
        let end = Math.min(i + maxLen, t.length)
        if (end < t.length) {
            const slice = t.slice(i, end)
            const sp = slice.lastIndexOf(" ")
            if (sp > 40) end = i + sp + 1
        }
        const part = t.slice(i, end).trim()
        if (part) out.push(part)
        i = end
    }
    return out
}

async function fetchChunk(q: string, tl: string): Promise<ArrayBuffer> {
    const params = new URLSearchParams({
        ie: "UTF-8",
        client: "tw-ob",
        tl,
        q,
    })
    const url = `https://translate.google.com/translate_tts?${params.toString()}`
    const res = await fetch(url, {
        headers: {
            "User-Agent": UA,
            Referer: "https://translate.google.com/",
            Accept: "*/*",
        },
        next: { revalidate: 0 },
    })
    if (!res.ok) {
        throw new Error(`tts_upstream_${res.status}`)
    }
    return res.arrayBuffer()
}

/** Proxy Google Translate TTS (Vietnamese uses the same female-style voice as translate.google.com). */
export async function POST(req: NextRequest) {
    let body: { text?: string; tl?: string }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "invalid_json" }, { status: 400 })
    }

    const text = typeof body.text === "string" ? body.text.trim() : ""
    const tl = typeof body.tl === "string" && body.tl.trim() !== "" ? body.tl.trim() : "vi"

    if (!text) {
        return NextResponse.json({ error: "missing_text" }, { status: 400 })
    }
    if (text.length > 12_000) {
        return NextResponse.json({ error: "text_too_long" }, { status: 400 })
    }

    const chunks = chunkAtWordBoundary(text, MAX_CHUNK)
    if (chunks.length === 0) {
        return NextResponse.json({ error: "empty" }, { status: 400 })
    }

    const buffers: Uint8Array[] = []
    for (let i = 0; i < chunks.length; i++) {
        const buf = new Uint8Array(await fetchChunk(chunks[i], tl))
        if (buf.byteLength < 80) {
            return NextResponse.json({ error: "upstream_empty_chunk" }, { status: 502 })
        }
        buffers.push(buf)
        if (i < chunks.length - 1) {
            await new Promise((r) => setTimeout(r, 120))
        }
    }

    const total = buffers.reduce((n, b) => n + b.byteLength, 0)
    const merged = new Uint8Array(total)
    let offset = 0
    for (const b of buffers) {
        merged.set(b, offset)
        offset += b.byteLength
    }

    return new NextResponse(merged, {
        status: 200,
        headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=300",
        },
    })
}
