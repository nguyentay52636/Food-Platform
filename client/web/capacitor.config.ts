import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android/iOS: WebView tải client Next từ URL (API + SSR không cần export tĩnh).
 *
 * Dev (điện thoại USB + cùng Wi‑Fi):
 *   set CAPACITOR_SERVER_URL=http://IP_MÁY_TÍNH:3000
 *   npm run android:sync
 *   npm run android:open  → Run trên thiết bị / emulator
 *
 * Production: set CAPACITOR_SERVER_URL=https://ten-mien-cua-ban
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
    appId: "com.foodplatform.client",
    appName: "Phố Ẩm Thực",
    webDir: "www",
    ...(serverUrl
        ? {
              server: {
                  url: serverUrl,
                  cleartext: serverUrl.startsWith("http://"),
              },
          }
        : {}),
    android: {
        allowMixedContent: true,
    },
    plugins: {
        Geolocation: {
            androidAccessFineLocation: true,
        },
    },
};

export default config;
