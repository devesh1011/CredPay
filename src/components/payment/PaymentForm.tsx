"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";
import { parseEther } from "viem";
import { useConvex } from "convex/react";
import { toast } from "sonner";
import { PaperPlaneTilt, CircleNotch, Warning } from "@phosphor-icons/react";
import {
  DEFAULT_PAYMENT_AMOUNTS,
  TX_STATUS,
  DEFAULT_NETWORK,
} from "@/lib/creditcoin/config";
import { isValidCreditcoinAddress, cn } from "@/lib/utils";
import { PaymentSuccess } from "./PaymentSuccess";

interface PaymentFormProps {
  recipientAddress?: string;
  recipientName?: string;
  defaultAmount?: string;
  showRecipientInput?: boolean;
}

export function PaymentForm({
  recipientAddress = "",
  recipientName,
  defaultAmount,
  showRecipientInput = true,
}: PaymentFormProps) {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const [recipient, setRecipient] = useState(recipientAddress);
  const [amount, setAmount] = useState(defaultAmount || "0.1");
  const [customAmount, setCustomAmount] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (recipientAddress) {
      setRecipient(recipientAddress);
    }
  }, [recipientAddress]);

  useEffect(() => {
    if (isSuccess && hash) {
      setShowSuccessModal(true);

      setTimeout(() => {
        setCustomAmount("");
      }, 5000);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error) {
      // We can ignore the "data" field error for now, as the transaction succeeds.
      if (!error.message.includes("cannot include data")) {
        toast.error("Transaction failed. Please try again.");
      }
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mounted || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!isValidCreditcoinAddress(recipient)) {
      toast.error("Please enter a valid Creditcoin  address");
      return;
    }

    const paymentAmount = customAmount || amount;
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (chain?.id !== DEFAULT_NETWORK.chainId) {
      try {
        await switchChain({ chainId: DEFAULT_NETWORK.chainId });
        toast.info(`Switched to ${DEFAULT_NETWORK.chainName}`);
        setTimeout(() => handleSend(), 500);
      } catch {
        toast.error(
          `Please switch to ${DEFAULT_NETWORK.chainName} to send payments`
        );
      }
      return;
    }

    await handleSend();
  };

  const handleSend = async () => {
    const paymentAmount = customAmount || amount;
    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(paymentAmount),
      data: undefined, // Explicitly set data to undefined
    });
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Send Payment
          </h2>
          {recipientName && (
            <p className="text-muted-foreground">
              to{" "}
              <span className="text-foreground font-medium">
                {recipientName}
              </span>
            </p>
          )}
        </div>

        {/* Recipient Input */}
        {showRecipientInput && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
        )}

        {/* Amount Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Amount (CTC)
          </label>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-2">
            {DEFAULT_PAYMENT_AMOUNTS.slice(0, 6).map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  setAmount(preset.value);
                  setCustomAmount("");
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border transition-colors",
                  amount === preset.value && !customAmount
                    ? "bg-primary/10 border-primary"
                    : "bg-card hover:bg-muted"
                )}
              >
                <span className="text-lg font-semibold">{preset.value}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <input
            type="number"
            step="any"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount("");
            }}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !mounted || !address}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <CircleNotch className="animate-spin" size={20} />
              {isConfirming ? "Confirming..." : "Sending..."}
            </>
          ) : (
            <>
              <PaperPlaneTilt size={20} />
              Send
            </>
          )}
        </button>

        {/* Wallet Status */}
        {!address && mounted && (
          <div className="text-center text-sm text-yellow-500 flex items-center justify-center gap-2">
            <Warning size={16} />
            Please connect your wallet to send a payment.
          </div>
        )}
      </form>

      {/* Success Modal */}
      {showSuccessModal && hash && (
        <PaymentSuccess
          hash={hash}
          amount={customAmount || amount}
          recipient={recipient}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
