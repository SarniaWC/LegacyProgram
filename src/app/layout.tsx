import { ReactQueryProvider } from "./providers/react-query-provider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legacy | Sarnia Wrestling Club",
  description: "Archive of Sarnia Wrestling Club",
  metadataBase: new URL("https://legacy.sarniawrestling.ca"),
  openGraph: {
    title: "Legacy | Sarnia Wrestling Club",
    description: "Legacy Program of Sarnia Wrestling Club",
    type: "website",
    url: "https://legacy.sarniawrestling.ca",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legacy | Sarnia Wrestling Club",
    description: "Legacy of Sarnia Wrestling Club",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
