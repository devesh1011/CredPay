"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { ArrowLeft, PaperPlaneTilt, User, Wallet } from "@phosphor-icons/react";

interface PayPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default function PayPage({ params }: PayPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || undefined;
  const recipientAddress = resolvedParams.address;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white pt-24 pb-16">
        <div className="container-fluid">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft weight="regular" size={20} />
            <span>Back to Home</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Complete Your Payment
                </h1>
                <p className="text-xl text-muted-foreground">
                  You've been sent a payment link. Review the details below and
                  confirm the transaction to send funds.
                </p>
              </div>

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Wallet
                    weight="duotone"
                    size={24}
                    className="text-primary mt-1"
                  />
                  <div>
                    <h3 className="font-semibold mb-1">Recipient Address</h3>
                    <code className="text-sm text-muted-foreground break-all">
                      {recipientAddress}
                    </code>
                  </div>
                </div>

                {amount && (
                  <div className="flex items-start gap-3">
                    <PaperPlaneTilt
                      weight="duotone"
                      size={24}
                      className="text-primary mt-1"
                    />
                    <div>
                      <h3 className="font-semibold mb-1">Amount</h3>
                      <p className="text-muted-foreground text-sm">
                        {amount} tCTC
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Payment Form */}
            <div className="bg-white rounded-2xl shadow-2xl border border-border p-6">
              <PaymentForm
                recipientAddress={recipientAddress}
                defaultAmount={amount}
                showRecipientInput={false}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
