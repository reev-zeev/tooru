# Tooru Platform — منصة طورو

> منصة سعودية خليجية لخدمات المشاوير والتوصيل عبر تيليغرام

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)
[![Telegram](https://img.shields.io/badge/Interface-Telegram-blue)](https://telegram.org/)

---

## ما هي منصة طورو؟

منصة طورو هي نظام متكامل لإدارة خدمات **المشاوير (التكسي)** و**التوصيل (الديليفري)** يعمل عبر بوتات تيليغرام، ويُدار من خلال لوحة تحكم إدارية متكاملة.

### الفكرة الأساسية
- السعر يُتفق عليه مباشرة بين العميل والسائق
- المنصة لا تحصل على عمولة من قيمة المشوار أو التوصيل
- السائقون يدفعون اشتراكًا شهريًا ويحتفظون بـ 100% من أجورهم
- الدفع يتم خارج المنصة (كاش أو تحويل)

---

## المكونات الرئيسية

| المكوّن | الوصف | التقنية |
|---|---|---|
| **بوت العميل** | طلب مشوار أو توصيل | Telegram Bot API |
| **بوت السائق** | استقبال الطلبات، إدارة الحالة، التسجيل | Telegram Bot API |
| **لوحة الإدارة** | إدارة السائقين، الرحلات، الأسعار، العمليات الحية | React + Vite (Arabic RTL) |
| **API Server** | منطق الأعمال، ووصلات تيليغرام، مهام الجدولة | Express 5 + TypeScript |
| **قاعدة البيانات** | تخزين دائم مع Row-Level Security | Supabase PostgreSQL |

---

## خدمات المنصة

### 1. المشاوير / التكسي (Rides)
العميل يطلب نقل راكب من نقطة إلى أخرى.

### 2. التوصيل (Delivery)
العميل يطلب توصيل غرض، طلب، أو شحنة من نقطة إلى أخرى.

---

## نظام الاشتراكات

| الخطة | السعر الشهري |
|---|---|
| أول شهر (تجريبي) | **مجاني** — خدمة واحدة في نفس الوقت |
| اشتراك المشاوير فقط | **250 SAR** |
| اشتراك التوصيل فقط | **250 SAR** |
| اشتراك الخدمتين معًا | **400 SAR** |

---

## تشغيل المشروع

### المتطلبات
- Node.js 24+
- pnpm 10+
- حساب Supabase
- بوتا تيليغرام (عميل + سائق)

### المتغيرات البيئية المطلوبة
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TELEGRAM_RIDER_BOT_TOKEN=...
TELEGRAM_DRIVER_BOT_TOKEN=...
```

### تشغيل الخوادم
```bash
# API Server
pnpm --filter @workspace/api-server run dev

# Admin Dashboard
pnpm --filter @workspace/ride-admin run dev

# Push DB schema to Supabase
pnpm --filter @workspace/db run push

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

---

## هيكل المشروع

```
artifacts/
  ride-admin/          ← لوحة الإدارة (React + Vite، عربي RTL)
  api-server/          ← API Server (Express 5 + Telegram bots)

lib/
  db/                  ← Drizzle ORM schema + migrations
  api-spec/            ← OpenAPI specification
  api-client-react/    ← Generated React Query hooks
  api-zod/             ← Generated Zod schemas
```

---

## التوثيق

- [`ARCHITECTURE_DECISIONS.md`](./ARCHITECTURE_DECISIONS.md) — القرارات الهندسية المهمة
- [`LEGACY_SYNTHESIS_REPORT.md`](./LEGACY_SYNTHESIS_REPORT.md) — تقرير استخلاص المشاريع السابقة

---

## خارطة الطريق

### MVP (الإصدار الأول)
- [x] قاعدة البيانات الكاملة
- [x] بوت العميل (مشاوير + توصيل)
- [x] بوت السائق (تسجيل، KYC، الاشتراك، استقبال الطلبات)
- [x] لوحة الإدارة (السائقون، الرحلات، التوصيل، الأسعار، المدن، الطوارئ)
- [x] نظام الاشتراكات والتجربة المجانية

### المستقبل
- [ ] بوابة دفع (موسر / Stripe)
- [ ] تطبيق ويب للعملاء
- [ ] تطبيق ويب للسائقين
- [ ] تعدد المشغّلين / الامتياز
- [ ] نظام كشف الاحتيال بالذكاء الاصطناعي
