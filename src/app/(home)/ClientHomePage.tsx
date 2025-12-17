"use client";
import { useEffect, useRef, useState } from "react";
import { Gallery, GalleryItem } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { AxiosError } from "axios";
import Select from "react-select";
import { main_site } from "@/constants";
import { useRouter } from "next/navigation";

type ImageResult = {
  id: number;
  cdn_url: string;
};

type FolderOption = {
  id: string;
  name: string;
};

async function getImages(
  page: number,
  folder?: string
): Promise<ImageResult[]> {
  const folderParam = folder ? `&folder=${folder}` : "";
  try {
    const { data } = await api.get(
      `/upload/archive/images/?page=${page}${folderParam}`
    );
    return data.results as ImageResult[];
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

async function getOptions(): Promise<FolderOption[]> {
  const { data } = await api.get(`/upload/archive/folders/`);
  return data as FolderOption[];
}

export default function ClientHomePage() {
  const [selectedFolder, setSelectedFolder] = useState<FolderOption | null>(
    null
  );
  const { data: folderOptions } = useQuery({
    queryKey: ["options"],
    queryFn: () => getOptions(),
  });

  const navigate = useRouter();

  const navigatePicture = (id: number, image: string) => {
    sessionStorage.setItem("picture", image);
    sessionStorage.setItem("entryPath", window.location.pathname);
    if (selectedFolder) {
      sessionStorage.setItem("selectedFolder", JSON.stringify(selectedFolder));
    }
    sessionStorage.setItem("scrollY", window.scrollY.toString());
    navigate.push(`/p/${id}`);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery<ImageResult[]>({
    queryKey: ["images", selectedFolder?.id],
    queryFn: ({ pageParam = 1 }) =>
      getImages(pageParam as number, selectedFolder?.id),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : undefined,
  });

  const images = data?.pages.flat() ?? [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedFolder = sessionStorage.getItem("selectedFolder");
    if (storedFolder) {
      try {
        const parsed = JSON.parse(storedFolder);
        setSelectedFolder(parsed);
      } catch (err) {
        console.error("Failed to parse stored folder:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && images.length > 0) {
      const scrollY = sessionStorage.getItem("scrollY");
      if (scrollY) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(scrollY),
            behavior: "instant",
          });

          setTimeout(() => {
            const currentScroll = window.scrollY;
            const targetScroll = parseInt(scrollY);

            if (Math.abs(currentScroll - targetScroll) > 50) {
              window.scrollTo({
                top: targetScroll,
                behavior: "instant",
              });
            }

            sessionStorage.removeItem("scrollY");
          }, 300);
        });
      }
    }
  }, [isLoading, images]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage().catch((err) => {
            console.error("Error fetching next page:", err);
          });
        }
      },
      { rootMargin: "200px" }
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return <p className="text-center text-red-600">Error: {error.message}</p>;
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading images...</p>;
  }

  return (
    <>
      <div className="hidden bg-neutral-900 text-white border border-neutral-700 rounded-md mt-1" />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Select
          unstyled
          classNames={{
            control: () =>
              "bg-neutral-900 text-white border border-neutral-700 rounded-md p-2.5",
            menu: () => "bg-neutral-900 border border-neutral-700 mt-1",
            option: ({ isFocused }) =>
              isFocused
                ? "bg-neutral-700 text-white"
                : "bg-neutral-900 text-white",
          }}
          options={folderOptions}
          value={selectedFolder}
          onChange={(opt) => setSelectedFolder(opt as FolderOption)}
          isClearable
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="Press to Filter by Year or Group"
        />
      </div>

      <Gallery className="mx-auto max-w-6xl px-4 py-6">
        <GalleryItem className="bg-accent" isFeatured>
          <div className="flex flex-col gap-6 justify-center text-center h-full">
            <h2>Sarnia Bluewater Wrestling Club</h2>
            <p>50 Years of Our Story, 100+ Years of Wrestling Pride.</p>
            <a style={{ textDecoration: "none" }} href={`${main_site}/about`}>
              <Button>Learn More</Button>
            </a>
          </div>
        </GalleryItem>

        {images.length === 0 ? (
          <p className="w-full text-center text-gray-500 py-20">
            No images found in this folder.
          </p>
        ) : (
          images.map((image, idx) => (
            <GalleryItem
              key={idx}
              src={image.cdn_url}
              onClick={() => navigatePicture(image.id, image.cdn_url)}
              className="cursor-zoom-in"
            />
          ))
        )}

        <div ref={loadMoreRef} className="w-full h-px" />

        {isFetchingNextPage && hasNextPage && (
          <p className="text-center text-gray-500 mt-4">Loading more...</p>
        )}
      </Gallery>
    </>
  );
}
