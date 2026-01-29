'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, Truck, CreditCard, CheckCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  order_id: string;
  link: string;
  read: boolean;
  created_at: string;
}

const typeIcons: Record<string, any> = {
  payment: CreditCard,
  shipping: Truck,
  tracking: Package,
  delivery: CheckCircle,
};

const typeColors: Record<string, string> = {
  payment: 'text-green-400',
  shipping: 'text-cyan-400',
  tracking: 'text-blue-400',
  delivery: 'text-gold-500',
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    }
  };

  const loadNotifications = async () => {
    if (!userId) return;

    try {
      const res = await fetch('/api/notifications', {
        headers: { 'x-user-id': userId }
      });
      const data = await res.json();
      
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markAllRead = async () => {
    if (!userId) return;

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, markAllRead: true })
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-luxury-gray/20 transition-colors rounded-full"
      >
        <Bell size={20} className="text-luxury-light" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile: Full screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed md:absolute left-4 right-4 top-20 md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 bg-luxury-dark border border-luxury-gray/30 shadow-2xl z-50 max-h-[70vh] overflow-hidden rounded-lg md:rounded-none"
            >
            {/* Header */}
            <div className="p-4 border-b border-luxury-gray/30 flex items-center justify-between">
              <h3 className="font-serif text-lg">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-gold-500 font-sans text-xs hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-luxury-gray/30 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[50vh]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-luxury-gray mx-auto mb-3" />
                  <p className="text-luxury-muted font-sans text-sm">No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => {
                    const Icon = typeIcons[notification.type] || Bell;
                    const iconColor = typeColors[notification.type] || 'text-luxury-muted';
                    
                    return (
                      <Link
                        key={notification.id}
                        href={notification.link || '/account/orders'}
                        onClick={() => setIsOpen(false)}
                        className={`block p-4 border-b border-luxury-gray/20 hover:bg-luxury-gray/10 transition-colors ${
                          !notification.read ? 'bg-gold-500/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full bg-luxury-gray/20 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-sans text-sm font-medium ${!notification.read ? 'text-gold-500' : 'text-luxury-light'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-luxury-muted font-sans text-xs mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-luxury-muted/60 font-sans text-[10px] mt-2">
                              {formatTime(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-luxury-gray/30">
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-gold-500 font-sans text-xs hover:underline"
                >
                  View All Orders →
                </Link>
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}