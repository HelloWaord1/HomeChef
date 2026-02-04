"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, CalendarDays, MessageCircle, Star, ShoppingBag, Loader2 } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: string) {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClick(notification: Notification) {
    if (!notification.read) {
      handleMarkRead(notification.id);
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl as "/dashboard");
    }
  }

  function getIcon(type: string) {
    if (type.startsWith("BOOKING")) return CalendarDays;
    if (type === "MESSAGE_NEW") return MessageCircle;
    if (type === "REVIEW_NEW") return Star;
    return ShoppingBag;
  }

  function getIconColor(type: string) {
    if (type === "BOOKING_NEW") return "text-blue-500 bg-blue-50";
    if (type === "BOOKING_CONFIRMED") return "text-emerald-500 bg-emerald-50";
    if (type === "BOOKING_CANCELLED") return "text-red-500 bg-red-50";
    if (type === "MESSAGE_NEW") return "text-purple-500 bg-purple-50";
    if (type === "REVIEW_NEW") return "text-amber-500 bg-amber-50";
    return "text-stone-500 bg-stone-50";
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("justNow");
    if (mins < 60) return t("minutesAgo", { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("hoursAgo", { count: hours });
    const days = Math.floor(hours / 24);
    return t("daysAgo", { count: days });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-warm-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
          <p className="text-stone-500 text-sm">
            {unreadCount > 0 ? t("unreadCount", { count: unreadCount }) : t("allRead")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-stone-600"
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <Bell className="w-12 h-12 mx-auto mb-4 text-stone-300" />
          <h3 className="text-lg font-semibold text-stone-700 mb-1">{t("noNotifications")}</h3>
          <p className="text-sm text-stone-500">{t("noNotificationsHint")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden divide-y divide-stone-100">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const iconColorClass = getIconColor(notification.type);
            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-stone-50 transition-colors ${
                  !notification.read ? "bg-warm-50/30" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${!notification.read ? "text-stone-900" : "text-stone-600"}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-warm-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-stone-500 mt-0.5">{notification.message}</p>
                  <p className="text-xs text-stone-400 mt-1">{timeAgo(notification.createdAt)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
