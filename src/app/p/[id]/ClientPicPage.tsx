"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/api";
import { SVGButton } from "@/components/SVGButton";

export interface ArchiveImage {
  id: number;
  cdn_url: string;
  short_name: string;
  Description: string;
}

export interface ArchiveImageResponse {
  primary_image: ArchiveImage;
  related_images: ArchiveImage[];
}

const getImages = async (id?: string): Promise<ArchiveImageResponse> => {
  const response = await api.get(`upload/archive/image/${id}/`);
  return response.data;
};

interface ClientPicPageProps {
  id: string;
}

export function ClientPicPage({ id }: ClientPicPageProps) {
  const navigate = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ["picture", id],
    queryFn: () => getImages(id),
    enabled: !!id,
  });

  const allImages = isSuccess ? data.related_images : [];

  useEffect(() => {
    if (id && allImages.length > 0) {
      const index = allImages.findIndex((img) => img.id.toString() === id);
      if (index !== -1) {
        setCurrentIndex(index);
        setDisplayImage(allImages[index].cdn_url);
      }
    }
  }, [id, allImages]);

  function goToImage(index: number) {
    if (index >= 0 && index < allImages.length) {
      const image = allImages[index];
      setCurrentIndex(index);
      setDisplayImage(image.cdn_url);
      navigate.push(`/p/${image.id}`);
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div
        className="absolute top-0 left-0 w-full
      flex justify-between items-center p-4 z-10 bg-gradient-to-b
      from-black/80 to-transparent"
      >
        <div className="flex space-x-2">
          <SVGButton
            iconType="Close"
            onClick={() => navigate.push("/")}
            title="Exit"
          />
          <SVGButton
            iconType="Subject"
            onClick={() => navigate.push(`/p/${id}/detail`)}
            title="Details"
          />
        </div>
        <div className="flex space-x-2">
          <SVGButton
            iconType="Download"
            onClick={async () => {
              const response = await api.get(
                `/upload/archive/cdn/download/${id}/`,
                {
                  responseType: "blob",
                },
              );
              const url = URL.createObjectURL(response.data);
              const link = document.createElement("a");
              link.href = url;
              link.download =
                allImages[currentIndex].cdn_url.split("/").pop() || "image.jpg";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            title="Download"
          />
          <SVGButton
            iconType="OpenNew"
            onClick={() => displayImage && window.open(displayImage, "_blank")}
            title="Open in New Tab"
          />
        </div>
      </div>

      {/* Image Display */}
      <div className="w-full h-full flex items-center justify-center relative">
        <SVGButton
          iconType="ArrowBackward"
          onClick={() => goToImage(currentIndex - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          disabled={currentIndex <= 0}
          title="Previous"
        />
        {displayImage ? (
          <img
            src={displayImage}
            className="object-contain w-full h-full"
            alt="Loaded"
          />
        ) : (
          <p>Loading image...</p>
        )}
        <SVGButton
          iconType="ArrowForward"
          onClick={() => goToImage(currentIndex + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          disabled={currentIndex >= allImages.length - 1}
          title="Next"
        />
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex overflow-x-auto space-x-2 z-10">
        {allImages.map((img, index) => (
          <img
            key={img.id}
            src={img.cdn_url}
            alt={img.short_name}
            className={`w-20 h-20 object-cover cursor-pointer border-2 ${
              index === currentIndex ? "border-white" : "border-transparent"
            }`}
            onClick={() => goToImage(index)}
          />
        ))}
      </div>
    </div>
  );
}
