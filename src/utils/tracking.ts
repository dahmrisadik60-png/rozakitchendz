// Tracking & Analytics Utilities (Meta Pixel & TikTok Pixel & Formspree Emailer)
import { CustomerOrder, AbandonedLead } from '../data/storeData';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
    META_PIXEL_ID?: string;
    TIKTOK_PIXEL_ID?: string;
    FORMSPREE_ENDPOINT?: string;
  }
}

// Default Configuration (Easy to customize by merchant)
export const TRACKING_CONFIG = {
  // Set your Meta (Facebook) Pixel ID here
  META_PIXEL_ID: 'YOUR_META_PIXEL_ID',
  // Set your TikTok Pixel ID here
  TIKTOK_PIXEL_ID: 'YOUR_TIKTOK_PIXEL_ID',
  // Formspree endpoint (free instant email forwarding to dahmrisadik60@gmail.com)
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/mqaeveoq',
  // Web3Forms backup access key
  WEB3FORMS_ACCESS_KEY: 'YOUR_WEB3FORMS_ACCESS_KEY',
  // Merchant email
  MERCHANT_EMAIL: 'dahmrisadik60@gmail.com',
};

// Initialize Pixels if configured
export function initTrackingPixels() {
  if (typeof window === 'undefined') return;

  // Initialize Meta Pixel if ID is provided and not placeholder
  const metaId = window.META_PIXEL_ID || TRACKING_CONFIG.META_PIXEL_ID;
  if (metaId && metaId !== 'YOUR_META_PIXEL_ID' && !window.fbq) {
    /* eslint-disable */
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    if (window.fbq) {
      window.fbq('init', metaId);
      window.fbq('track', 'PageView');
    }
  }

  // Initialize TikTok Pixel if provided
  const tiktokId = window.TIKTOK_PIXEL_ID || TRACKING_CONFIG.TIKTOK_PIXEL_ID;
  if (tiktokId && tiktokId !== 'YOUR_TIKTOK_PIXEL_ID' && !window.ttq) {
    /* eslint-disable */
    (function(w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function(t: any, e: any) {
        t[e] = function() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function(t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function(e: any, n: any) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var o = document.createElement('script');
        o.type = 'text/javascript';
        o.async = !0;
        o.src = i + '?sdkid=' + e + '&lib=' + t;
        var a = document.getElementsByTagName('script')[0];
        a.parentNode?.insertBefore(o, a);
      };
      ttq.load(tiktokId);
      ttq.page();
    })(window, document, 'ttq');
  }
}

// Track Purchase / Lead event
export function trackOrderSuccess(order: CustomerOrder) {
  // 1. Meta Pixel Purchase & Lead
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: order.totalPrice,
      currency: 'DZD',
      content_name: order.productName,
      content_type: 'product',
      num_items: order.quantity,
    });
    window.fbq('track', 'Lead', {
      content_name: order.productName,
      value: order.totalPrice,
      currency: 'DZD',
    });
  }

  // 2. TikTok Pixel CompletePayment
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('CompletePayment', {
      content_name: order.productName,
      value: order.totalPrice,
      currency: 'DZD',
      quantity: order.quantity,
    });
  }

  // 3. Dispatch Background Email via Formspree to dahmrisadik60@gmail.com
  sendOrderEmailNotification(order).catch(() => {});
}

// Background Email Notification via Formspree & Web3Forms
export async function sendOrderEmailNotification(order: CustomerOrder) {
  const emailBody = `
طلب جديد وارد عبر متجر Rozakitchendz:
------------------------------------------
رقم الطلب والفاتورة: #${order.id}
اسم الزبون: ${order.customerName}
رقم الهاتف: ${order.customerPhone}
الولاية: ولاية ${order.wilayaName} (البلدية: ${order.commune})
نوع التوصيل: ${order.deliveryType === 'home' ? 'توصيل لباب المنزل' : 'استلام من مكتب التوصيل'}
العنوان بالتفصيل: ${order.address}
------------------------------------------
المنتج: ${order.productName}
النسخة / اللون: ${order.variantName}
نوع العرض: ${order.packTitle} (الكمية: ${order.quantity})
سعر المنتجات: ${order.productPrice} دج
تكلفة التوصيل: ${order.deliveryFee === 0 ? 'مجاني' : order.deliveryFee + ' دج'}
المبلغ الإجمالي عند الاستلام: ${order.totalPrice} دج
تاريخ وتوقيت الطلب: ${order.createdAt}
------------------------------------------
يرجى الاتصال بالزبون فوراً على الرقم: ${order.customerPhone} لتأكيد الشحن.
  `.trim();

  // 1. Send via Formspree
  const formspreeUrl = window.FORMSPREE_ENDPOINT || TRACKING_CONFIG.FORMSPREE_ENDPOINT;
  if (formspreeUrl) {
    try {
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          subject: `طلب جديد مؤكد #${order.id} - ${order.customerName} (${order.wilayaName})`,
          orderId: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          wilaya: order.wilayaName,
          commune: order.commune,
          address: order.address,
          product: order.productName,
          variant: order.variantName,
          offer: order.packTitle,
          quantity: order.quantity,
          totalPrice: `${order.totalPrice} DZD`,
          deliveryType: order.deliveryType,
          createdAt: order.createdAt,
          message: emailBody,
          _replyto: TRACKING_CONFIG.MERCHANT_EMAIL,
        }),
      });
    } catch (e) {
      console.warn('Formspree dispatch notice:', e);
    }
  }

  // 2. Fallback to Web3Forms if key is set
  if (
    TRACKING_CONFIG.WEB3FORMS_ACCESS_KEY &&
    TRACKING_CONFIG.WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'
  ) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: TRACKING_CONFIG.WEB3FORMS_ACCESS_KEY,
          subject: `طلب جديد مؤكد #${order.id} من متجر Rozakitchendz`,
          from_name: 'Rozakitchendz Store Bot',
          to_email: TRACKING_CONFIG.MERCHANT_EMAIL,
          message: emailBody,
        }),
      });
    } catch (err) {
      console.warn('Web3Forms dispatch notice:', err);
    }
  }
}

// Abandoned Cart Capture (استرجاع السلات والطلبات المتروكة)
export function captureAbandonedLead(name: string, phone: string, wilaya: string, product: string) {
  if (!name.trim() || !phone.trim() || phone.length < 10) return;

  const leadKey = `rozakitchendz_abandoned_${phone.replace(/\D/g, '')}`;
  if (localStorage.getItem(leadKey)) return; // Already captured recently

  const abandonedLead: AbandonedLead = {
    id: `ABN-${Date.now()}`,
    customerName: name.trim(),
    customerPhone: phone.trim(),
    wilayaName: wilaya,
    timestamp: new Date().toLocaleString('ar-DZ'),
    productName: product,
  };

  localStorage.setItem(leadKey, JSON.stringify(abandonedLead));

  // Store in global list of captured leads
  const existingList: AbandonedLead[] = JSON.parse(
    localStorage.getItem('rozakitchendz_abandoned_leads_list') || '[]'
  );
  localStorage.setItem(
    'rozakitchendz_abandoned_leads_list',
    JSON.stringify([abandonedLead, ...existingList.slice(0, 49)])
  );
}
