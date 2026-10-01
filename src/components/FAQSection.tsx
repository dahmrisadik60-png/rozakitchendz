import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      q: "كيف تتم عملية الدفع؟ وهل يمكنني معاينة الجهاز قبل الدفع؟",
      a: "نعم بكل تأكيد! نحن نعمل بنظام الدفع عند الاستلام (Cash on Delivery). عندما يصل الموزع إلى باب منزلك، يمنحك الطرد لتفتحه وتتفقد جهاز الكتروميناج الأوروبي وملحقاته، وبعد أن تتأكد من سلامته التامة ومطابقته للمواصفات تسلّمه المبلغ نقداً.",
    },
    {
      q: "كم تستغرق مدة التوصيل لولايتي؟",
      a: "التوصيل يتم خلال 24 ساعة فقط لولايات الجزائر العاصمة، البليدة، بومرداس، تيبازة وسطيف، وخلال 24 إلى 48 ساعة لبقية الولايات الشمالية والداخلية، و3 إلى 5 أيام لولايات الجنوب الكبير.",
    },
    {
      q: "هل الأجهزة أصلية وتحمل شهادة المطابقة الأوروبية CE؟",
      a: "نعم 100%، جميع أجهزة الكتروميناج المعروضة في متجر rozakitchendz مستوردة ومطابقة لمعايير السلامة والجودة الأوروبية CE مع كفاءة طاقوية عالية تضمن لك توفير استهلاك الكهرباء.",
    },
    {
      q: "كيف استفيد من الضمان في حال حدوث أي عيب مصنعي؟",
      a: "أجهزتنا مغطاة بضمان استبدال رسمي لمدة سنتين (24 شهراً) من متجر روزا كيتشن بإشراف الأخ صادق دحمري. في حال حدوث أي خلل، يكفي الاتصال بنا هاتفياً أو عبر الواتساب وسيتم إرسال موزع لاستبدال الجهاز فوراً بدون أي تعقيد.",
    },
    {
      q: "هل تتوفر قطع الغيار والملحقات بعد انتهاء فترة الضمان؟",
      a: "نعم، متجر روزا كيتشن يوفر خدمة ما بعد البيع المتكاملة مع توفر جميع الملحقات والسلال والمصافي الأصلية لضمان استخدام جهازك لسنوات طويلة بأعلى كفاءة.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#0d080b] border-t border-rose-950/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>إجابات واضحة</span>
            <span aria-hidden="true">·</span>
            <span>الأسئلة الشائعة حول الكتروميناج الأوروبي</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            الأسئلة الأكثر تداولاً حول أجهزتنا
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            كل ما تحتاج لمعرفته قبل تأكيد طلبك مع متجر روزا كيتشن ديزاد.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#140c11] border border-rose-950/80 overflow-hidden transition-all text-right"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-right cursor-pointer hover:bg-[#1a1017] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-rose-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-rose-950/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
