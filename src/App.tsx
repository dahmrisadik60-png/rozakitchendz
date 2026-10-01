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
  // Store Owner profile state
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

  // Current Active Product Configuration
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

  // Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('rozakitchendz_orders_live') || localStorage.getItem('rozakitchendz_orders_eu');
    if (saved) {
      try {
        const parsed: CustomerOrder[] = JSON.parse(saved);
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
    return [];
  });

  // Reviews State
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

  // Protected Admin State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modals Visibility
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Keyboard shortcut (F2) to unlock Admin Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        const pass = prompt('أدخل كلمة السر للوصول إلى لوحة الإدارة والطلبات:');
        if (pass === '1234') { // كلمة السر الافتراضية
          setIsAuthenticated(true);
          setIsOrdersOpen(true);
        } else if (pass !== null) {
          alert('كلمة السر غير صحيحة!');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    localStorage.setItem('rozakitchendz_orders_live', JSON.stringify(orders));
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

  const verifyAdminAccess = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      const pass = prompt('أدخل كلمة السر للوصول للإدارة:');
      if (pass === '1234') {
        setIsAuthenticated(true);
        action();
      } else if (pass !== null) {
        alert('كلمة السر غير صحيحة!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d080b] text-neutral-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-300">
      {/* Navigation (Customer Only View) */}
      <Navbar
        owner={owner}
        onOpenOrders={() => verifyAdminAccess(() => setIsOrdersOpen(true))}
        onOpenProductCustomizer={() => verifyAdminAccess(() => setIsCustomizerOpen(true))}
        onOpenAdmin={() => verifyAdminAccess(() => setIsAdminOpen(true))}
        ordersCount={isAuthenticated ? orders.length : 0}
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
          onOpenProductCustomizer={() => verifyAdminAccess(() => setIsCustomizerOpen(true))}
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
        onOpenOrders={() => verifyAdminAccess(() => setIsOrdersOpen(true))}
        onOpenProductCustomizer={() => verifyAdminAccess(() => setIsCustomizerOpen(true))}
        onOpenAdmin={() => verifyAdminAccess(() => setIsAdminOpen(true))}
      />

      {/* Live Social Proof Sales Popups */}
      <LiveSocialProof />

      {/* Mobile Sticky Buy Bar */}
      <MobileStickyBar
        product={product}
        onOrderClick={scrollToOrderForm}
        owner={owner}
      />

      {/* Admin Modals (Only Accessible After Authentication) */}
      {isAuthenticated && (
        <>
          <OrdersModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            orders={orders}
            owner={owner}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />

          <ProductCustomizerModal
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            product={product}
            onSaveProduct={handleSaveProduct}
          />

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
        </>
      )}
    </div>
  );
}
