import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, AlertCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export default function DriverRegistration() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    city: "",
    gender: "male" as "male" | "female",
    driverType: "own_vehicle" as "own_vehicle" | "rent_vehicle" | "company_vehicle",
    vehicleType: "",
  });

  const [files, setFiles] = useState({
    license: null as File | null,
    registration: null as File | null,
    insurance: null as File | null,
    nationalIdDoc: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const registerMutation = trpc.driver.register.useMutation({
    onSuccess: () => {
      toast.success(t("driverReg.success"), {
        description: t("driverReg.successDesc"),
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        nationalId: "",
        city: "",
        gender: "male",
        driverType: "own_vehicle",
        vehicleType: "",
      });
      setFiles({
        license: null,
        registration: null,
        insurance: null,
        nationalIdDoc: null,
      });
    },
    onError: (error) => {
      toast.error(t("driverReg.error"), {
        description: error.message,
      });
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (key: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const licenseBase64 = files.license ? await fileToBase64(files.license) : undefined;
      const registrationBase64 = files.registration ? await fileToBase64(files.registration) : undefined;
      const insuranceBase64 = files.insurance ? await fileToBase64(files.insurance) : undefined;
      const nationalIdBase64 = files.nationalIdDoc ? await fileToBase64(files.nationalIdDoc) : undefined;

      await registerMutation.mutateAsync({
        ...formData,
        licenseFile: licenseBase64,
        registrationFile: registrationBase64,
        insuranceFile: insuranceBase64,
        nationalIdFile: nationalIdBase64,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cities = ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "الخبر", "تبوك", "أبها", "الطائف", "حائل"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background pt-20 pb-12">
      <div className="container max-w-2xl">
        <SectionHeading title={t("driverReg.title")} subtitle={t("driverReg.subtitle")} />

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">{t("driverReg.personalInfo")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("driverReg.fullName")}</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.phone")}</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.email")}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.nationalId")}</label>
                      <input
                        type="text"
                        required
                        value={formData.nationalId}
                        onChange={(e) => handleInputChange("nationalId", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.city")}</label>
                      <select
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      >
                        <option value="">{t("driverReg.selectCity")}</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.gender")}</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      >
                        <option value="male">{t("driverReg.male")}</option>
                        <option value="female">{t("driverReg.female")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.driverType")}</label>
                      <select
                        value={formData.driverType}
                        onChange={(e) => handleInputChange("driverType", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      >
                        <option value="own_vehicle">{t("driverReg.ownVehicle")}</option>
                        <option value="rent_vehicle">{t("driverReg.rentVehicle")}</option>
                        <option value="company_vehicle">{t("driverReg.companyVehicle")}</option>
                      </select>
                    </div>
                  </div>

                  {formData.driverType !== "company_vehicle" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">{t("driverReg.vehicleType")}</label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-brand"
                      >
                        <option value="">{t("driverReg.selectVehicle")}</option>
                        <option value="sedan">{t("driverReg.sedan")}</option>
                        <option value="h1">{t("driverReg.h1")}</option>
                        <option value="hiace">{t("driverReg.hiace")}</option>
                        <option value="coaster">{t("driverReg.coaster")}</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">{t("driverReg.documents")}</h3>
                <div className="space-y-4">
                  {[
                    { key: "license", label: t("driverReg.license") },
                    { key: "registration", label: t("driverReg.registration") },
                    { key: "insurance", label: t("driverReg.insurance") },
                    { key: "nationalIdDoc", label: t("driverReg.nationalIdDoc") },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-2">{label}</label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-sky-brand transition-colors"
                        onClick={() => fileInputsRef.current[key]?.click()}
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{t("driverReg.uploadHint")}</p>
                        {files[key as keyof typeof files] && (
                          <p className="text-xs text-sky-brand mt-2">{files[key as keyof typeof files]?.name}</p>
                        )}
                      </div>
                      <input
                        ref={(el) => {
                          if (el) fileInputsRef.current[key] = el;
                        }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        hidden
                        onChange={(e) => handleFileChange(key as keyof typeof files, e.target.files?.[0] || null)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="w-full bg-gradient-to-r from-sky-brand to-mint-brand text-white text-base py-3 rounded-lg hover:shadow-lg transition-all"
              >
                {isSubmitting || registerMutation.isPending ? t("driverReg.submitting") : t("driverReg.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
