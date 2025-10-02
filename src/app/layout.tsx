import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CredPay - Instant Payments on Creditcoin Network",
  description:
    "Send and receive instant payments on Creditcoin Network. Fast, secure, and easy to use payment platform.",
  keywords: "sei, payments, blockchain, crypto, web3, CredPay",
  authors: [{ name: "CredPay" }],
  openGraph: {
    title: "CredPay - Instant Payments on Creditcoin Network",
    description: "Send and receive instant payments on Creditcoin Network",
    type: "website",
    locale: "en_US",
    siteName: "CredPay",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredPay - Instant Payments on Creditcoin Network",
    description: "Send and receive instant payments on Creditcoin Network",
  },
  icons: {
    icon: "/credpay.png",
    shortcut: "/credpay.png",
    apple: "/credpay.png",
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
