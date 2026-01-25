'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  DollarSign,
  Plus,
  LogOut,
  Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingReviews: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingReviews: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const supabase = createClient();
    
    // Check if logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Check if admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      await supabase.auth.signOut();
      router.push('/admin/login');
      return;
    }

    // Load stats
    const [watchesRes, ordersRes, reviewsRes] = await Promise.all([
      supabase.from('watches').select('id', { count: 'exact' }),
      supabase.from('orders').select('id, total, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('reviews').select('id', { count: 'exact' }).eq('approved', false)
    ]);

    const totalRevenue = ordersRes.data?.reduce((sum, order) => {
      return order.status === 'completed' ? sum + (order.total || 0) : sum;
    }, 0) || 0;

    setStats({
      totalProducts: watchesRes.count || 0,
      totalOrders: ordersRes.data?.length || 0,
      pendingReviews: reviewsRes.count || 0,
      totalRevenue
    });

    setRecentOrders(ordersRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Admin Header */}
      <header className="bg-luxury-dark border-b border-luxury-gray/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo.png" alt="Luxero" className="h-10" />
            </Link>
            <span className="text-luxury-muted font-sans text-sm">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-luxury-muted hover:text-red-500 transition-colors font-sans text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'text-blue-500' },
            { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: 'text-green-500' },
            { icon: MessageSquare, label: 'Pending Reviews', value: stats.pendingReviews, color: 'text-yellow-500' },
            { icon: DollarSign, label: 'Revenue', value: `$${(stats.totalRevenue / 100).toLocaleString()}`, color: 'text-gold-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-luxury p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-2xl font-serif mb-1">{stat.value}</p>
              <p className="text-luxury-muted font-sans text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products" className="card-luxury p-6 hover:border-gold-500/30 transition-colors group">
            <Package className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="text-lg font-serif mb-2 group-hover:text-gold-500 transition-colors">Manage Products</h3>
            <p className="text-luxury-muted font-sans text-sm">Add, edit, or remove watches</p>
          </Link>
          
          <Link href="/admin/orders" className="card-luxury p-6 hover:border-gold-500/30 transition-colors group">
            <ShoppingCart className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="text-lg font-serif mb-2 group-hover:text-gold-500 transition-colors">Manage Orders</h3>
            <p className="text-luxury-muted font-sans text-sm">View and update order status</p>
          </Link>
          
          <Link href="/admin/reviews" className="card-luxury p-6 hover:border-gold-500/30 transition-colors group">
            <MessageSquare className="w-8 h-8 text-gold-500 mb-4" />
            <h3 className="text-lg font-serif mb-2 group-hover:text-gold-500 transition-colors">Manage Reviews</h3>
            <p className="text-luxury-muted font-sans text-sm">Approve or reject customer reviews</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="card-luxury p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-light">Recent Orders</h3>
            <Link href="/admin/orders" className="text-gold-500 font-sans text-sm hover:underline">
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-luxury-muted font-sans">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 border-b border-luxury-gray/20 last:border-0">
                  <div>
                    <p className="font-sans text-sm">{order.id.slice(0, 8)}...</p>
                    <p className="text-luxury-muted font-sans text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 font-serif">${(order.total / 100).toLocaleString()}</p>
                    <span className={`text-xs font-sans uppercase tracking-wide px-2 py-0.5 ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
