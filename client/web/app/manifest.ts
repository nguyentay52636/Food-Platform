import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Food Platform",
        short_name: "Food Platform",
        description: "Food discovery client",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/file.svg",
                type: "image/svg+xml",
                sizes: "any",
                purpose: "any",
            },
        ],
    };
}
