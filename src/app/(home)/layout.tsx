import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { main_site } from "@/constants";

interface LayoutProps {
    children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <header className="p-6">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className={"flex items-center"}>
                        <a
                            href={main_site}
                            className="flex items-center hover:text-primary"
                        >
                            Sarnia Wrestling Club
                        </a>
                    </div>
                    <div className={"flex flex-col sm:flex-row"}>
                        <ul className="flex gap-4">
                            <li>
                                <a
                                    href="https://www.facebook.com/groups/95004813674"
                                    className={"hover:text-primary"}
                                >
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/sarniabluewaterwc/"
                                    className={"hover:text-primary"}
                                >
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <nav>
                    <div className="max-w-screen-xl flex items-center justify-center mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row">
                            <ul className="flex gap-4">
                                <li className="hover:text-primary">
                                    <a href={main_site}>Home</a>
                                </li>
                                <li className="hover:text-primary">
                                    <a href={`${main_site}/about`}>About</a>
                                </li>
                                <li className="hover:text-primary">
                                    <a href={`${main_site}/contact`}>Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </>
    )}