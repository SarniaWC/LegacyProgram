type GalleryProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function Gallery({
  children = null,
  className = "",
  ...props
}: GalleryProps) {
  return (
    <div className={className} {...props}>
      <div className="grid grid-cols-1 auto-rows-auto sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

type GalleryItemProps = {
  src?: string;
  isFeatured?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export function GalleryItem({
  src = "",
  isFeatured = false,
  className = "",
  children,
  onClick,
}: GalleryItemProps) {
  return (
    <>
      {isFeatured ? (
        <div
          className={`block w-full rounded-lg ${className} 
          p-10 min-h-20 sm:row-span-2 sm:col-span-1 sm:h-auto`}
        >
          {children}
        </div>
      ) : (
        <div className={`aspect-[4/3] ${className}`} onClick={onClick}>
          <img
            src={src}
            alt=""
            loading="lazy"
            className="block w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
    </>
  );
}
