"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

type Conversation = {
  partner: {
    id: string;
    name: string | null;
    avatar: string | null;
    role: string;
  } | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    read: boolean;
  } | null;
  unreadCount: number;
};

export function MessagesClient({
  conversations,
  currentUserId,
}: {
  conversations: Conversation[];
  currentUserId: string;
}) {
  const t = useTranslations("messagesPage");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <MessageCircle className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400">{t("noConversations")}</p>
          <p className="text-xs text-stone-300 mt-1">
            {t("noConversationsHint")}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50">
          {conversations.map((conv) => (
            <Link
              key={conv.partner?.id}
              href={`/dashboard/messages/${conv.partner?.id}`}
              className="w-full flex items-center gap-3 p-4 hover:bg-stone-50/50 transition-colors text-left block"
            >
              {conv.partner?.avatar ? (
                <img
                  src={conv.partner.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-500 flex-shrink-0">
                  {conv.partner?.name?.[0] || "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900 text-sm truncate">
                      {conv.partner?.name}
                    </p>
                    {conv.partner?.role === "COOK" && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1 py-0 bg-warm-50 text-warm-700"
                      >
                        {t("cookBadge")}
                      </Badge>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <span className="text-[10px] text-stone-400 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-stone-400 truncate">
                    {conv.lastMessage?.senderId === currentUserId && (
                      <span className="text-stone-300">{t("you")} </span>
                    )}
                    {conv.lastMessage?.content || t("noMessages")}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-warm-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-2">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
