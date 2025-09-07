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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/archive/image/${id}/detail/`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch image data");
  }
  const data = await response.json();
  if (!data) {
    throw new Error("Invalid image data");
  }
  if (!data.cdn_url || !data.id) {
    throw new Error("Invalid image data: missing required fields");
  }
  return data;
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
 * Critical, we must invoke getImages twice despite only using it for metadata
 * Otherwise, the metadata will not be generated
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
