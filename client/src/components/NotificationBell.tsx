/**
 * NotificationBell - جرس الإشعارات مع polling كل 15 ثانية
 * يعرض عدد الإشعارات غير المقروءة وقائمة منسدلة
 */
import { useState, useRef } from "react";
import { Bell, Check, CheckCheck, X, MapPin, Star, Car, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

const notifIcons: Record<string, React.ReactNode> = {
  booking_confirmed: <Calendar className="w-4 h-4 text-sky-500" />,
  ride_started: <Car className="w-4 h-4 text-green-500" />,
  ride_completed: <Star className="w-4 h-4 text-amber-500" />,
  new_booking: <MapPin className="w-4 h-4 text-violet-500" />,
  booking_cancelled: <X className="w-4 h-4 text-red-500" />,
  system: <Bell className="w-4 h-4 text-gray-500" />,
};

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const dropRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();

  // Poll every 15 seconds for new notifications
  const unreadCount = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 15_000,
  });

  const notifications = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated && open,
  });

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
      toast.success("تم تحديد الكل كمقروء");
    },
  });

  if (!isAuthenticated) return null;

  const count = unreadCount.data ?? 0;

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5 text-foreground/70" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-sm text-gray-800">الإشعارات</span>
                  {count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                      {count} جديد
                    </span>
                  )}
                </div>
                {count > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    تحديد الكل
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.isLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                    جاري التحميل...
                  </div>
                ) : !notifications.data || notifications.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">لا توجد إشعارات</p>
                  </div>
                ) : (
                  notifications.data.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                        !notif.isRead ? "bg-sky-50/60 hover:bg-sky-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (!notif.isRead) markRead.mutate({ notificationId: notif.id });
                      }}
                    >
                      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        {notifIcons[notif.type] ?? notifIcons.system}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold leading-tight ${!notif.isRead ? "text-gray-900" : "text-gray-600"}`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.data && notifications.data.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                  <span className="text-xs text-gray-400">يتم التحديث كل 15 ثانية</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
