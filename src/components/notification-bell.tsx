"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Bell, CalendarDays, MessageCircle, Star, ShoppingBag, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.count || 0);
      }
    } catch {
      // ignore
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
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  function handleClick(notification: Notification) {
    if (!notification.read) {
      handleMarkRead(notification.id);
    }
    setOpen(false);
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

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-warm-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-stone-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-900 text-sm">{t("title")}</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-warm-600 hover:text-warm-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                {t("markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p className="text-sm text-stone-400">{t("noNotifications")}</p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleClick(notification)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 ${
                      !notification.read ? "bg-warm-50/40" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 text-stone-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-medium truncate ${!notification.read ? "text-stone-900" : "text-stone-600"}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-warm-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">{notification.message}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 flex-shrink-0">{timeAgo(notification.createdAt)}</span>
                  </button>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-stone-100 px-4 py-2.5">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/notifications" as "/dashboard");
                }}
                className="text-xs text-warm-600 hover:text-warm-700 font-medium w-full text-center"
              >
                {t("viewAll")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
