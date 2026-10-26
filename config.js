// Supabase bilgilerini buraya yapıştır (README'deki 2. adım).
// İkisi de boş kalırsa Bahçem senkron olmadan, sadece bu cihazda çalışır.
// Buradaki "anon" anahtar herkese açık olacak şekilde tasarlanmıştır; verilerini
// veritabanındaki satır güvenliği kuralları korur. "service_role" anahtarını ASLA buraya koyma.
window.BAHCEM_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
