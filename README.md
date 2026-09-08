# Festara

**Festara** adalah platform booking vendor pernikahan, wisuda, dan event di Yogyakarta. Festara mempertemukan calon pengantin/penyelenggara acara dengan vendor terpercaya — fotografer, wedding organizer, venue, dekorasi, catering, MUA, dan penyedia sewa perlengkapan — dalam satu platform, dengan booking langsung dan sistem pembayaran yang aman.

🔗 **Live:** [festara.id](https://festara.id)

---

## Fitur Utama

### Untuk Pembeli (Buyer)
- Cari dan filter vendor berdasarkan kategori (Wedding Organizer, Event Organizer, Fotografer, Venue, Dekorasi, Merchandise Wisuda, Catering, MUA/Make Up Artist, Sewa)
- Lihat profil vendor lengkap: paket harga, portofolio, ulasan, dan ketersediaan kalender
- Chat realtime langsung dengan vendor
- Booking berdasarkan tanggal & jam acara
- Wishlist vendor favorit

### Untuk Vendor (Seller)
- Dashboard vendor lengkap: ringkasan bisnis, pesanan, inbox, kalender ketersediaan
- Kelola paket layanan (tambah, edit, aktif/nonaktifkan)
- Upload & kelola portofolio
- Statistik performa: pendapatan, rating, response rate, dan waktu respons rata-rata
- Nonaktifkan/aktifkan toko sewaktu-waktu

### Untuk Admin
- Ringkasan admin: aplikasi vendor pending, bukti transfer menunggu verifikasi, booking bulan ini, pendapatan terverifikasi, vendor aktif, total pendaftaran akun, dan total kunjungan halaman
- Review & approve/reject aplikasi pendaftaran vendor baru (termasuk verifikasi KTP dan portofolio)
- Verifikasi bukti transfer pembayaran manual
- Kelola seluruh booking di platform
- Kelola vendor: aktifkan/nonaktifkan toko, serta edit harga & harga promo paket layanan tiap vendor
- Pengaturan admin

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Realtime, Row Level Security)
- **Pembayaran:** Midtrans (QRIS) — serta alur verifikasi transfer manual oleh admin
- **Hosting:** Vercel
- **Autentikasi:** Email/password & Google OAuth (PKCE)

---

## Struktur Singkat

```
app/
  admin/            → Panel admin (ringkasan, aplikasi vendor, pembayaran, booking, kelola vendor, pengaturan)
  seller/           → Dashboard vendor
  store/[id]/       → Halaman publik profil vendor
  chat/             → Booking & chat buyer-vendor
  api/midtrans/     → Integrasi pembayaran QRIS
components/         → Komponen UI bersama (ChatThread, PageViewTracker, dll)
lib/                → Helper Supabase (admin, sellerVendor, vendors, dsb)
```

---

## Menjalankan Secara Lokal

1. Clone repo ini dan install dependency:
   ```
   npm install
   ```
2. Salin `.env.example` ke `.env.local` dan isi kredensial Supabase & Midtrans kamu.
3. Jalankan development server:
   ```
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000)

---

## Kontribusi & Kontak

Festara dikembangkan oleh Alysa Salsabila Irfan Putri sebagai proyek platform booking vendor untuk pasar Indonesia, dan merupakan tenant resmi Inkubator Bisnis UNY.
