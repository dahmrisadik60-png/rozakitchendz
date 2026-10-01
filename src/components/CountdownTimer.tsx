import React, { useState, useEffect } from 'react';
import { Clock, Flame, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  className?: string;
  oldPrice?: number;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ className = '', oldPrice = 23500 }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    // 12-hour rotating flash window stored in localStorage
    const STORAGE_KEY = 'rozakitchendz_offer_end_time';
    let targetTime: number;

    const storedEndTime = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (storedEndTime && Number(storedEndTime) > now) {
      targetTime = Number(storedEndTime);
    } else {
      // Set target to 11 hours, 45 minutes from now
      targetTime = now + (11 * 3600 + 45 * 60) * 1000;
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    }

    const updateTimer = () => {
      const current = Date.now();
      const diff = targetTime - current;

      if (diff <= 0) {
        // Reset a new 12-hour urgency cycle
        const newTarget = Date.now() + 12 * 3600 * 1000;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        targetTime = newTarget;
      }

      const totalSeconds = Math.max(0, Math.floor((targetTime - current) / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <div
      className={`rounded-2xl bg-[#140c11]/90 border border-rose-500/30 p-3.5 sm:p-4 shadow-lg shadow-rose-500/5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
          <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>ينتهي عرض التخفيض الأوروبي الحصري خلال:</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>عرض محدود</span>
        </div>
      </div>

      {/* Digits Display in Rose Theme */}
      <div className="grid grid-cols-3 gap-2 text-center" dir="ltr">
        {/* Hours */}
        <div className="bg-[#1b1017] border border-rose-950 rounded-xl py-2 px-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-white tabular-nums tracking-wider block">
            {formatDigit(timeRemaining.hours)}
          </span>
          <span className="text-[10px] text-rose-300/80 font-medium block mt-0.5" dir="rtl">
            ساعة
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-[#1b1017] border border-rose-950 rounded-xl py-2 px-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-rose-400 tabular-nums tracking-wider block">
            {formatDigit(timeRemaining.minutes)}
          </span>
          <span className="text-[10px] text-rose-300/80 font-medium block mt-0.5" dir="rtl">
            دقيقة
          </span>
        </div>

        {/* Seconds */}
        <div className="bg-[#1b1017] border border-rose-950 rounded-xl py-2 px-1">
          <span className="text-xl sm:text-2xl font-black font-mono text-pink-400 tabular-nums tracking-wider block">
            {formatDigit(timeRemaining.seconds)}
          </span>
          <span className="text-[10px] text-rose-300/80 font-medium block mt-0.5" dir="rtl">
            ثانية
          </span>
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 mt-2 text-right">
        * يعود السعر إلى {oldPrice.toLocaleString('ar-DZ')} دج فور انتهاء هذا العداد أو نفاد القطع المتبقية.
      </p>
    </div>
  );
};
