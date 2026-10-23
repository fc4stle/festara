"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CounterAnimation from "@/components/CounterAnimation";

export default function StatsSection() {
  const [loaded, setLoaded] = useState(false);
  const [vendorCount, setVendorCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [cityCount, setCityCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const { count: vendors } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true });

      const { count: bookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating");

      const { data: locations } = await supabase
        .from("vendors")
        .select("location")
        .not("location", "is", null);

      setVendorCount(vendors || 0);
      setBookingCount(bookings || 0);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setSatisfaction(Math.round((avgRating / 5) * 100));
      } else {
        setSatisfaction(0);
      }

      if (locations) {
        const uniqueCities = new Set(locations.map((v) => v.location));
        setCityCount(uniqueCities.size);
      }

      setLoaded(true);
    }

    fetchCounts();
  }, []);

  // Hanya tampilkan statistik yang benar-benar punya nilai (tanpa angka 0 yang menyesatkan)
  const items = [
    { value: vendorCount, suffix: "+", label: "Vendor Terdaftar" },
    { value: bookingCount, suffix: "+", label: "Booking Selesai" },
    { value: satisfaction, suffix: "%", label: "Kepuasan Klien" },
    { value: cityCount, suffix: "+", label: "Kota di Indonesia" },
  ].filter((item) => item.value > 0);

  // Selama data dimuat, sisakan ruang kosong agar tata letak tidak melompat
  if (!loaded) {
    return <div className="min-h-[140px]" aria-hidden="true" />;
  }

  // Kalau semuanya masih 0, jangan tampilkan bagian ini sama sekali
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white/80 to-[#DBEBC9]/60 backdrop-blur rounded-3xl p-8 flex flex-wrap justify-center gap-6 text-center">
      {items.map((item) => (
        <div key={item.label} className="flex-1 basis-[140px] min-w-[140px]">
          <p className="text-4xl font-extrabold text-[#1CABB4]">
            <CounterAnimation target={item.value} suffix={item.suffix} />
          </p>
          <p className="text-sm text-[#16302e] mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
