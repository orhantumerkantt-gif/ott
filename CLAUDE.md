# CLAUDE.md — dedektiforhan.com

Bu dosya, bu projede çalışan her Claude Code oturumunun **ilk okuyacağı** kural kitabıdır.
Kod yazmadan önce buradaki kurallara uy.

---

## 0. En önemli kural: Orhan web geliştirici DEĞİL

Proje sahibi **Orhan Tümerkan** (Dedektif Orhan) bir **içerik üreticisi ve eğitmen**,
yazılımcı değil. Kendi ifadesiyle: *"hayatımda hiç web sitesi tasarlamadım"*.

Bunun pratik sonuçları:

1. **Teknik soru sorma.** "Hangi ORM?", "SSR mi ISR mi?", "Redis ekleyelim mi?" gibi
   sorular ona hiçbir şey ifade etmez ve karar veremediği için tıkanır. Bu bir kez
   yaşandı: teknoloji seçimi soruldu, cevap veremedi, süreç durdu.
2. **Kararı sen ver, gerekçesini sade Türkçeyle anlat.** Karşılaştırma tablosu ver,
   bir tanesini öner, "şunu yapıyorum" de.
3. **Ona sadece şunları sor:** görünüm/tasarım tercihleri, metin ve fiyat kararları,
   hangi fotoğrafın kullanılacağı, iş kararları. Yani **gördüğü ve sahip olduğu** şeyler.
4. **Terminolojiyi her kullandığında açıkla.** `docs/02-terimler.md` sözlüğü var,
   yeni bir terim geçerse oraya ekle.

---

## 1. Dil

Kullanıcı **Türkçe** konuşur → **Türkçe cevap ver**. Kod içindeki değişken, fonksiyon ve
dosya adları da **Türkçe** (`fiyatKurus`, `oturumZorunlu`, `abonelikAktifMi`). Sebep:
Orhan ileride koda bakarsa ne olduğunu anlayabilsin.

Framework'ün dayattığı adlar (`page.tsx`, `layout.tsx`, `generateMetadata`) İngilizce kalır.

---

## 2. Bu proje ne?

Sosyal medyada para kazanma ve yapay zekâ eğitimleri satan **üyelikli e-ticaret sitesi**.

| Gelir kalemi | Fiyat | Not |
|---|---|---|
| Birebir danışmanlık | **5.000 TL / saat** | Randevu talebi + ödeme |
| Aylık abonelik | **2.500 TL / ay** | Tüm eğitim + yazılımlara erişim |
| Eğitim setleri | Orhan belirler | Tek tek satılır |
| Sosyal medya yazılımları | Orhan belirler | Satış + güvenli indirme |

---

## 3. Teknoloji kararları (verildi, tartışmaya kapalı)

| Konu | Karar | Neden |
|---|---|---|
| Framework | **Next.js 16** (App Router) + TypeScript | En iyi SEO + hız; Python servislerine API ile doğal bağlanır |
| Stil | **Tailwind CSS v4** | Tek dosyada tasarım sistemi, çıktı küçük |
| Veritabanı | **Prisma 6** + SQLite (geliştirme) → PostgreSQL (canlı) | Prisma 7 `url`'i şemadan kaldırdı, sürüm avcılığı yapılmayacak |
| Oturum | **Auth.js v5**, JWT stratejisi | Edge'de bcrypt/Prisma çalışmıyor, JWT bu sorunu bitiriyor |
| Ödeme | **PayTR** (tek sağlayıcı) | Orhan'ın kullandığı sistem. Payoneer TL abonelik tahsil EDEMEZ |
| Barındırma | Site **Vercel**, domain+e-posta **Natro** | Natro paketinde Node.js YOK — cPanel'de ölçüldü, aşağıya bak |

★ **WordPress bilinçli olarak REDDEDİLDİ.** Gerekçe: abonelik + üyelik + LMS için
4-5 ücretli eklenti gerekir (yıllık 200-400$), site yavaşlar, eklentiler çakışır ve
Python araçlarını bağlamak zorlaşır. Orhan'ın bir numaralı şartı **optimizasyon** idi.

★ **Payoneer ödeme yolu olarak EKLENMEYECEK.** Payoneer bir para *alma* hesabıdır,
sanal POS değildir; TL'de aylık otomatik yenilenen abonelik tahsil edemez.

### 3.1 Natro hesabının ÖLÇÜLMÜŞ durumu (2026-08-13, cPanel'den okundu)

Tahmin değil, panelden bakıldı:

| Bulgu | Değer |
|---|---|
| Paket | **Sınırsız Pro Hosting**, aktif, **13 Mart 2027**'ye kadar ödenmiş |
| Kontrol paneli | cPanel 136.0.33, tema `natro-thema`, kullanıcı `u1698418` |
| Sunucu | `cpls27.srvpanel.com`, paylaşımlı IP `94.73.150.176` |
| cPanel "Yazılım" bölümünün TAMAMI | Installatron · Web Sitesini Optimize Edin · **Select PHP Version** |
| **Setup Node.js App** | ❌ **YOK** |
| **Setup Python App** | ❌ **YOK** |
| Veritabanı | Yalnız **MySQL** (phpMyAdmin) — PostgreSQL yok |
| Kaynak sınırları | Bellek **2 GB** · süreç **200** · IOPS 25.600 · G/Ç 100 MB/s |
| SSL | ⚠️ **Sertifika süresi dolmuş** (`CERT_HAS_EXPIRED`) |

★★ **Bu tablo "Next.js Natro'da çalışmaz" kararının kanıtıdır.** Biri gelip
"Natro'ya kuralım" derse önce cPanel > Yazılım bölümüne baksın; `Setup Node.js App`
görünmüyorsa karar geçerlidir.

### 3.2 Devralınan eski site — SİLİNMEYECEK

Aynı hostingde Orhan'ın **eski WordPress sitesi duruyor** ve Installatron onu
"Live" gösteriyor, ama alan adı hem `http` hem `https` üzerinden **hiç açılmıyor**
(Orhan siteyi kapattığını söylemişti, doğrulandı).

| | |
|---|---|
| Uygulama | WordPress **6.9.7**, PHP 8.1.34, ad: "Orhan TÜMERKAN" |
| Dosyalar | **1.124 MB** |
| Veritabanı | **107 MB** ← ciddi içerik/üye birikimi olabilir |
| Installatron yedeği | **9 adet** |
| Görünen içerik | "🚀 BİZİ BEKLEYİN !! — 3 GÜNLÜK CANLI EĞİTİM — SIFIRDAN YOUTUBE İLE" |

★★★ **KURAL: Bu WordPress kurulumuna, dosyalarına, veritabanına veya yedeklerine
DOKUNULMAZ.** Silme, taşıma, güncelleme, "temizlik" yapılmaz. 107 MB'lık veritabanı
eski üye kayıtları, sipariş geçmişi veya blog içeriği barındırıyor olabilir ve
bunların değerini yalnız Orhan bilir. Yeni site ayrı bir yerde (Vercel) yükselecek;
eski kurulum olduğu gibi arşiv olarak kalacak.

★ İçerik/SEO devri gerekirse bu **ayrı bir faz** olarak planlanır (yazı URL'lerinin
yeni siteye yönlendirilmesi dahil), kendiliğinden yapılmaz.

---

## 4. Değişiklik disiplini

1. **Faz sınırını geç.** Bir fazda çalışma izni, diğer faza dokunma hakkı vermez.
   Fazlar `docs/00-yol-haritasi.md` dosyasında.
2. **Her faz kendi başına çalışır durumda bitmeli.** Faz 4 bitince site para
   kazanabilmeli; Faz 5 beklenmemeli.
3. **Mevcut koda zarar verme.** Yeni davranış geri uyumlu olmalı; eskisini silme,
   gerekiyorsa bayrakla kapat.
4. **Kör kod yazma.** Bir dosyayı değiştirmeden önce oku. Oturum başındaki okuma bayattır.
5. **Kanıtsız "çalışıyor" deme.** Dev sunucusunu çalıştır, sayfayı aç, ekran görüntüsü
   veya konsol çıktısıyla göster.
6. **Sır dosyaya yazılmaz.** Anahtarlar `.env` içinde, `.env` git'e girmez.

---

## 5. Görsel varlıklar — hassas içerik kuralı

`D:\FOTOĞRAFLAR\İŞ` klasörü **345 görsel** içeriyor ve **incelendi**. İçinde
siteye asla girmemesi gereken malzeme var:

- T.C. Kimlik Kartı (3 görsel) · başkasına ait Denizci Belgesi (isim + TC no)
- **Açık şifre** içeren ekran görüntüsü · IBAN + WhatsApp konuşması
- Noter/damgalı resmi belgeler (7) · banka ekranları, EFT, vergi tahsilatı (5)
- Kredi kartı fotoğrafı · AdSense publisher ID ve ödeme dökümü
- ~40 farklı Gmail hesabının göründüğü hesap değiştirici ekranları (~18 görsel)
- Telefon numaraları, emlak ilanı + adres, ev fotoğrafı · `VERGİ` alt klasörünün tamamı

★ **Kural: bu klasörden `public/gorseller/` altına elle onaylanmadan hiçbir dosya
kopyalanmaz.** Onaylı 17 görselin listesi `docs/04-gorsel-envanteri.md` dosyasında.

★ **Escrow kanal satışı ekranları bilinçli olarak kullanılmadı** — üçüncü kişilerin
(başka kanal sahiplerinin) ticari verilerini gösteriyorlar.

★ **Gelir görselleri "sen de bunu kazanırsın" vaadi olarak sunulmaz.** Yanıltıcı
gelir vaadi hem etik değil hem de reklam mevzuatı riski. Başlıklar nötr olmalı.

---

## 6. Komutlar

```bat
:: Geliştirme sunucusu (http://localhost:3000)
npm run dev

:: Veritabanı şemasını uygula
npx prisma db push

:: Veritabanını tarayıcıda görüntüle
npx prisma studio

:: Örnek verileri yükle (admin hesabı dahil)
npm run seed

:: Canlıya çıkmadan önce derleme kontrolü
npm run build
```

★ **Node.js bu makinede PATH'te değil.** PowerShell'de önce:
`$env:Path = "C:\Program Files\nodejs;" + $env:Path`

★ Proje yolu Türkçe karakter içeriyor (`C:\Users\Orhan Tümerkan\...`). Bazı araçlar
buna takılır; takılırsa yolu tırnak içinde ver.

---

## 7. Belge haritası

| Dosya | İçerik |
|---|---|
| `docs/00-yol-haritasi.md` | 11 fazın tamamı, neyin ne zaman yapılacağı |
| `docs/01-mimari.md` | Sistem tasarımı, modüller, açık uçlar, Python köprüsü |
| `docs/02-terimler.md` | Orhan için terim sözlüğü — yeni terim geçerse buraya ekle |
| `docs/03-tasarim-sistemi.md` | Renk, font, bileşen kuralları |
| `docs/04-gorsel-envanteri.md` | Onaylı görseller + yasaklı içerik listesi |
| `docs/05-yayina-alma.md` | Vercel + Natro DNS adımları (Orhan için resimli anlatım) |
