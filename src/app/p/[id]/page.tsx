import { api } from "@/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ClientPicPage } from "@/app/p/[id]/ClientPicPage";

interface ArchiveImage {
  id: number;
  cdn_url: string;
  short_name: string;
  Description: string;
}

async function getImages(id: string): Promise<ArchiveImage> {
  const response = await api.get(`upload/archive/image/${id}/detail/`);
  if (!response.data) {
    throw new Error("Invalid image data");
  }
  if (!response.data.cdn_url || !response.data.id) {
    throw new Error("Invalid image data: missing required fields");
  }
  return response.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const id = (await params).id;
    const data = await getImages(id);

    // Encode the CDN URL to handle spaces and special characters
    const encodedCdnUrl = encodeURI(data.cdn_url);

    return {
      title: data.short_name || "Image Detail",
      description: data.Description || "No description available",
      openGraph: {
        title: data.short_name || "Image Detail",
        description: data.Description || "No description available",
        images: [
          {
            url: encodedCdnUrl,
            width: 1200,
            height: 630,
            alt: data.short_name || "Image",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.short_name || "Image Detail",
        description: data.Description || "No description available",
        images: [encodedCdnUrl],
      },
    };
  } catch (error) {
    return {
      title: "Image Detail",
      description: "Image details not found",
    };
  }
}

/**
 *  Critical: We must fetch image data here in the server component — even though it's already fetched in `generateMetadata()`.
 *
 * Why? Because Next.js injects metadata into the <head> of the initial HTML only if it's resolved synchronously
 * during server render. If we skip this fetch and rely solely on the client component to load data,
 * metadata injection breaks — it gets deferred to <script> tags, which SEO bots and social crawlers ignore.
 *
 * Additionally, this fetch ensures:
 * - Early validation of the `id` param
 * - Proper error handling via `notFound()`
 * - Synchronization between metadata and page content
 *
 * Yes, this results in a duplicate API call — but it's necessary to ensure correct metadata injection,
 * crawler compatibility, and consistent server-rendered output.
 */

export default async function DetailTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let data;
  let id;
  try {
    id = (await params).id;
    data = await getImages(id);
  } catch (error) {
    console.error(
      "Error fetching image details:",
      error instanceof Error ? error.message : error,
    );
    notFound();
  }
  return (
    <div>
      <ClientPicPage id={id} />
    </div>
  );
}
