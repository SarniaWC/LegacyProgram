import { api } from "@/api";
import { notFound } from "next/navigation";

interface ArchiveImage {
  id: number;
  cdn_url: string;
  short_name: string;
  description: string;
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
    <div className="mt-4 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">
        {!data.short_name ? "No title" : data.short_name}
      </h1>
      <img src={data.cdn_url} alt={data.short_name} className="max-w-64" />
      <p className="text-lg mb-8 text-white">
        {!data.description ? "No Description" : data.description}
      </p>
    </div>
  );
}
