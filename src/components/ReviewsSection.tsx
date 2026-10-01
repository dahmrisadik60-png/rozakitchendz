import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, MapPin } from 'lucide-react';
import { CustomerReview } from '../data/storeData';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const review: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      city: newCity.trim() || 'الجزائر',
      rating: newRating,
      date: 'الآن',
      comment: newComment.trim(),
      variant: 'أسود ملكي مع حواف روز جولد وردية',
      verified: true,
    };

    onAddReview(review);
    setNewAuthor('');
    setNewCity('');
    setNewComment('');
    setShowAddModal(false);
  };

  return (
    <section id="reviews" className="py-20 bg-[#10090d]/40 border-t border-rose-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
              <span>تجارب حقيقية موثقة</span>
              <span aria-hidden="true">·</span>
              <span>زبائن روزا كيتشن</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              ماذا يقول زبائننا في مختلف الولايات؟
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#140c11] border border-rose-950 px-4 py-2 rounded-2xl">
              <div className="flex text-rose-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-400 text-rose-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-white tabular-nums">4.9 / 5</span>
              <span className="text-xs text-neutral-400">(+310 طلب مؤكد)</span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 bg-[#1a1017] hover:bg-[#251520] text-rose-200 text-xs font-bold rounded-2xl border border-rose-900/60 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4 text-rose-400" />
              <span>أضف تجربتك</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#140c11]/80 border border-rose-950/80 space-y-4 hover:border-rose-900 transition-all text-right"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        مشترٍ مؤكد
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>{rev.city}</span>
                    <span aria-hidden="true" className="text-rose-500">·</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                <div className="flex text-rose-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="pt-2 border-t border-rose-950/70 text-[11px] text-neutral-400">
                <span>الموديل: {rev.variant}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding review */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#140c11] border border-rose-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right">
              <h3 className="text-xl font-bold text-white mb-2">أضف تقييمك لجهاز الكتروميناج</h3>
              <p className="text-xs text-neutral-400 mb-6">
                مشاركتك تساعد زوار متجر روزا كيتشن في الشراء بكل شفافية.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    الاسم واللقب
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="مثال: ياسمين بوقرة"
                    className="w-full px-3 py-2 bg-[#1b1017] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    ولايتك / مدينتك
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="مثال: الجزائر العاصمة"
                    className="w-full px-3 py-2 bg-[#1b1017] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    التقييم
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? 'fill-rose-400 text-rose-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    رأيك وتجربتك بالتفصيل
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="اكتبي عن جودة الطهي، سرعة التوصيل، التعامل..."
                    className="w-full px-3 py-2 bg-[#1b1017] border border-rose-950 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-l from-rose-500 via-rose-400 to-pink-400 text-neutral-950 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    نشر التقييم
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 bg-[#180e14] hover:bg-[#20141c] text-neutral-400 hover:text-white rounded-xl text-sm border border-rose-950 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
