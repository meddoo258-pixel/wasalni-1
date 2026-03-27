/**
 * Tests for dashboard-related API procedures
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getAdminStats: vi.fn().mockResolvedValue({
    totalUsers: 10,
    totalRides: 50,
    totalRevenue: "5000.00",
    openTickets: 3,
  }),
  getAllUsers: vi.fn().mockResolvedValue([
    { id: 1, name: "Test User", email: "test@example.com", role: "user", createdAt: new Date() },
  ]),
  getAllRides: vi.fn().mockResolvedValue([
    { id: 1, status: "completed", price: "100.00", scheduledTime: new Date(), totalSeats: 4, availableSeats: 2 },
  ]),
  getDriverApplications: vi.fn().mockResolvedValue([
    { id: 1, fullName: "Test Driver", status: "pending", driverType: "own_vehicle", createdAt: new Date() },
  ]),
  updateDriverApplicationStatus: vi.fn().mockResolvedValue({
    id: 1,
    fullName: "Test Driver",
    status: "approved",
    driverType: "own_vehicle",
    createdAt: new Date(),
  }),
  getContactMessages: vi.fn().mockResolvedValue([]),
  getActiveRoutes: vi.fn().mockResolvedValue([
    { id: 1, name: "Route 1", startLocation: "A", endLocation: "B", basePrice: "50.00", isActive: true },
  ]),
  getAvailableRides: vi.fn().mockResolvedValue([]),
  getUserWallet: vi.fn().mockResolvedValue({ id: 1, balance: "100.00", totalAdded: "200.00", totalSpent: "100.00" }),
  getWalletTransactions: vi.fn().mockResolvedValue([]),
  getRiderBookings: vi.fn().mockResolvedValue([]),
  getDriverRides: vi.fn().mockResolvedValue([]),
  getUserSupportTickets: vi.fn().mockResolvedValue([]),
  getAllSupportTickets: vi.fn().mockResolvedValue([]),
}));

describe("Admin Dashboard API", () => {
  it("should return admin stats with correct structure", async () => {
    const { getAdminStats } = await import("./db");
    const stats = await getAdminStats();
    expect(stats).toBeDefined();
    expect(stats?.totalUsers).toBe(10);
    expect(stats?.totalRides).toBe(50);
    expect(stats?.openTickets).toBe(3);
  });

  it("should return all users list", async () => {
    const { getAllUsers } = await import("./db");
    const users = await getAllUsers(100);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).toHaveProperty("name");
    expect(users[0]).toHaveProperty("role");
  });

  it("should return all rides", async () => {
    const { getAllRides } = await import("./db");
    const rides = await getAllRides(100);
    expect(Array.isArray(rides)).toBe(true);
    expect(rides[0]).toHaveProperty("status");
    expect(rides[0]).toHaveProperty("price");
  });

  it("should return driver applications", async () => {
    const { getDriverApplications } = await import("./db");
    const apps = await getDriverApplications();
    expect(Array.isArray(apps)).toBe(true);
    expect(apps[0]).toHaveProperty("status");
    expect(apps[0].status).toBe("pending");
  });

  it("should update driver application status", async () => {
    const { updateDriverApplicationStatus } = await import("./db");
    const result = await updateDriverApplicationStatus(1, "approved");
    expect(result).toBeDefined();
    expect(result?.status).toBe("approved");
  });
});

describe("Passenger Dashboard API", () => {
  it("should return available rides", async () => {
    const { getAvailableRides } = await import("./db");
    const rides = await getAvailableRides();
    expect(Array.isArray(rides)).toBe(true);
  });

  it("should return wallet data", async () => {
    const { getUserWallet } = await import("./db");
    const wallet = await getUserWallet(1);
    expect(wallet).toBeDefined();
    expect(wallet).toHaveProperty("balance");
    expect(wallet).toHaveProperty("totalAdded");
  });

  it("should return rider bookings", async () => {
    const { getRiderBookings } = await import("./db");
    const bookings = await getRiderBookings(1);
    expect(Array.isArray(bookings)).toBe(true);
  });
});

describe("Driver Dashboard API", () => {
  it("should return driver rides", async () => {
    const { getDriverRides } = await import("./db");
    const rides = await getDriverRides(1);
    expect(Array.isArray(rides)).toBe(true);
  });

  it("should return active routes for ride creation", async () => {
    const { getActiveRoutes } = await import("./db");
    const routes = await getActiveRoutes();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes[0]).toHaveProperty("name");
    expect(routes[0]).toHaveProperty("basePrice");
  });

  it("should return support tickets", async () => {
    const { getUserSupportTickets } = await import("./db");
    const tickets = await getUserSupportTickets(1);
    expect(Array.isArray(tickets)).toBe(true);
  });
});
