# Bahçem

Namaz, okuma ve işler için kişisel ajanda. Tek bir HTML dosyasından oluşan bir PWA: GitHub Pages'te yayınlanır, telefonda ana ekrana eklenince uygulama gibi açılır, internetsiz de çalışır. Supabase bağlanırsa telefon ve bilgisayar arasında senkron olur.

## Klasördeki dosyalar

`index.html` uygulamanın kendisi. `config.js` Supabase bilgilerinin yazıldığı tek yer. `manifest.webmanifest` telefona uygulamanın adını ve ikonunu tanıtır. `sw.js` uygulamayı telefonda saklayıp internetsiz açılmasını sağlar. `icons/` ikonlar, `supabase.sql` veritabanı kurulumu.

## 1. GitHub Pages'te yayınla

1. GitHub'da **New repository** ile `bahcem` adında yeni bir depo aç. Public olması gerekiyor (ücretsiz Pages için).
2. Depo sayfasında **Add file → Upload files** de, bu klasördeki her şeyi (icons klasörü dahil) sürükleyip bırak, **Commit changes** de.
3. **Settings → Pages** bölümünde *Source* olarak **Deploy from a branch**, branch olarak **main** ve **/ (root)** seç, kaydet.
4. Bir iki dakika sonra adresin hazır olur: `https://KULLANICI-ADIN.github.io/bahcem/`

Bu noktada uygulama çalışır ama veriler yalnızca açtığın cihazda durur.

## 2. Supabase ile senkronu aç

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir hesap aç ve **New project** de. Bölge olarak Avrupa'dan birini (örneğin Frankfurt) seçebilirsin.
2. Proje açılınca sol menüden **SQL Editor**'a gir, `supabase.sql` dosyasının içeriğini yapıştır ve **Run** de.
3. **Authentication → Sign In / Providers** altında **Email**'in açık olduğundan emin ol. Kişisel kullanım için **Confirm email** seçeneğini kapatmak en kolayı; açık bırakırsan hesabı oluşturduktan sonra gelen e-postadaki bağlantıya bir kez tıklaman gerekir. Açık bırakacaksan **Authentication → URL Configuration** altında *Site URL* olarak GitHub Pages adresini yaz.
4. **Project Settings → API** (ya da **Data API**) sayfasından **Project URL** ve **anon public** anahtarını kopyala.
5. GitHub'da `config.js` dosyasını aç, kalem simgesiyle düzenle, iki değeri tırnakların içine yapıştır, commit et. `service_role` anahtarını asla buraya koyma.
6. Uygulamayı aç, sağ üstteki ayarlardan **Hesap oluştur** de. Sonra diğer cihazda aynı e-posta ve şifreyle **Giriş yap**.
7. Hesabını oluşturduktan sonra, başkaları kayıt olamasın diye **Authentication → Sign In / Providers** altında **Allow new users to sign up** seçeneğini kapatabilirsin. Kapatmasan da herkes yalnızca kendi verisini görebilir.

## 3. Claude'daki kayıtları taşı

Claude'daki Bahçem'de Ayarlar → **Kayıtları indir** ile bir `.json` dosyası al. Yeni uygulamada Ayarlar → **Kayıtları içe aktar** ile o dosyayı seç. Kayıtlar mevcut verilerle birleştirilir, hiçbir şey silinmez.

## 4. Telefona ekle

iPhone'da adresi **Safari**'de aç, paylaş düğmesi → **Ana Ekrana Ekle**. Android'de **Chrome**'da aç, menüden **Uygulamayı yükle** (ya da *Ana ekrana ekle*).

## Güncelleme yaparken

`index.html`'i değiştirdiğinde `sw.js` içindeki `VERSION` değerini bir artır (`bahcem-v1` → `bahcem-v2`). Telefonlar yeni sürümü bir sonraki açılışta alır; hemen görmek istersen uygulamayı kapatıp iki kez açman yeterli.

## Senkron nasıl çalışıyor

Her değişiklik önce cihazın kendi hafızasına yazılır, internet varsa birkaç saniye içinde Supabase'e gönderilir. Uygulama açıldığında, öne geldiğinde ve açıkken dakikada bir buluttaki son hâli çeker. İki cihazda aynı anda çevrimdışı değişiklik yapılırsa ikisi birleştirilir: kılınan vakitler, işler, kitaplar ve rapor kayıtları kaybolmaz. Bu durumda tek kayıp ihtimali, bir cihazda kaldırdığın bir işaretin diğer cihazdaki işaretle geri gelmesidir.
