import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Car, Users, Wallet, Star, Bell, User,
  ChevronLeft, ArrowLeft, Navigation, Clock,
  TrendingUp, CheckCircle, XCircle, Plus,
  Calendar, MapPin, Loader2, Phone, Shield,
  MessageCircle, Settings
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
import RideTrackingMap from "@/components/RideTrackingMap";
import NotificationBell from "@/components/NotificationBell";

export default function DriverDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [newRideRouteId, setNewRideRouteId] = useState("");
  const [newRideTime, setNewRideTime] = useState("");
  const [newRideSeats, setNewRideSeats] = useState("4");
  const [newRidePrice, setNewRidePrice] = useState("");
  const [trackingRideId, setTrackingRideId] = useState<number | null>(null);

  // Queries
  const wallet = trpc.wallet.get.useQuery(undefined, { enabled: isAuthenticated });
  const myRides = trpc.rides.myRides.useQuery(undefined, { enabled: isAuthenticated && (activeTab === "rides" || activeTab === "home") });
  const routes = trpc.routes.list.useQuery(undefined, { enabled: activeTab === "add-ride" });
  const transactions = trpc.wallet.transactions.useQuery(undefined, { enabled: isAuthenticated && activeTab === "earnings" });

  // Mutations
  const createRide = trpc.rides.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الرحلة بنجاح!");
      myRides.refetch();
      setActiveTab("rides");
      setNewRideRouteId(""); setNewRideTime(""); setNewRideSeats("4"); setNewRidePrice("");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatus = trpc.rides.updateStatus.useMutation({
    onSuccess: () => { toast.success("تم تحديث حالة الرحلة"); myRides.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const ridePassengers = trpc.bookings.ridePassengers;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-xl">
          <Car className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">بوابة السائقين</h1>
        <p className="text-gray-500 mb-8">سجّل دخولك للوصول إلى لوحة تحكم السائق</p>
        <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 shadow-lg hover:scale-105 transition-transform"
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

  const walletBalance = parseFloat(wallet.data?.balance ?? "0");
  const totalEarnings = parseFloat(wallet.data?.totalAdded ?? "0");
  const completedRides = myRides.data?.filter(r => r.status === "completed").length ?? 0;
  const activeRides = myRides.data?.filter(r => r.status === "in_progress" || r.status === "scheduled").length ?? 0;

  const navItems = [
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "rides", icon: Car, label: "رحلاتي" },
    { id: "map", icon: Navigation, label: "الخريطة" },
    { id: "add-ride", icon: Plus, label: "رحلة جديدة" },
    { id: "earnings", icon: Wallet, label: "الأرباح" },
    { id: "profile", icon: User, label: "حسابي" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70">السائق</p>
              <p className="font-bold text-sm">{user?.name ?? "السائق"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-bold">{walletBalance.toFixed(0)} ر.س</span>
            </div>
            <div className="bg-white rounded-full p-1">
              <NotificationBell />
            </div>
          </div>
        </div>
        {activeTab === "home" && (
          <div className="mt-2">
            <p className="text-white/80 text-sm">جاهز للعمل؟</p>
            <h2 className="text-xl font-bold">لوحة تحكم السائق</h2>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <AnimatePresence mode="wait">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "رحلات مكتملة", value: completedRides, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50", gradient: "from-emerald-500 to-teal-600" },
                  { label: "رحلات نشطة", value: activeRides, icon: Navigation, color: "text-sky-600 bg-sky-50", gradient: "from-sky-500 to-blue-600" },
                  { label: "إجمالي الأرباح", value: `${totalEarnings.toFixed(0)} ر.س`, icon: TrendingUp, color: "text-amber-600 bg-amber-50", gradient: "from-amber-500 to-orange-600" },
                  { label: "تقييمي", value: "5.0 ⭐", icon: Star, color: "text-violet-600 bg-violet-50", gradient: "from-violet-500 to-purple-600" },
                ].map((stat, i) => (
                  <Card key={i} className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-3">إجراءات سريعة</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveTab("add-ride")} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">أنشئ</p>
                        <p className="font-bold text-sm text-gray-900">رحلة جديدة</p>
                      </div>
                    </button>
                    <button onClick={() => setActiveTab("earnings")} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">عرض</p>
                        <p className="font-bold text-sm text-gray-900">الأرباح</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Rides */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">آخر الرحلات</CardTitle>
                    <button onClick={() => setActiveTab("rides")} className="text-amber-500 text-xs flex items-center gap-1">
                      عرض الكل <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {myRides.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>
                  ) : myRides.data?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <Car className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">لا توجد رحلات بعد</p>
                      <Button onClick={() => setActiveTab("add-ride")} className="mt-3 bg-amber-500 text-white text-xs h-8">أنشئ رحلة</Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myRides.data?.slice(0, 3).map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              ride.status === "completed" ? "bg-emerald-100" :
                              ride.status === "in_progress" ? "bg-sky-100" :
                              ride.status === "scheduled" ? "bg-amber-100" : "bg-gray-100"
                            }`}>
                              <Car className={`w-4 h-4 ${
                                ride.status === "completed" ? "text-emerald-600" :
                                ride.status === "in_progress" ? "text-sky-600" :
                                ride.status === "scheduled" ? "text-amber-600" : "text-gray-400"
                              }`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">رحلة #{ride.id}</p>
                              <p className="text-xs text-gray-400">{new Date(ride.scheduledTime).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-gray-900">{ride.price} ر.س</p>
                            <Badge variant={ride.status === "completed" ? "secondary" : ride.status === "in_progress" ? "default" : "outline"} className="text-xs">
                              {ride.status === "scheduled" ? "مجدول" : ride.status === "in_progress" ? "جارٍ" : ride.status === "completed" ? "مكتمل" : "ملغي"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* RIDES TAB */}
          {activeTab === "rides" && (
            <motion.div key="rides" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">رحلاتي</h2>
                <Button size="sm" onClick={() => setActiveTab("add-ride")} className="bg-amber-500 text-white text-xs h-8 gap-1">
                  <Plus className="w-3 h-3" /> رحلة جديدة
                </Button>
              </div>
              {myRides.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
              ) : myRides.data?.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Car className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-base font-medium">لا توجد رحلات بعد</p>
                  <Button onClick={() => setActiveTab("add-ride")} className="mt-4 bg-amber-500 text-white">أنشئ رحلتك الأولى</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRides.data?.map((ride) => (
                    <Card key={ride.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                              ride.status === "completed" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                              ride.status === "in_progress" ? "bg-gradient-to-br from-sky-500 to-blue-600" :
                              ride.status === "scheduled" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                              "bg-gradient-to-br from-gray-400 to-gray-500"
                            }`}>
                              <Car className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">رحلة #{ride.id}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(ride.scheduledTime).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-gray-900">{ride.price} ر.س</p>
                            <p className="text-xs text-gray-500">{ride.availableSeats}/{ride.totalSeats} مقعد</p>
                          </div>
                        </div>

                        {/* Status Actions */}
                        {ride.status === "scheduled" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-sky-500 text-white text-xs"
                              onClick={() => updateStatus.mutate({ rideId: ride.id, status: "in_progress" })}
                              disabled={updateStatus.isPending}>
                              <Navigation className="w-3 h-3 ml-1" /> ابدأ الرحلة
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-200 text-xs"
                              onClick={() => updateStatus.mutate({ rideId: ride.id, status: "cancelled" })}
                              disabled={updateStatus.isPending}>
                              إلغاء
                            </Button>
                          </div>
                        )}
                        {ride.status === "in_progress" && (
                          <Button size="sm" className="w-full bg-emerald-500 text-white text-xs"
                            onClick={() => updateStatus.mutate({ rideId: ride.id, status: "completed" })}
                            disabled={updateStatus.isPending}>
                            <CheckCircle className="w-3 h-3 ml-1" /> إنهاء الرحلة
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ADD RIDE TAB */}
          {activeTab === "add-ride" && (
            <motion.div key="add-ride" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">إنشاء رحلة جديدة</h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">المسار</Label>
                    <Select value={newRideRouteId} onValueChange={setNewRideRouteId}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المسار..." />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.data?.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.name} - {r.startLocation} → {r.endLocation}
                          </SelectItem>
                        ))}
                        {routes.data?.length === 0 && <SelectItem value="none" disabled>لا توجد مسارات متاحة</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">موعد الرحلة</Label>
                    <Input type="datetime-local" value={newRideTime} onChange={(e) => setNewRideTime(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">عدد المقاعد</Label>
                      <Input type="number" value={newRideSeats} onChange={(e) => setNewRideSeats(e.target.value)} min={1} max={50} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">السعر (ر.س)</Label>
                      <Input type="number" value={newRidePrice} onChange={(e) => setNewRidePrice(e.target.value)} placeholder="0.00" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    disabled={createRide.isPending || !newRideRouteId || !newRideTime || !newRidePrice}
                    onClick={() => createRide.mutate({
                      routeId: parseInt(newRideRouteId),
                      scheduledTime: newRideTime,
                      totalSeats: parseInt(newRideSeats),
                      price: parseFloat(newRidePrice),
                    })}>
                    {createRide.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إنشاء الرحلة"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">الأرباح والمدفوعات</h2>

              {/* Earnings Summary */}
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-white/70 text-sm mb-1">إجمالي الأرباح</p>
                <p className="text-4xl font-bold mb-1">{totalEarnings.toFixed(2)}</p>
                <p className="text-white/70 text-sm">ريال سعودي</p>
                <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white/60 text-xs">رصيد المحفظة</p>
                    <p className="font-bold">{walletBalance.toFixed(2)} ر.س</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">رحلات مكتملة</p>
                    <p className="font-bold">{completedRides} رحلة</p>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">سجل المدفوعات</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {transactions.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>
                  ) : transactions.data?.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">لا توجد مدفوعات بعد</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.data?.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{tx.description ?? "دفعة"}</p>
                              <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                          <p className="font-bold text-sm text-emerald-600">+{tx.amount} ر.س</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* MAP TAB */}
          {activeTab === "map" && (
            <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">خريطة الرحلة</h2>
              {myRides.data?.some(r => r.status === "in_progress" || r.status === "scheduled") ? (
                (() => {
                  const activeRide = myRides.data?.find(r => r.status === "in_progress" || r.status === "scheduled");
                  return activeRide ? (
                    <RideTrackingMap
                      startLocation="نقطة الانطلاق"
                      endLocation="الوجهة"
                      rideStatus={activeRide.status as "scheduled" | "in_progress" | "completed"}
                      className="w-full"
                      mode="driver"
                    />
                  ) : null;
                })()
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Navigation className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">لا توجد رحلات نشطة</p>
                  <p className="text-xs mt-1">أنشئ رحلة جديدة لعرض الخريطة</p>
                  <Button size="sm" onClick={() => setActiveTab("add-ride")} className="mt-3 bg-amber-500 text-white text-xs">رحلة جديدة</Button>
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">حسابي</h2>

              {/* Profile Card */}
              <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{user?.name ?? "السائق"}</h3>
                  <p className="text-gray-500 text-sm mt-1">{user?.email ?? ""}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-600">{completedRides}</p>
                      <p className="text-xs text-gray-500">رحلة</p>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-600">5.0</p>
                      <p className="text-xs text-gray-500">تقييم</p>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-amber-600">{totalEarnings.toFixed(0)}</p>
                      <p className="text-xs text-gray-500">ر.س</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  {[
                    { icon: Shield, label: "سياسة الخصوصية", color: "text-sky-600 bg-sky-50" },
                    { icon: Phone, label: "تواصل مع الإدارة: 0510660620", color: "text-emerald-600 bg-emerald-50", href: "tel:0510660620" },
                    { icon: MessageCircle, label: "الدعم والمساعدة", color: "text-violet-600 bg-violet-50" },
                  ].map((item, i) => (
                    <a key={i} href={item.href ?? "#"} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <ChevronLeft className="w-4 h-4 text-gray-400 mr-auto" />
                    </a>
                  ))}
                </CardContent>
              </Card>

              <Link href="/">
                <Button variant="outline" className="w-full text-gray-500">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للموقع الرئيسي
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-2xl px-2 py-2 z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${activeTab === item.id ? "text-amber-600 bg-amber-50" : "text-gray-400 hover:text-gray-600"}`}>
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-amber-600" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
