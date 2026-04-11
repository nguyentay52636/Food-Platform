/**
 * Starts Next dev on 0.0.0.0 and prints a LAN URL + QR for phone (same Wi‑Fi).
 * Run API server on this machine (port 8000); browser uses /api rewrites through Next.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const require = createRequire(path.join(root, "package.json"));
const nextCli = require.resolve("next/dist/bin/next");

/** Ưu tiên Wi‑Fi / Ethernet LAN, tránh VPN / WSL / Hyper‑V khi có thể. */
const VIRTUAL_IFACE = /vEthernet|VirtualBox|VMware|WSL|Hyper-V|TAP|Wintun|Tailscale|ZeroTier|NordLynx|VPN|Radmin|Tunngle|Npcap/i;

function scoreAddress(addr) {
    if (addr.startsWith("192.168.")) return 300;
    if (addr.startsWith("10.")) return 200;
    const m = /^172\.(\d+)\./.exec(addr);
    if (m) {
        const n = Number(m[1]);
        if (n >= 16 && n <= 31) return 250;
    }
    return 50;
}

function collectLanCandidates() {
    const nets = os.networkInterfaces();
    const out = [];
    for (const name of Object.keys(nets)) {
        if (/^lo(opback)?$/i.test(name)) continue;
        for (const net of nets[name] ?? []) {
            const v4 = net.family === "IPv4" || net.family === 4;
            if (!v4 || net.internal) continue;
            out.push({
                address: net.address,
                iface: name,
                virtual: VIRTUAL_IFACE.test(name),
            });
        }
    }
    out.sort((a, b) => {
        if (a.virtual !== b.virtual) return a.virtual ? 1 : -1;
        return scoreAddress(b.address) - scoreAddress(a.address);
    });
    return out;
}

function pickLanIp(candidates) {
    return candidates[0]?.address ?? null;
}

async function main() {
    const { default: qrcode } = await import("qrcode-terminal");
    const port = process.env.PORT ?? "3000";
    const candidates = collectLanCandidates();
    const ip = pickLanIp(candidates);
    const url = ip ? `http://${ip}:${port}` : `http://localhost:${port}`;

    console.log("\n  Food Platform — client cho điện thoại (cùng Wi‑Fi)\n");
    console.log(`  Mở trên điện thoại: ${url}`);
    console.log("  Chạy API Nest trên máy này (mặc định cổng 8000). Yêu cầu /api qua Next.\n");
    if (candidates.length > 1) {
        console.log("  Các IP khác (thử nếu trang cứ quay / không mở được):");
        for (const c of candidates) {
            console.log(`    http://${c.address}:${port}  (${c.iface}${c.virtual ? ", có thể là VPN/ảo" : ""})`);
        }
        console.log("");
    }
    if (ip) {
        qrcode.generate(url, { small: true });
        console.log(
            "\n  Cài như app: Android/Chrome — menu ⋮ → \"Cài đặt\" / \"Thêm vào Màn hình chính\"; iOS Safari — Chia sẻ → \"Thêm vào Màn hình chính\"."
        );
        console.log(
            "  Lưu ý: định vị trình duyệt thường chỉ đáng tin với HTTPS hoặc localhost (không phải IP LAN)."
        );
        if (process.platform === "win32") {
            console.log(
                "\n  Nếu điện thoại CHỈ LOAD mãi: Windows Firewall thường chặn cổng 3000. Mở PowerShell (Run as Administrator) trong thư mục client\\web và chạy:"
            );
            console.log("    npm run dev:mobile:firewall");
            console.log("  Hoặc: Settings → Windows Security → Firewall → Advanced → Inbound Rules → New Rule → Port TCP 3000 → Allow.\n");
        } else {
            console.log(
                "\n  Nếu chỉ load mãi: kiểm tra firewall máy tính cho cổng TCP " +
                    port +
                    "; tắt AP isolation / \"Guest network\" trên router nếu có.\n"
            );
        }
    } else {
        console.log("  (Không tìm thấy IPv4 LAN — kiểm tra Wi‑Fi hoặc dùng tunnel HTTPS.)\n");
    }

    spawn(process.execPath, [nextCli, "dev", "--hostname", "0.0.0.0", "--port", String(port)], {
        stdio: "inherit",
        cwd: root,
        env: { ...process.env },
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
