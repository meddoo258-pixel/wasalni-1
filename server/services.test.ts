import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@wasalni.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Subscription API", () => {
  it("should submit a new subscription request (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscriptions.submit({
      fullName: "نورة أحمد",
      phone: "0512345678",
      email: "noura@test.com",
      serviceType: "student",
      city: "الرياض",
      pickupAddress: "حي النرجس",
      dropoffAddress: "جامعة الملك سعود",
      preferredTime: "7:00",
      numberOfPassengers: 1,
      notes: "ملاحظة اختبارية",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("should reject invalid subscription (missing required fields)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.subscriptions.submit({
        fullName: "",
        phone: "0512345678",
        email: "",
        serviceType: "student",
        city: "الرياض",
        pickupAddress: "حي النرجس",
        dropoffAddress: "جامعة الملك سعود",
        preferredTime: "",
        numberOfPassengers: 1,
        notes: "",
      })
    ).rejects.toThrow();
  });

  it("should list subscriptions for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscriptions.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should reject listing subscriptions for non-admin", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.subscriptions.list()).rejects.toThrow("غير مصرح");
  });
});

describe("Contact API", () => {
  it("should submit a contact message (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "محمد علي",
      email: "mohammed@test.com",
      phone: "0551234567",
      subject: "استفسار عن الخدمة",
      message: "أريد معرفة المزيد عن خدمة نقل الموظفات في الرياض",
    });

    expect(result).toHaveProperty("success", true);
  });

  it("should reject invalid contact message (short subject)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "م",
        email: "invalid",
        phone: "05",
        subject: "ق",
        message: "قصير",
      })
    ).rejects.toThrow();
  });

  it("should list contact messages for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should reject listing contact messages for non-admin", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contact.list()).rejects.toThrow("غير مصرح");
  });
});

describe("Rental API", () => {
  it("should submit a rental request (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rental.submitRequest({
      fullName: "سارة محمد",
      phone: "0512345678",
      email: "sara@test.com",
      vehicleType: "sedan",
      startDate: "2026-04-01",
      endDate: "2026-04-07",
      pickupLocation: "الرياض - حي العليا",
      rentalPurpose: "رحلة عائلية",
      notes: "",
    });

    expect(result).toHaveProperty("success", true);
  });

  it("should list rental requests for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rental.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Corporate API", () => {
  it("should submit a corporate request (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.corporate.submitRequest({
      companyName: "شركة وصلني",
      contactName: "أحمد خالد",
      email: "ahmed@wasalni.com",
      phone: "0512345678",
      serviceType: "employees",
      employeeCount: 50,
      city: "الرياض",
      requirements: "نقل يومي للموظفات",
    });

    expect(result).toHaveProperty("success", true);
  });

  it("should list corporate requests for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.corporate.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Wallet API", () => {
  it("should get or create wallet for authenticated user", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wallet.get();
    expect(result).toHaveProperty("balance");
    expect(result).toHaveProperty("userId", 1);
  });

  it("should top up wallet", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wallet.topUp({
      amount: 100,
      method: "card",
    });

    expect(result).toHaveProperty("balance");
  });
});

describe("Routes API", () => {
  it("should list routes (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.routes.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Auth API", () => {
  it("should return null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("should return user for authenticated user", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toHaveProperty("id", 1);
    expect(result).toHaveProperty("name", "Test User");
  });
});

describe("Admin Analytics API", () => {
  it("should return analytics data for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.analytics();
    expect(result).toHaveProperty("overview");
    expect(result).toHaveProperty("subscriptions");
    expect(result).toHaveProperty("rides");
    expect(result).toHaveProperty("drivers");
    expect(result!.overview).toHaveProperty("totalUsers");
    expect(result!.overview).toHaveProperty("totalSubscriptions");
    expect(result!.overview).toHaveProperty("totalRentals");
    expect(result!.overview).toHaveProperty("totalCorporate");
    expect(result!.overview).toHaveProperty("totalDriverApps");
    expect(result!.overview).toHaveProperty("totalContactMsgs");
    expect(typeof result!.overview.totalUsers).toBe("number");
  });

  it("should reject analytics for non-admin", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.analytics()).rejects.toThrow("غير مصرح");
  });

  it("should return subscriptions by type for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.subscriptionsByType();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should reject subscriptions by type for non-admin", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.subscriptionsByType()).rejects.toThrow("غير مصرح");
  });

  it("should return recent payments for admin", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.recentPayments();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should reject recent payments for non-admin", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.recentPayments()).rejects.toThrow("غير مصرح");
  });
});

describe("Email Notifications", () => {
  it("should export notification functions", async () => {
    const notifications = await import("./emailNotifications");
    expect(typeof notifications.notifyNewSubscription).toBe("function");
    expect(typeof notifications.notifySubscriptionStatusChange).toBe("function");
    expect(typeof notifications.notifyNewContactMessage).toBe("function");
    expect(typeof notifications.notifyNewRentalRequest).toBe("function");
    expect(typeof notifications.notifyNewCorporateRequest).toBe("function");
    expect(typeof notifications.notifyNewDriverApplication).toBe("function");
    expect(typeof notifications.notifyDriverStatusChange).toBe("function");
  });
});

describe("Sitemap & Robots", () => {
  it("should serve sitemap.xml with correct content type", async () => {
    const response = await fetch("http://localhost:3000/sitemap.xml");
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('<?xml version="1.0"');
    expect(text).toContain("<urlset");
    expect(text).toContain("<loc>");
    expect(text).toContain("/services");
    expect(text).toContain("/pricing");
    expect(text).toContain("/subscribe");
    expect(text).toContain("/contact");
    expect(text).toContain("/about");
    expect(text).toContain("/drivers");
    expect(text).toContain("/rental");
    expect(text).toContain("/corporate");
    expect(text).toContain("/coverage");
  });

  it("should serve robots.txt with sitemap reference", async () => {
    const response = await fetch("http://localhost:3000/robots.txt");
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /admin");
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("Sitemap:");
    expect(text).toContain("/sitemap.xml");
  });
});
