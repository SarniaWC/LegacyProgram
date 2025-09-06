import { api } from "@/api";
import { notFound } from "next/navigation";

interface ArchiveImage {
  id: number;
  cdn_url: string;
  short_name: string;
  Description: string;
}
async function getImages(id: string): Promise<ArchiveImage> {
  const response = await api.get(`upload/archive/image/${id}/detail/`);
  return response.data;
}

export default async function DetailPage({
  params,
}: {
  params: { id: number };
}) {
  let data;
  try {
    data = await getImages(params.id.toString());
  } catch (error) {
    console.error("Error fetching image details:", error);
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
