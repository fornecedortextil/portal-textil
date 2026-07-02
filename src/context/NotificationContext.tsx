import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef,
} from "react";
import type { AuthUser, UserAd } from "./AuthContext";

export interface EmailNotification {
  id: string;
  adId: string;
  adTitle: string;
  adCategory: string;
  expiresAt: string;
  sentAt: string;
  daysLeft: number;
  type: "expiring_soon" | "expired";
  read: boolean;
}

interface NotificationContextType {
  notifications: EmailNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  latestToast: EmailNotification | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const NOTIF_KEY = (userId: string) => `ft_notif_${userId}`;

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function buildDemoNotifications(ads: UserAd[]): EmailNotification[] {
  const demo: EmailNotification[] = [];
  ads.forEach((ad) => {
    const left = daysUntil(ad.expiresAt);
    if (left <= 7 && left > 0 && ad.status === "active") {
      demo.push({
        id: `demo_7d_${ad.id}`,
        adId: ad.id,
        adTitle: ad.title,
        adCategory: ad.category,
        expiresAt: ad.expiresAt,
        sentAt: daysAgo(1),
        daysLeft: left + 1,
        type: "expiring_soon",
        read: false,
      });
    }
    if (ad.status === "expired") {
      demo.push({
        id: `demo_exp_${ad.id}`,
        adId: ad.id,
        adTitle: ad.title,
        adCategory: ad.category,
        expiresAt: ad.expiresAt,
        sentAt: daysAgo(2),
        daysLeft: 0,
        type: "expired",
        read: false,
      });
    }
  });
  return demo;
}

function loadNotifications(userId: string): EmailNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY(userId));
    if (raw) return JSON.parse(raw);
  } catch { /* */ }
  return [];
}

function saveNotifications(userId: string, notifs: EmailNotification[]) {
  localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(notifs));
}

function wasAlreadyNotified(notifs: EmailNotification[], adId: string, type: string): boolean {
  const cutoff = Date.now() - 86400000 * 6;
  return notifs.some(
    (n) => n.adId === adId && n.type === type && new Date(n.sentAt).getTime() > cutoff,
  );
}

export function NotificationProvider({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [latestToast, setLatestToast] = useState<EmailNotification | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLatestToast(null);
      initialized.current = false;
      return;
    }

    let existing = loadNotifications(user.id);

    if (existing.length === 0 && !initialized.current) {
      const demo = buildDemoNotifications(user.ads);
      existing = demo;
      saveNotifications(user.id, existing);
    }

    const newOnes: EmailNotification[] = [];

    user.ads.forEach((ad) => {
      const left = daysUntil(ad.expiresAt);

      if (left <= 7 && left > 0 && ad.status === "active") {
        if (!wasAlreadyNotified(existing, ad.id, "expiring_soon")) {
          const n: EmailNotification = {
            id: `notif_7d_${ad.id}_${Date.now()}`,
            adId: ad.id,
            adTitle: ad.title,
            adCategory: ad.category,
            expiresAt: ad.expiresAt,
            sentAt: new Date().toISOString(),
            daysLeft: left,
            type: "expiring_soon",
            read: false,
          };
          newOnes.push(n);
        }
      }

      if (ad.status === "expired" && left <= 0) {
        if (!wasAlreadyNotified(existing, ad.id, "expired")) {
          const n: EmailNotification = {
            id: `notif_exp_${ad.id}_${Date.now()}`,
            adId: ad.id,
            adTitle: ad.title,
            adCategory: ad.category,
            expiresAt: ad.expiresAt,
            sentAt: new Date().toISOString(),
            daysLeft: 0,
            type: "expired",
            read: false,
          };
          newOnes.push(n);
        }
      }
    });

    const merged = [...newOnes, ...existing];
    if (newOnes.length > 0) saveNotifications(user.id, merged);

    setNotifications(merged);

    if (newOnes.length > 0 && !initialized.current) {
      setLatestToast(newOnes[0]);
    }

    initialized.current = true;
  }, [user]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, read: true } : n);
      if (user) saveNotifications(user.id, updated);
      return updated;
    });
  }, [user]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (user) saveNotifications(user.id, updated);
      return updated;
    });
  }, [user]);

  const dismissToast = useCallback(() => setLatestToast(null), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, latestToast, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
