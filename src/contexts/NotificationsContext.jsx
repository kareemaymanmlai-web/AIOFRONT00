import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const NotificationsContext = createContext(null);
const readStorageKey = "aiofront_read_notifications";

function loadReadIds() {
  try {
    const saved = window.localStorage.getItem(readStorageKey);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function NotificationsProvider({ children }) {
  const [raw, setRaw] = useState([]);
  const [readIds, setReadIds] = useState(() => loadReadIds());

  useEffect(() => {
    let mounted = true;
    api.getNotifications().then((result) => {
      if (mounted) setRaw(result);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(readStorageKey, JSON.stringify([...readIds]));
  }, [readIds]);

  const notifications = useMemo(
    () => raw.map((item) => ({ ...item, unread: item.unread && !readIds.has(item.id) })),
    [raw, readIds]
  );

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((item) => item.unread).length,
    markRead(id) {
      setReadIds((current) => new Set(current).add(id));
    },
    markAllRead() {
      setReadIds((current) => {
        const next = new Set(current);
        raw.forEach((item) => next.add(item.id));
        return next;
      });
    }
  }), [notifications, raw]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useNotifications must be used inside NotificationsProvider");
  return value;
}
