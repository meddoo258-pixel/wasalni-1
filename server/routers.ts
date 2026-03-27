import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { nanoid } from "nanoid";
import {
  getOrCreateWallet, updateWalletBalance, getUserPayments, createPayment,
  getActiveRoutes, getRouteById, createRoute,
  getAvailableRides, getRideById, getDriverRides, createRide, updateRideStatus, getAllRides,
  createBooking, getRiderBookings, getRideBookings, cancelBooking,
  createRating, getDriverRatings, getRideRating,
  createSupportTicket, getUserSupportTickets, getAllSupportTickets, addSupportMessage, getTicketMessages, updateTicketStatus,
  getAdminStats, getAllUsers,
  createDriverApplication, getDriverApplications, updateDriverApplicationStatus,
  getAnalyticsData, getSubscriptionsByType, getRecentPayments,
  createContactMessage, getContactMessages,
  createNotification, getUserNotifications, getUnreadNotificationsCount, markNotificationRead, markAllNotificationsRead,
  createRentalRequest, getRentalRequests,
  createCorporateRequest, getCorporateRequests,
  createSubscription, getSubscriptions, getUserSubscriptions, updateSubscriptionStatus,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import {
  notifyNewSubscription,
  notifySubscriptionStatusChange,
  notifyNewContactMessage,
  notifyNewRentalRequest,
  notifyNewCorporateRequest,
  notifyNewDriverApplication,
  notifyDriverStatusChange,
} from "./emailNotifications";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== WALLET =====
  wallet: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getOrCreateWallet(ctx.user.id);
    }),
    topUp: protectedProcedure
      .input(z.object({ amount: z.number().min(10).max(5000), method: z.enum(["tabby", "tamara", "card"]) }))
      .mutation(async ({ ctx, input }) => {
        const wallet = await updateWalletBalance(ctx.user.id, input.amount, "add");
        await createPayment({
          userId: ctx.user.id,
          amount: input.amount.toFixed(2),
          paymentMethod: input.method,
          status: "completed",
          description: `إضافة رصيد للمحفظة - ${input.amount} ريال`,
        });
        return wallet;
      }),
    transactions: protectedProcedure.query(async ({ ctx }) => {
      return getUserPayments(ctx.user.id);
    }),
  }),

  // ===== ROUTES =====
  routes: router({
    list: publicProcedure.query(async () => getActiveRoutes()),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => getRouteById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        startLocation: z.string().min(2),
        endLocation: z.string().min(2),
        city: z.string().optional(),
        serviceType: z.string().optional(),
        monthlyPrice: z.number().optional(),
        basePrice: z.number().min(1).optional(),
        estimatedTime: z.number().optional(),
        distance: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("غير مصرح");
        const price = input.basePrice ?? input.monthlyPrice ?? 0;
        return createRoute({
          name: input.name,
          startLocation: input.startLocation,
          endLocation: input.endLocation,
          basePrice: price.toFixed(2),
          estimatedTime: input.estimatedTime,
          distance: input.distance?.toFixed(2),
        });
      }),
  }),

  // ===== RIDES =====
  rides: router({
    available: publicProcedure.query(async () => getAvailableRides(20)),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => getRideById(input.id)),
    myRides: protectedProcedure.query(async ({ ctx }) => getDriverRides(ctx.user.id)),
    all: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getAllRides(50);
    }),
    create: protectedProcedure
      .input(z.object({
        routeId: z.number(),
        scheduledTime: z.string(),
        totalSeats: z.number().min(1).max(50),
        price: z.number().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        return createRide({
          routeId: input.routeId,
          driverId: ctx.user.id,
          scheduledTime: new Date(input.scheduledTime),
          totalSeats: input.totalSeats,
          availableSeats: input.totalSeats,
          price: input.price.toFixed(2),
          status: "scheduled",
        });
      }),
    updateStatus: protectedProcedure
      .input(z.object({ rideId: z.number(), status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]) }))
      .mutation(async ({ ctx, input }) => {
        const updated = await updateRideStatus(input.rideId, input.status);
        // When ride starts, notify all booked riders
        if (input.status === "in_progress") {
          const rideBookings = await getRideBookings(input.rideId);
          for (const b of rideBookings) {
            if (b.status === "confirmed") {
              await createNotification({
                userId: b.riderId,
                type: "ride_started",
                title: "بدأت رحلتك",
                message: `سائقك في الطريق - الرحلة #${input.rideId} بدأت الآن`,
                relatedId: input.rideId,
              });
            }
          }
        }
        // When ride completes, notify riders to rate
        if (input.status === "completed") {
          const rideBookings = await getRideBookings(input.rideId);
          for (const b of rideBookings) {
            if (b.status === "confirmed") {
              await createNotification({
                userId: b.riderId,
                type: "ride_completed",
                title: "اكتملت رحلتك",
                message: `وصلتم بسلامة! شارك بتقييم الرحلة #${input.rideId}`,
                relatedId: input.rideId,
              });
            }
          }
        }
        return updated;
      }),
    withRoute: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const ride = await getRideById(input.id);
        if (!ride) return null;
        const route = ride.routeId ? await getRouteById(ride.routeId) : null;
        return { ...ride, route };
      }),
  }),

  // ===== BOOKINGS =====
  bookings: router({
    create: protectedProcedure
      .input(z.object({
        rideId: z.number(),
        pickupLocation: z.string().optional(),
        paymentMethod: z.enum(["wallet", "tabby", "tamara", "card"]).default("wallet"),
      }))
      .mutation(async ({ ctx, input }) => {
        const ride = await getRideById(input.rideId);
        if (!ride) throw new Error("الرحلة غير موجودة");
        if ((ride.availableSeats ?? 0) <= 0) throw new Error("لا توجد مقاعد متاحة");

        if (input.paymentMethod === "wallet") {
          await updateWalletBalance(ctx.user.id, parseFloat(ride.price), "deduct");
        }

        const booking = await createBooking({
          rideId: input.rideId,
          riderId: ctx.user.id,
          price: ride.price,
          paymentMethod: input.paymentMethod,
          paymentStatus: "completed",
          pickupLocation: input.pickupLocation,
          status: "confirmed",
        });

        await createPayment({
          bookingId: booking?.id,
          userId: ctx.user.id,
          amount: ride.price,
          paymentMethod: input.paymentMethod,
          status: "completed",
          description: `حجز رحلة #${input.rideId}`,
        });

        // Notify rider that booking is confirmed
        await createNotification({
          userId: ctx.user.id,
          type: "booking_confirmed",
          title: "تم تأكيد حجزك",
          message: `تم تأكيد حجزك في الرحلة #${input.rideId} بسعر ${ride.price} ريال`,
          relatedId: booking?.id,
        });

        // Notify driver about new booking
        if (ride.driverId) {
          await createNotification({
            userId: ride.driverId,
            type: "new_booking",
            title: "حجز جديد",
            message: `راكب جديد حجز في رحلتك #${input.rideId}`,
            relatedId: input.rideId,
          });
        }

        return booking;
      }),
    myBookings: protectedProcedure.query(async ({ ctx }) => getRiderBookings(ctx.user.id)),
    ridePassengers: protectedProcedure
      .input(z.object({ rideId: z.number() }))
      .query(async ({ input }) => getRideBookings(input.rideId)),
    cancel: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ ctx, input }) => cancelBooking(input.bookingId, ctx.user.id)),
  }),

  // ===== RATINGS =====
  ratings: router({
    create: protectedProcedure
      .input(z.object({
        rideId: z.number(),
        driverId: z.number(),
        driverRating: z.number().min(1).max(5),
        riderComment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getRideRating(input.rideId, ctx.user.id);
        if (existing) throw new Error("لقد قيّمت هذه الرحلة مسبقاً");
        return createRating({
          rideId: input.rideId,
          riderId: ctx.user.id,
          driverId: input.driverId,
          driverRating: input.driverRating,
          riderComment: input.riderComment,
        });
      }),
    driverRatings: publicProcedure
      .input(z.object({ driverId: z.number() }))
      .query(async ({ input }) => getDriverRatings(input.driverId)),
  }),

  // ===== SUPPORT =====
  support: router({
    createTicket: protectedProcedure
      .input(z.object({
        subject: z.string().min(5),
        description: z.string().min(10),
        rideId: z.number().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      }))
      .mutation(async ({ ctx, input }) => {
        const ticket = await createSupportTicket({
          userId: ctx.user.id,
          subject: input.subject,
          description: input.description,
          rideId: input.rideId,
          priority: input.priority,
          status: "open",
        });
        await notifyOwner({
          title: `🎫 تذكرة دعم جديدة: ${input.subject}`,
          content: `من المستخدم #${ctx.user.id}\n${input.description}`,
        });
        return ticket;
      }),
    myTickets: protectedProcedure.query(async ({ ctx }) => getUserSupportTickets(ctx.user.id)),
    allTickets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getAllSupportTickets(50);
    }),
    addMessage: protectedProcedure
      .input(z.object({ ticketId: z.number(), message: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => addSupportMessage({ ticketId: input.ticketId, userId: ctx.user.id, message: input.message })),
    getMessages: protectedProcedure
      .input(z.object({ ticketId: z.number() }))
      .query(async ({ input }) => getTicketMessages(input.ticketId)),
    updateStatus: protectedProcedure
      .input(z.object({ ticketId: z.number(), status: z.enum(["open", "in_progress", "resolved", "closed"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("غير مصرح");
        return updateTicketStatus(input.ticketId, input.status);
      }),
  }),

  // ===== ADMIN =====
  admin: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      const stats = await getAdminStats();
      return {
        totalUsers: stats?.totalUsers ?? 0,
        totalRides: stats?.totalRides ?? 0,
        totalRevenue: stats?.totalRevenue ?? 0,
        openTickets: stats?.openTickets ?? 0,
        activeDrivers: 0,
        completedRides: 0,
        activeRides: 0,
        pendingDrivers: 0,
        newMessages: 0,
      };
    }),
    users: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getAllUsers(100);
    }),
    rides: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getAllRides(100);
    }),
    driverApplications: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getDriverApplications();
    }),
    updateDriverStatus: protectedProcedure
      .input(z.object({
        applicationId: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("غير مصرح");
        return updateDriverApplicationStatus(input.applicationId, input.status, input.notes);
      }),
    contactMessages: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getContactMessages();
    }),
    analytics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getAnalyticsData();
    }),
    subscriptionsByType: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getSubscriptionsByType();
    }),
    recentPayments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getRecentPayments(20);
    }),
  }),

  // ===== DRIVER REGISTRATION =====
  driver: router({
    register: publicProcedure
      .input(z.object({
        fullName: z.string().min(3),
        phone: z.string().min(9),
        email: z.string().email().optional().or(z.literal("")),
        nationalId: z.string().min(10),
        city: z.string().min(2),
        driverType: z.enum(["own_vehicle", "rent_vehicle", "company_vehicle"]),
        vehicleType: z.string().optional(),
        gender: z.enum(["male", "female"]),
        licenseFile: z.string().optional(),
        registrationFile: z.string().optional(),
        insuranceFile: z.string().optional(),
        nationalIdFile: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const uploadFile = async (base64Data: string | undefined, prefix: string): Promise<string | null> => {
          if (!base64Data) return null;
          try {
            const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
            if (!matches) return null;
            const contentType = matches[1];
            const buffer = Buffer.from(matches[2], "base64");
            const ext = contentType.split("/")[1] || "bin";
            const key = `drivers/${prefix}-${nanoid(10)}.${ext}`;
            const { url } = await storagePut(key, buffer, contentType);
            return url;
          } catch (err) {
            console.error(`Failed to upload ${prefix}:`, err);
            return null;
          }
        };

        const [licenseUrl, registrationUrl, insuranceUrl, nationalIdUrl] = await Promise.all([
          uploadFile(input.licenseFile, "license"),
          uploadFile(input.registrationFile, "registration"),
          uploadFile(input.insuranceFile, "insurance"),
          uploadFile(input.nationalIdFile, "nationalid"),
        ]);

        const result = await createDriverApplication({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email || null,
          nationalId: input.nationalId,
          city: input.city,
          driverType: input.driverType,
          vehicleType: input.vehicleType || null,
          gender: input.gender,
          licenseUrl,
          registrationUrl,
          insuranceUrl,
          nationalIdUrl,
        });

        await notifyNewDriverApplication({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          city: input.city,
          driverType: input.driverType,
        });

        return { success: true, id: result.id };
      }),
  }),

  // ===== NOTIFICATIONS =====
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserNotifications(ctx.user.id, 30);
    }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return getUnreadNotificationsCount(ctx.user.id);
    }),
    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await markNotificationRead(input.notificationId, ctx.user.id);
        return { success: true };
      }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  // ===== RENTAL REQUESTS =====
  rental: router({
    submitRequest: publicProcedure
      .input(z.object({
        fullName: z.string().min(2),
        phone: z.string().min(9),
        email: z.string().email().optional().or(z.literal("")),
        vehicleType: z.enum(["sedan", "h1", "hiace", "coaster"]),
        rentalPurpose: z.string().optional().or(z.literal("")),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
        pickupLocation: z.string().optional().or(z.literal("")),
        notes: z.string().optional().or(z.literal("")),
      }))
      .mutation(async ({ input }) => {
        const result = await createRentalRequest({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email || null,
          vehicleType: input.vehicleType,
          rentalPurpose: input.rentalPurpose || null,
          startDate: input.startDate,
          endDate: input.endDate,
          pickupLocation: input.pickupLocation || null,
          notes: input.notes || null,
        });
        await notifyNewRentalRequest({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          vehicleType: input.vehicleType,
          startDate: input.startDate,
          endDate: input.endDate,
        });
        return { success: true, id: result.id };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getRentalRequests();
    }),
  }),

  // ===== CORPORATE REQUESTS =====
  corporate: router({
    submitRequest: publicProcedure
      .input(z.object({
        companyName: z.string().min(2),
        contactName: z.string().min(2),
        phone: z.string().min(9),
        email: z.string().email(),
        employeeCount: z.number().optional(),
        serviceType: z.enum(["employees", "students", "mixed", "airport"]),
        city: z.string().optional().or(z.literal("")),
        requirements: z.string().optional().or(z.literal("")),
      }))
      .mutation(async ({ input }) => {
        const result = await createCorporateRequest({
          companyName: input.companyName,
          contactName: input.contactName,
          phone: input.phone,
          email: input.email,
          employeeCount: input.employeeCount || null,
          serviceType: input.serviceType,
          city: input.city || null,
          requirements: input.requirements || null,
        });
        await notifyNewCorporateRequest({
          companyName: input.companyName,
          contactName: input.contactName,
          phone: input.phone,
          email: input.email,
          serviceType: input.serviceType,
          employeeCount: input.employeeCount,
        });
        return { success: true, id: result.id };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getCorporateRequests();
    }),
  }),

  // ===== SUBSCRIPTIONS =====
  subscriptions: router({
    submit: publicProcedure
      .input(z.object({
        fullName: z.string().min(2),
        phone: z.string().min(9),
        email: z.string().email().optional().or(z.literal("")),
        serviceType: z.enum(["employee", "student", "teacher", "corporate"]),
        city: z.string().min(2),
        pickupAddress: z.string().min(5),
        dropoffAddress: z.string().min(5),
        preferredTime: z.string().optional().or(z.literal("")),
        numberOfPassengers: z.number().min(1).max(50).optional(),
        notes: z.string().optional().or(z.literal("")),
      }))
      .mutation(async ({ input }) => {
        const result = await createSubscription({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email || null,
          serviceType: input.serviceType,
          city: input.city,
          pickupAddress: input.pickupAddress,
          dropoffAddress: input.dropoffAddress,
          preferredTime: input.preferredTime || null,
          numberOfPassengers: input.numberOfPassengers || 1,
          notes: input.notes || null,
        });
        await notifyNewSubscription({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          serviceType: input.serviceType,
          city: input.city,
          pickupAddress: input.pickupAddress,
          dropoffAddress: input.dropoffAddress,
          preferredTime: input.preferredTime,
          numberOfPassengers: input.numberOfPassengers,
        });
        return { success: true, id: result.id };
      }),
    mySubscriptions: protectedProcedure.query(async ({ ctx }) => {
      return getUserSubscriptions(ctx.user.id);
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getSubscriptions();
    }),
    updateStatus: protectedProcedure
      .input(z.object({
        subscriptionId: z.number(),
        status: z.enum(["pending", "active", "expired", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("غير مصرح");
        const result = await updateSubscriptionStatus(input.subscriptionId, input.status);
        // Send notification about status change
        if (result) {
          await notifySubscriptionStatusChange(
            {
              fullName: (result as any).fullName || "مشترك",
              phone: (result as any).phone || "",
              email: (result as any).email,
              serviceType: (result as any).serviceType || "",
              city: (result as any).city || "",
              pickupAddress: (result as any).pickupAddress || "",
              dropoffAddress: (result as any).dropoffAddress || "",
            },
            input.status
          );
        }
        return result;
      }),
  }),

  // ===== CONTACT =====
  contact: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("غير مصرح");
      return getContactMessages();
    }),
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional().or(z.literal("")),
        subject: z.string().min(3),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        const result = await createContactMessage({
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          subject: input.subject,
          message: input.message,
        });

        await notifyNewContactMessage({
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          message: input.message,
        });

        return { success: true, id: result.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
