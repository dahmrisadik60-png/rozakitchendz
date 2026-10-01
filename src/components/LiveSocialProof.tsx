import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';

interface SocialProofEvent {
  name: string;
  city: string;
  product: string;
  timeAgo: string;
}

const SAMPLE_EVENTS: SocialProofEvent[] = [
  { name: 'فاطمة الزهراء ب.', city: 'وهران (المرسى الكبير)', product: 'قلاية فيليبس سمارت XXL الأوروبية', timeAgo: 'منذ دقيقة واحدة' },
  { name: 'محمد أمين م.', city: 'الجزائر العاصمة (دالي براهيم)', product: 'عرض التوفير الذكي (قطعتان)', timeAgo: 'منذ دقيقتين' },
  { name: 'نسرين ق.', city: 'سطيف (حي الباز)', product: 'قلاية فيليبس سمارت XXL الأوروبية', timeAgo: 'منذ 4 دقائق' },
  { name: 'سارة ح.', city: 'قسنطينة (الكدية)', product: 'عرض التوفير الذكي (قطعتان)', timeAgo: 'منذ 6 دقائق' },
  { name: 'عبد الرؤوف ب.', city: 'البليدة (أولاد يعيش)', product: 'قلاية فيليبس سمارت XXL الأوروبية', timeAgo: 'منذ 8 دقائق' },
  { name: 'حكيمة ز.', city: 'تلمسان (منصورة)', product: 'قلاية فيليبس سمارت XXL الأوروبية', timeAgo: 'منذ 10 دقائق' },
  { name: 'مريم ع.', city: 'عنابة (سيدي عمار)', product: 'عرض التوفير الذكي (قطعتان)', timeAgo: 'منذ 12 دقيقة' },
];

export const LiveSocialProof: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<SocialProofEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let index = 0;

    const showNext = () => {
      setCurrentEvent(SAMPLE_EVENTS[index]);
      setIsVisible(true);
      index = (index + 1) % SAMPLE_EVENTS.length;

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // First popup after 3 seconds
    const initialTimer = setTimeout(showNext, 3000);

    // Then repeat every 12 seconds
    const interval = setInterval(showNext, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!currentEvent || !isVisible) return null;

  return (
    <aside
      aria-label="إشعار طلب مباشر"
      className="fixed bottom-20 left-4 z-40 max-w-xs sm:max-w-sm bg-[#160d13]/95 backdrop-blur-md border border-rose-500/40 rounded-2xl p-3 shadow-2xl text-right animate-in slide-in-from-bottom duration-300 pointer-events-auto"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <ShoppingBag className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{currentEvent.name}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            </span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-neutral-500 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-rose-300 font-semibold truncate mt-0.5">
            قام بطلب {currentEvent.product}
          </p>

          <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
            <span>📍 {currentEvent.city}</span>
            <span className="text-emerald-400 font-medium">● {currentEvent.timeAgo}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
