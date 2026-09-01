import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IRUKA",
    short_name: "IRUKA",
    description:
      "IRUKA - Business management and enterprise operations system for IRUKA Industries Ltd.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    background_color: "#081028",
    theme_color: "#071028",
    orientation: "portrait",

    icons: [
      {
        src: "/logo/nkiruka-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/nkiruka-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}