# Architecture Decisions — قرارات الهندسة المعمارية

---

## ADR-001: Telegram as the Primary User Interface

**القرار:** استخدام تيليغرام كواجهة أساسية للعملاء والسائقين بدلًا من تطبيق موبايل أو موقع ويب.

**السبب:**
- انتشار واسع في السوق الخليجي السعودي
- لا يحتاج العميل أو السائق لتثبيت أي تطبيق إضافي
- تكلفة تطوير وصيانة أقل بكثير من تطبيق موبايل
- التحقق من الهوية عبر رقم الهاتف المرتبط بتيليغرام
- الإشعارات الفورية مدمجة مجانًا

**البدائل المدروسة:** تطبيق React Native / Expo، موقع PWA.

**سبب عدم اختيارها:** تطلب تثبيتًا، توزيعًا عبر المتاجر، وتكلفة تطوير أعلى في مرحلة MVP.

**الأثر:** السرعة في الوصول للسوق، محدودية تجربة المستخدم المرئية.

---

## ADR-002: Supabase PostgreSQL as the Database

**القرار:** استخدام Supabase (PostgreSQL) مع Drizzle ORM للـ migrations والـ queries، وـRaw SQL RPCs للعمليات الحرجة.

**السبب:**
- مشروع Koolex (أنضج مشروع في المجموعة) أثبت فاعلية هذا الاختيار بـ 17 migration ناجحة
- Row-Level Security (RLS) يوفر أمانًا على مستوى قاعدة البيانات
- Supabase يوفر Auth + Realtime مجانًا
- PostgreSQL يدعم الـ row-level locking اللازم للعمليات الذرية

**البدائل المدروسة:** MongoDB، PlanetScale MySQL، SQLite.

**سبب عدم اختيارها:** PostgreSQL أفضل للـ transactions الذرية اللازمة لمنع double-accept في الطلبات.

**الأثر:** حل مشكلة التنافس (race condition) في قبول الطلبات بشكل موثق ومُختبر.

---

## ADR-003: Atomic SQL RPCs for Critical Operations

**القرار:** استخدام Stored Procedures/RPCs بـ PostgreSQL row-level locking للعمليات الحرجة بدلًا من logic على مستوى التطبيق.

**العمليات الحرجة:**
- `accept_request(request_id, driver_id)` — قبول طلب (مشوار أو توصيل)
- `cancel_request(request_id, actor_id, reason)` — إلغاء طلب
- `expire_stale_offers()` — تنظيف العروض المنتهية الصلاحية

**السبب:**
- مستوثق من ADR-001 في Koolex بـ test plan كامل للـ double-accept
- التطبيق متعدد الـ threads/instances — الـ locking على مستوى DB هو الضمان الوحيد
- يمنع حالة "سائقان يقبلان نفس الطلب في نفس اللحظة"

**الأثر:** أمان تام من الـ race conditions، قابلية للاختبار على مستوى PostgreSQL مباشرة.

---

## ADR-004: Dual Service Types (Rides + Delivery)

**القرار:** إضافة نوع الخدمة (service_type) كـ enum أساسي في جميع جداول الطلبات والسائقين.

**القيم:** `ride` | `delivery`

**قواعد العمل المضمّنة في الـ schema:**
- كل سائق لديه `active_service_mode` (الخدمة التي يعمل بها الآن)
- كل سائق لديه `subscription_plan` يحدد الخدمات المصرح له بها
- قيد `active_request_lock`: لا يمكن للسائق استقبال طلب جديد إذا كان لديه طلب نشط (partial unique index في PostgreSQL)

**السبب:**
- طلب صريح من مالك المنتج
- يتيح للسائق خدمة واحدة بدون تعقيد في MVP، وخدمتين مع الاشتراك المزدوج

**الأثر:** توسيع نطاق المنصة بدون تعقيد المنطق — نفس الـ dispatching logic يعمل للنوعين.

---

## ADR-005: Platform-Agnostic Pricing (No Commission)

**القرار:** المنصة لا تحدد سعر الطلب ولا تحصل على عمولة. السعر يُتفق عليه بين العميل والسائق. الإيراد يأتي من الاشتراكات فقط.

**السبب:**
- النموذج التجاري الأصلي من مشروع ODD_a-trip (أول مشروع في المجموعة)
- يبسّط الـ schema (لا حاجة لـ payment processing للطلبات)
- يزيل الحاجة لبوابة دفع في MVP
- يقلل التعقيد التنظيمي في المرحلة الأولى

**الأثر:** MVP أسرع وأبسط؛ المرحلة الثانية ستضيف اشتراكات مدفوعة عبر موسر أو Stripe.

---

## ADR-006: Free Trial Month for New Drivers

**القرار:** أول شهر مجاني لجميع السائقين الجدد. خلال التجربة المجانية: خدمة واحدة فعّالة في نفس الوقت (يمكن التبديل بين الخدمتين في أي وقت).

**خطط الاشتراك بعد التجربة:**
| الخطة | السعر |
|---|---|
| مشاوير فقط | 250 SAR/شهر |
| توصيل فقط | 250 SAR/شهر |
| الخدمتان معًا | 400 SAR/شهر |

**التنفيذ:**
- `subscription_plan`: `free_trial` | `rides` | `delivery` | `both`
- `trial_started_at` + `trial_ends_at` لتتبع نهاية التجربة
- التحقق من الصلاحية قبل كل dispatch

---

## ADR-007: Monorepo with pnpm Workspaces

**القرار:** بناء المشروع كـ pnpm monorepo مع فصل واضح بين الـ artifacts والـ libs.

**الهيكل:**
- `artifacts/ride-admin` — لوحة الإدارة (React + Vite)
- `artifacts/api-server` — Backend (Express 5 + Telegram bots)
- `lib/db` — Drizzle ORM schema (shared)
- `lib/api-spec` — OpenAPI spec (single source of truth)
- `lib/api-client-react` — Generated hooks (consumed by admin)
- `lib/api-zod` — Generated Zod schemas (consumed by backend)

**السبب:**
- فصل المسؤوليات بوضوح
- Codegen يضمن type safety من OpenAPI إلى React إلى Express
- سهولة إضافة artifacts جديدة (تطبيق موبايل، موقع عملاء) لاحقًا

---

## ADR-008: Koolex as the Foundation Project

**القرار:** اعتماد Koolex كمشروع أساس للمنتج النهائي، مع استخلاص أفضل ما في المشاريع الأخرى.

**السبب:**
- أنضج مشروع (17 migration، ADR مكتوب، test plan للـ concurrency)
- الوحيد الذي حل مشكلة double-accept بشكل موثق
- يحتوي على أكمل schema للـ ride lifecycle
- أحدث تاريخيًا (July 2026)

**ما استُخلص من المشاريع الأخرى:**
- `ODD_a-trip`: النموذج التجاري (اشتراك + 0% عمولة)
- `Nona`: خدمة التوصيل، multi-city، scheduler workers
- `Manus-v1`: state machine contracts، idempotency
- `swift-telegram-ride`: Telegram UX patterns

**ما لم يُعتمد:**
- Python bots من ODD (تم استبدالها بـ TypeScript للتوحيد)
- Over-engineering من Manus-v1 (platform engines غير ضرورية في MVP)
