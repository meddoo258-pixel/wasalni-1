import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profileImage"),
  userType: mysqlEnum("userType", ["rider", "driver", "admin"]).default("rider").notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Rider Profile - Additional info for riders
 */
export const riderProfiles = mysqlTable("rider_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalRides: int("totalRides").default(0),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0.00"),
  walletBalance: decimal("walletBalance", { precision: 10, scale: 2 }).default("0.00"),
  preferredLocations: json("preferredLocations"),
  emergencyContact: varchar("emergencyContact", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RiderProfile = typeof riderProfiles.$inferSelect;

/**
 * Driver Profile - Additional info for drivers
 */
export const driverProfiles = mysqlTable("driver_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  licenseNumber: varchar("licenseNumber", { length: 50 }).notNull().unique(),
  licenseExpiry: timestamp("licenseExpiry"),
  vehicleType: mysqlEnum("vehicleType", ["sedan", "h1", "hiace", "coaster"]).notNull(),
  vehiclePlate: varchar("vehiclePlate", { length: 50 }).notNull().unique(),
  vehicleColor: varchar("vehicleColor", { length: 30 }),
  vehicleCapacity: int("vehicleCapacity").default(4),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalRides: int("totalRides").default(0),
  totalEarnings: decimal("totalEarnings", { precision: 10, scale: 2 }).default("0.00"),
  isVerified: boolean("isVerified").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DriverProfile = typeof driverProfiles.$inferSelect;

/**
 * Routes - Predefined routes
 */
export const routes = mysqlTable("routes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  startLocation: varchar("startLocation", { length: 255 }).notNull(),
  endLocation: varchar("endLocation", { length: 255 }).notNull(),
  startLat: decimal("startLat", { precision: 10, scale: 8 }),
  startLng: decimal("startLng", { precision: 11, scale: 8 }),
  endLat: decimal("endLat", { precision: 10, scale: 8 }),
  endLng: decimal("endLng", { precision: 11, scale: 8 }),
  distance: decimal("distance", { precision: 8, scale: 2 }),
  estimatedTime: int("estimatedTime"), // in minutes
  basePrice: decimal("basePrice", { precision: 8, scale: 2 }).notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Route = typeof routes.$inferSelect;

/**
 * Rides - Individual ride instances
 */
export const rides = mysqlTable("rides", {
  id: int("id").autoincrement().primaryKey(),
  routeId: int("routeId").notNull(),
  driverId: int("driverId"),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  scheduledTime: timestamp("scheduledTime").notNull(),
  actualStartTime: timestamp("actualStartTime"),
  actualEndTime: timestamp("actualEndTime"),
  totalSeats: int("totalSeats").default(4),
  availableSeats: int("availableSeats").default(4),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ride = typeof rides.$inferSelect;

/**
 * Bookings - Rider bookings for rides
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  rideId: int("rideId").notNull(),
  riderId: int("riderId").notNull(),
  status: mysqlEnum("status", ["confirmed", "cancelled", "completed"]).default("confirmed").notNull(),
  seatNumber: int("seatNumber"),
  pickupLocation: varchar("pickupLocation", { length: 255 }),
  pickupLat: decimal("pickupLat", { precision: 10, scale: 8 }),
  pickupLng: decimal("pickupLng", { precision: 11, scale: 8 }),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["wallet", "tabby", "tamara", "card"]).default("wallet"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;

/**
 * Payments - Payment transactions
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId"),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["wallet", "tabby", "tamara", "card"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;

/**
 * Wallets - User digital wallets
 */
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  totalAdded: decimal("totalAdded", { precision: 10, scale: 2 }).default("0.00"),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;

/**
 * Ratings - Ride ratings and reviews
 */
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  rideId: int("rideId").notNull(),
  riderId: int("riderId").notNull(),
  driverId: int("driverId").notNull(),
  riderRating: int("riderRating"), // 1-5
  driverRating: int("driverRating"), // 1-5
  riderComment: text("riderComment"),
  driverComment: text("driverComment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;

/**
 * Support Tickets - Customer support
 */
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rideId: int("rideId"),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;

/**
 * Support Messages - Messages in support tickets
 */
export const supportMessages = mysqlTable("support_messages", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  attachmentUrl: text("attachmentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupportMessage = typeof supportMessages.$inferSelect;

/**
 * Promotions - Discount codes and promotions
 */
export const promotions = mysqlTable("promotions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 8, scale: 2 }).notNull(),
  maxUses: int("maxUses"),
  currentUses: int("currentUses").default(0),
  expiryDate: timestamp("expiryDate"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Promotion = typeof promotions.$inferSelect;

/**
 * Driver registration applications (legacy - keep for compatibility)
 */
export const driverApplications = mysqlTable("driver_applications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  nationalId: varchar("nationalId", { length: 20 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  driverType: mysqlEnum("driverType", ["own_vehicle", "rent_vehicle", "company_vehicle"]).notNull(),
  vehicleType: varchar("vehicleType", { length: 50 }),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  licenseUrl: text("licenseUrl"),
  registrationUrl: text("registrationUrl"),
  insuranceUrl: text("insuranceUrl"),
  nationalIdUrl: text("nationalIdUrl"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

/**
 * Contact form submissions (legacy - keep for compatibility)
 */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Notifications - In-app notifications for riders and drivers
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["booking_confirmed", "ride_started", "ride_completed", "new_booking", "booking_cancelled", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedId: int("relatedId"), // bookingId or rideId
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Vehicle Rental Requests - Requests for vehicle rental
 */
export const rentalRequests = mysqlTable("rental_requests", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  vehicleType: mysqlEnum("vehicleType", ["sedan", "h1", "hiace", "coaster"]).notNull(),
  rentalPurpose: varchar("rentalPurpose", { length: 255 }),
  startDate: varchar("startDate", { length: 20 }).notNull(),
  endDate: varchar("endDate", { length: 20 }).notNull(),
  pickupLocation: varchar("pickupLocation", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RentalRequest = typeof rentalRequests.$inferSelect;
export type InsertRentalRequest = typeof rentalRequests.$inferInsert;

/**
 * Corporate Requests - Corporate transport contract requests
 */
export const corporateRequests = mysqlTable("corporate_requests", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  employeeCount: int("employeeCount"),
  serviceType: mysqlEnum("serviceType", ["employees", "students", "mixed", "airport"]).notNull(),
  city: varchar("city", { length: 100 }),
  requirements: text("requirements"),
  status: mysqlEnum("status", ["pending", "contacted", "contracted", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CorporateRequest = typeof corporateRequests.$inferSelect;
export type InsertCorporateRequest = typeof corporateRequests.$inferInsert;

/**
 * Monthly Subscriptions - Monthly transport subscription requests
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  serviceType: mysqlEnum("serviceType", ["employee", "student", "teacher", "corporate"]).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  pickupAddress: varchar("pickupAddress", { length: 500 }).notNull(),
  dropoffAddress: varchar("dropoffAddress", { length: 500 }).notNull(),
  preferredTime: varchar("preferredTime", { length: 50 }),
  numberOfPassengers: int("numberOfPassengers").default(1),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "active", "expired", "cancelled"]).default("pending").notNull(),
  startDate: varchar("startDate", { length: 20 }),
  endDate: varchar("endDate", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
