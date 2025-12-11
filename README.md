# GİRİŞİMCİ TÜRK – YAZILIM UZMANI ÖN ELEME MİNİ PROJE GÖREVİ TEKNİK DÖKÜMANTASYON

## Kullanılan Teknolojiler
**Frontend / Backend:** Next.js 16.0.8 (React2Shell CVE fix), TypeScript, Tailwind  
**API:** Next.js API Routes (demo için ayrı backend ihtiyacı yok)  
**Ödeme:** Stripe (hazır checkout, global ödeme desteği, güçlü dokümantasyon)  
**Auth:** Cookie tabanlı session (ileride JWT’ye taşınabilir)

## Build ve Çalıştırma
Projeyi derlemek ve production modunda çalıştırmak için:

```bash
npm install
npm run build
npm start
```

## Ödeme Akışı
1. Kullanıcı kurs seçer; kursa ait Stripe `priceId`, `/api/checkout_sessions` endpoint’ine gönderilir.  
2. Backend, gelen `priceId` ile Stripe Checkout Session oluşturur ve kullanıcı Stripe ödeme sayfasına yönlendirilir.  
3. Ödeme başarılı olduğunda Stripe, `success_url` adresine geri yönlendirir.  
4. `success_url` ekranında session verisi işlenir, ödeme mock veritabanına kaydedilir ve kullanıcıya kurs erişimi tanımlanır.

## Eğitmen–Öğrenci Eşleştirme Mantığı
1. Kullanıcı alan ve konu seçimi yapar.  
2. Sistem aktif eğitmenleri filtreler.  
3. Öncelik sırası:  
   - Tam eşleşme (alan + konu)  
   - Alan eşleşmesi  
   - Eşleşme yoksa atama yapılmaz  
4. Uygun eğitmenden `[0]` indeks seçimi yapılır.  
5. Eğitmen isteği onaylarsa inaktif duruma geçer; reddederse başka eşleştirme yapılabilir.

## Sistemin Gelecekte Ölçeklenmesi
- **Modüler mimari veya mikroservis**: Auth, Payment, Course, Matching modülleri ayrıştırılabilir.  
- **Queue tabanlı asenkron işleme**: Eşleştirme, bildirim ve ödeme sonrası süreçler RabbitMQ üzerinde asenkronlaştırılabilir.  
- **Gerçek veritabanı + Redis**: Eğitmen müsaitliği, oturumlar ve hızlı eşleştirme verileri için yüksek performans sağlar.  
- **Gelişmiş matching algoritmaları**: Takvim uygunluğu, dinamik skorlamalar.  
- **CI/CD + Containerization**: Docker/Kubernetes ile otomatik ölçeklendirme ve cloud-native yapı.