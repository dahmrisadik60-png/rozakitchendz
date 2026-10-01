import React, { useState } from 'react';
import {
  X,
  Package,
  Phone,
  MessageCircle,
  Download,
  Search,
  Trash2,
} from 'lucide-react';
import { CustomerOrder, StoreOwner } from '../data/storeData';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  owner: StoreOwner;
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  owner,
  onUpdateOrderStatus,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.wilayaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    if (orders.length === 0) {
      alert('لا توجد طلبات لتصديرها.');
      return;
    }
    const headers =
      'رقم الطلب,اسم الزبون,الهاتف,الولاية,البلدية,العنوان,المنتج,النسخة,العرض,المبلغ الإجمالي,تاريخ الطلب,الحالة\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.customerPhone}","${o.wilayaName}","${o.commune}","${o.address}","${o.productName || 'rozakitchendz'}","${o.variantName}","${o.packTitle}","${o.totalPrice}","${o.createdAt}","${o.status}"`
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
  const newOrdersCount = orders.filter((o) => o.status === 'جديد').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-[#120a0f] border border-rose-950 rounded-3xl h-[92vh] flex flex-col shadow-2xl text-right animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-rose-950 flex items-center justify-between bg-[#190e15]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center relative">
              <Package className="w-5 h-5" />
              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                  {newOrdersCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                صندوق طلبات الكتروميناج الواردة (rozakitchendz)
              </h2>
              <p className="text-xs text-rose-300/80">
                متابعة وإدارة طلبيات الزبائن والتأكيد المباشر عبر الهاتف والواتساب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من تصفير ومسح جميع الطلبات المسجلة؟ ستصبح الطلبات 0 والمبيعات 0 دج.')) {
                    localStorage.removeItem('rozakitchendz_orders_live');
                    localStorage.removeItem('rozakitchendz_orders_eu');
                    window.location.reload();
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-900/80 text-red-300 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                title="تصفير ومسح كافة الطلبات"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>تصفير السجل</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 bg-[#1b1017] hover:bg-[#251520] border border-rose-900/60 text-neutral-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>تصدير Excel لشركة التوصيل</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-[#251520] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:px-6 bg-[#160d13]/40 border-b border-rose-950/80">
          <div className="p-3 rounded-2xl bg-[#170e14] border border-rose-950">
            <span className="text-[11px] text-neutral-400">إجمالي الطلبات</span>
            <p className="text-xl font-black text-white tabular-nums mt-0.5">{orders.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#170e14] border border-rose-950">
            <span className="text-[11px] text-rose-400">طلبات جديدة تنتظر التأكيد</span>
            <p className="text-xl font-black text-rose-400 tabular-nums mt-0.5">{newOrdersCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#170e14] border border-rose-950">
            <span className="text-[11px] text-emerald-400">المبيعات المتوقعة (دج)</span>
            <p className="text-xl font-black text-emerald-400 tabular-nums mt-0.5">
              {totalRevenue.toLocaleString('ar-DZ')} دج
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#170e14] border border-rose-950">
            <span className="text-[11px] text-neutral-400">المتجر المسؤول</span>
            <p className="text-sm font-bold text-rose-200 truncate mt-0.5">rozakitchendz</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3 border-b border-rose-950 bg-[#120a0f]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الزبون، رقم الهاتف، أو الولاية..."
              className="w-full pr-9 pl-3 py-2 bg-[#170e14] border border-rose-950 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'جديد', 'تم التأكيد', 'قيد التوصيل', 'تم التسليم', 'ملغى'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? 'bg-rose-500 text-white font-bold shadow'
                    : 'bg-[#170e14] text-neutral-400 hover:text-white border border-rose-950'
                }`}
              >
                {status === 'all' ? 'جميع الحالات' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-rose-950 rounded-3xl">
              <Package className="w-12 h-12 text-rose-900 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-300">لا توجد طلبات في هذا التصنيف</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                عندما يقوم أي زبون بطلب جهاز الكتروميناج ستصلك بياناته فوراً هنا.
              </p>
            </div>
          ) : (
            filteredOrders.map((o) => (
              <div
                key={o.id}
                className="p-4 sm:p-5 rounded-3xl bg-[#160d13]/80 border border-rose-950 hover:border-rose-900 transition-all space-y-3"
              >
                {/* Top order info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-950/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-400 font-mono tracking-wider tabular-nums bg-rose-500/15 px-2.5 py-0.5 rounded-lg border border-rose-500/25">
                      {o.id}
                    </span>
                    <span className="text-xs text-neutral-400 tabular-nums">{o.createdAt}</span>
                    <span className="text-xs text-rose-800">·</span>
                    <span className="text-xs font-medium text-neutral-300">
                      {o.deliveryType === 'home' ? 'توصيل لباب المنزل' : 'استلام من المكتب (Stop Desk)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(o.id, e.target.value as CustomerOrder['status'])
                      }
                      className={`text-xs font-bold py-1.5 px-3 rounded-xl border cursor-pointer focus:outline-none ${
                        o.status === 'جديد'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : o.status === 'تم التأكيد'
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : o.status === 'قيد التوصيل'
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : o.status === 'تم التسليم'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-[#10090d] text-neutral-400 border-neutral-700'
                      }`}
                    >
                      <option value="جديد">جديد</option>
                      <option value="تم التأكيد">تم التأكيد</option>
                      <option value="قيد التوصيل">قيد التوصيل</option>
                      <option value="تم التسليم">تم التسليم</option>
                      <option value="ملغى">ملغى</option>
                    </select>

                    <button
                      onClick={() => onDeleteOrder(o.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-[#20131b] cursor-pointer transition-colors"
                      title="حذف هذا الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Customer */}
                  <div className="p-3 rounded-2xl bg-[#120a0f] border border-rose-950">
                    <span className="text-neutral-400 block mb-1">الزبون:</span>
                    <p className="font-bold text-white text-sm">{o.customerName}</p>
                    <p className="text-rose-400 font-mono text-xs mt-0.5 tabular-nums" dir="ltr">
                      {o.customerPhone}
                    </p>
                  </div>

                  {/* Destination */}
                  <div className="p-3 rounded-2xl bg-[#120a0f] border border-rose-950">
                    <span className="text-neutral-400 block mb-1">الموقع والتوصيل:</span>
                    <p className="font-bold text-white">ولاية {o.wilayaName}</p>
                    <p className="text-neutral-300 mt-0.5">
                      {o.commune} - {o.address}
                    </p>
                  </div>

                  {/* Product & Price */}
                  <div className="p-3 rounded-2xl bg-[#120a0f] border border-rose-950">
                    <span className="text-neutral-400 block mb-1">الجهاز المطلوب والمبلغ:</span>
                    <p className="font-bold text-white truncate">{o.productName || o.packTitle}</p>
                    <p className="text-neutral-300">{o.variantName}</p>
                    <p className="text-rose-400 font-extrabold text-sm mt-1 tabular-nums">
                      المجموع: {o.totalPrice.toLocaleString('ar-DZ')} دج
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <a
                    href={`tel:${o.customerPhone.replace(/[\s-]/g, '')}`}
                    className="flex-1 py-2 px-3 bg-[#1e131b] hover:bg-[#281824] text-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-400" />
                    <span>اتصال هاتفي بالزبون</span>
                  </a>

                  <a
                    href={`https://wa.me/213${o.customerPhone.replace(/^0|[^0-9]/g, '')}?text=${encodeURIComponent(
                      `مرحباً ${o.customerName}، معك الأخ صادق دحمري من متجر rozakitchendz (روزا كيتشن للالكتروميناج الأوروبي) بخصوص طلبك رقم #${o.id}.\nالمنتج: ${o.productName} (${o.variantName})\nالمبلغ عند الاستلام: ${o.totalPrice} دج.\nهل تؤكد لنا الشحن لعنوانك في ولاية ${o.wilayaName}؟`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تأكيد عبر الواتساب</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
