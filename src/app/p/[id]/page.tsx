"use client";
import { useRouter, useParams } from "next/navigation";
import { SVGButton } from "@/components/SVGButton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useEffect, useState } from "react";

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

export default function Picture() {
  const navigate = useRouter();
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId.join("/") : rawId;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ["picture", id],
    queryFn: () => getImages(id),
    enabled: !!id,
  });

  const allImages = isSuccess ? data.related_images : [];

  // Set current index based on image ID from URL
  useEffect(() => {
    if (id && allImages.length > 0) {
      const index = allImages.findIndex((img) => img.id.toString() === id);
      if (index !== -1) {
        setCurrentIndex(index);
        setDisplayImage(allImages[index].cdn_url);
      }
    }
  }, [id, allImages]);

  function OpenImage(image: string | null) {
    if (image) window.open(image, "_blank");
  }

  async function downloadImage(id: string) {
    const proxyUrl = `/upload/archive/cdn/download/${id}/`;

    try {
      const response = await api.get(proxyUrl, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  }

  function exit() {
    const entryPath = sessionStorage.getItem("entryPath");
    sessionStorage.removeItem("entryPath");
    sessionStorage.removeItem("selectedFolder");
    sessionStorage.removeItem("picture");
    navigate.push(entryPath || "/");
  }

  function goToImage(index: number) {
    if (index >= 0 && index < allImages.length) {
      const image = allImages[index];
      setCurrentIndex(index);
      setDisplayImage(image.cdn_url);
      navigate.push(`/p/${image.id}`); // Sync URL with image ID
    }
  }

  function nextImage() {
    goToImage(currentIndex + 1);
  }

  function prevImage() {
    goToImage(currentIndex - 1);
  }

  function subject() {
    navigate.push(`/p/${id}/detail`);
  }

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      {/* Header Buttons */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex space-x-2">
          <SVGButton iconType="Close" onClick={exit} title="Exit" />
          <SVGButton iconType="Subject" onClick={subject} title="Details" />
        </div>
        <div className="flex space-x-2">
          <SVGButton
            iconType="Download"
            onClick={() => {
              if (id) downloadImage(id);
            }}
            title="Download"
          />
          <SVGButton
            iconType="OpenNew"
            onClick={() => OpenImage(displayImage)}
            title="Open in New Tab"
          />
        </div>
      </div>

      {/* Display Image with Arrows */}
      <div className="w-full h-full flex items-center justify-center relative">
        <SVGButton
          iconType="ArrowBackward"
          onClick={prevImage}
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
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          disabled={currentIndex >= allImages.length - 1}
          title="Next"
        />
      </div>

      {/* Thumbnails Preview */}
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
