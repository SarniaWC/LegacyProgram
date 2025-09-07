import { api } from "@/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
    const { id } = await params;
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

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let data;
  try {
    const { id } = await params;
    data = await getImages(id);
  } catch (error) {
    console.error("Error fetching image details:", error instanceof Error ? error.message : error);
    notFound();
  }
  return (
    <div className="container mx-auto px-2 py-2">
      <div className="bg-neutral-900 rounded-lg shadow-lg overflow-hidden border border-neutral-700 max-w-3xl mx-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4 text-white">
            {!data.short_name ? "No title" : data.short_name}
          </h1>
          <p className="text-sm mb-6 text-gray-300">
            {!data.Description ? "No Description" : data.Description}
          </p>
          <div className="flex justify-center">
            <img
              src={data.cdn_url}
              alt={data.short_name}
              className="max-w-[90%] h-auto rounded-md shadow-md max-h-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
