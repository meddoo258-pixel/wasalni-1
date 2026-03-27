/**
 * RatingDialog - نافذة تقييم الرحلة بـ 5 نجوم
 * تظهر تلقائياً بعد اكتمال الرحلة
 */
import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  rideId: number;
  driverId: number;
  onRated?: () => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1 justify-center my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-10 h-10 transition-colors duration-150 ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

const ratingLabels: Record<number, string> = {
  1: "سيء جداً",
  2: "سيء",
  3: "مقبول",
  4: "جيد",
  5: "ممتاز!",
};

export default function RatingDialog({ open, onClose, rideId, driverId, onRated }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitRating = trpc.ratings.create.useMutation({
    onSuccess: () => {
      toast.success("شكراً على تقييمك!");
      onRated?.();
      onClose();
      setRating(0);
      setComment("");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return;
    }
    submitRating.mutate({ rideId, driverId, driverRating: rating, riderComment: comment });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm text-center" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">قيّم رحلتك</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            رأيك يساعدنا على تحسين الخدمة
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Car animation */}
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ x: [0, 8, 0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-5xl"
            >
              🚗
            </motion.div>
          </div>

          {/* Stars */}
          <StarRating value={rating} onChange={setRating} />

          {/* Label */}
          <AnimatePresence mode="wait">
            {rating > 0 && (
              <motion.p
                key={rating}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-lg font-bold text-amber-500"
              >
                {ratingLabels[rating]}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Comment */}
          <Textarea
            placeholder="أضف تعليقاً (اختياري)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none text-right"
            rows={3}
          />

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0"
              onClick={handleSubmit}
              disabled={submitRating.isPending || rating === 0}
            >
              {submitRating.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              لاحقاً
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
