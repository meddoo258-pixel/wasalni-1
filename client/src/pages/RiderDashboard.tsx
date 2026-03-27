import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, MapPin, CreditCard, Clock, Star, MessageCircle,
  Bell, User, ChevronRight, ChevronLeft, ArrowLeft,
  Car, Navigation, CheckCircle, XCircle, Plus,
  Wallet, TrendingUp, Calendar, Shield, Phone,
  Search, Filter, Bus, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const PAYMENT_METHODS = [
  { id: "wallet", label: "المحفظة", icon: Wallet, color: "from-sky-500 to-blue-600" },
  { id: "tabby", label: "تابي", icon: CreditCard, color: "from-teal-500 to-teal-700" },
  { id: "tamara", label: "تمارا", icon: CreditCard, color: "from-pink-500 to-pink-700" },
  { id: "card", label: "بطاقة", icon: CreditCard, color: "from-gray-600 to-gray-800" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} className="focus:outline-none">
          <Star className={`w-8 h-8 transition-colors ${star <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  );
}

export default function RiderDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [bookingMethod, setBookingMethod] = useState<"wallet" | "tabby" | "tamara" | "card">("wallet");
  const [topUpAmount, setTopUpAmount] = useState(100);
  const [topUpMethod, setTopUpMethod] = useState<"tabby" | "tamara" | "card">("card");
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingRideId, setRatingRideId] = useState<number | null>(null);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDesc, setSupportDesc] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // tRPC queries
  const wallet = trpc.wallet.get.useQuery(undefined, { enabled: isAuthenticated });
  const transactions = trpc.wallet.transactions.useQuery(undefined, { enabled: isAuthenticated && activeTab === "wallet" });
  const availableRides = trpc.rides.available.useQuery(undefined, { enabled: activeTab === "book" || activeTab === "home" });
  const myBookings = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated && (activeTab === "rides" || activeTab === "home") });
  const myTickets = trpc.support.myTickets.useQuery(undefined, { enabled: isAuthenticated && activeTab === "support" });
  const ticketMessages = trpc.support.getMessages.useQuery(
    { ticketId: selectedTicket! },
    { enabled: !!selectedTicket }
  );

  // tRPC mutations
  const bookRide = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("تم الحجز بنجاح!");
      myBookings.refetch();
      wallet.refetch();
      setSelectedRide(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const cancelBooking = trpc.bookings.cancel.useMutation({
    onSuccess: () => { toast.success("تم إلغاء الحجز"); myBookings.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const topUp = trpc.wallet.topUp.useMutation({
    onSuccess: () => { toast.success(`تم إضافة ${topUpAmount} ريال للمحفظة`); wallet.refetch(); transactions.refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const submitRating = trpc.ratings.create.useMutation({
    onSuccess: () => { toast.success("شكراً على تقييمك!"); setRatingRideId(null); },
    onError: (e) => toast.error(e.message),
  });

  const createTicket = trpc.support.createTicket.useMutation({
    onSuccess: () => { toast.success("تم إرسال طلب الدعم"); myTickets.refetch(); setSupportSubject(""); setSupportDesc(""); },
    onError: (e) => toast.error(e.message),
  });

  const sendMessage = trpc.support.addMessage.useMutation({
    onSuccess: () => { ticketMessages.refetch(); setNewMessage(""); },
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
          <Car className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك في وصلني</h1>
        <p className="text-gray-500 mb-8">سجّل دخولك للوصول إلى لوحة التحكم</p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-10 shadow-lg hover:scale-105 transition-transform"
          onClick={() => window.location.href = getLoginUrl()}
        >
          تسجيل الدخول
        </Button>
        <Link href="/">
          <Button variant="ghost" className="mt-4 text-gray-500">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للموقع
          </Button>
        </Link>
      </div>
    );
  }

  const walletBalance = parseFloat(wallet.data?.balance ?? "0");

  const navItems = [
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "book", icon: Search, label: "احجز" },
    { id: "rides", icon: Car, label: "رحلاتي" },
    { id: "wallet", icon: Wallet, label: "المحفظة" },
    { id: "support", icon: MessageCircle, label: "الدعم" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70">مرحباً</p>
              <p className="font-bold text-sm">{user?.name ?? "المستخدم"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-bold">{walletBalance.toFixed(0)} ر.س</span>
            </div>
            <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTab === "home" && (
          <div className="mt-2">
            <p className="text-white/80 text-sm">جاهز للانطلاق؟</p>
            <h2 className="text-xl font-bold">احجز رحلتك الآن</h2>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "رحلاتي", value: myBookings.data?.length ?? 0, icon: Car, color: "text-sky-600 bg-sky-50" },
                  { label: "رصيدي", value: `${walletBalance.toFixed(0)} ر.س`, icon: Wallet, color: "text-emerald-600 bg-emerald-50" },
                  { label: "تقييمي", value: "5.0 ⭐", icon: Star, color: "text-amber-600 bg-amber-50" },
                ].map((stat, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                      <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="font-bold text-sm text-gray-900">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-3">إجراءات سريعة</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveTab("book")} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 hover:bg-sky-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ابحث</p>
                        <p className="font-bold text-sm text-gray-900">احجز رحلة</p>
                      </div>
                    </button>
                    <button onClick={() => setActiveTab("wallet")} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">شحن</p>
                        <p className="font-bold text-sm text-gray-900">المحفظة</p>
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
                    <button onClick={() => setActiveTab("rides")} className="text-sky-500 text-xs flex items-center gap-1">
                      عرض الكل <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {myBookings.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                  ) : myBookings.data?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <Car className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">لا توجد رحلات بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myBookings.data?.slice(0, 3).map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
                              <Car className="w-4 h-4 text-sky-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">رحلة #{b.rideId}</p>
                              <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                          <Badge variant={b.status === "confirmed" ? "default" : b.status === "completed" ? "secondary" : "destructive"} className="text-xs">
                            {b.status === "confirmed" ? "مؤكد" : b.status === "completed" ? "مكتمل" : "ملغي"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Rides Preview */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">رحلات متاحة</CardTitle>
                    <button onClick={() => setActiveTab("book")} className="text-sky-500 text-xs flex items-center gap-1">
                      عرض الكل <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {availableRides.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                  ) : availableRides.data?.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <Navigation className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">لا توجد رحلات متاحة الآن</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableRides.data?.slice(0, 2).map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center">
                              <Navigation className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">رحلة #{ride.id}</p>
                              <p className="text-xs text-gray-500">{ride.availableSeats} مقعد متاح</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-sky-600">{ride.price} ر.س</p>
                            <button
                              onClick={() => { setSelectedRide(ride.id); setActiveTab("book"); }}
                              className="text-xs text-sky-500 hover:underline"
                            >
                              احجز
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* BOOK TAB */}
          {activeTab === "book" && (
            <motion.div key="book" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">الرحلات المتاحة</h2>
              {availableRides.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
              ) : availableRides.data?.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Navigation className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-base font-medium">لا توجد رحلات متاحة الآن</p>
                  <p className="text-sm mt-1">تحقق لاحقاً</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRides.data?.map((ride) => (
                    <Card key={ride.id} className={`border-2 transition-all cursor-pointer ${selectedRide === ride.id ? "border-sky-500 bg-sky-50" : "border-transparent hover:border-sky-200"}`}
                      onClick={() => setSelectedRide(ride.id === selectedRide ? null : ride.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
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
                            <p className="text-lg font-bold text-sky-600">{ride.price} ر.س</p>
                            <Badge variant="secondary" className="text-xs">{ride.availableSeats} مقعد</Badge>
                          </div>
                        </div>

                        {selectedRide === ride.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pt-3 border-t border-sky-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">طريقة الدفع:</p>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {PAYMENT_METHODS.map((m) => (
                                <button key={m.id} onClick={(e) => { e.stopPropagation(); setBookingMethod(m.id as typeof bookingMethod); }}
                                  className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${bookingMethod === m.id ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}>
                                  <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                                    <m.icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-xs font-medium">{m.label}</span>
                                </button>
                              ))}
                            </div>
                            {bookingMethod === "wallet" && (
                              <p className="text-xs text-gray-500 mb-3">
                                رصيدك: <span className={`font-bold ${walletBalance >= parseFloat(ride.price) ? "text-emerald-600" : "text-red-500"}`}>{walletBalance.toFixed(2)} ر.س</span>
                              </p>
                            )}
                            <Button
                              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                              disabled={bookRide.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                bookRide.mutate({ rideId: ride.id, paymentMethod: bookingMethod });
                              }}
                            >
                              {bookRide.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد الحجز"}
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* RIDES TAB */}
          {activeTab === "rides" && (
            <motion.div key="rides" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">رحلاتي</h2>
              {myBookings.isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>
              ) : myBookings.data?.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Car className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-base font-medium">لا توجد رحلات بعد</p>
                  <Button onClick={() => setActiveTab("book")} className="mt-4 bg-sky-500 text-white">احجز رحلتك الأولى</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.data?.map((booking) => (
                    <Card key={booking.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                              booking.status === "confirmed" ? "bg-gradient-to-br from-sky-500 to-blue-600" :
                              booking.status === "completed" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                              "bg-gradient-to-br from-gray-400 to-gray-500"
                            }`}>
                              {booking.status === "completed" ? <CheckCircle className="w-6 h-6 text-white" /> :
                               booking.status === "cancelled" ? <XCircle className="w-6 h-6 text-white" /> :
                               <Car className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">رحلة #{booking.rideId}</p>
                              <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900">{booking.price} ر.س</p>
                            <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "completed" ? "secondary" : "destructive"} className="text-xs">
                              {booking.status === "confirmed" ? "مؤكد" : booking.status === "completed" ? "مكتمل" : "ملغي"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "confirmed" && (
                            <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50 text-xs"
                              onClick={() => cancelBooking.mutate({ bookingId: booking.id })}
                              disabled={cancelBooking.isPending}>
                              إلغاء الحجز
                            </Button>
                          )}
                          {booking.status === "completed" && (
                            <Button size="sm" className="flex-1 bg-amber-500 text-white text-xs"
                              onClick={() => setRatingRideId(booking.rideId)}>
                              <Star className="w-3 h-3 ml-1" />
                              قيّم الرحلة
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* WALLET TAB */}
          {activeTab === "wallet" && (
            <motion.div key="wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-white/70 text-sm mb-1">رصيد المحفظة</p>
                <p className="text-4xl font-bold mb-1">{walletBalance.toFixed(2)}</p>
                <p className="text-white/70 text-sm">ريال سعودي</p>
                <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-white/60 text-xs">إجمالي المضاف</p>
                    <p className="font-bold">{parseFloat(wallet.data?.totalAdded ?? "0").toFixed(0)} ر.س</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">إجمالي المصروف</p>
                    <p className="font-bold">{parseFloat(wallet.data?.totalSpent ?? "0").toFixed(0)} ر.س</p>
                  </div>
                </div>
              </div>

              {/* Top Up */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">شحن المحفظة</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((amt) => (
                      <button key={amt} onClick={() => setTopUpAmount(amt)}
                        className={`py-2 rounded-xl text-sm font-bold transition-all ${topUpAmount === amt ? "bg-sky-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        {amt}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">أو أدخل مبلغاً مخصصاً</Label>
                    <Input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      className="text-center font-bold" min={10} max={5000} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">طريقة الدفع</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "card", label: "بطاقة", color: "from-gray-600 to-gray-800" },
                        { id: "tabby", label: "تابي", color: "from-teal-500 to-teal-700" },
                        { id: "tamara", label: "تمارا", color: "from-pink-500 to-pink-700" },
                      ].map((m) => (
                        <button key={m.id} onClick={() => setTopUpMethod(m.id as typeof topUpMethod)}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${topUpMethod === m.id ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}>
                          <div className={`w-5 h-5 rounded bg-gradient-to-br ${m.color}`} />
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                    onClick={() => topUp.mutate({ amount: topUpAmount, method: topUpMethod })}
                    disabled={topUp.isPending}>
                    {topUp.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `شحن ${topUpAmount} ريال`}
                  </Button>
                </CardContent>
              </Card>

              {/* Transactions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">المعاملات الأخيرة</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {transactions.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                  ) : transactions.data?.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">لا توجد معاملات</p>
                  ) : (
                    <div className="space-y-2">
                      {transactions.data?.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.status === "completed" ? "bg-emerald-100" : "bg-red-100"}`}>
                              <TrendingUp className={`w-4 h-4 ${tx.status === "completed" ? "text-emerald-600" : "text-red-500"}`} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{tx.description ?? "معاملة"}</p>
                              <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString("ar-SA")}</p>
                            </div>
                          </div>
                          <p className={`font-bold text-sm ${tx.status === "completed" ? "text-emerald-600" : "text-red-500"}`}>
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

          {/* SUPPORT TAB */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">الدعم والمساعدة</h2>

              {/* Contact Info */}
              <Card className="border-0 shadow-sm bg-gradient-to-r from-sky-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">تواصل مع الإدارة</p>
                      <a href="tel:0510660620" className="text-sky-600 font-bold text-lg">0510660620</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Ticket */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">فتح تذكرة دعم جديدة</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">الموضوع</Label>
                    <Input placeholder="اكتب موضوع المشكلة..." value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">التفاصيل</Label>
                    <Textarea placeholder="اشرح مشكلتك بالتفصيل..." value={supportDesc} onChange={(e) => setSupportDesc(e.target.value)} rows={3} />
                  </div>
                  <Button className="w-full bg-sky-500 text-white"
                    onClick={() => createTicket.mutate({ subject: supportSubject, description: supportDesc })}
                    disabled={createTicket.isPending || !supportSubject || !supportDesc}>
                    {createTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال الطلب"}
                  </Button>
                </CardContent>
              </Card>

              {/* My Tickets */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">تذاكر الدعم</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {myTickets.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-sky-400" /></div>
                  ) : myTickets.data?.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">لا توجد تذاكر</p>
                  ) : (
                    <div className="space-y-2">
                      {myTickets.data?.map((ticket) => (
                        <div key={ticket.id} className="p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                            <Badge variant={ticket.status === "open" ? "default" : ticket.status === "resolved" ? "secondary" : "outline"} className="text-xs">
                              {ticket.status === "open" ? "مفتوح" : ticket.status === "in_progress" ? "قيد المعالجة" : ticket.status === "resolved" ? "محلول" : "مغلق"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{new Date(ticket.createdAt).toLocaleDateString("ar-SA")}</p>

                          {selectedTicket === ticket.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              {ticketMessages.data?.map((msg) => (
                                <div key={msg.id} className={`mb-2 p-2 rounded-lg text-xs ${msg.userId === user?.id ? "bg-sky-100 text-sky-800 mr-4" : "bg-white border border-gray-200 ml-4"}`}>
                                  {msg.message}
                                </div>
                              ))}
                              <div className="flex gap-2 mt-2">
                                <Input placeholder="اكتب رسالة..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="text-xs" />
                                <Button size="sm" className="bg-sky-500 text-white px-3"
                                  onClick={() => sendMessage.mutate({ ticketId: ticket.id, message: newMessage })}
                                  disabled={!newMessage || sendMessage.isPending}>
                                  إرسال
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Dialog */}
      {ratingRideId && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">قيّم رحلتك</h3>
            <div className="flex justify-center mb-4">
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>
            <Textarea placeholder="أضف تعليقاً (اختياري)..." value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} rows={3} className="mb-4" />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setRatingRideId(null)}>إلغاء</Button>
              <Button className="flex-1 bg-amber-500 text-white"
                onClick={() => submitRating.mutate({ rideId: ratingRideId, driverId: 1, driverRating: ratingValue, riderComment: ratingComment })}
                disabled={submitRating.isPending}>
                {submitRating.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال التقييم"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-2xl px-2 py-2 z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${activeTab === item.id ? "text-sky-600 bg-sky-50" : "text-gray-400 hover:text-gray-600"}`}>
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-sky-600" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
