import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IRUKA BREAD",
    short_name: "IRUKA",
    description: "Fresh Bread Ordering Platform",
    start_url: "/customer/home",
    display: "standalone",
    background_color: "#FFFDF8",
    theme_color: "#071028",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}