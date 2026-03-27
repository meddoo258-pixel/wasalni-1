import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Car, MapPin, Wallet, Star,
  TrendingUp, ChevronLeft, ArrowLeft, Loader2,
  CheckCircle, XCircle, Clock, Navigation,
  Building2, Bell, Settings, BarChart3,
  MessageCircle, Route, Bus, Shield,
  CreditCard, Truck, CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteStart, setNewRouteStart] = useState("");
  const [newRouteEnd, setNewRouteEnd] = useState("");
  const [newRouteCity, setNewRouteCity] = useState("الرياض");
  const [newRouteType, setNewRouteType] = useState("employees");
  const [newRoutePrice, setNewRoutePrice] = useState("");

  // Queries
  const stats = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated });
  const allUsers = trpc.admin.users.useQuery(undefined, { enabled: isAuthenticated && activeTab === "users" });
  const allRides = trpc.admin.rides.useQuery(undefined, { enabled: isAuthenticated && activeTab === "rides" });
  const routes = trpc.routes.list.useQuery(undefined, { enabled: activeTab === "routes" || activeTab === "overview" });
  const messages = trpc.contact.list.useQuery(undefined, { enabled: isAuthenticated && activeTab === "messages" });
  const driverApps = trpc.admin.driverApplications.useQuery(undefined, { enabled: isAuthenticated && activeTab === "drivers" });
  const subscriptionsList = trpc.subscriptions.list.useQuery(undefined, { enabled: isAuthenticated && activeTab === "subscriptions" });
  const rentalsList = trpc.rental.list.useQuery(undefined, { enabled: isAuthenticated && activeTab === "rentals" });
  const corporatesList = trpc.corporate.list.useQuery(undefined, { enabled: isAuthenticated && activeTab === "corporates" });
  const analyticsData = trpc.admin.analytics.useQuery(undefined, { enabled: isAuthenticated && (activeTab === "analytics" || activeTab === "overview") });
  const subsByType = trpc.admin.subscriptionsByType.useQuery(undefined, { enabled: isAuthenticated && activeTab === "analytics" });

  // Mutations
  const createRoute = trpc.routes.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء المسار بنجاح!");
      routes.refetch();
      setActiveTab("routes");
      setNewRouteName(""); setNewRouteStart(""); setNewRouteEnd(""); setNewRoutePrice("");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateDriverStatus = trpc.admin.updateDriverStatus.useMutation({
    onSuccess: () => { toast.success("تم تحديث حالة السائق"); driverApps.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const updateSubscriptionStatus = trpc.subscriptions.updateStatus.useMutation({
    onSuccess: () => { toast.success("تم تحديث حالة الاشتراك"); subscriptionsList.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-white">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-violet-50 to-white p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة تحكم الإدارة</h1>
        <p className="text-gray-500 mb-8">سجّل دخولك للوصول إلى لوحة الإدارة</p>
        <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-10 shadow-lg hover:scale-105 transition-transform"
          onClick={() => window.location.href = getLoginUrl()}>
          تسجيل الدخول
        </Button>
        <Link href="/">
          <Button variant="ghost" className="mt-4 text-gray-500">
            <ArrowLeft className="w-4 h-4 ml-2" />العودة للموقع
          </Button>
        </Link>
      </div>
    );
  }

  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "نظرة عامة" },
    { id: "users", icon: Users, label: "المستخدمون" },
    { id: "drivers", icon: Car, label: "السائقون" },
    { id: "rides", icon: Navigation, label: "الرحلات" },
    { id: "routes", icon: Route, label: "المسارات" },
    { id: "subscriptions", icon: CalendarCheck, label: "الاشتراكات" },
    { id: "rentals", icon: Truck, label: "طلبات التأجير" },
    { id: "corporates", icon: Building2, label: "طلبات الشركات" },
    { id: "messages", icon: MessageCircle, label: "الرسائل" },
    { id: "analytics", icon: BarChart3, label: "التقارير والإحصائيات" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-l border-gray-100 shadow-sm min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">لوحة الإدارة</p>
              <p className="text-xs text-gray-400">وصلني</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400">مدير النظام</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full mt-2 text-gray-400 text-xs">
              <ArrowLeft className="w-3 h-3 ml-1" /> الموقع الرئيسي
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            {navItems.find(n => n.id === activeTab)?.label ?? "لوحة الإدارة"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-100">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {stats.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "إجمالي المستخدمين", value: stats.data?.totalUsers ?? 0, icon: Users, gradient: "from-sky-500 to-blue-600", change: "+12%" },
                        { label: "السائقون النشطون", value: stats.data?.activeDrivers ?? 0, icon: Car, gradient: "from-amber-500 to-orange-600", change: "+5%" },
                        { label: "الرحلات المكتملة", value: stats.data?.completedRides ?? 0, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600", change: "+23%" },
                        { label: "إجمالي الإيرادات", value: `${stats.data?.totalRevenue ?? 0} ر.س`, icon: TrendingUp, gradient: "from-violet-500 to-purple-600", change: "+18%" },
                      ].map((kpi, i) => (
                        <Card key={i} className="border-0 shadow-sm overflow-hidden">
                          <CardContent className="p-5">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                              <kpi.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-2">{kpi.change} هذا الشهر</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-0 shadow-sm col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">المسارات النشطة</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {routes.isLoading ? (
                            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
                          ) : routes.data?.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                              <Route className="w-10 h-10 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">لا توجد مسارات بعد</p>
                              <Button size="sm" onClick={() => setActiveTab("routes")} className="mt-3 bg-violet-500 text-white text-xs">أضف مسار</Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {routes.data?.slice(0, 5).map((route) => (
                                <div key={route.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                      <MapPin className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{route.name}</p>
                                      <p className="text-xs text-gray-400">{route.startLocation} → {route.endLocation}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">{route.basePrice} ر.س</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">حالة النظام</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { label: "الرحلات النشطة", value: stats.data?.activeRides ?? 0, color: "bg-sky-500" },
                            { label: "طلبات السائقين", value: stats.data?.pendingDrivers ?? 0, color: "bg-amber-500" },
                            { label: "رسائل جديدة", value: stats.data?.newMessages ?? 0, color: "bg-violet-500" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-sm text-gray-600">{item.label}</span>
                              </div>
                              <span className="font-bold text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {allUsers.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">المستخدمون ({allUsers.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {allUsers.data?.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{u.name ?? "مستخدم"}</p>
                                <p className="text-xs text-gray-400">{u.email ?? ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                                {u.role === "admin" ? "مدير" : "مستخدم"}
                              </Badge>
                              <p className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                        ))}
                        {allUsers.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا يوجد مستخدمون بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* DRIVERS */}
            {activeTab === "drivers" && (
              <motion.div key="drivers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {driverApps.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">طلبات السائقين ({driverApps.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {driverApps.data?.map((app) => (
                          <div key={app.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                                  <Car className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{app.fullName}</p>
                                  <p className="text-xs text-gray-500">{app.phone}</p>
                                  <p className="text-xs text-gray-400">{app.city} • {app.vehicleType}</p>
                                </div>
                              </div>
                              <Badge variant={
                                app.status === "approved" ? "default" :
                                app.status === "rejected" ? "destructive" : "secondary"
                              } className="text-xs">
                                {app.status === "pending" ? "قيد المراجعة" : app.status === "approved" ? "مقبول" : "مرفوض"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                              <span>نوع السائق: {app.driverType === "own_vehicle" ? "بسيارته" : app.driverType === "rent_vehicle" ? "يستأجر" : "سيارة الشركة"}</span>
                              <span>نوع المركبة: {app.vehicleType ?? "-"}</span>
                            </div>
                            {app.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1 bg-emerald-500 text-white text-xs"
                                  onClick={() => updateDriverStatus.mutate({ applicationId: app.id, status: "approved" })}
                                  disabled={updateDriverStatus.isPending}>
                                  <CheckCircle className="w-3 h-3 ml-1" /> قبول
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-200 text-xs"
                                  onClick={() => updateDriverStatus.mutate({ applicationId: app.id, status: "rejected" })}
                                  disabled={updateDriverStatus.isPending}>
                                  <XCircle className="w-3 h-3 ml-1" /> رفض
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        {driverApps.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد طلبات سائقين بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* RIDES */}
            {activeTab === "rides" && (
              <motion.div key="rides" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {allRides.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">جميع الرحلات ({allRides.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {allRides.data?.map((ride) => (
                          <div key={ride.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                ride.status === "completed" ? "bg-emerald-100" :
                                ride.status === "in_progress" ? "bg-sky-100" :
                                ride.status === "scheduled" ? "bg-amber-100" : "bg-gray-100"
                              }`}>
                                <Navigation className={`w-5 h-5 ${
                                  ride.status === "completed" ? "text-emerald-600" :
                                  ride.status === "in_progress" ? "text-sky-600" :
                                  ride.status === "scheduled" ? "text-amber-600" : "text-gray-400"
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">رحلة #{ride.id}</p>
                                <p className="text-xs text-gray-400">{new Date(ride.scheduledTime).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900">{ride.price} ر.س</p>
                              <Badge variant={ride.status === "completed" ? "secondary" : "outline"} className="text-xs">
                                {ride.status === "scheduled" ? "مجدول" : ride.status === "in_progress" ? "جارٍ" : ride.status === "completed" ? "مكتمل" : "ملغي"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {allRides.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد رحلات بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* ROUTES */}
            {activeTab === "routes" && (
              <motion.div key="routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Add Route Form */}
                <Card className="border-0 shadow-sm border-violet-100 bg-violet-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-violet-800">إضافة مسار جديد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">اسم المسار</Label>
                        <Input placeholder="مثال: الرياض - حي النرجس" value={newRouteName} onChange={e => setNewRouteName(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">المدينة</Label>
                        <Select value={newRouteCity} onValueChange={setNewRouteCity}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "أبها", "تبوك"].map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">نقطة الانطلاق</Label>
                        <Input placeholder="مثال: حي العليا" value={newRouteStart} onChange={e => setNewRouteStart(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">نقطة الوصول</Label>
                        <Input placeholder="مثال: وسط المدينة" value={newRouteEnd} onChange={e => setNewRouteEnd(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">نوع الخدمة</Label>
                        <Select value={newRouteType} onValueChange={setNewRouteType}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employees">موظفون/موظفات</SelectItem>
                            <SelectItem value="students">طالبات</SelectItem>
                            <SelectItem value="teachers">معلمات</SelectItem>
                            <SelectItem value="corporate">شركات</SelectItem>
                            <SelectItem value="airport">مطار</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">السعر الشهري (ر.س)</Label>
                        <Input type="number" placeholder="0.00" value={newRoutePrice} onChange={e => setNewRoutePrice(e.target.value)} />
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      disabled={createRoute.isPending || !newRouteName || !newRouteStart || !newRouteEnd || !newRoutePrice}
                      onClick={() => createRoute.mutate({
                        name: newRouteName,
                        startLocation: newRouteStart,
                        endLocation: newRouteEnd,
                        city: newRouteCity,
                        serviceType: newRouteType,
                        monthlyPrice: parseFloat(newRoutePrice),
                      })}>
                      {createRoute.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة المسار"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Routes List */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">المسارات ({routes.data?.length ?? 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {routes.isLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
                    ) : routes.data?.length === 0 ? (
                      <p className="text-center text-gray-400 py-6">لا توجد مسارات بعد</p>
                    ) : (
                      <div className="space-y-2">
                        {routes.data?.map((route) => (
                          <div key={route.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                <Route className="w-5 h-5 text-violet-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{route.name}</p>
                                <p className="text-xs text-gray-400">{route.startLocation} → {route.endLocation}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-violet-700">{route.basePrice} ر.س</p>
                              <Badge variant="secondary" className="text-xs">مسار</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* SUBSCRIPTIONS */}
            {activeTab === "subscriptions" && (
              <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {subscriptionsList.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">طلبات الاشتراك الشهري ({subscriptionsList.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {subscriptionsList.data?.map((sub: any) => (
                          <div key={sub.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-bold text-gray-900">{sub.fullName}</p>
                                <p className="text-xs text-gray-500">{sub.phone} • {sub.email || 'لا يوجد بريد'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={sub.status === 'active' ? 'default' : sub.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                                  {sub.status === 'pending' ? 'قيد المراجعة' : sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : 'ملغي'}
                                </Badge>
                                <p className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleDateString('ar-SA')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                              <div className="text-xs"><span className="text-gray-400">النوع:</span> <span className="font-medium text-gray-700">{sub.serviceType === 'employee' ? 'موظفات' : sub.serviceType === 'student' ? 'طالبات' : sub.serviceType === 'teacher' ? 'معلمات' : 'شركات'}</span></div>
                              <div className="text-xs"><span className="text-gray-400">المدينة:</span> <span className="font-medium text-gray-700">{sub.city}</span></div>
                              <div className="text-xs"><span className="text-gray-400">الركاب:</span> <span className="font-medium text-gray-700">{sub.numberOfPassengers}</span></div>
                              <div className="text-xs"><span className="text-gray-400">الوقت:</span> <span className="font-medium text-gray-700">{sub.preferredTime || 'غير محدد'}</span></div>
                            </div>
                            <div className="text-xs mb-3">
                              <span className="text-gray-400">من:</span> <span className="text-gray-700">{sub.pickupAddress}</span>
                              <span className="text-gray-400 mx-2">→</span>
                              <span className="text-gray-400">إلى:</span> <span className="text-gray-700">{sub.dropoffAddress}</span>
                            </div>
                            {sub.notes && <p className="text-xs text-gray-500 mb-3">ملاحظات: {sub.notes}</p>}
                            <div className="flex gap-2">
                              {sub.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-emerald-500 text-white text-xs hover:bg-emerald-600" onClick={() => updateSubscriptionStatus.mutate({ subscriptionId: sub.id, status: 'active' })}>
                                    <CheckCircle className="w-3 h-3 ml-1" />تفعيل
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 text-xs" onClick={() => updateSubscriptionStatus.mutate({ subscriptionId: sub.id, status: 'cancelled' })}>
                                    <XCircle className="w-3 h-3 ml-1" />إلغاء
                                  </Button>
                                </>
                              )}
                              {sub.status === 'active' && (
                                <Button size="sm" variant="outline" className="text-amber-500 border-amber-200 text-xs" onClick={() => updateSubscriptionStatus.mutate({ subscriptionId: sub.id, status: 'expired' })}>
                                  <Clock className="w-3 h-3 ml-1" />إنهاء
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {subscriptionsList.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد طلبات اشتراك بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* RENTALS */}
            {activeTab === "rentals" && (
              <motion.div key="rentals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {rentalsList.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">طلبات تأجير المركبات ({rentalsList.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {rentalsList.data?.map((req: any) => (
                          <div key={req.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-gray-900">{req.fullName}</p>
                                <p className="text-xs text-gray-500">{req.phone} • {req.email || 'لا يوجد بريد'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={req.status === 'confirmed' ? 'default' : req.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                                  {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'confirmed' ? 'مؤكد' : 'مرفوض'}
                                </Badge>
                                <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('ar-SA')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                              <div className="text-xs"><span className="text-gray-400">نوع المركبة:</span> <span className="font-medium text-gray-700">{req.vehicleType}</span></div>
                              <div className="text-xs"><span className="text-gray-400">من:</span> <span className="font-medium text-gray-700">{req.startDate}</span></div>
                              <div className="text-xs"><span className="text-gray-400">إلى:</span> <span className="font-medium text-gray-700">{req.endDate}</span></div>
                            </div>
                            {req.rentalPurpose && <p className="text-xs text-gray-500">الغرض: {req.rentalPurpose}</p>}
                            {req.pickupLocation && <p className="text-xs text-gray-500">موقع الاستلام: {req.pickupLocation}</p>}
                            {req.notes && <p className="text-xs text-gray-500">ملاحظات: {req.notes}</p>}
                          </div>
                        ))}
                        {rentalsList.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد طلبات تأجير بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* CORPORATES */}
            {activeTab === "corporates" && (
              <motion.div key="corporates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {corporatesList.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">طلبات الشركات ({corporatesList.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {corporatesList.data?.map((corp: any) => (
                          <div key={corp.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-gray-900">{corp.companyName}</p>
                                <p className="text-xs text-gray-500">جهة الاتصال: {corp.contactName} • {corp.phone}</p>
                                <p className="text-xs text-gray-500">{corp.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={corp.status === 'contracted' ? 'default' : corp.status === 'pending' ? 'secondary' : corp.status === 'contacted' ? 'outline' : 'destructive'} className="text-xs">
                                  {corp.status === 'pending' ? 'جديد' : corp.status === 'contacted' ? 'تم التواصل' : corp.status === 'contracted' ? 'متعاقد' : 'مرفوض'}
                                </Badge>
                                <p className="text-xs text-gray-400">{new Date(corp.createdAt).toLocaleDateString('ar-SA')}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                              <div className="text-xs"><span className="text-gray-400">نوع الخدمة:</span> <span className="font-medium text-gray-700">{corp.serviceType === 'employees' ? 'موظفين' : corp.serviceType === 'students' ? 'طلاب' : corp.serviceType === 'mixed' ? 'مختلط' : 'مطار'}</span></div>
                              {corp.employeeCount && <div className="text-xs"><span className="text-gray-400">عدد الموظفين:</span> <span className="font-medium text-gray-700">{corp.employeeCount}</span></div>}
                              {corp.city && <div className="text-xs"><span className="text-gray-400">المدينة:</span> <span className="font-medium text-gray-700">{corp.city}</span></div>}
                            </div>
                            {corp.requirements && <p className="text-xs text-gray-500">المتطلبات: {corp.requirements}</p>}
                          </div>
                        ))}
                        {corporatesList.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد طلبات شركات بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {messages.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">رسائل التواصل ({messages.data?.length ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {messages.data?.map((msg) => (
                          <div key={msg.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-gray-900">{msg.name}</p>
                                <p className="text-xs text-gray-500">{msg.email} • {msg.phone}</p>
                              </div>
                              <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                            <p className="text-xs font-medium text-violet-700 mb-1">{msg.subject}</p>
                            <p className="text-sm text-gray-600">{msg.message}</p>
                          </div>
                        ))}
                        {messages.data?.length === 0 && (
                          <p className="text-center text-gray-400 py-8">لا توجد رسائل بعد</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
            {/* ANALYTICS & REPORTS */}
            {activeTab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {analyticsData.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
                ) : (
                  <>
                    {/* Overview KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        { label: "إجمالي المستخدمين", value: analyticsData.data?.overview?.totalUsers ?? 0, icon: Users, gradient: "from-sky-500 to-blue-600" },
                        { label: "إجمالي الاشتراكات", value: analyticsData.data?.overview?.totalSubscriptions ?? 0, icon: CalendarCheck, gradient: "from-emerald-500 to-teal-600" },
                        { label: "طلبات التأجير", value: analyticsData.data?.overview?.totalRentals ?? 0, icon: Truck, gradient: "from-amber-500 to-orange-600" },
                        { label: "طلبات الشركات", value: analyticsData.data?.overview?.totalCorporate ?? 0, icon: Building2, gradient: "from-violet-500 to-purple-600" },
                        { label: "طلبات السائقين", value: analyticsData.data?.overview?.totalDriverApps ?? 0, icon: Car, gradient: "from-rose-500 to-pink-600" },
                      ].map((kpi, i) => (
                        <Card key={i} className="border-0 shadow-sm overflow-hidden">
                          <CardContent className="p-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center mb-3 shadow-md`}>
                              <kpi.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Subscriptions Distribution */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-emerald-500" />
                            توزيع الاشتراكات حسب النوع
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {subsByType.isLoading ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
                          ) : (subsByType.data?.length ?? 0) === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">لا توجد بيانات بعد</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {(() => {
                                const typeLabels: Record<string, string> = { employee: "موظفات", student: "طالبات", teacher: "معلمات", corporate: "شركات" };
                                const colors = ["bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500"];
                                const total = subsByType.data?.reduce((sum, s) => sum + (s.count ?? 0), 0) ?? 1;
                                return subsByType.data?.map((s, i) => (
                                  <div key={s.serviceType} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700 font-medium">{typeLabels[s.serviceType ?? ""] ?? s.serviceType}</span>
                                      <span className="text-gray-500">{s.count} ({Math.round(((s.count ?? 0) / total) * 100)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                      <div className={`${colors[i % colors.length]} h-3 rounded-full transition-all duration-700`} style={{ width: `${Math.max(((s.count ?? 0) / total) * 100, 3)}%` }} />
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Subscription Status */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-sky-500" />
                            حالة الاشتراكات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { label: "مفعّلة", value: analyticsData.data?.subscriptions?.active ?? 0, color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50" },
                              { label: "قيد المراجعة", value: analyticsData.data?.subscriptions?.pending ?? 0, color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50" },
                              { label: "إجمالي", value: analyticsData.data?.subscriptions?.total ?? 0, color: "bg-sky-500", textColor: "text-sky-700", bgColor: "bg-sky-50" },
                            ].map((item, i) => (
                              <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${item.bgColor}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                  <span className={`text-sm font-medium ${item.textColor}`}>{item.label}</span>
                                </div>
                                <span className={`text-xl font-bold ${item.textColor}`}>{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Rides Status */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-blue-500" />
                            حالة الرحلات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { label: "مكتملة", value: analyticsData.data?.rides?.completed ?? 0, color: "bg-emerald-500", icon: CheckCircle },
                              { label: "مجدولة", value: analyticsData.data?.rides?.scheduled ?? 0, color: "bg-sky-500", icon: Clock },
                              { label: "ملغاة", value: analyticsData.data?.rides?.cancelled ?? 0, color: "bg-red-500", icon: XCircle },
                              { label: "إجمالي", value: analyticsData.data?.rides?.total ?? 0, color: "bg-gray-500", icon: Navigation },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center`}>
                                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                                  </div>
                                  <span className="text-sm text-gray-700">{item.label}</span>
                                </div>
                                <span className="font-bold text-gray-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Drivers Status */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Car className="w-5 h-5 text-amber-500" />
                            حالة طلبات السائقين
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { label: "تمت الموافقة", value: analyticsData.data?.drivers?.approved ?? 0, color: "bg-emerald-500", icon: CheckCircle },
                              { label: "قيد المراجعة", value: analyticsData.data?.drivers?.pending ?? 0, color: "bg-amber-500", icon: Clock },
                              { label: "مرفوضة", value: analyticsData.data?.drivers?.rejected ?? 0, color: "bg-red-500", icon: XCircle },
                              { label: "إجمالي", value: analyticsData.data?.drivers?.total ?? 0, color: "bg-gray-500", icon: Car },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center`}>
                                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                                  </div>
                                  <span className="text-sm text-gray-700">{item.label}</span>
                                </div>
                                <span className="font-bold text-gray-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Services Summary */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-violet-500" />
                          ملخص الخدمات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "الاشتراكات", total: analyticsData.data?.overview?.totalSubscriptions ?? 0, active: analyticsData.data?.subscriptions?.active ?? 0, color: "from-emerald-400 to-emerald-600" },
                            { label: "طلبات التأجير", total: analyticsData.data?.overview?.totalRentals ?? 0, active: null, color: "from-amber-400 to-amber-600" },
                            { label: "طلبات الشركات", total: analyticsData.data?.overview?.totalCorporate ?? 0, active: null, color: "from-violet-400 to-violet-600" },
                            { label: "رسائل التواصل", total: analyticsData.data?.overview?.totalContactMsgs ?? 0, active: null, color: "from-sky-400 to-sky-600" },
                          ].map((svc, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-gray-50">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} mx-auto flex items-center justify-center mb-3 shadow-md`}>
                                <span className="text-white font-bold text-lg">{svc.total}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{svc.label}</p>
                              {svc.active !== null && (
                                <p className="text-xs text-emerald-600 mt-1">{svc.active} مفعّل</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revenue Card */}
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/80 mb-1">إجمالي الإيرادات</p>
                            <p className="text-4xl font-bold">{analyticsData.data?.overview?.totalRevenue ?? 0} <span className="text-lg font-normal text-white/80">ر.س</span></p>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Wallet className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-white/60">تذاكر الدعم المفتوحة</p>
                            <p className="text-lg font-bold">{analyticsData.data?.overview?.openTickets ?? 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">إجمالي الرحلات</p>
                            <p className="text-lg font-bold">{analyticsData.data?.overview?.totalRides ?? 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">إجمالي المستخدمين</p>
                            <p className="text-lg font-bold">{analyticsData.data?.overview?.totalUsers ?? 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
