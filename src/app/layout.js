import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IQ Challenge – Test Your Intelligence Instantly",
  description:
    "Take a 30-question IQ test that challenges your logic, reasoning, and pattern recognition. Get your score instantly and share your results with friends!",
  keywords: [
    "IQ test",
    "online IQ quiz",
    "intelligence test",
    "pattern recognition",
    "logic puzzles",
    "IQ score",
    "brain test",
    "smartness test",
    "IQ calculator",
    "mental ability test"
  ],
  authors: [{ name: "IQ Challenge" }],
  creator: "IQ Challenge",
  publisher: "IQ Challenge",
  openGraph: {
    title: "IQ Challenge – Test Your Intelligence Instantly",
    description:
      "Discover your IQ level in minutes with 30 unique questions testing logic, reasoning, and creativity.",
    url: "https://your-domain.com",
    siteName: "IQ Challenge",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IQ Challenge – Online IQ Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQ Challenge – Online IQ Test",
    description:
      "Find out how smart you really are! Take a 30-question IQ test and get your score instantly.",
    creator: "@your_twitter_handle",
    images: ["https://your-domain.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://your-domain.com"),
  themeColor: "#111827",
  manifest: "/site.webmanifest",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
