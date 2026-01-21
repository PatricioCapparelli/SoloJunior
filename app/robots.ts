import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://solo-junior.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/admin",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}