import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { main_site } from "@/constants";
import StandardLayout from "@/components/StandardLayout";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <StandardLayout>{children}</StandardLayout>
    </>
  );
}
