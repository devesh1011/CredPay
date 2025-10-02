"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { PaymentQR } from "@/components/payment/PaymentQR";
import { WorldMapAnimation } from "@/components/animations/WorldMapAnimation";
import {
  ArrowRightIcon,
  GlobeIcon,
  QrCodeIcon,
  PaperPlaneTiltIcon,
  CheckCircleIcon,
  WalletIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure & Reliable",
      description: "Built on Creditcoin Network's battle-tested infrastructure",
    },
    {
      icon: GlobeIcon,
      title: "Global Payments",
      description: "Send money anywhere in the world, 24/7",
    },
    {
      icon: WalletIcon,
      title: "Multi-Wallet Support",
      description: "Works with MetaMask, Coinbase, and more",
    },
  ];

  const benefits = [
    { icon: CheckCircleIcon, text: "No international transfer fees" },
    { icon: CheckCircleIcon, text: "24/7 availability, even on holidays" },
    { icon: CheckCircleIcon, text: "Transparent blockchain verification" },
    { icon: CheckCircleIcon, text: "Instant settlement, no waiting" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white">
        {/* Hero Section with Payment Form */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

          <div className="container-fluid relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-sm font-medium text-orange-900">
                      Live on Creditcoin Network
                    </span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                    Send Money
                    <span className="block gradient-text">Instantly</span>
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-xl">
                    The fastest way to send and receive payments on Creditcoin
                    Network. No banks, no delays, just instant transfers.
                  </p>
                </div>

                {/* World Map Animation */}
                <div className="my-8">
                  <WorldMapAnimation />
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <ClockIcon
                      weight="duotone"
                      size={24}
                      className="text-primary"
                    />
                    <span className="font-medium">&lt; 1 sec transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon
                      weight="duotone"
                      size={24}
                      className="text-primary"
                    />
                    <span className="font-medium">Bank-grade security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GlobeIcon
                      weight="duotone"
                      size={24}
                      className="text-primary"
                    />
                    <span className="font-medium">Global reach</span>
                  </div>
                </div>
              </div>

              {/* Right Payment Card */}
              <div className="lg:pl-8">
                <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
                  {/* Tab Selector */}
                  <div className="flex border-b border-border">
                    <button
                      onClick={() => setActiveTab("send")}
                      className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === "send"
                          ? "bg-orange-50 text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <PaperPlaneTiltIcon weight="regular" size={20} />
                      Send Payment
                    </button>
                    <button
                      onClick={() => setActiveTab("receive")}
                      className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === "receive"
                          ? "bg-orange-50 text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <QrCodeIcon weight="regular" size={20} />
                      Receive Payment
                    </button>
                  </div>

                  {/* Tab Content - Fixed minimum height based on send form */}
                  <div className="p-6 min-h-[660px] flex flex-col">
                    {activeTab === "send" ? (
                      <PaymentForm showRecipientInput />
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        {address ? (
                          <PaymentQR
                            address={address}
                            recipientName="Your Wallet"
                          />
                        ) : (
                          <div className="text-center space-y-6">
                            <WalletIcon
                              weight="light"
                              size={64}
                              className="mx-auto text-muted-foreground"
                            />
                            <div>
                              <p className="text-lg font-medium text-foreground mb-2">
                                Connect Wallet to Receive
                              </p>
                              <p className="text-muted-foreground">
                                Connect your wallet to generate a payment QR
                                code
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                Your address will be displayed here for others
                                to send you payments
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container-fluid">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl font-bold">
                Why businesses choose CredPay
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of merchants accepting instant payments with zero
                fees
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 rounded-xl bg-white border border-border hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                      <Icon weight="bold" size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="container-fluid">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  The future of payments is here
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Say goodbye to wire transfers, ACH delays, and international
                  fees. With CredPay, your money moves at the speed of the
                  internet.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <li key={index} className="flex items-center gap-3">
                        <Icon
                          weight="fill"
                          size={24}
                          className="text-success flex-shrink-0"
                        />
                        <span className="text-lg">{benefit.text}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/send"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Start Sending Now
                    <ArrowRightIcon weight="bold" size={20} />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-border">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Traditional Bank Transfer
                      </span>
                      <span className="font-semibold text-red-600">
                        3-5 days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Wire Transfer
                      </span>
                      <span className="font-semibold text-orange-600">
                        1-2 days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Credit Card</span>
                      <span className="font-semibold text-yellow-600">
                        Instant + 3% fee
                      </span>
                    </div>
                    <div className="border-t-2 border-primary pt-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">
                          CredPay
                        </span>
                        <span className="font-bold text-success">
                          &lt; 1 second, 0% fee
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gray-50 text-center">
          <div className="container-fluid">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text">
                  Start accepting payments today
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of developers and businesses using CredPay to
                power their payments.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started for Free
                <ArrowRightIcon weight="bold" size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-50 border-t border-border">
          <div className="container-fluid">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/CredPay.png"
                  alt="CredPay"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="font-semibold">CredPay</span>
                <span className="text-muted-foreground">© 2025</span>
              </div>

              <div className="flex gap-8 text-sm">
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/send"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Send
                </Link>
                <Link
                  href="/receive"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Receive
                </Link>
                <a
                  href="https://docs.sei.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Docs
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
