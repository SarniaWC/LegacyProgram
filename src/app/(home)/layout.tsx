import StandardLayout from "@/components/StandardLayout";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  return <StandardLayout>{children}</StandardLayout>;
}
