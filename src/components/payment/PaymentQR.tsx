"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { Share2, Download, Copy, CheckCircleIcon, QrCode } from "lucide-react";
import { toast } from "sonner";
import { generatePaymentUrl, copyToClipboard } from "@/lib/utils";
import { api } from "@/../convex/_generated/api";
import { useConvex, useQuery } from "convex/react";

interface PaymentQRProps {
  address: string;
  username?: string | null;
  recipientName?: string;
  amount?: string;
}

export function PaymentQR({
  address,
  recipientName = "User",
  amount,
}: PaymentQRProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const username = useQuery(
    api.users.getUsernameByAddress,
    address ? { address } : "skip"
  );

  const paymentUrl = generatePaymentUrl(username || address, amount);
  const addressPaymentUrl = generatePaymentUrl(address, amount);
  const usernamePaymentUrl = username
    ? generatePaymentUrl(username, amount)
    : null;

  const handleCopy = async (
    urlToCopy: string,
    type: "address" | "username"
  ) => {
    const success = await copyToClipboard(urlToCopy);
    if (success) {
      if (type === "address") {
        setCopiedAddress(true);
        toast.success("Address link copied!");
        setTimeout(() => setCopiedAddress(false), 2000);
      } else {
        setCopiedUsername(true);
        toast.success("Username link copied!");
        setTimeout(() => setCopiedUsername(false), 2000);
      }
    } else {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) {
      toast.error("QR code element not found.");
      return;
    }

    const svg = qrCodeRef.current.querySelector("svg");
    if (!svg) {
      toast.error("Could not find QR code SVG.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Could not create canvas context.");
      return;
    }

    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const link = document.createElement("a");
      link.download = `CredPay-qr-${address.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("QR code downloaded!");
    };

    img.onerror = () => {
      toast.error("Failed to download QR code");
    };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pay ${recipientName} on Creditcoin`,
          text: `Send payments to ${recipientName} using CredPay`,
          url: paymentUrl,
        });
      } catch (error) {
        // User cancelled or error
        if ((error as Error).name !== "AbortError") {
          handleCopy(paymentUrl, username ? "username" : "address");
        }
      }
    } else {
      handleCopy(paymentUrl, username ? "username" : "address");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* QR Code Card */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Payment QR</h3>
          </div>
          {amount && (
            <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary font-medium">
              {amount} tCTC
            </span>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg">
          <div ref={qrCodeRef} style={{ lineHeight: 0 }}>
            <QRCode
              value={paymentUrl}
              size={200}
              level="H"
              fgColor="#09090b"
              bgColor="#FFFFFF"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>
        </div>
      </div>

      {/* Payment URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Payment Link (Address)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={addressPaymentUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleCopy(addressPaymentUrl, "address")}
            className="p-2 rounded-lg bg-card border border-border hover:border-primary transition-colors"
            title="Copy link"
          >
            {copiedAddress ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Username Payment URL */}
      {usernamePaymentUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Payment Link (Username)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={usernamePaymentUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => handleCopy(usernamePaymentUrl, "username")}
              className="p-2 rounded-lg bg-card border border-border hover:border-primary transition-colors"
              title="Copy username link"
            >
              {copiedUsername ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-primary" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        <button
          onClick={handleDownloadQR}
          className="flex-1 py-2.5 px-4 rounded-lg bg-card border border-border hover:border-primary transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-center text-muted-foreground">
        Share this QR code to receive instant payments on Creditcoin Network
      </p>
    </div>
  );
}
