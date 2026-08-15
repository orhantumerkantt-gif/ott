# Yol Haritası — 11 Faz

Her faz **kendi başına çalışır durumda** biter. İstenirse Faz 4'ten sonra durulup
yayına alınabilir; kalan fazlar sonra eklenir.

**Durum işaretleri:** ⬜ yapılmadı · 🟡 devam ediyor · ✅ bitti

---

## ✅ FAZ 0 — Karar ve dokümantasyon

Kod yazmadan önce yol haritasının, kuralların ve terimlerin yazılması.

- [x] Teknoloji kararı verildi ve gerekçesi yazıldı (`CLAUDE.md` §3)
- [x] Natro hesabının gerçek durumu **ölçüldü** (Node.js yok, kanıt `CLAUDE.md` §3.1)
- [x] Eski WordPress sitesi tespit edildi ve **dokunulmaz** ilan edildi (§3.2)
- [x] 345 fotoğraf incelendi, hassas içerik ayıklandı, 17 görsel onaylandı
- [x] `CLAUDE.md`, terim sözlüğü, mimari, tasarım sistemi belgeleri

**Çıktı:** Kural kitabı + yol haritası.

---

## 🟡 FAZ 1 — Tasarım sistemi ve iskelet

Sitenin "görünüş dili": renkler, yazı tipleri, butonlar, kartlar, üst/alt menü.

- [x] Renk paleti ve yazı tipi tanımları (`globals.css`)
- [x] Logo (büyüteç + parmak izi) — kartal maskotu yerine
- [x] Ortak arayüz parçaları (buton, rozet, form alanı, uyarı)
- [x] Üst menü (mobil uyumlu)
- [ ] Alt menü (footer)
- [ ] Ana sayfa düzeni

**Çıktı:** Tutarlı görünen, boş ama gezilebilen bir site.
**Orhan'ın kararı gereken:** Tasarım yönü ve renk tercihi.

---

## ⬜ FAZ 2 — Halka açık sayfalar

Ziyaretçinin üye olmadan gördüğü her şey.

- Ana sayfa (kanıt görselleri, hizmetler, sık sorulanlar)
- Hakkımda (plaketler, kanal başarıları, hikâye)
- Eğitimler listesi + eğitim detay sayfası
- Abonelik tanıtım sayfası
- Birebir danışmanlık sayfası (5.000 TL/saat)
- Yazılımlar sayfası
- İletişim (form)

**Çıktı:** Satış yapan tanıtım sitesi (henüz ödeme almıyor).

---

## ⬜ FAZ 3 — Üyelik

- Kayıt olma, giriş, çıkış
- Şifremi unuttum → e-posta ile sıfırlama
- Oturum güvenliği, rol ayrımı (üye / yönetici)

**Çıktı:** İnsanlar üye olabilir.
**Not:** Veritabanı şeması Faz 0'da yazıldı ve kuruldu.

---

## ⬜ FAZ 4 — PayTR ödeme ve abonelik ⭐

Projenin **para kazandıran** fazı.

- PayTR ödeme ekranı entegrasyonu
- Ödeme onayı doğrulama (sahte onay engelleme)
- Tek seferlik satış: eğitim, yazılım, danışmanlık
- **Aylık 2.500 TL abonelik** ve otomatik yenileme
- Sipariş kayıtları, fatura bilgileri
- Ödeme başarılı / başarısız sayfaları

**Çıktı:** Site gerçek para tahsil eder.
**Orhan'ın yapması gereken:** PayTR mağaza bilgilerini (3 anahtar) vermek.

---

## ⬜ FAZ 5 — Eğitim alanı

- Üyenin satın aldığı eğitimlerin listesi
- Ders ders video izleme ekranı
- İlerleme takibi ("%40 tamamlandı")
- Erişim kontrolü: satın almış VEYA aboneliği aktif olan görür
- Ücretsiz önizleme dersleri

**Çıktı:** Üyeler eğitim izler.

---

## ⬜ FAZ 6 — Yönetim paneli

Orhan'ın kod görmeden siteyi yönettiği yer.

- Eğitim ekleme/düzenleme, ders ekleme, **fiyat belirleme**
- Yazılım ekleme, sürüm güncelleme
- Üye listesi, abonelik durumları
- Sipariş takibi, danışmanlık randevuları
- Blog yazısı yazma
- Site metinlerini düzenleme

**Çıktı:** Orhan siteyi tek başına yönetir.

---

## ⬜ FAZ 7 — Yazılım satışı ve güvenli indirme

- Satın alan üyeye özel, **süreli indirme bağlantısı**
- Link paylaşılsa bile başkası indiremez
- Sürüm geçmişi, güncelleme bildirimi

**Çıktı:** Yazılımlar korumalı biçimde satılır.

---

## ⬜ FAZ 8 — Blog ve SEO

- Blog listesi + yazı sayfası
- Otomatik site haritası (`sitemap.xml`) ve `robots.txt`
- Google için yapısal veri (eğitim, fiyat, eğitmen, sık sorulanlar)
- Sosyal medyada paylaşım görselleri
- Sayfa başlıkları ve açıklamaları

**Çıktı:** Google'dan organik ziyaretçi akmaya başlar.

---

## ⬜ FAZ 9 — Entegrasyon katmanı (Python köprüsü)

Orhan'ın mevcut programlarının siteye bağlandığı faz.

- Site ile Python servisleri arasında **API köprüsü**
- İş kuyruğu: uzun süren işler siteyi bekletmez
- Üye kotası ve kullanım takibi
- Servis çökerse **site etkilenmez** (yalıtım)

**Çıktı:** Üyeler tarayıcıdan Orhan'ın araçlarını kullanır.
**Not:** Ayrı bir sunucu gerekir; paylaşımlı hosting bunu çalıştıramaz.

---

## ⬜ FAZ 10 — Optimizasyon ve yayına alma

- Core Web Vitals ölçümü ve düzeltme (LCP < 2,5sn · INP < 200ms · CLS < 0,1)
- Görsel optimizasyonu, önbellekleme
- Mobil test
- **Zorunlu yasal sayfalar**: mesafeli satış sözleşmesi, ön bilgilendirme formu,
  iade politikası, gizlilik, KVKK, çerez politikası
- Vercel'e yükleme + Natro DNS ayarı
- SSL sertifikası
- Google Search Console ve Analytics

**Çıktı:** `dedektiforhan.com` canlıda, hızlı ve yasal olarak uyumlu.

---

## Fazlar arası kural

> Bir fazda çalışma izni, **diğer faza dokunma hakkı vermez.**

Faz atlanmaz. Bir faz bitmeden diğerine geçilmez. Faz içinde eksik kalırsa
o faz "bitti" sayılmaz.
