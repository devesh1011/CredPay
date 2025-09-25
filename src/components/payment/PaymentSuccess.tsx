"use client";

import { useEffect } from "react";
import { LottieAnimation } from "@/components/animations/LottieAnimation";
import { X, CheckCircle } from "@phosphor-icons/react";
import { formatAddress, formatCreditcoin } from "@/lib/utils";
import { getExplorerUrl } from "@/lib/creditcoin/config";
import TigerAnimation from "../../../public/Tiger.json";

interface PaymentSuccessProps {
  onClose: () => void;
  amount: string;
  recipient: string;
  recipientName?: string;
  hash: string;
}

export function PaymentSuccess({
  onClose,
  amount,
  recipient,
  recipientName,
  hash,
}: PaymentSuccessProps) {
  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X weight="regular" size={20} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Success Animation */}
          <div className="w-32 h-32 mx-auto">
            <LottieAnimation
              animationData={TigerAnimation}
              loop={false}
              autoplay
            />
          </div>

          {/* Success Icon & Title */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle weight="fill" size={32} className="text-success" />
            </div>
            <h3 className="text-2xl font-bold">Payment Sent!</h3>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">
                {formatCreditcoin(amount)} CTC
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">
                {recipientName || formatAddress(recipient)}
              </span>
            </div>
            {hash && (
              <div className="pt-2">
                <a
                  href={getExplorerUrl(hash, "tx")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors underline"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
