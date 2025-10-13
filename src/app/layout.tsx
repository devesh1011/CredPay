import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CredPay - Easy Payments on Creditcoin Network",
  description: "The easy way to send and receive payments on Creditcoin.",
  keywords: "creditcoin, payments, blockchain, crypto, web3, CredPay",
  authors: [{ name: "CredPay" }],
  openGraph: {
    title: "CredPay - Easy Payments on Creditcoin Network",
    description: "The easy way to send and receive payments on Creditcoin.",
    type: "website",
    locale: "en_US",
    siteName: "CredPay",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredPay - Easy Payments on Creditcoin Network",
    description: "The easy way to send and receive payments on Creditcoin.",
  },
  icons: {
    icon: [
      { url: "/credpay.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/credpay.png",
    apple: [{ url: "/credpay.png", sizes: "180x180", type: "image/png" }],
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/credpay.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
