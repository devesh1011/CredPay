"use client";

import { useState } from "react";
import { ApertureIcon, UserCircleIcon, LockIcon } from "@phosphor-icons/react";
import { PaymentAgent } from "./PaymentAgent";
import { UsernameManager } from "./UsernameManager";
import { CustodialWalletPanel } from "./CustodialWalletPanel";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  address: string;
}

export function DashboardContent({ address }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<
    "agent" | "api" | "profile" | "wallets"
  >("agent");

  const features = [
    {
      id: "profile",
      icon: UserCircleIcon,
      title: "Profile & Username",
      description: "Manage your unique username",
      status: "available",
      badge: "New",
    },
    {
      id: "wallets",
      icon: LockIcon,
      title: "Custodial Wallets",
      description: "AI-controlled secure wallets",
      status: "available",
      badge: "Secure",
    },
    {
      id: "agent",
      icon: ApertureIcon,
      title: "AI Payment Assistant",
      description: "Chat-based payment assistance",
      status: "available",
      badge: "Beta",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Dashboard</h1>
        <p className="text-muted-foreground">
          Advanced payment features powered by AI and smart contracts
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeTab === feature.id;
          const isAvailable = feature.status === "available";

          return (
            <button
              key={feature.id}
              onClick={() => isAvailable && setActiveTab(feature.id as any)}
              disabled={!isAvailable}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all text-left",
                isActive && isAvailable
                  ? "border-primary bg-[#D3DAD9] shadow-lg"
                  : isAvailable
                    ? "border-border bg-white hover:border-primary/50 hover:shadow-md cursor-pointer"
                    : "border-border bg-gray-50 opacity-60 cursor-not-allowed"
              )}
            >
              <div className="absolute top-4 right-4">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full bg-[#333] text-white"
                  )}
                >
                  {feature.badge}
                </span>
              </div>

              <Icon
                weight="duotone"
                size={32}
                className={cn(
                  "mb-4",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />

              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        {activeTab === "profile" && (
          <div className="p-8">
            <UsernameManager />
          </div>
        )}

        {activeTab === "wallets" && (
          <div className="p-8">
            <CustodialWalletPanel />
          </div>
        )}

        {activeTab === "agent" && <PaymentAgent address={address} />}
      </div>
    </div>
  );
}
