/* ==========================================================================
   DataSouq — إعدادات الموقع
   عدّل الملف ده وبس عشان تغيّر رقم الواتساب أو بيانات التواصل.
   ========================================================================== */

const SITE_CONFIG = {
  /* -----------------------------------------------------------------------
     ⚠️ مهم: غيّر الرقم ده لرقم الواتساب الحقيقي.
     الصيغة: كود الدولة + الرقم — من غير + ومن غير أصفار في الأول ومن غير مسافات.
     أمثلة:  مصر 201012345678  |  السعودية 966512345678  |  الإمارات 971501234567
     ----------------------------------------------------------------------- */
  whatsappNumber: "201000000000",

  /* لسه الرقم مش متغيّر؟ الموقع هيوري تنبيه. خليها false بعد ما تحطه. */
  showPlaceholderWarning: true,

  brandName: "DataSouq",
  brandNameAr: "داتا سوق",
  tagline: "سوق البيانات والحلول الرقمية",

  /* العملة المعروضة جنب الأسعار */
  currency: "ج.م",

  /* بيانات التواصل في الفوتر */
  email: "mbi.datasouq@gmail.com",
  workingHours: "السبت – الخميس، ٩ ص – ٦ م",

  /* الرسالة اللي هتتبعت على الواتساب لما حد يضغط على منتج */
  messageTemplate: (product, pageUrl) =>
    `السلام عليكم 👋\n\nمهتم بالمنتج ده من ${SITE_CONFIG.brandNameAr}:\n\n` +
    `📦 *${product.name}*\n` +
    `🏷️ التصنيف: ${product.category}\n` +
    `💰 السعر: ${formatPrice(product.price)} ${SITE_CONFIG.currency}\n` +
    `🔗 ${pageUrl}#${product.id}\n\n` +
    `ممكن تفاصيل أكتر؟`,

  /* رسالة الاستفسار العام */
  generalMessage: () =>
    `السلام عليكم 👋\n\nحابب أستفسر عن الخدمات المتاحة في ${SITE_CONFIG.brandNameAr}.`,
};

/* تنسيق السعر بفواصل الآلاف */
function formatPrice(value) {
  if (value === 0) return "مجانًا";
  if (value === null || value === undefined) return "حسب الطلب";
  return new Intl.NumberFormat("en-US").format(value);
}

/* بناء رابط واتساب جاهز */
function buildWhatsAppUrl(text) {
  const number = String(SITE_CONFIG.whatsappNumber).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
