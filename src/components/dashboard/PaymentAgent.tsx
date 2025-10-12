"use client";

import { useState, useRef, useEffect } from "react";
import {
  PaperPlaneTilt,
  Aperture,
  User,
  MagicWand,
  Copy,
  CheckCircleIcon,
  ArrowsClockwise,
  Pulse,
  Wallet,
  Atom,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentAgentProps {
  address: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_PROMPTS = [
  "Send 0.01 tCTC to 0x...",
  "What is the agent's wallet address?",
  "What is the agent's balance?",
];

const CAPABILITIES = [
  {
    icon: Pulse,
    label: "Autonomous Transactions",
    description: "Send payments on your behalf",
  },
  {
    icon: Wallet,
    label: "Wallet Management",
    description: "Check its own balance and address",
  },
  {
    icon: Atom,
    label: "Complex Tasks",
    description: "Understands natural language",
  },
];

export function PaymentAgent({}: PaymentAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const processMessage = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userMessage,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      const { output } = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: output,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
      console.error("Agent error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred.");
      } else {
        toast.error("An unknown error occurred.");
      }
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    processMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Directly call the logic from handleSubmit to avoid unsafe 'any' cast
      if (!input.trim() || isProcessing) return;
      processMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Aperture weight="duotone" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Payment Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Powered by LangChain & Google Gemini
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#333] border border-[#444]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-medium text-white">Online</span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-3 gap-3">
          {CAPABILITIES.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                <Icon
                  weight="duotone"
                  size={20}
                  className="text-primary mb-1"
                />
                <div className="text-xs font-medium">{capability.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {capability.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            <p>Ask me to send a payment!</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                message.role === "user"
                  ? "bg-[#333] text-white order-2"
                  : "bg-orange-100 text-primary order-1"
              )}
            >
              {message.role === "user" ? (
                <User weight="bold" size={16} />
              ) : (
                <MagicWand weight="fill" size={16} />
              )}
            </div>

            <div
              className={cn(
                "flex-1 space-y-2 max-w-[80%]",
                message.role === "user" ? "order-1" : "order-2"
              )}
            >
              <div
                className={cn(
                  "rounded-xl px-4 py-3 relative group w-fit",
                  message.role === "user"
                    ? "bg-[#333] text-white ml-auto"
                    : "bg-gray-100 text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                {message.role !== "user" && (
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-lg shadow-md border border-border"
                  >
                    {copiedId === message.id ? (
                      <CheckCircleIcon
                        weight="fill"
                        size={14}
                        className="text-success"
                      />
                    ) : (
                      <Copy
                        weight="regular"
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-primary flex items-center justify-center">
              <ArrowsClockwise
                weight="bold"
                size={16}
                className="animate-spin"
              />
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-border">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Send 0.1 tCTC to 0x..."
            className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none resize-none"
            rows={1}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={cn(
              "px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
              input.trim() && !isProcessing
                ? "gradient-primary text-white hover:shadow-lg hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <PaperPlaneTilt weight="bold" size={20} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Example prompts */}
        {messages.length === 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(prompt)}
                  className="px-3 py-1.5 text-xs bg-[#333] border border-[#444] text-white rounded-lg hover:bg-[#444] hover:border-[#555] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
