"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { X, FloppyDisk, CircleNotch } from "@phosphor-icons/react";
import { AccessLevel } from "@/lib/wallet/custodial";
import { cn } from "@/lib/utils";

interface AIAccessSettingsModalProps {
  wallet: any;
  onClose: () => void;
}

export function AIAccessSettingsModal({
  wallet,
  onClose,
}: AIAccessSettingsModalProps) {
  const [enabled, setEnabled] = useState(wallet.aiAccess.enabled);
  const [level, setLevel] = useState(wallet.aiAccess.level);
  const [dailyLimit, setDailyLimit] = useState(
    wallet.aiAccess.dailyLimit || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateAIAccess = useMutation(api.wallets.updateAIAccess);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateAIAccess({
        userId: wallet.userId.toLowerCase(),
        walletId: wallet.walletId,
        enabled,
        level,
        dailyLimit: level === AccessLevel.SEND_LIMITED ? dailyLimit : undefined,
      });
      toast.success("AI access settings updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  }, [wallet, enabled, level, dailyLimit, updateAIAccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">AI Agent Access Settings</h3>
            <p className="text-sm text-gray-600">
              {wallet.fullWalletName || wallet.label || "Custodial Wallet"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <label htmlFor="ai-enabled" className="font-medium">
              Enable AI Agent Access
            </label>
            <button
              id="ai-enabled"
              onClick={() => setEnabled(!enabled)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                enabled ? "bg-[#333]" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {enabled && (
            <div className="space-y-4">
              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Access Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AccessLevel)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value={AccessLevel.NONE}>None (Disabled)</option>
                  <option value={AccessLevel.VIEW_ONLY}>View Only</option>
                  <option value={AccessLevel.SEND_LIMITED}>Send Limited</option>
                </select>
              </div>

              {/* Daily Limit */}
              {level === AccessLevel.SEND_LIMITED && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Daily Spending Limit (tCTC)
                  </label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    placeholder="e.g., 100"
                    className="w-full p-2 border rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max amount the AI can spend in a 24-hour period.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-[#444] disabled:bg-gray-300 flex items-center gap-2"
          >
            {isSaving ? (
              <CircleNotch className="animate-spin" size={18} />
            ) : (
              <FloppyDisk size={18} />
            )}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
