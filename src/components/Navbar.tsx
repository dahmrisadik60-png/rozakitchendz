import React from 'react';
import { ShoppingBag, Package, Sparkles, SlidersHorizontal, Settings } from 'lucide-react';
import { StoreOwner } from '../data/storeData';

interface NavbarProps {
  owner: StoreOwner;
  onOpenOrders: () => void;
  onOpenProductCustomizer: () => void;
  onOpenAdmin: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  owner,
  onOpenOrders,
  onOpenProductCustomizer,
  onOpenAdmin,
  ordersCount,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#110b0f]/95 backdrop-blur-md border-b border-rose-950/80 transition-all">
      {/* Top micro announcement bar in luxury rose */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 text-neutral-950 px-4 py-1.5 text-xs font-black text-center flex items-center justify-center gap-2 shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-neutral-950 animate-pulse"></span>
        <span>توصيل سريع لـ 69 ولاية | الدفع عند الاستلام بعد معاينة المنتج</span>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/25">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                rozakitchendz
              </span>
              <span className="text-[11px] text-rose-300/80 font-medium -mt-1">
                الكتروميناج الأوروبي الفاخر
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            المميزات
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            معرض الصور
          </button>
          <button
            onClick={() => scrollToSection('specs')}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            المواصفات الأوروبية
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            آراء الزبائن
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            الأسئلة الشائعة
          </button>
        </nav>

        {/* Zone 3: Actions (Analytics + Orders Manager + Product Customizer + Order CTA) */}
        <div className="flex items-center gap-2">
          {/* Analytics & Stats Button */}
          <button
            onClick={onOpenAdmin}
            title="الرسوم البيانية وإحصائيات المتجر"
            className="p-2 sm:px-2.5 sm:py-2 text-xs font-bold text-rose-300 bg-[#1a1017] hover:bg-[#251520] border border-rose-900/60 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:border-rose-500"
          >
            <Settings className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">التحليلات 📊</span>
          </button>

          {/* Space 1: Orders Inbox Button */}
          <button
            onClick={onOpenOrders}
            title="صندوق الطلبات الواردة"
            className="relative px-3 py-2 text-xs font-bold text-neutral-200 bg-[#1a1017] hover:bg-[#251520] border border-rose-900/60 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:border-rose-500"
          >
            <Package className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">الطلبات</span>
            {ordersCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Space 2: Product Customizer Button */}
          <button
            onClick={onOpenProductCustomizer}
            title="استوديو تعديل وتغيير المنتج"
            className="px-3 py-2 text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">تعديل المنتج</span>
          </button>

          {/* Primary CTA: Order Now */}
          <button
            onClick={() => scrollToSection('order-form')}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-neutral-950 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 hover:from-rose-400 hover:to-pink-300 rounded-xl transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="whitespace-nowrap">اطلب الآن</span>
          </button>
        </div>
      </div>
    </header>
  );
};
