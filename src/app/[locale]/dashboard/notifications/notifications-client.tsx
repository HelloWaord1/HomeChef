"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions/notifications";
import { Bell, CalendarDays, MessageCircle, Star, CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  linkUrl: string | null;
  createdAt: string;
}

const typeIcons: Record<string, typeof Bell> = {
  BOOKING_NEW: CalendarDays,
  BOOKING_CONFIRMED: CalendarDays,
  BOOKING_CANCELLED: CalendarDays,
  MESSAGE_NEW: MessageCircle,
  REVIEW_NEW: Star,
};

const typeColors: Record<string, string> = {
  BOOKING_NEW: "bg-blue-100 text-blue-600",
  BOOKING_CONFIRMED: "bg-emerald-100 text-emerald-600",
  BOOKING_CANCELLED: "bg-red-100 text-red-600",
  MESSAGE_NEW: "bg-warm-100 text-warm-700",
  REVIEW_NEW: "bg-amber-100 text-amber-600",
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationsClient({ notifications: initial }: { notifications: Notification[] }) {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [notifications, setNotifications] = useState(initial);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl as "/dashboard");
    }
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {unreadCount > 0
              ? t("unreadCount", { count: unreadCount })
              : t("allRead")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-stone-700 mb-2">{t("noNotifications")}</h3>
          <p className="text-sm text-stone-500">{t("noNotificationsHint")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            const colorClass = typeColors[notification.type] || "bg-stone-100 text-stone-600";

            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-sm ${
                  notification.read
                    ? "bg-white border-stone-100"
                    : "bg-warm-50/50 border-warm-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold truncate ${
                        notification.read ? "text-stone-700" : "text-stone-900"
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-stone-400 flex-shrink-0">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm mt-0.5 line-clamp-2 ${
                      notification.read ? "text-stone-400" : "text-stone-600"
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-warm-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
