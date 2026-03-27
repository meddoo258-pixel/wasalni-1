import { eq, desc, and, sql, count, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, InsertUser,
  riderProfiles, driverProfiles,
  routes, rides, bookings, payments, wallets,
  ratings, supportTickets, supportMessages,
  promotions, driverApplications, contactMessages,
  notifications,
  rentalRequests, corporateRequests, subscriptions,
  InsertDriverApplication, InsertContactMessage,
  InsertRentalRequest, InsertCorporateRequest, InsertSubscription
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER FUNCTIONS =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
}

export async function getUsersCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(users);
  return result[0]?.count ?? 0;
}

// ===== WALLET FUNCTIONS =====

export async function getOrCreateWallet(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(wallets).values({ userId, balance: "0.00", totalAdded: "0.00", totalSpent: "0.00" });
  const created = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return created[0] ?? null;
}

export async function updateWalletBalance(userId: number, amount: number, type: "add" | "deduct") {
  const db = await getDb();
  if (!db) return null;
  const wallet = await getOrCreateWallet(userId);
  if (!wallet) return null;
  const currentBalance = parseFloat(wallet.balance ?? "0");
  const newBalance = type === "add" ? currentBalance + amount : currentBalance - amount;
  if (newBalance < 0) throw new Error("Insufficient wallet balance");
  const updateData: Record<string, unknown> = { balance: newBalance.toFixed(2) };
  if (type === "add") updateData.totalAdded = (parseFloat(wallet.totalAdded ?? "0") + amount).toFixed(2);
  else updateData.totalSpent = (parseFloat(wallet.totalSpent ?? "0") + amount).toFixed(2);
  await db.update(wallets).set(updateData).where(eq(wallets.userId, userId));
  return { ...wallet, balance: newBalance.toFixed(2) };
}

// ===== ROUTES FUNCTIONS =====

export async function getActiveRoutes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(routes).where(eq(routes.isActive, true)).orderBy(routes.name);
}

export async function getRouteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(routes).where(eq(routes.id, id)).limit(1);
  return result[0];
}

export async function createRoute(data: typeof routes.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(routes).values(data);
  return { id: result[0].insertId, ...data };
}

// ===== RIDES FUNCTIONS =====

export async function getAvailableRides(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rides)
    .where(and(eq(rides.status, "scheduled"), sql`${rides.availableSeats} > 0`))
    .orderBy(rides.scheduledTime)
    .limit(limit);
}

export async function getRideById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rides).where(eq(rides.id, id)).limit(1);
  return result[0];
}

export async function getDriverRides(driverId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rides)
    .where(eq(rides.driverId, driverId))
    .orderBy(desc(rides.scheduledTime))
    .limit(limit);
}

export async function createRide(data: typeof rides.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(rides).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateRideStatus(rideId: number, status: "scheduled" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) return null;
  const updateData: Record<string, unknown> = { status };
  if (status === "in_progress") updateData.actualStartTime = new Date();
  if (status === "completed") updateData.actualEndTime = new Date();
  await db.update(rides).set(updateData).where(eq(rides.id, rideId));
  return getRideById(rideId);
}

export async function getAllRides(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rides).orderBy(desc(rides.scheduledTime)).limit(limit);
}

export async function getRidesCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(rides);
  return result[0]?.count ?? 0;
}

// ===== BOOKINGS FUNCTIONS =====

export async function createBooking(data: typeof bookings.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(bookings).values(data);
  await db.update(rides).set({ availableSeats: sql`${rides.availableSeats} - 1` }).where(eq(rides.id, data.rideId));
  return { id: result[0].insertId, ...data };
}

export async function getRiderBookings(riderId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings)
    .where(eq(bookings.riderId, riderId))
    .orderBy(desc(bookings.createdAt))
    .limit(limit);
}

export async function getRideBookings(rideId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.rideId, rideId));
}

export async function cancelBooking(bookingId: number, riderId: number) {
  const db = await getDb();
  if (!db) return null;
  const booking = await db.select().from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.riderId, riderId))).limit(1);
  if (!booking[0]) throw new Error("Booking not found");
  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, bookingId));
  await db.update(rides).set({ availableSeats: sql`${rides.availableSeats} + 1` }).where(eq(rides.id, booking[0].rideId));
  return booking[0];
}

// ===== PAYMENTS FUNCTIONS =====

export async function createPayment(data: typeof payments.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(payments).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getUserPayments(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function getTotalRevenue() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sum(payments.amount) })
    .from(payments).where(eq(payments.status, "completed"));
  return parseFloat(result[0]?.total ?? "0");
}

// ===== RATINGS FUNCTIONS =====

export async function createRating(data: typeof ratings.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(ratings).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getDriverRatings(driverId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ratings).where(eq(ratings.driverId, driverId)).orderBy(desc(ratings.createdAt));
}

export async function getRideRating(rideId: number, riderId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(ratings)
    .where(and(eq(ratings.rideId, rideId), eq(ratings.riderId, riderId))).limit(1);
  return result[0] ?? null;
}

// ===== SUPPORT FUNCTIONS =====

export async function createSupportTicket(data: typeof supportTickets.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(supportTickets).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getUserSupportTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportTickets)
    .where(eq(supportTickets.userId, userId))
    .orderBy(desc(supportTickets.createdAt));
}

export async function getAllSupportTickets(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt)).limit(limit);
}

export async function addSupportMessage(data: typeof supportMessages.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(supportMessages).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getTicketMessages(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(supportMessages)
    .where(eq(supportMessages.ticketId, ticketId))
    .orderBy(supportMessages.createdAt);
}

export async function updateTicketStatus(ticketId: number, status: "open" | "in_progress" | "resolved" | "closed") {
  const db = await getDb();
  if (!db) return null;
  await db.update(supportTickets).set({ status }).where(eq(supportTickets.id, ticketId));
}

// ===== ADMIN STATS FUNCTIONS =====

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  const [totalUsers, totalRides, revenue, openTickets] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(rides),
    db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "completed")),
    db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, "open")),
  ]);
  return {
    totalUsers: totalUsers[0]?.count ?? 0,
    totalRides: totalRides[0]?.count ?? 0,
    totalRevenue: parseFloat(revenue[0]?.total ?? "0"),
    openTickets: openTickets[0]?.count ?? 0,
  };
}

// ===== DRIVER APPLICATIONS =====

export async function createDriverApplication(data: InsertDriverApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(driverApplications).values(data);
  return { id: result[0].insertId };
}

export async function getDriverApplications() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(driverApplications).orderBy(desc(driverApplications.createdAt));
}

export async function updateDriverApplicationStatus(
  id: number,
  status: "pending" | "approved" | "rejected",
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Record<string, unknown> = { status };
  if (notes !== undefined) updateData.notes = notes;
  await db.update(driverApplications).set(updateData).where(eq(driverApplications.id, id));
  const result = await db.select().from(driverApplications).where(eq(driverApplications.id, id)).limit(1);
  return result[0];
}

// ===== CONTACT MESSAGES =====

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactMessages).values(data);
  return { id: result[0].insertId };
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

// ===== NOTIFICATIONS FUNCTIONS =====

export async function createNotification(data: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(notifications).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getUserNotifications(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count ?? 0;
}

export async function markNotificationRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId));
}

// ===== WALLET QUERY HELPERS =====

export async function getUserWallet(userId: number) {
  return getOrCreateWallet(userId);
}

export async function getWalletTransactions(userId: number, limit = 20) {
  return getUserPayments(userId, limit);
}

// ===== RENTAL REQUESTS FUNCTIONS =====

export async function createRentalRequest(data: InsertRentalRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rentalRequests).values(data);
  return { id: result[0].insertId };
}

export async function getRentalRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(rentalRequests).orderBy(desc(rentalRequests.createdAt));
}

// ===== CORPORATE REQUESTS FUNCTIONS =====

export async function createCorporateRequest(data: InsertCorporateRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(corporateRequests).values(data);
  return { id: result[0].insertId };
}

export async function getCorporateRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(corporateRequests).orderBy(desc(corporateRequests.createdAt));
}


// ===== SUBSCRIPTION FUNCTIONS =====

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(data);
  return { id: result[0].insertId };
}

export async function getSubscriptions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
}

export async function updateSubscriptionStatus(id: number, status: "pending" | "active" | "expired" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscriptions).set({ status }).where(eq(subscriptions.id, id));
  return { success: true };
}

// ===== ADVANCED ANALYTICS =====

export async function getAnalyticsData() {
  const db = await getDb();
  if (!db) return null;

  const [
    totalUsers, totalRides, totalRevenue, openTickets,
    totalSubscriptions, totalRentals, totalCorporate, totalDriverApps,
    totalContactMsgs,
    activeSubscriptions, pendingSubscriptions,
    completedRides, cancelledRides, scheduledRides,
    approvedDrivers, pendingDrivers, rejectedDrivers,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(rides),
    db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "completed")),
    db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, "open")),
    db.select({ count: count() }).from(subscriptions),
    db.select({ count: count() }).from(rentalRequests),
    db.select({ count: count() }).from(corporateRequests),
    db.select({ count: count() }).from(driverApplications),
    db.select({ count: count() }).from(contactMessages),
    db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, "active")),
    db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, "pending")),
    db.select({ count: count() }).from(rides).where(eq(rides.status, "completed")),
    db.select({ count: count() }).from(rides).where(eq(rides.status, "cancelled")),
    db.select({ count: count() }).from(rides).where(eq(rides.status, "scheduled")),
    db.select({ count: count() }).from(driverApplications).where(eq(driverApplications.status, "approved")),
    db.select({ count: count() }).from(driverApplications).where(eq(driverApplications.status, "pending")),
    db.select({ count: count() }).from(driverApplications).where(eq(driverApplications.status, "rejected")),
  ]);

  return {
    overview: {
      totalUsers: totalUsers[0]?.count ?? 0,
      totalRides: totalRides[0]?.count ?? 0,
      totalRevenue: parseFloat(totalRevenue[0]?.total ?? "0"),
      openTickets: openTickets[0]?.count ?? 0,
      totalSubscriptions: totalSubscriptions[0]?.count ?? 0,
      totalRentals: totalRentals[0]?.count ?? 0,
      totalCorporate: totalCorporate[0]?.count ?? 0,
      totalDriverApps: totalDriverApps[0]?.count ?? 0,
      totalContactMsgs: totalContactMsgs[0]?.count ?? 0,
    },
    subscriptions: {
      active: activeSubscriptions[0]?.count ?? 0,
      pending: pendingSubscriptions[0]?.count ?? 0,
      total: totalSubscriptions[0]?.count ?? 0,
    },
    rides: {
      completed: completedRides[0]?.count ?? 0,
      cancelled: cancelledRides[0]?.count ?? 0,
      scheduled: scheduledRides[0]?.count ?? 0,
      total: totalRides[0]?.count ?? 0,
    },
    drivers: {
      approved: approvedDrivers[0]?.count ?? 0,
      pending: pendingDrivers[0]?.count ?? 0,
      rejected: rejectedDrivers[0]?.count ?? 0,
      total: totalDriverApps[0]?.count ?? 0,
    },
  };
}

export async function getSubscriptionsByType() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      serviceType: subscriptions.serviceType,
      count: count(),
    })
    .from(subscriptions)
    .groupBy(subscriptions.serviceType);
  return result;
}

export async function getRecentPayments(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
}
