import StandardLayout from "@/components/StandardLayout";

export default function NotFound() {
  return (
    <StandardLayout>
      <div className="flex flex-col items-center justify-center m-4">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg">The page you are looking for does not exist.</p>
      </div>
    </StandardLayout>
  );
}
