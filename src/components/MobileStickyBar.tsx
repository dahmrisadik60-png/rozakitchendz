import React from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { StoreOwner, ProductConfig } from '../data/storeData';

interface MobileStickyBarProps {
  product: ProductConfig;
  onOrderClick: () => void;
  owner: StoreOwner;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  product,
  onOrderClick,
  owner,
}) => {
  const whatsappNumber = owner.phone.replace(/[^0-9]/g, '');

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#110b0f]/95 backdrop-blur-md border-t border-rose-950 p-2.5 px-4 flex items-center justify-between gap-3 shadow-2xl">
      <div className="text-right">
        <span className="text-[10px] text-neutral-400 block leading-tight">الدفع عند الاستلام</span>
        <span className="text-base font-extrabold text-rose-400 tabular-nums leading-tight">
          {product.basePrice.toLocaleString('ar-DZ')} دج
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `مرحباً متجر ${owner.storeName}، أريد الاستفسار عن ${product.name}.`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-colors"
          title="مراسلة عبر الواتساب"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        <button
          onClick={onOrderClick}
          className="py-2.5 px-4 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 hover:from-rose-400 hover:to-pink-300 text-neutral-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>اطلب الآن</span>
        </button>
      </div>
    </div>
  );
};
