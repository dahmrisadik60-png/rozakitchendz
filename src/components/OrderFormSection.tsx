import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Clock,
  Printer,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Gift,
  FileText,
} from 'lucide-react';
import {
  ProductConfig,
  ProductVariant,
  algerianWilayas,
  Wilaya,
  CustomerOrder,
  StoreOwner,
  PackageOffer,
} from '../data/storeData';
import { trackOrderSuccess, captureAbandonedLead } from '../utils/tracking';

interface OrderFormSectionProps {
  owner: StoreOwner;
  product: ProductConfig;
  selectedVariant: ProductVariant;
  onSelectVariant: (v: ProductVariant) => void;
  onOrderCreated: (order: CustomerOrder) => void;
}

export const OrderFormSection: React.FC<OrderFormSectionProps> = ({
  owner,
  product,
  selectedVariant,
  onSelectVariant,
  onOrderCreated,
}) => {
  // Upsell Option: 1 piece or 2 pieces (with discount & free shipping)
  const [selectedOfferType, setSelectedOfferType] = useState<'single' | 'duo'>('single');

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Default Alger (16)
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<CustomerOrder | null>(null);

  // Selected Wilaya from the complete 69 Wilayas list
  const currentWilaya: Wilaya =
    algerianWilayas.find((w) => w.code === selectedWilayaCode) || algerianWilayas[15];

  // Pricing calculations
  const isDuo = selectedOfferType === 'duo';
  const quantity = isDuo ? 2 : 1;
  const productPrice = isDuo
    ? product.packageOffers?.[1]?.price || Math.round(product.basePrice * 1.8)
    : product.basePrice;

  // Free shipping for duo upsell, otherwise calculate by wilaya and delivery type
  const rawDeliveryFee =
    deliveryType === 'home' ? currentWilaya.homeDeliveryFee : currentWilaya.stopDeskDeliveryFee;
  const deliveryFee = isDuo ? 0 : rawDeliveryFee;
  const totalPrice = productPrice + deliveryFee;

  // Strict Algerian Phone Validator (Must be 10 digits starting with 05, 06, or 07)
  const cleanPhone = customerPhone.replace(/\D/g, '');
  const isValidAlgerianPhone = /^(05|06|07)\d{8}$/.test(cleanPhone);

  const getPhoneErrorMessage = (): string | null => {
    if (!customerPhone.trim() && !phoneTouched) return null;
    if (!customerPhone.trim()) {
      return 'يرجى إدخال رقم الهاتف للتواصل.';
    }
    if (!/^(05|06|07)/.test(cleanPhone)) {
      return 'يجب أن يبدأ رقم الهاتف بـ 05 أو 06 أو 07 (مقدمات الهواتف الجزائرية).';
    }
    if (cleanPhone.length !== 10) {
      return `يرجى إدخال رقم هاتف جزائري صحيح مكون من 10 أرقام (مثال: 0661xxxxxx) - كتبت حالياً ${cleanPhone.length} أرقام.`;
    }
    return null;
  };

  const phoneError = getPhoneErrorMessage();

  // Abandoned Form Capture on input blur
  const handleInputBlur = () => {
    if (customerName.trim() && isValidAlgerianPhone) {
      captureAbandonedLead(customerName, cleanPhone, currentWilaya.name, product.name);
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errors.name = 'يرجى إدخال الاسم واللقب بالكامل.';
    }
    if (!isValidAlgerianPhone) {
      errors.phone =
        'يرجى إدخال رقم هاتف جزائري صحيح مكون من 10 أرقام (مثال: 0661xxxxxx)';
    }
    if (!commune.trim()) {
      errors.commune = 'يرجى كتابة البلدية.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);

    if (!validate()) {
      const formEl = document.getElementById('order-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `ROZA-${Math.floor(100000 + Math.random() * 900000)}`;
      const packTitle = isDuo
        ? 'عرض التوفير الذكي (قطعتان + شحن مجاني)'
        : 'قطعة واحدة (الطلب القياسي)';

      const newOrder: CustomerOrder = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        wilayaName: currentWilaya.name,
        wilayaCode: currentWilaya.code,
        commune: commune.trim(),
        address: address.trim() || 'سيتم التنسيق هاتفياً مع الموزع عند الوصول',
        productName: product.name,
        variantName: selectedVariant?.name || 'النسخة القياسية',
        packTitle,
        quantity,
        productPrice,
        deliveryFee,
        totalPrice,
        notes: notes.trim(),
        deliveryType,
        createdAt: new Date().toLocaleString('ar-DZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'جديد',
      };

      // 1. Notify parent & persist
      onOrderCreated(newOrder);

      // 2. Dual Pixel Tracking (Meta + TikTok + Emailer)
      trackOrderSuccess(newOrder);

      // 3. Switch to Official Interactive Invoice Screen
      setSubmittedOrder(newOrder);
      setIsSubmitting(false);

      // Scroll smoothly to receipt
      const receiptEl = document.getElementById('official-receipt');
      if (receiptEl) receiptEl.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppNotify = (order: CustomerOrder) => {
    const rawOwnerPhone = owner.phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `مرحباً متجر ${owner.storeName} (صادق دحمري)،\n` +
      `لقد أتممت طلبي عبر الموقع بنجاح!\n` +
      `--------------------------------\n` +
      `🧾 رقم الفاتورة: #${order.id}\n` +
      `👤 الاسم: ${order.customerName}\n` +
      `📞 الهاتف: ${order.customerPhone}\n` +
      `📍 الولاية: ولاية ${order.wilayaName} (البلدية: ${order.commune})\n` +
      `🏠 نوع التوصيل: ${order.deliveryType === 'home' ? 'توصيل للمنزل' : 'استلام من المكتب'}\n` +
      `📦 المنتج: ${order.productName} (${order.variantName})\n` +
      `🎁 العرض: ${order.packTitle}\n` +
      `💰 المبلغ الإجمالي عند الاستلام: ${order.totalPrice.toLocaleString('ar-DZ')} دج\n` +
      `--------------------------------\n` +
      `يرجى تأكيد إرسال الطرد مع شركة التوصيل وشكراً!`
    );
    window.open(`https://wa.me/213${rawOwnerPhone}?text=${message}`, '_blank');
  };

  return (
    <section id="order-form" className="py-16 bg-[#10090d]/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
            <span>استمارة الحجز المباشر بالدفع عند الاستلام</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            اطلب {product.name} الآن وادفع بعد المعاينة
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            توصيل سريع لكافة الـ 69 ولاية جزائرية. لا تدفع أي دينار حتى يصلك الطرد وتفتحه بنفسك وتتأكد من جودته.
          </p>
        </div>

        {/* VIEW 1: Official Interactive Invoice / Receipt Screen */}
        {submittedOrder ? (
          <div
            id="official-receipt"
            className="bg-[#140c11] border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-right animate-in zoom-in-95 duration-200"
          >
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-rose-950/90 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white font-black text-xl flex items-center justify-center shadow-lg">
                  R
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{owner.storeName}</h3>
                  <p className="text-xs text-rose-300">فاتورة طلب رسمية ومؤكدة (Official Invoice)</p>
                  <p className="text-[11px] text-neutral-400">إشراف: {owner.name} · الجزائر العاصمة</p>
                </div>
              </div>

              <div className="text-center sm:text-left bg-[#1a0f16] border border-rose-900/60 rounded-2xl px-4 py-2">
                <span className="text-[10px] text-neutral-400 block font-mono">رقم الطلب والفاتورة</span>
                <span className="text-xl font-black text-rose-400 font-mono tracking-wider tabular-nums">
                  #{submittedOrder.id}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  ● مسجل للدفع عند الاستلام
                </span>
              </div>
            </div>

            {/* Success message banner */}
            <div className="my-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  تهانينا يا {submittedOrder.customerName}، تم تأكيد تسجيل طلبك بنجاح!
                </h4>
                <p className="text-xs text-neutral-300 mt-0.5">
                  سيتصل بك موزع التوصيل في ولاية {submittedOrder.wilayaName} على الرقم{' '}
                  <span className="font-bold text-rose-400 font-mono" dir="ltr">
                    {submittedOrder.customerPhone}
                  </span>{' '}
                  قبل تسليم الطرد.
                </p>
              </div>
            </div>

            {/* Official Itemized Receipt Table */}
            <div className="bg-[#180f15] border border-rose-950 rounded-2xl p-5 mb-6 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">المنتج المطلوب:</span>
                <span className="font-bold text-white">{submittedOrder.productName}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">الإصدار / اللون:</span>
                <span className="font-semibold text-rose-300">{submittedOrder.variantName}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">باقة العرض:</span>
                <span className="font-bold text-white">{submittedOrder.packTitle}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">الكمية الإجمالية:</span>
                <span className="font-bold text-white tabular-nums">{submittedOrder.quantity} قطعة</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">عنوان ووجهة التوصيل:</span>
                <span className="font-medium text-white text-right">
                  ولاية {submittedOrder.wilayaName} · دائرة/بلدية {submittedOrder.commune}
                  <span className="block text-[11px] text-neutral-400">({submittedOrder.address})</span>
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">طريقة الاستلام:</span>
                <span className="font-medium text-neutral-200">
                  {submittedOrder.deliveryType === 'home'
                    ? 'توصيل مباشر لباب المنزل'
                    : 'استلام من مكتب التوصيل (Stop Desk)'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">سعر المنتجات:</span>
                <span className="font-semibold text-white tabular-nums">
                  {submittedOrder.productPrice.toLocaleString('ar-DZ')} دج
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-rose-950/80">
                <span className="text-neutral-400">تكلفة الشحن والتوصيل:</span>
                <span className="font-semibold text-emerald-400 tabular-nums">
                  {submittedOrder.deliveryFee === 0 ? 'شحن مجاني (0 دج)' : `${submittedOrder.deliveryFee} دج`}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 text-base sm:text-lg font-black text-rose-400">
                <span>المبلغ الإجمالي المستحق عند الاستلام:</span>
                <span className="tabular-nums text-2xl font-black">
                  {submittedOrder.totalPrice.toLocaleString('ar-DZ')} دج
                </span>
              </div>
            </div>

            {/* Official Seal and Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-[#1a0f16] border border-rose-950/80 text-[11px] text-neutral-400 mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>ضمان رسمي معتمد 24 شهراً + حق فحص الطرد قبل تسليم المبلغ للموزع.</span>
              </span>
              <span className="font-mono text-[10px] text-rose-400/80">ختم Rozakitchendz المعتمد CE</span>
            </div>

            {/* Action buttons: WhatsApp confirmation + Print invoice */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleWhatsAppNotify(submittedOrder)}
                className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-600/20 active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال تأكيد فوري عبر الواتساب للمتجر</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-3.5 px-5 bg-[#1b1017] hover:bg-[#251520] border border-rose-900/60 text-neutral-200 font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-rose-300" />
                <span>طباعة أو حفظ الفاتورة (PDF)</span>
              </button>

              <button
                onClick={() => setSubmittedOrder(null)}
                className="py-3.5 px-4 bg-[#140c11] hover:bg-[#1a0f16] border border-rose-950 text-neutral-400 hover:text-white rounded-2xl text-xs font-semibold cursor-pointer"
              >
                <span>طلب قطعة أخرى</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: Ultra-Fast High-Converting Order Form */
          <form
            onSubmit={handleSubmit}
            className="bg-[#140c11] border border-rose-950 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative"
          >
            {/* STEP 1: Smart Upsell Options (قطعة واحدة أو قطعتان مع شحن مجاني) */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white mb-3">
                1. اختر العرض المناسب لك (عروض التوفير الذكية):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Single Piece Option */}
                <div
                  onClick={() => setSelectedOfferType('single')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-right flex items-center justify-between ${
                    selectedOfferType === 'single'
                      ? 'bg-[#1b1017] border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-[#160d13]/40 border-rose-950 hover:border-rose-900'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">قطعة واحدة (جهاز فردي)</span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      القلاية الأصلية كاملة مع شبكة الشواء وكتاب الوصفات
                    </span>
                    <span className="text-base font-extrabold text-rose-400 tabular-nums block mt-1.5">
                      {product.basePrice.toLocaleString('ar-DZ')} دج
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedOfferType === 'single' ? 'border-rose-500 bg-rose-500 text-white' : 'border-neutral-600'
                    }`}
                  >
                    {selectedOfferType === 'single' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Duo Upsell (2 Pieces + Free Shipping) */}
                <div
                  onClick={() => setSelectedOfferType('duo')}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer text-right flex items-center justify-between ${
                    selectedOfferType === 'duo'
                      ? 'bg-[#1b1017] border-rose-500 shadow-md shadow-rose-500/20'
                      : 'bg-[#160d13]/40 border-rose-950 hover:border-rose-900'
                  }`}
                >
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
                    أعلى توفير + شحن مجاني 0 دج 🔥
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      قطعتان (لكِ ولأختكِ أو لوالدتكِ)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                      توصيل مجاني لـ 69 ولاية + طقم ملاقط سيليكون هدية
                    </span>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-extrabold text-rose-400 tabular-nums">
                        {(product.packageOffers?.[1]?.price || Math.round(product.basePrice * 1.8)).toLocaleString('ar-DZ')} دج
                      </span>
                      <span className="text-[11px] text-neutral-500 line-through tabular-nums">
                        {(product.basePrice * 2).toLocaleString('ar-DZ')} دج
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedOfferType === 'duo' ? 'border-rose-500 bg-rose-500 text-white' : 'border-neutral-600'
                    }`}
                  >
                    {selectedOfferType === 'duo' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Color / Variant Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white mb-3">
                2. اختر الإصدار واللون المفضل:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => onSelectVariant(v)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1b1017] border-rose-500 ring-1 ring-rose-500/50 shadow-md shadow-rose-500/10'
                          : 'bg-[#160e14]/50 border-rose-950 hover:border-rose-900'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full border border-neutral-600 shrink-0"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{v.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{v.colorName}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Strict Customer Delivery Information */}
            <div className="space-y-5 mb-8">
              <label className="block text-sm font-bold text-white">
                3. معلومات التوصيل والتواصل (تحقق صارم لضمان وصول الطرد):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    الاسم واللقب بالكامل <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={handleInputBlur}
                      placeholder="مثال: أسماء بن حمزة"
                      className="w-full pr-10 pl-3 py-2.5 bg-[#180e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 transition-colors"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Strict Phone Input (10 Digits Starting with 05, 06, or 07) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    رقم الهاتف المحمول (10 أرقام) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      dir="ltr"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setCustomerPhone(val);
                        if (!phoneTouched) setPhoneTouched(true);
                      }}
                      onBlur={handleInputBlur}
                      placeholder="05 / 06 / 07 XX XX XX XX"
                      className={`w-full pr-10 pl-3 py-2.5 bg-[#180e14] border rounded-xl text-white text-sm focus:outline-none transition-colors text-right font-mono tracking-wider ${
                        phoneError
                          ? 'border-red-500 focus:border-red-400 bg-red-950/10'
                          : isValidAlgerianPhone
                          ? 'border-emerald-500/80 focus:border-emerald-400'
                          : 'border-rose-950 focus:border-rose-400'
                      }`}
                    />
                  </div>

                  {/* Strict Real-Time Red Warning Notice */}
                  {phoneError ? (
                    <p className="text-xs text-red-400 mt-1.5 font-medium flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{phoneError}</span>
                    </p>
                  ) : isValidAlgerianPhone ? (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>رقم جزائري معتمد وصحيح (10 أرقام)</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-neutral-400 mt-1">
                      اكتب 10 أرقام تبدأ بـ 05 أو 06 أو 07 للتواصل المباشر.
                    </p>
                  )}
                </div>
              </div>

              {/* 69 Wilayas Selector & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 69 Wilayas of Algeria */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    الولاية (متاح لـ 69 ولاية جزائرية بالكامل) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                      className="w-full pr-10 pl-3 py-2.5 bg-[#180e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
                    >
                      {algerianWilayas.map((w) => (
                        <option key={w.code} value={w.code} className="bg-[#180e14] text-white">
                          {w.code} - ولاية {w.name} ({w.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-rose-300/90 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span>مدة التوصيل المتوقعة: {currentWilaya.deliveryTime}</span>
                  </p>
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    البلدية أو الدائرة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="مثال: دالي براهيم، حيدرة، عين البنيان..."
                    className="w-full px-3.5 py-2.5 bg-[#180e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 transition-colors"
                  />
                  {formErrors.commune && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.commune}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Option: Home vs Stop Desk */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  مكان استلام الطرد:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      deliveryType === 'home'
                        ? 'bg-[#1a1017] border-rose-500 text-white shadow-sm'
                        : 'bg-[#140c11] border-rose-950 text-neutral-400 hover:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>توصيل لباب المنزل</span>
                      <span className="text-rose-400 tabular-nums">
                        {isDuo ? 'مجاني (0 دج)' : `${currentWilaya.homeDeliveryFee} دج`}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      يسلمك الموزع الطرد في يدك
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('desk')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                      deliveryType === 'desk'
                        ? 'bg-[#1a1017] border-rose-500 text-white shadow-sm'
                        : 'bg-[#140c11] border-rose-950 text-neutral-400 hover:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>استلام من المكتب (Stop Desk)</span>
                      <span className="text-rose-400 tabular-nums">
                        {isDuo ? 'مجاني (0 دج)' : `${currentWilaya.stopDeskDeliveryFee} دج`}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      تستلم الطرد من أقرب مكتب في ولايتك
                    </p>
                  </button>
                </div>
              </div>

              {/* Address / Landmark */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  العنوان بالتفصيل أو الحي (اختياري)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: حي البساتين فيلا رقم 14 بالقرب من المسجد"
                  className="w-full px-3.5 py-2.5 bg-[#180e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>
            </div>

            {/* Price Summary Breakdown Card */}
            <div className="bg-[#1b1017] border border-rose-950 rounded-3xl p-5 mb-6 space-y-2.5">
              <div className="flex items-center justify-between text-sm text-neutral-300">
                <span>سعر الجهاز ({isDuo ? 'قطعتان' : 'قطعة واحدة'}):</span>
                <span className="font-semibold tabular-nums text-white">
                  {productPrice.toLocaleString('ar-DZ')} دج
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-300">
                <span>رسوم التوصيل إلى ولاية {currentWilaya.name}:</span>
                <span className="font-semibold tabular-nums text-emerald-400">
                  {deliveryFee === 0 ? 'شحن مجاني 100% (عرض خاص)' : `${deliveryFee} دج`}
                </span>
              </div>

              <div className="pt-3 border-t border-rose-950 flex items-center justify-between text-base sm:text-lg font-black text-white">
                <span>المبلغ الإجمالي (للدفع عند الاستلام):</span>
                <span className="text-2xl text-rose-400 tabular-nums font-black">
                  {totalPrice.toLocaleString('ar-DZ')} دج
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 pt-1">
                * لن تدفع أي دينار الآن. الدفع نقداً عند استلام الطرد وفحصه مع الموزع.
              </p>
            </div>

            {/* Main Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValidAlgerianPhone}
              className={`w-full py-4 px-6 text-neutral-950 font-black text-base sm:text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                isValidAlgerianPhone
                  ? 'bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 hover:from-rose-400 hover:to-pink-300 shadow-rose-500/25'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-80'
              }`}
            >
              {isSubmitting ? (
                <span>جارٍ تسجيل الطلب وتوليد الفاتورة...</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>اطلب الآن وافتح طردك قبل الدفع</span>
                </>
              )}
            </button>

            {/* Security & Trust Guarantee Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                معاينة حرة قبل دفع أي دينار
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                ضمان سنتين من صادق دحمري
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-rose-400" />
                شحن لـ 69 ولاية جزائرية
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
