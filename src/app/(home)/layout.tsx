import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { main_site } from "@/constants";
import Link from "next/link";
import StandardLayout from "@/components/StandardLayout";

config.autoAddCss = false;

interface LayoutProps {
  children?: React.ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  return <StandardLayout>{children}</StandardLayout>;
}
