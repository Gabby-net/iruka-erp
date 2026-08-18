import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IRUKA ERP",
    short_name: "IRUKA ERP",
    description:
      "IRUKA ERP - Enterprise Resource Planning System for IRUKA Industries Ltd.",

    start_url: "/login",
    scope: "/",

    display: "standalone",

    background_color: "#081028",
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