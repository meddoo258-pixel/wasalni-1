/**
 * Email Notification Service for Wasalni
 * Uses the built-in LLM + notification system to send formatted notifications
 * when subscriptions are created or their status changes.
 */
import { notifyOwner } from "./_core/notification";

// ===== Email Template Types =====
type SubscriptionEmailData = {
  fullName: string;
  phone: string;
  email?: string | null;
  serviceType: string;
  city: string;
  pickupAddress: string;
  dropoffAddress: string;
  preferredTime?: string | null;
  numberOfPassengers?: number;
  status?: string;
};

type ContactEmailData = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

type RentalEmailData = {
  fullName: string;
  phone: string;
  email?: string | null;
  vehicleType: string;
  startDate: string;
  endDate: string;
  status?: string;
};

type CorporateEmailData = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  serviceType: string;
  employeeCount?: number | null;
  status?: string;
};

type DriverEmailData = {
  fullName: string;
  phone: string;
  email?: string | null;
  city: string;
  driverType: string;
  status?: string;
};

// ===== Service Type Labels =====
const SERVICE_TYPE_LABELS: Record<string, string> = {
  employee: "نقل موظفات",
  student: "نقل طالبات",
  teacher: "نقل معلمات",
  corporate: "نقل شركات",
  employees: "نقل موظفين",
  students: "نقل طلاب",
  mixed: "خدمات مختلطة",
  airport: "خدمة المطار",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  active: "مفعّل",
  approved: "تمت الموافقة",
  expired: "منتهي",
  cancelled: "ملغي",
  rejected: "مرفوض",
  contacted: "تم التواصل",
  completed: "مكتمل",
};

const VEHICLE_LABELS: Record<string, string> = {
  sedan: "سيدان",
  h1: "هيونداي H1",
  hiace: "هايس",
  coaster: "كوستر",
};

// ===== Notification Functions =====

/**
 * Send notification when a new subscription is created
 */
export async function notifyNewSubscription(data: SubscriptionEmailData): Promise<boolean> {
  const serviceLabel = SERVICE_TYPE_LABELS[data.serviceType] || data.serviceType;
  
  const title = `📋 اشتراك شهري جديد - ${serviceLabel}`;
  const content = [
    `✅ تم استلام طلب اشتراك شهري جديد`,
    ``,
    `📌 تفاصيل الطلب:`,
    `• الاسم: ${data.fullName}`,
    `• الهاتف: ${data.phone}`,
    data.email ? `• البريد: ${data.email}` : null,
    `• نوع الخدمة: ${serviceLabel}`,
    `• المدينة: ${data.city}`,
    `• نقطة الانطلاق: ${data.pickupAddress}`,
    `• نقطة الوصول: ${data.dropoffAddress}`,
    data.preferredTime ? `• الوقت المفضل: ${data.preferredTime}` : null,
    data.numberOfPassengers ? `• عدد الركاب: ${data.numberOfPassengers}` : null,
    ``,
    `⏳ الحالة: قيد المراجعة`,
    `يرجى مراجعة الطلب من لوحة الإدارة واتخاذ الإجراء المناسب.`,
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when subscription status changes
 */
export async function notifySubscriptionStatusChange(
  data: SubscriptionEmailData,
  newStatus: string,
  oldStatus?: string
): Promise<boolean> {
  const serviceLabel = SERVICE_TYPE_LABELS[data.serviceType] || data.serviceType;
  const statusLabel = STATUS_LABELS[newStatus] || newStatus;
  const oldStatusLabel = oldStatus ? (STATUS_LABELS[oldStatus] || oldStatus) : "قيد المراجعة";

  const title = `🔄 تحديث حالة اشتراك - ${data.fullName}`;
  const content = [
    `تم تحديث حالة الاشتراك الشهري`,
    ``,
    `👤 المشترك: ${data.fullName} (${data.phone})`,
    `📋 نوع الخدمة: ${serviceLabel}`,
    `📍 المدينة: ${data.city}`,
    ``,
    `📊 تغيير الحالة:`,
    `• من: ${oldStatusLabel}`,
    `• إلى: ${statusLabel}`,
    ``,
    newStatus === "active" ? `✅ تم تفعيل الاشتراك بنجاح. سيتم التواصل مع العميل لتنسيق المواعيد.` : "",
    newStatus === "cancelled" ? `❌ تم إلغاء الاشتراك.` : "",
    newStatus === "expired" ? `⏰ انتهت صلاحية الاشتراك.` : "",
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when a new contact message is received
 */
export async function notifyNewContactMessage(data: ContactEmailData): Promise<boolean> {
  const title = `📩 رسالة تواصل جديدة - ${data.subject}`;
  const content = [
    `تم استلام رسالة جديدة من نموذج التواصل`,
    ``,
    `👤 المرسل: ${data.name}`,
    `📧 البريد: ${data.email}`,
    data.phone ? `📱 الهاتف: ${data.phone}` : null,
    `📌 الموضوع: ${data.subject}`,
    ``,
    `💬 الرسالة:`,
    data.message,
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when a new rental request is submitted
 */
export async function notifyNewRentalRequest(data: RentalEmailData): Promise<boolean> {
  const vehicleLabel = VEHICLE_LABELS[data.vehicleType] || data.vehicleType;
  
  const title = `🚗 طلب تأجير جديد - ${vehicleLabel}`;
  const content = [
    `✅ تم استلام طلب تأجير مركبة جديد`,
    ``,
    `📌 تفاصيل الطلب:`,
    `• الاسم: ${data.fullName}`,
    `• الهاتف: ${data.phone}`,
    data.email ? `• البريد: ${data.email}` : null,
    `• نوع المركبة: ${vehicleLabel}`,
    `• تاريخ البداية: ${data.startDate}`,
    `• تاريخ النهاية: ${data.endDate}`,
    ``,
    `⏳ الحالة: قيد المراجعة`,
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when a new corporate request is submitted
 */
export async function notifyNewCorporateRequest(data: CorporateEmailData): Promise<boolean> {
  const serviceLabel = SERVICE_TYPE_LABELS[data.serviceType] || data.serviceType;
  
  const title = `🏢 طلب شركة جديد - ${data.companyName}`;
  const content = [
    `✅ تم استلام طلب خدمة شركات جديد`,
    ``,
    `📌 تفاصيل الطلب:`,
    `• الشركة: ${data.companyName}`,
    `• جهة الاتصال: ${data.contactName}`,
    `• الهاتف: ${data.phone}`,
    `• البريد: ${data.email}`,
    `• نوع الخدمة: ${serviceLabel}`,
    data.employeeCount ? `• عدد الموظفين: ${data.employeeCount}` : null,
    ``,
    `⏳ الحالة: قيد المراجعة`,
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when a new driver application is submitted
 */
export async function notifyNewDriverApplication(data: DriverEmailData): Promise<boolean> {
  const title = `🚗 طلب سائق جديد - ${data.fullName}`;
  const content = [
    `✅ تم استلام طلب تسجيل سائق جديد`,
    ``,
    `📌 تفاصيل الطلب:`,
    `• الاسم: ${data.fullName}`,
    `• الهاتف: ${data.phone}`,
    data.email ? `• البريد: ${data.email}` : null,
    `• المدينة: ${data.city}`,
    `• نوع القيادة: ${data.driverType}`,
    ``,
    `⏳ الحالة: قيد المراجعة`,
    `يرجى مراجعة الطلب والمستندات من لوحة الإدارة.`,
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}

/**
 * Send notification when driver application status changes
 */
export async function notifyDriverStatusChange(
  data: DriverEmailData,
  newStatus: string
): Promise<boolean> {
  const statusLabel = STATUS_LABELS[newStatus] || newStatus;

  const title = `🔄 تحديث حالة طلب سائق - ${data.fullName}`;
  const content = [
    `تم تحديث حالة طلب تسجيل السائق`,
    ``,
    `👤 السائق: ${data.fullName} (${data.phone})`,
    `📍 المدينة: ${data.city}`,
    ``,
    `📊 الحالة الجديدة: ${statusLabel}`,
    ``,
    newStatus === "approved" ? `✅ تمت الموافقة على الطلب. يمكن للسائق البدء بتقديم الخدمة.` : "",
    newStatus === "rejected" ? `❌ تم رفض الطلب.` : "",
  ].filter(Boolean).join("\n");

  return notifyOwner({ title, content });
}
