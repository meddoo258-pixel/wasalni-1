import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MapPin, Wallet, Star, Clock,
  Navigation, Bell, ArrowLeft, Loader2,
  CheckCircle, XCircle, Calendar, CreditCard,
  MessageCircle, User, Route, ChevronRight, Plus,
  CalendarCheck, Settings
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
import RatingDialog from "@/components/RatingDialog";
import NotificationBell from "@/components/NotificationBell";

export default function PassengerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<"tabby" | "tamara" | "card">("card");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDesc, setSupportDesc] = useState("");
  const [trackingRideId, setTrackingRideId] = useState<number | null>(null);
  const [ratingBooking, setRatingBooking] = useState<{ rideId: number; driverId: number } | null>(null);

  // Queries
  const wallet = trpc.wallet.get.useQuery(undefined, { enabled: isAuthenticated });
  const myBookings = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated && (activeTab === "bookings" || activeTab === "overview") });
  const transactions = trpc.wallet.transactions.useQuery(undefined, { enabled: isAuthenticated && activeTab === "wallet" });
  const availableRides = trpc.rides.available.useQuery(undefined, { enabled: activeTab === "book" });
  const myTickets = trpc.support.myTickets.useQuery(undefined, { enabled: isAuthenticated && activeTab === "support" });
  const mySubscriptions = trpc.subscriptions.mySubscriptions.useQuery(undefined, { enabled: isAuthenticated && activeTab === "subscriptions" });

  // Mutations
  const topUpWallet = trpc.wallet.topUp.useMutation({
    onSuccess: () => { toast.success("تم شحن المحفظة بنجاح!"); wallet.refetch(); transactions.refetch(); setTopUpAmount(""); },
    onError: (e) => toast.error(e.message),
  });

  const bookRide = trpc.bookings.create.useMutation({
    onSuccess: () => { toast.success("تم حجز الرحلة بنجاح!"); myBookings.refetch(); wallet.refetch(); setActiveTab("bookings"); },
    onError: (e) => toast.error(e.message),
  });

  const cancelBooking = trpc.bookings.cancel.useMutation({
    onSuccess: () => { toast.success("تم إلغاء الحجز"); myBookings.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const createTicket = trpc.support.createTicket.useMutation({
    onSuccess: () => { toast.success("تم إرسال طلب الدعم"); myTickets.refetch(); setSupportSubject(""); setSupportDesc(""); },
    onError: (e) => toast.error(e.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 shadow-xl">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة تحكم الراكب</h1>
        <p className="text-gray-500 mb-8">سجّل دخولك للوصول إلى لوحة التحكم</p>
        <Button size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-10 shadow-lg hover:scale-105 transition-transform"
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
    { id: "overview", icon: LayoutDashboard, label: "الرئيسية" },
    { id: "book", icon: Route, label: "احجز رحلة" },
    { id: "bookings", icon: Calendar, label: "حجوزاتي" },
    { id: "subscriptions", icon: CalendarCheck, label: "اشتراكاتي" },
    { id: "track", icon: Navigation, label: "تتبع الرحلة" },
    { id: "wallet", icon: Wallet, label: "المحفظة" },
    { id: "support", icon: MessageCircle, label: "الدعم" },
    { id: "profile", icon: Settings, label: "الملف الشخصي" },
  ];

  const walletBalance = parseFloat(wallet.data?.balance ?? "0");

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-l border-gray-100 shadow-sm min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">وصلني</p>
              <p className="text-xs text-gray-400">لوحة الراكب</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? "bg-sky-50 text-sky-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
              <User className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400">راكب</p>
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
            {navItems.find(n => n.id === activeTab)?.label ?? "لوحة التحكم"}
          </h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-100">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-500"
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
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-sm opacity-80 mb-1">مرحباً بك،</p>
                  <h2 className="text-2xl font-bold mb-4">{user?.name ?? "مستخدم"}</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-70">رصيد المحفظة</p>
                      <p className="text-3xl font-bold">{walletBalance.toFixed(2)} <span className="text-sm">ر.س</span></p>
                    </div>
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs"
                      onClick={() => setActiveTab("wallet")}>
                      <Plus className="w-3 h-3 ml-1" /> شحن
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Route, label: "احجز رحلة", tab: "book", gradient: "from-sky-500 to-blue-600" },
                    { icon: Calendar, label: "حجوزاتي", tab: "bookings", gradient: "from-emerald-500 to-teal-600" },
                    { icon: Wallet, label: "المحفظة", tab: "wallet", gradient: "from-violet-500 to-purple-600" },
                    { icon: MessageCircle, label: "الدعم", tab: "support", gradient: "from-amber-500 to-orange-600" },
                  ].map((action, i) => (
                    <button key={i} onClick={() => setActiveTab(action.tab)}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>

                {/* Active Ride Tracking Map */}
                {myBookings.data?.some(b => b.status === "confirmed") && (
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-sky-600" />
                        تتبع رحلتك
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {(() => {
                        const activeBooking = myBookings.data?.find(b => b.status === "confirmed");
                        return activeBooking ? (
                          <RideTrackingMap
                            startLocation="نقطة الانطلاق"
                            endLocation="الوجهة"
                            rideStatus="scheduled"
                            className="rounded-none border-0"
                            mode="passenger"
                          />
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Recent Bookings */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">آخر الحجوزات</CardTitle>
                    <button onClick={() => setActiveTab("bookings")} className="text-xs text-sky-600 flex items-center gap-1">
                      عرض الكل <ChevronRight className="w-3 h-3" />
                    </button>
                  </CardHeader>
                  <CardContent>
                    {myBookings.isLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                    ) : myBookings.data?.length === 0 ? (
                      <div className="text-center py-6 text-gray-400">
                        <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">لا توجد حجوزات بعد</p>
                        <Button size="sm" onClick={() => setActiveTab("book")} className="mt-3 bg-sky-500 text-white text-xs">احجز الآن</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {myBookings.data?.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                booking.status === "confirmed" ? "bg-sky-100" :
                                booking.status === "completed" ? "bg-emerald-100" : "bg-red-100"
                              }`}>
                                <Navigation className={`w-4 h-4 ${
                                  booking.status === "confirmed" ? "text-sky-600" :
                                  booking.status === "completed" ? "text-emerald-600" : "text-red-400"
                                }`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">حجز #{booking.id}</p>
                                <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString("ar-SA")}</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900">{booking.price} ر.س</p>
                              <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "completed" ? "secondary" : "destructive"} className="text-xs">
                                {booking.status === "confirmed" ? "مؤكد" : booking.status === "completed" ? "مكتمل" : "ملغي"}
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

            {/* BOOK RIDE */}
            {activeTab === "book" && (
              <motion.div key="book" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">الرحلات المتاحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableRides.isLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
                    ) : availableRides.data?.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Route className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">لا توجد رحلات متاحة الآن</p>
                        <p className="text-xs mt-1">تحقق لاحقاً أو تواصل معنا</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {availableRides.data?.map((ride) => (
                          <div key={ride.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                                  <Navigation className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">رحلة #{ride.id}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(ride.scheduledTime).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-sky-700">{ride.price} ر.س</p>
                                <p className="text-xs text-gray-400">{ride.availableSeats} مقعد متاح</p>
                              </div>
                            </div>
                            <Button size="sm" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs"
                              disabled={bookRide.isPending || walletBalance < parseFloat(ride.price)}
                              onClick={() => bookRide.mutate({ rideId: ride.id, paymentMethod: "wallet" })}>
                              {bookRide.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                               walletBalance < parseFloat(ride.price) ? "رصيد غير كافٍ" : "احجز الآن"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* BOOKINGS */}
            {activeTab === "bookings" && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base">حجوزاتي ({myBookings.data?.length ?? 0})</CardTitle>
                    <Button size="sm" onClick={() => setActiveTab("book")} className="bg-sky-500 text-white text-xs">
                      <Plus className="w-3 h-3 ml-1" /> حجز جديد
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {myBookings.isLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
                    ) : myBookings.data?.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">لا توجد حجوزات بعد</p>
                        <Button size="sm" onClick={() => setActiveTab("book")} className="mt-3 bg-sky-500 text-white text-xs">احجز الآن</Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myBookings.data?.map((booking) => (
                          <div key={booking.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  booking.status === "confirmed" ? "bg-sky-100" :
                                  booking.status === "completed" ? "bg-emerald-100" : "bg-red-100"
                                }`}>
                                  <Navigation className={`w-5 h-5 ${
                                    booking.status === "confirmed" ? "text-sky-600" :
                                    booking.status === "completed" ? "text-emerald-600" : "text-red-400"
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">حجز #{booking.id}</p>
                                  <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-900">{booking.price} ر.س</p>
                                <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "completed" ? "secondary" : "destructive"} className="text-xs">
                                  {booking.status === "confirmed" ? "مؤكد" : booking.status === "completed" ? "مكتمل" : "ملغي"}
                                </Badge>
                              </div>
                            </div>
                            {booking.pickupLocation && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3" /> {booking.pickupLocation}
                              </p>
                            )}
                            <div className="flex gap-2">
                              {booking.status === "confirmed" && (
                                <>
                                  <Button size="sm" variant="outline" className="text-sky-600 border-sky-200 text-xs flex-1"
                                    onClick={() => { setTrackingRideId(booking.rideId); setActiveTab("track"); }}>
                                    <Navigation className="w-3 h-3 ml-1" /> تتبع
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 text-xs flex-1"
                                    onClick={() => cancelBooking.mutate({ bookingId: booking.id })}
                                    disabled={cancelBooking.isPending}>
                                    <XCircle className="w-3 h-3 ml-1" /> إلغاء
                                  </Button>
                                </>
                              )}
                              {booking.status === "completed" && (
                                <Button size="sm" className="bg-amber-500 text-white text-xs w-full"
                                  onClick={() => setRatingBooking({ rideId: booking.rideId, driverId: 0 })}>
                                  <Star className="w-3 h-3 ml-1" /> قيّم الرحلة
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* WALLET */}
            {activeTab === "wallet" && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-sm opacity-80 mb-1">الرصيد الحالي</p>
                  <p className="text-4xl font-bold mb-1">{walletBalance.toFixed(2)}</p>
                  <p className="text-sm opacity-70">ريال سعودي</p>
                  <div className="flex gap-4 mt-4 text-xs opacity-70">
                    <span>مجموع الإضافات: {wallet.data?.totalAdded ?? 0} ر.س</span>
                    <span>مجموع الإنفاق: {wallet.data?.totalSpent ?? 0} ر.س</span>
                  </div>
                </div>

                {/* Top Up Form */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">شحن المحفظة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">المبلغ (ر.س)</Label>
                      <Input type="number" placeholder="أدخل المبلغ (10 - 5000)" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} min={10} max={5000} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">طريقة الدفع</Label>
                      <Select value={topUpMethod} onValueChange={(v) => setTopUpMethod(v as "tabby" | "tamara" | "card")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">بطاقة ائتمانية / مدى</SelectItem>
                          <SelectItem value="tabby">تابي - قسّم على 4 دفعات</SelectItem>
                          <SelectItem value="tamara">تمارا - قسّم على 3 دفعات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      disabled={topUpWallet.isPending || !topUpAmount || parseFloat(topUpAmount) < 10}
                      onClick={() => topUpWallet.mutate({ amount: parseFloat(topUpAmount), method: topUpMethod })}>
                      {topUpWallet.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `شحن ${topUpAmount || 0} ر.س`}
                    </Button>
                  </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">المعاملات الأخيرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.isLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
                    ) : transactions.data?.length === 0 ? (
                      <p className="text-center text-gray-400 py-6 text-sm">لا توجد معاملات بعد</p>
                    ) : (
                      <div className="space-y-2">
                        {transactions.data?.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                tx.status === "completed" ? "bg-emerald-100" : "bg-red-100"
                              }`}>
                                <CreditCard className={`w-4 h-4 ${tx.status === "completed" ? "text-emerald-600" : "text-red-400"}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{tx.description ?? "معاملة"}</p>
                                <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString("ar-SA")}</p>
                              </div>
                            </div>
                            <p className={`font-bold ${tx.status === "completed" ? "text-emerald-600" : "text-red-400"}`}>
                              {tx.amount} ر.س
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TRACK RIDE */}
            {activeTab === "track" && (
              <motion.div key="track" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {trackingRideId ? (
                  <RideTrackingMap
                    startLocation="نقطة الانطلاق"
                    endLocation="الوجهة"
                    rideStatus="in_progress"
                    className="w-full"
                    mode="passenger"
                  />
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Navigation className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">اختر حجزاً لتتبعه</p>
                    <Button size="sm" onClick={() => setActiveTab("bookings")} className="mt-3 bg-sky-500 text-white text-xs">حجوزاتي</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* SUPPORT */}
            {activeTab === "support" && (
              <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* New Ticket Form */}
                <Card className="border-0 shadow-sm border-amber-100 bg-amber-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-amber-800">إرسال طلب دعم</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">الموضوع</Label>
                      <Input placeholder="اكتب موضوع طلبك..." value={supportSubject} onChange={e => setSupportSubject(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">التفاصيل</Label>
                      <textarea
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        rows={4}
                        placeholder="اشرح مشكلتك بالتفصيل..."
                        value={supportDesc}
                        onChange={e => setSupportDesc(e.target.value)}
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      disabled={createTicket.isPending || !supportSubject || supportDesc.length < 10}
                      onClick={() => createTicket.mutate({ subject: supportSubject, description: supportDesc })}>
                      {createTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال الطلب"}
                    </Button>
                  </CardContent>
                </Card>

                {/* My Tickets */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">طلباتي ({myTickets.data?.length ?? 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {myTickets.isLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>
                    ) : myTickets.data?.length === 0 ? (
                      <p className="text-center text-gray-400 py-6 text-sm">لا توجد طلبات دعم بعد</p>
                    ) : (
                      <div className="space-y-3">
                        {myTickets.data?.map((ticket) => (
                          <div key={ticket.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium text-gray-900">{ticket.subject}</p>
                              <Badge variant={
                                ticket.status === "open" ? "default" :
                                ticket.status === "in_progress" ? "secondary" :
                                ticket.status === "resolved" ? "outline" : "destructive"
                              } className="text-xs">
                                {ticket.status === "open" ? "مفتوح" : ticket.status === "in_progress" ? "قيد المعالجة" : ticket.status === "resolved" ? "محلول" : "مغلق"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{ticket.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(ticket.createdAt).toLocaleDateString("ar-SA")}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* MY SUBSCRIPTIONS */}
            {activeTab === "subscriptions" && (
              <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">اشتراكاتي الشهرية</h2>
                  <Link href="/subscribe">
                    <Button size="sm" className="bg-sky-500 text-white text-xs gap-1">
                      <Plus className="w-3 h-3" />اشتراك جديد
                    </Button>
                  </Link>
                </div>
                {mySubscriptions.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
                ) : mySubscriptions.data?.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-8 text-center">
                      <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">لا توجد اشتراكات بعد</p>
                      <Link href="/subscribe">
                        <Button className="bg-sky-500 text-white">اشترك الآن</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {mySubscriptions.data?.map((sub: any) => (
                      <Card key={sub.id} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900">
                                {sub.serviceType === 'employee' ? 'اشتراك موظفات' : sub.serviceType === 'student' ? 'اشتراك طالبات' : sub.serviceType === 'teacher' ? 'اشتراك معلمات' : 'اشتراك شركات'}
                              </p>
                              <p className="text-xs text-gray-500">{sub.city}</p>
                            </div>
                            <Badge variant={sub.status === 'active' ? 'default' : sub.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                              {sub.status === 'pending' ? 'قيد المراجعة' : sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : 'ملغي'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-400">من:</span> {sub.pickupAddress}
                            <span className="text-gray-400 mx-2">→</span>
                            <span className="text-gray-400">إلى:</span> {sub.dropoffAddress}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">تاريخ الطلب: {new Date(sub.createdAt).toLocaleDateString('ar-SA')}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROFILE */}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">الملف الشخصي</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{user?.name || 'مستخدم'}</p>
                        <p className="text-sm text-gray-500">{user?.email || 'لا يوجد بريد إلكتروني'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 mb-1">رصيد المحفظة</p>
                        <p className="text-xl font-bold text-sky-600">{walletBalance.toFixed(2)} ر.س</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 mb-1">إجمالي الحجوزات</p>
                        <p className="text-xl font-bold text-gray-900">{myBookings.data?.length ?? 0}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                      <p className="text-sm font-medium text-sky-700 mb-2">معلومات الحساب</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">الاسم</span>
                          <span className="text-gray-900 font-medium">{user?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">البريد</span>
                          <span className="text-gray-900 font-medium">{user?.email || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">الدور</span>
                          <span className="text-gray-900 font-medium">{user?.role === 'admin' ? 'مدير' : 'مستخدم'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rating Dialog */}
      {ratingBooking && (
        <RatingDialog
          open={!!ratingBooking}
          onClose={() => setRatingBooking(null)}
          rideId={ratingBooking.rideId}
          driverId={ratingBooking.driverId}
          onRated={() => myBookings.refetch()}
        />
      )}
    </div>
  );
}
