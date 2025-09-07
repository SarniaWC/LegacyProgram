import ClientHomePage from "@/app/(home)/ClientHomePage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: "Legacy | Sarnia Wrestling",
    description: "Legacy Program of Sarnia Wrestling Club",
    openGraph: {
      title: "Legacy | Sarnia Wrestling Club",
      description: "Legacy Program of Sarnia Wrestling Club",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Legacy | Sarnia Wrestling Club",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Legacy | Sarnia Wrestling Club",
      description: "Legacy of Sarnia Wrestling Club",
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default function HomePage() {
  return <ClientHomePage />;
}
