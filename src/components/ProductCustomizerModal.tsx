import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Save,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Layers,
  Plus,
  Trash2,
  Box,
  Upload,
  Camera,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import {
  ProductConfig,
  availableProductPresets,
  ProductVariant,
} from '../data/storeData';

// Helper to resize and compress uploaded image files to ensure crisp quality and safe storage
function processImageFile(file: File, callback: (dataUrl: string) => void) {
  if (!file.type.startsWith('image/')) {
    alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(dataUrl);
      } else {
        callback(e.target?.result as string);
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

// Component for uploading an image from phone/computer or link
interface ImagePickerProps {
  label: string;
  description?: string;
  currentImage: string;
  onChange: (newImage: string) => void;
}

const DeviceImagePicker: React.FC<ImagePickerProps> = ({
  label,
  description,
  currentImage,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        onChange(dataUrl);
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        onChange(dataUrl);
      });
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#170e14] border border-rose-950 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">{label}</span>
          {description && (
            <span className="text-[11px] text-neutral-400">{description}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-rose-300 hover:text-rose-200 underline cursor-pointer flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'إخفاء الرابط' : 'أو إدخال رابط صورة'}</span>
        </button>
      </div>

      {/* Main Upload Zone from Device */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Preview thumbnail */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#10090d] border border-rose-900/60 shrink-0 relative group shadow-md">
          <img
            src={currentImage}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded-md">
              معاينة الصورة
            </span>
          </div>
        </div>

        {/* Device file picker action box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-400 bg-rose-500/15'
              : 'border-rose-950/80 bg-[#120a0f] hover:border-rose-500 hover:bg-[#1a0f17]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 shadow-inner">
            <Upload className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-white mb-0.5">
            اضغط لاختيار صورة من هاتفك أو جهازك
          </p>
          <p className="text-[11px] text-neutral-400">
            يمكنك التقاط صورة بالكاميرا أو اختيارها من الصور (JPG, PNG)
          </p>

          <span className="mt-2 py-1.5 px-3 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 text-neutral-950 font-black text-[11px] rounded-lg shadow-sm">
            📁 اختر صورة من جهازك
          </span>
        </div>
      </div>

      {/* Optional URL link input */}
      {showUrlInput && (
        <div className="pt-2 border-t border-rose-950/60 animate-in fade-in duration-150">
          <label className="block text-[11px] text-neutral-400 mb-1">
            رابط الصورة من الإنترنت (اختياري بدلاً من الرفع من الجهاز):
          </label>
          <input
            type="text"
            dir="ltr"
            value={currentImage}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#10090d] border border-rose-900 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      )}
    </div>
  );
};

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductConfig;
  onSaveProduct: (newProduct: ProductConfig) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveProduct,
}) => {
  // Working state for the product customizer
  const [formData, setFormData] = useState<ProductConfig>({ ...product });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'images' | 'variants' | 'presets'>('images');

  if (!isOpen) return null;

  const handlePresetSelect = (presetConfig: ProductConfig) => {
    setFormData({ ...presetConfig });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProduct(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Helper to add a new variant
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: 'لون جديد',
      colorName: 'Rose Edition',
      colorHex: '#f43f5e',
      strapType: 'خامة أوروبية معتمدة عالية الجودة',
      image: formData.images.hero,
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      alert('يجب الإبقاء على نسخة/لون واحد على الأقل للمنتج.');
      return;
    }
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: string) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, variants: updated });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-[#120a0f] border border-rose-950 rounded-3xl h-[92vh] flex flex-col shadow-2xl text-right animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-rose-950 flex items-center justify-between bg-[#190e15]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                استوديو تعديل وإضافة الصور من جهازك (rozakitchendz)
              </h2>
              <p className="text-xs text-rose-300/80">
                أضف صورك مباشرة من هاتفك أو حاسوبك، عدل الأسعار، الألوان، والمواصفات
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

        {/* Tab Navigation */}
        <div className="flex border-b border-rose-950 bg-[#160d13]/60 px-4 gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-rose-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>صور المنتج من جهازك</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-rose-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>بيانات واسم المنتج</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-rose-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>الأسعار</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'variants'
                ? 'bg-rose-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الألوان والنسخ ({formData.variants.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-rose-500 text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-[#20131b]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>قوالب الكتروميناج جاهزة</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Tab: Images Upload From Device */}
            {activeTab === 'images' && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    يمكنك الآن رفع أي صورة من هاتفك المحمول أو حاسوبك مباشرة وسيتم حفظها وعرضها فوراً في المتجر دون الحاجة لأي رابط.
                  </span>
                </div>

                {/* 1. Main Hero Image */}
                <DeviceImagePicker
                  label="1. الصورة الرئيسية للمنتج (Hero Image)"
                  description="هذه هي الصورة الأولى التي يشاهدها الزائر في واجهة المتجر"
                  currentImage={formData.images.hero}
                  onChange={(newImg) =>
                    setFormData({
                      ...formData,
                      images: { ...formData.images, hero: newImg },
                    })
                  }
                />

                {/* 2. Macro Detail Image */}
                <DeviceImagePicker
                  label="2. صورة التفاصيل الدقيقة المقربة (Macro Image)"
                  description="صورة مقربة لشاشة التحكم، الرؤوس، أو تفاصيل الجهاز"
                  currentImage={formData.images.macro || formData.images.hero}
                  onChange={(newImg) =>
                    setFormData({
                      ...formData,
                      images: { ...formData.images, macro: newImg },
                    })
                  }
                />

                {/* 3. Lifestyle Image */}
                <DeviceImagePicker
                  label="3. صورة الجهاز أثناء الاستخدام أو على رخامة المطبخ (Lifestyle)"
                  description="تظهر في معرض الصور لإعطاء انطباع حقيقي للزبائن"
                  currentImage={formData.images.lifestyle || formData.images.hero}
                  onChange={(newImg) =>
                    setFormData({
                      ...formData,
                      images: { ...formData.images, lifestyle: newImg },
                    })
                  }
                />

                {/* 4. Kit / Unboxing Image */}
                <DeviceImagePicker
                  label="4. صورة محتويات العلبة والملحقات (Kit / Unboxing)"
                  description="توضح للزبون ماذا سيستلم بالضبط في الصندوق"
                  currentImage={formData.images.kit || formData.images.hero}
                  onChange={(newImg) =>
                    setFormData({
                      ...formData,
                      images: { ...formData.images, kit: newImg },
                    })
                  }
                />
              </div>
            )}

            {/* Tab: General Info */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    اسم المنتج الرئيسي (بالعربية) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                    placeholder="مثال: قلاية فيليبس سمارت XXL الأوروبية"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    اسم المنتج أو الموديل بالإنجليزية (يظهر كعنوان ثانوي)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400 text-right"
                    placeholder="Philips Airfryer XXL Smart (Électroménager Européen)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      شارة أعلى العنوان (Kicker)
                    </label>
                    <input
                      type="text"
                      value={formData.kicker}
                      onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                      placeholder="أفضل جهاز الكتروميناج أوروبي للمطبخ الجزائري 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      شارة الصورة الرئيسية (Badge)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                      placeholder="معايير الجودة الأوروبية الأصلية CE"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    الوصف الترويجي للمنتج
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#170e14] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                    placeholder="اكتب وصفاً جذاباً يشرح فائدة جهاز الكتروميناج ومميزاته..."
                  />
                </div>

                {/* Bullet benefits */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    أبرز 4 نقاط قوة (Bullet Benefits)
                  </label>
                  <div className="space-y-2">
                    {formData.bulletBenefits.map((bullet, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...formData.bulletBenefits];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, bulletBenefits: updated });
                        }}
                        className="w-full px-3 py-2 bg-[#170e14] border border-rose-950 rounded-lg text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Pricing */}
            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-[#160d13] border border-rose-950 space-y-2">
                    <label className="block text-xs font-bold text-rose-400 mb-1.5">
                      سعر بيع المنتج المخفض (دج) <span className="text-white">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#10090d] border border-rose-900 rounded-xl text-white text-xl font-bold tabular-nums focus:outline-none focus:border-rose-400"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      هذا هو السعر الأساسي للقطعة الذي يدفعه الزبون عند استلام الطرد.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#160d13] border border-rose-950 space-y-2">
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                      السعر القديم قبل الخصم المشطوب (دج)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#10090d] border border-rose-900 rounded-xl text-neutral-300 text-xl font-bold tabular-nums line-through focus:outline-none focus:border-rose-400"
                    />
                    <p className="text-[11px] text-rose-400 mt-1 font-semibold">
                      نسبة التخفيض المحسوبة في المتجر: {Math.round(((formData.oldPrice - formData.basePrice) / formData.oldPrice) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200">
                  تم إلغاء العروض المزدوجة. الزبون يطلب مباشرة بسعر هذا المنتج عبر زر "اطلب الآن (الدفع عند الاستلام)" مع إمكانية زيادة الكمية بحرية.
                </div>
              </div>
            )}

            {/* Tab: Variants & Colors */}
            {activeTab === 'variants' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-bold">
                    الخيارات والألوان المتاحة للزبون:
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="py-1.5 px-3 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة لون / نسخة جديدة</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.variants.map((v, vIdx) => {
                    const fileInputVariantRef = React.createRef<HTMLInputElement>();
                    return (
                      <div
                        key={v.id}
                        className="p-4 rounded-2xl bg-[#170e14] border border-rose-950 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                              type="color"
                              value={v.colorHex}
                              onChange={(e) => handleUpdateVariant(vIdx, 'colorHex', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                              title="اختر لون النسخة"
                            />
                            <div className="space-y-1 flex-1">
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => handleUpdateVariant(vIdx, 'name', e.target.value)}
                                className="px-2.5 py-1 bg-[#10090d] border border-rose-900 rounded-lg text-white text-xs font-bold w-full sm:w-56"
                                placeholder="اسم اللون أو الموديل"
                              />
                              <input
                                type="text"
                                value={v.strapType}
                                onChange={(e) => handleUpdateVariant(vIdx, 'strapType', e.target.value)}
                                className="px-2.5 py-1 bg-[#10090d] border border-rose-950 rounded-lg text-neutral-400 text-[11px] w-full"
                                placeholder="وصف الخامة أو الملحق"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(vIdx)}
                            className="p-2 text-neutral-500 hover:text-red-400 self-end sm:self-center cursor-pointer transition-colors"
                            title="حذف هذا اللون"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Upload custom picture from device for this variant */}
                        <div className="flex items-center gap-3 pt-2 border-t border-rose-950/70">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#10090d] border border-rose-900 shrink-0">
                            <img
                              src={v.image || formData.images.hero}
                              alt={v.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <input
                            type="file"
                            ref={fileInputVariantRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                processImageFile(file, (dataUrl) => {
                                  handleUpdateVariant(vIdx, 'image', dataUrl);
                                });
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => fileInputVariantRef.current?.click()}
                            className="py-1.5 px-3 bg-[#1e121a] hover:bg-[#2a1725] text-rose-300 text-xs font-bold rounded-xl border border-rose-900/60 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-rose-400" />
                            <span>تغيير صورة هذا اللون من جهازك</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-[#170e14] border border-rose-950 text-xs text-neutral-300">
                  اختر أحد أجهزة الكتروميناج الأوروبية الجاهزة بالصور والمواصفات الكاملة لتطبيقها على متجر روزا كيتشن ديزاد فوراً:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableProductPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.config)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        formData.id === preset.config.id
                          ? 'bg-[#1b1017] border-rose-500 shadow-md shadow-rose-500/20'
                          : 'bg-[#160d13]/50 border-rose-950 hover:border-rose-900'
                      }`}
                    >
                      <div>
                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#10090d] mb-3 border border-rose-950">
                          <img
                            src={preset.config.images.hero}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1">{preset.label}</h4>
                        <p className="text-[11px] text-rose-400 font-bold tabular-nums">
                          {preset.config.basePrice.toLocaleString('ar-DZ')} دج
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePresetSelect(preset.config);
                        }}
                        className="mt-3 w-full py-2 bg-[#20131b] hover:bg-rose-500 hover:text-white text-rose-200 text-[11px] font-bold rounded-xl transition-colors"
                      >
                        تطبيق هذا القالب
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Save Actions */}
          <div className="p-4 sm:p-5 border-t border-rose-950 bg-[#160d13]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            {saveSuccess ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ الصور والتعديلات بنجاح وتحديث المتجر فوراً!</span>
              </div>
            ) : (
              <span className="text-xs text-neutral-400">
                كل صورة ترفعها من هاتفك أو حاسوبك تحفظ محلياً وتظهر في المتجر في نفس اللحظة.
              </span>
            )}

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-[#1b1017] hover:bg-[#251520] border border-rose-950 text-neutral-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none py-2.5 px-6 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 hover:from-rose-400 text-neutral-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-500/20 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتطبيق التغييرات فوراً</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
