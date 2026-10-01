import React, { useState, useEffect } from 'react';
import {
  StoreOwner,
  initialStoreOwner,
  ProductConfig,
  europeanAirfryerPreset,
  ProductVariant,
  CustomerReview,
  initialReviews,
  CustomerOrder,
} from './data/storeData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { GallerySection } from './components/GallerySection';
import { GuaranteesSection } from './components/GuaranteesSection';
import { OrderFormSection } from './components/OrderFormSection';
import { TechSpecsSection } from './components/TechSpecsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { LiveSocialProof } from './components/LiveSocialProof';
import { OrdersModal } from './components/OrdersModal';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { AdminDrawer } from './components/AdminDrawer';
import { initTrackingPixels } from './utils/tracking';

export default function App() {
  // Store Owner profile state (persisted with rozakitchendz in rose theme)
  const [owner, setOwner] = useState<StoreOwner>(() => {
    const saved = localStorage.getItem('rozakitchendz_owner');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          storeName: "rozakitchendz | الكتروميناج الأوروبي الأصلي",
        };
      } catch (e) {
        // fallback
      }
    }
    return initialStoreOwner;
  });

  // Current Active Product Configuration: Defaults to European Smart Airfryer XXL
  const [product, setProduct] = useState<ProductConfig>(() => {
    const saved = localStorage.getItem('rozakitchendz_product_eu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return europeanAirfryerPreset;
  });

  // Active Variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return product.variants[0];
  });

  // Keep selected variant in sync when product changes
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product.id, product.variants]);

  // Orders State (Cleaned & Persisted: Real Orders only)
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('rozakitchendz_orders_live');
    if (saved) {
      try {
        const parsed: CustomerOrder[] = JSON.parse(saved);
        // Exclude dummy test orders if any
        return parsed.filter(
          (o) =>
            !o.customerName.includes('نادية') &&
            !o.customerName.includes('سهام') &&
            !['ROZA-918230', 'ROZA-730194'].includes(o.id)
        );
      } catch (e) {
        // fallback
      }
    }
    // Clean initial state with zero dummy orders
    return [];
  });

  // Reviews State (persisted)
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('rozakitchendz_reviews_eu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialReviews;
  });

  // Modals Visibility
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize Meta & TikTok tracking pixels on mount
  useEffect(() => {
    initTrackingPixels();
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('rozakitchendz_owner', JSON.stringify(owner));
  }, [owner]);

  useEffect(() => {
    localStorage.setItem('rozakitchendz_product_eu', JSON.stringify(product));
  }, [product]);

  useEffect(() => {
    localStorage.setItem('rozakitchendz_orders_eu', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rozakitchendz_reviews_eu', JSON.stringify(reviews));
  }, [reviews]);

  const handleOrderCreated = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب من سجلات rozakitchendz؟')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  };

  const handleAddReview = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleSaveProduct = (newProduct: ProductConfig) => {
    setProduct(newProduct);
  };

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d080b] text-neutral-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-300">
      {/* Navigation in Pink/Rose Theme */}
      <Navbar
        owner={owner}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenProductCustomizer={() => setIsCustomizerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        ordersCount={orders.length}
      />

      {/* Main Landing Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          owner={owner}
          product={product}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          onOrderClick={scrollToOrderForm}
          onOpenProductCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Features Section */}
        <FeaturesSection product={product} />

        {/* Gallery Section */}
        <GallerySection product={product} />

        {/* Guarantees Section */}
        <GuaranteesSection owner={owner} product={product} />

        {/* Core COD Purchase Form */}
        <OrderFormSection
          owner={owner}
          product={product}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          onOrderCreated={handleOrderCreated}
        />

        {/* Technical Specifications */}
        <TechSpecsSection specs={product.specs} productName={product.name} />

        {/* Customer Reviews & Feedback */}
        <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />

        {/* FAQs */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        owner={owner}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenProductCustomizer={() => setIsCustomizerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Live Social Proof Sales Popups */}
      <LiveSocialProof />

      {/* Mobile Sticky Buy Bar */}
      <MobileStickyBar
        product={product}
        onOrderClick={scrollToOrderForm}
        owner={owner}
      />

      {/* Space 1: Dedicated Orders Manager ("بلاصة تدخلني فيها الطلبات") */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        owner={owner}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* Space 2: Dedicated Product Customizer ("بلاصة نغير فيها كل منتج وش نحب ندير وش نبدل") */}
      <ProductCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        product={product}
        onSaveProduct={handleSaveProduct}
      />

      {/* Admin Settings Drawer */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        owner={owner}
        onUpdateOwner={setOwner}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        basePrice={product.basePrice}
        onUpdateBasePrice={(newPrice) =>
          setProduct((prev) => ({ ...prev, basePrice: newPrice }))
        }
      />
    </div>
  );
}
