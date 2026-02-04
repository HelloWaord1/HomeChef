"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  ArrowLeft,
  ChefHat,
} from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  sender: { id: string; name: string | null; avatar: string | null };
};

type Partner = {
  id: string;
  name: string | null;
  avatar: string | null;
  role: string;
};

export function ChatClient({
  partner,
  initialMessages,
  currentUserId,
}: {
  partner: Partner;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const t = useTranslations("messagesPage");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageTime = useRef<string>(
    initialMessages.length > 0
      ? initialMessages[initialMessages.length - 1].createdAt
      : new Date(0).toISOString()
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/messages?partnerId=${partner.id}&after=${encodeURIComponent(lastMessageTime.current)}`
        );
        if (!res.ok) return;
        const newMessages: Message[] = await res.json();
        if (newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const unique = newMessages.filter((m) => !existingIds.has(m.id));
            if (unique.length === 0) return prev;
            return [...prev, ...unique];
          });
          lastMessageTime.current =
            newMessages[newMessages.length - 1].createdAt;
        }
      } catch {
        // Silently ignore polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [partner.id]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;

    const content = text.trim();
    setText("");
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: partner.id,
          content,
        }),
      });

      if (!res.ok) {
        setText(content);
        return;
      }

      const newMessage: Message = await res.json();
      newMessage.createdAt =
        typeof newMessage.createdAt === "string"
          ? newMessage.createdAt
          : new Date(newMessage.createdAt).toISOString();

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        if (existingIds.has(newMessage.id)) return prev;
        return [...prev, newMessage];
      });
      lastMessageTime.current = newMessage.createdAt;
    } catch {
      setText(content);
    } finally {
      setSending(false);
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const d = new Date(msg.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (d !== currentDate) {
      currentDate = d;
      groupedMessages.push({ date: d, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/messages"
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("backToConversations")}
      </Link>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col h-[calc(100vh-14rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-stone-100">
          {partner.avatar ? (
            <img
              src={partner.avatar}
              alt=""
              className="w-9 h-9 rounded-xl object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500">
              {partner.name?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-stone-900 text-sm">{partner.name}</p>
            <div className="flex items-center gap-1">
              {partner.role === "COOK" && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1 py-0 bg-warm-50 text-warm-700"
                >
                  {t("cookBadge")}
                </Badge>
              )}
              <p className="text-xs text-stone-400 capitalize">
                {partner.role === "COOK" ? "" : partner.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-1">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-10 h-10 text-stone-200 mx-auto mb-2" />
              <p className="text-sm text-stone-400">
                {t("startConversation", {
                  name: partner.name?.split(" ")[0] || "",
                })}
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                <div className="flex items-center justify-center my-4">
                  <span className="text-[10px] text-stone-400 bg-stone-50 px-3 py-1 rounded-full">
                    {group.date}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                            isMine
                              ? "bg-warm-700 text-white rounded-br-md"
                              : "bg-stone-100 text-stone-800 rounded-bl-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              isMine ? "text-warm-200" : "text-stone-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 px-4 py-3 border-t border-stone-100"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("typeMessage")}
            className="border-stone-200 rounded-full"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !text.trim()}
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
