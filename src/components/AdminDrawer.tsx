import React, { useState, useMemo } from 'react';
import {
  X,
  Package,
  Phone,
  MessageCircle,
  Download,
  Settings,
  DollarSign,
  CheckCircle,
  Trash2,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CustomerOrder, StoreOwner } from '../data/storeData';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  owner: StoreOwner;
  onUpdateOwner: (newOwner: StoreOwner) => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  basePrice: number;
  onUpdateBasePrice: (price: number) => void;
}

// Colors for the status breakdown chart
const STATUS_COLORS: { [key: string]: string } = {
  جديد: '#f43f5e', // Rose
  'تم التأكيد': '#3b82f6', // Blue
  'قيد التوصيل': '#a855f7', // Purple
  'تم التسليم': '#10b981', // Emerald
  ملغى: '#64748b', // Slate
};

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  owner,
  onUpdateOwner,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  basePrice,
  onUpdateBasePrice,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'settings'>('analytics');

  // Edit states
  const [editName, setEditName] = useState(owner.name);
  const [editEmail, setEditEmail] = useState(owner.email);
  const [editPhone, setEditPhone] = useState(owner.phone);
  const [editStoreName, setEditStoreName] = useState(owner.storeName);
  const [editPrice, setEditPrice] = useState(basePrice);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Calculate Daily Orders Data for the charts (Zeros when empty)
  const dailyOrdersData = useMemo(() => {
    const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'اليوم'];
    if (orders.length === 0) {
      return days.map((day) => ({ day, orders: 0, revenue: 0 }));
    }
    return days.map((day, idx) => {
      if (idx === days.length - 1) {
        const rev = orders.reduce((sum, o) => sum + (o.status !== 'ملغى' ? o.totalPrice : 0), 0);
        return { day, orders: orders.length, revenue: rev };
      }
      return { day, orders: 0, revenue: 0 };
    });
  }, [orders]);

  // 2. Calculate Order Status Breakdown for the Pie Chart
  const statusPieData = useMemo(() => {
    if (orders.length === 0) {
      return [{ name: 'لا توجد طلبات بعد (تصفير)', value: 1, color: '#3f3f46' }];
    }

    const counts: { [key: string]: number } = {
      جديد: 0,
      'تم التأكيد': 0,
      'قيد التوصيل': 0,
      'تم التسليم': 0,
      ملغى: 0,
    };

    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      } else {
        counts[o.status] = 1;
      }
    });

    return Object.entries(counts)
      .filter(([_, val]) => val > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        color: STATUS_COLORS[status] || '#ec4899',
      }));
  }, [orders]);

  // 3. Top Wilayas distribution (Zeros when empty)
  const topWilayasData = useMemo(() => {
    if (orders.length === 0) {
      return [
        { wilaya: 'الجزائر العاصمة', orders: 0 },
        { wilaya: 'وهران', orders: 0 },
        { wilaya: 'سطيف', orders: 0 },
        { wilaya: 'قسنطينة', orders: 0 },
        { wilaya: 'البليدة', orders: 0 },
      ];
    }

    const wilayaCounts: { [key: string]: number } = {};
    orders.forEach((o) => {
      if (o.wilayaName) {
        wilayaCounts[o.wilayaName] = (wilayaCounts[o.wilayaName] || 0) + 1;
      }
    });

    return Object.entries(wilayaCounts)
      .map(([wilaya, count]) => ({
        wilaya,
        orders: count,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  }, [orders]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOwner({
      ...owner,
      name: editName,
      email: editEmail,
      phone: editPhone,
      storeName: editStoreName,
    });
    onUpdateBasePrice(editPrice);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('لا توجد طلبات لتصديرها حالياً.');
      return;
    }
    const headers =
      'رقم الطلب,الاسم,الهاتف,الولاية,البلدية,العنوان,المنتج,النسخة,الكمية,المبلغ الإجمالي,تاريخ الطلب,الحالة\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.customerPhone}","${o.wilayaName}","${o.commune}","${o.address}","${o.productName}","${o.variantName}","${o.quantity}","${o.totalPrice}","${o.createdAt}","${o.status}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `طلبات_rozakitchendz_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== 'ملغى' ? o.totalPrice : 0),
    0
  );
  const confirmedCount = orders.filter(
    (o) => o.status === 'تم التأكيد' || o.status === 'تم التسليم' || o.status === 'قيد التوصيل'
  ).length;
  const confirmationRate = orders.length > 0 ? Math.round((confirmedCount / orders.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#120a0f] border-l border-rose-950 h-full flex flex-col shadow-2xl text-right animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-rose-950 flex items-center justify-between bg-[#190e15]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                لوحة تحكم المتجر والتحليلات (rozakitchendz)
              </h3>
              <p className="text-[11px] text-rose-300/80">
                إشراف: {owner.name} · {owner.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#251520] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-rose-950 bg-[#160d13]/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الرسوم البيانية والإحصائيات</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات المتجر</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: Visual Analytics with Recharts */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#170e14] border border-rose-950">
                  <span className="text-[11px] text-neutral-400 block">إجمالي الطلبات</span>
                  <p className="text-xl font-black text-white tabular-nums mt-0.5">
                    {orders.length}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#170e14] border border-rose-950">
                  <span className="text-[11px] text-rose-400 block">إجمالي المبيعات</span>
                  <p className="text-base sm:text-lg font-black text-rose-400 tabular-nums mt-0.5 truncate">
                    {totalRevenue.toLocaleString('ar-DZ')} دج
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#170e14] border border-rose-950">
                  <span className="text-[11px] text-emerald-400 block">نسبة التأكيد</span>
                  <p className="text-xl font-black text-emerald-400 tabular-nums mt-0.5">
                    {confirmationRate}%
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#170e14] border border-rose-950">
                  <span className="text-[11px] text-neutral-400 block">الولايات المغطاة</span>
                  <p className="text-xl font-black text-white tabular-nums mt-0.5">58 ولاية</p>
                </div>
              </div>

              {/* Chart 1: Daily Orders Area Trend Chart */}
              <div className="p-4 rounded-3xl bg-[#170e14] border border-rose-950 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-950/70">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white">
                      مخطط عدد الطلبات اليومية (Daily Orders Trend)
                    </h4>
                  </div>
                  <span className="text-[10px] text-rose-300 font-semibold bg-rose-500/15 px-2 py-0.5 rounded-md">
                    آخر 7 أيام
                  </span>
                </div>

                <div className="h-56 w-full pt-2" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyOrdersData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a1723" vertical={false} />
                      <XAxis
                        dataKey="day"
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#190e15',
                          borderColor: '#4c1d32',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          textAlign: 'right',
                        }}
                        formatter={(val: any) => [`${val ?? 0} طلب`, 'الطلبيات']}
                        labelFormatter={(label) => `يوم: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#roseGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Order Status Breakdown (Donut Pie Chart) */}
              <div className="p-4 rounded-3xl bg-[#170e14] border border-rose-950 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-950/70">
                  <div className="flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white">
                      توزيع حالات الطلبات (Order Status Breakdown)
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-400">حسب الإجراء الفعلي</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 pt-2">
                  <div className="sm:col-span-7 h-52 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#120a0f" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#190e15',
                            borderColor: '#4c1d32',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px',
                            textAlign: 'right',
                          }}
                          formatter={(val: any) => [`${val ?? 0} طلب`, 'العدد']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status Legend */}
                  <div className="sm:col-span-5 space-y-2 text-xs">
                    {statusPieData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#10090d] border border-rose-950/60"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-neutral-200 font-medium">{item.name}</span>
                        </div>
                        <span className="text-white font-bold tabular-nums">
                          {item.value} طلب
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart 3: Top Wilayas Distribution Bar Chart */}
              <div className="p-4 rounded-3xl bg-[#170e14] border border-rose-950 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-950/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white">
                      أعلى الولايات طلباً للالكتروميناج
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-400">تغطية ياليدين وبروكوليس</span>
                </div>

                <div className="h-44 w-full pt-2" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topWilayasData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a1723" horizontal={false} />
                      <XAxis type="number" stroke="#71717a" fontSize={10} hide />
                      <YAxis
                        dataKey="wilaya"
                        type="category"
                        stroke="#d4d4d8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#190e15',
                          borderColor: '#4c1d32',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          textAlign: 'right',
                        }}
                        formatter={(val: any) => [`${val ?? 0} طلبية`, 'الطلبات']}
                      />
                      <Bar dataKey="orders" fill="#fb7185" radius={[0, 8, 8, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Orders List */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Action buttons */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-neutral-300">سجل طلبات الزبائن:</span>
                <button
                  onClick={exportOrdersCSV}
                  className="py-1.5 px-3 bg-[#170e14] hover:bg-[#20141c] border border-rose-950 text-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>تصدير Excel / CSV للشركات</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-rose-950 rounded-2xl">
                  <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">لا توجد طلبات مسجلة بعد</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    عندما يقوم أي زائر بطلب جهاز ستظهر تفاصيله كاملة هنا فوراً.
                  </p>
                </div>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl bg-[#170e14] border border-rose-950 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block tabular-nums">
                          {o.createdAt}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{o.customerName}</h4>
                        <p className="text-xs text-rose-400 tabular-nums font-semibold" dir="ltr">
                          {o.customerPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(o.id, e.target.value as CustomerOrder['status'])
                          }
                          className="text-xs py-1 px-2 rounded-lg bg-[#10090d] border border-rose-900 text-neutral-200 cursor-pointer"
                        >
                          <option value="جديد">جديد</option>
                          <option value="تم التأكيد">تم التأكيد</option>
                          <option value="قيد التوصيل">قيد التوصيل</option>
                          <option value="تم التسليم">تم التسليم</option>
                          <option value="ملغى">ملغى</option>
                        </select>

                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1 bg-[#10090d] p-2.5 rounded-xl border border-rose-950">
                      <p>
                        <span className="text-neutral-400">العنوان: </span>
                        ولاية {o.wilayaName} ({o.commune}) - {o.address}
                      </p>
                      <p>
                        <span className="text-neutral-400">الطلب: </span>
                        {o.productName} · {o.variantName}
                      </p>
                      <p className="text-rose-400 font-bold">
                        <span className="text-neutral-400 font-normal">المبلغ عند الاستلام: </span>
                        {o.totalPrice.toLocaleString('ar-DZ')} دج
                      </p>
                    </div>

                    {/* Customer Contact Actions */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${o.customerPhone.replace(/[\s-]/g, '')}`}
                        className="flex-1 py-1.5 px-3 bg-[#1f131c] hover:bg-[#281824] text-neutral-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-rose-400" />
                        <span>اتصال بالهاتف</span>
                      </a>
                      <a
                        href={`https://wa.me/213${o.customerPhone.replace(/^0|[^0-9]/g, '')}?text=${encodeURIComponent(
                          `مرحباً ${o.customerName}، معك الأخ صادق دحمري من متجر rozakitchendz بخصوص طلبك رقم #${o.id}. هل تؤكد لنا الشحن؟`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-3 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب للزبون</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Settings Tab */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300">
                هذه المعلومات تظهر على صفحة المتجر وتستخدم في تواصل الزبائن وإرسال رسائل الواتساب وفواتير الشراء.
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  اسم صاحب المتجر
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  البريد الإلكتروني الرسمي
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  رقم الهاتف / الواتساب الرسمي لاستقبال الطلبات
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  اسم المتجر المعروض
                </label>
                <input
                  type="text"
                  value={editStoreName}
                  onChange={(e) => setEditStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  سعر بيع الجهاز الأساسي (دج)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  رابط استقبال الطلبات الفوري Formspree (لتلقي إشعارات الطلب على بريدك)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  defaultValue="https://formspree.io/f/mqaeveoq"
                  onChange={(e) => {
                    if (typeof window !== 'undefined') {
                      window.FORMSPREE_ENDPOINT = e.target.value;
                    }
                  }}
                  placeholder="https://formspree.io/f/mqaeveoq"
                  className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-rose-400 text-left"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  كل طلب يسجله الزبون يرسل فوراً إلى بريدك الإلكتروني (dahmrisadik60@gmail.com).
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم حفظ الإعدادات بنجاح وتحديث الموقع فوراً!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 text-neutral-950 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                حفظ التعديلات
              </button>

              <div className="pt-4 border-t border-rose-950/80">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من تصفير ومسح جميع الطلبات نهائياً؟ ستصبح الطلبات 0 والمبيعات 0 دج.')) {
                      localStorage.removeItem('rozakitchendz_orders_live');
                      localStorage.removeItem('rozakitchendz_orders_eu');
                      window.location.reload();
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-red-950/40 hover:bg-red-900/60 border border-red-900/80 text-red-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>تصفير ومسح جميع الطلبات (تفريغ السجل بالكامل)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
