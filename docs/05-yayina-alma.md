# Yayına Alma Rehberi

Bu belge, siteyi `dedektiforhan.com` adresinde canlıya almanın adımlarını içerir.
**Orhan için yazıldı** — teknik terim geçtiğinde açıklaması yanında.

---

## Kurulacak yapı

```
   Ziyaretçi
       │
       ▼
dedektiforhan.com  ──DNS──►  Vercel (sitenin çalıştığı yer)
   (Natro'da)                      │
                                   ▼
                            Neon (veritabanı)
```

| Parça | Nerede | Ücret |
|---|---|---|
| Alan adı | **Natro** (zaten seninde) | Ödediğin kadar |
| E-posta | **Natro** (zaten seninde) | Ödediğin kadar |
| Sitenin kendisi | **Vercel** | Ücretsiz |
| Veritabanı | **Neon** | Ücretsiz (0,5 GB) |
| Kod deposu | **GitHub** | Ücretsiz |

---

## Neden SQLite bırakılıyor?

Geliştirme sırasında veritabanı tek bir dosyaydı (`prisma/dev.db`). Bu senin
bilgisayarında sorunsuz çalışır ama Vercel'de **çalışmaz**: orada dosya sistemi
her güncellemede sıfırlanır, yani üyeler ve siparişler kaybolur.

Bu yüzden canlıda **PostgreSQL** kullanılır — internet üzerinden erişilen,
kalıcı bir veritabanı.

---

## ADIM 1 — Hesapları aç (Orhan yapar, ~10 dakika)

Üç hesap gerekiyor. Üçü de ücretsiz ve GitHub ile tek tıkla bağlanıyor.

### 1a. GitHub — kodun saklandığı yer
1. https://github.com/signup adresine git
2. E-posta, şifre, kullanıcı adı gir
3. E-postanı doğrula

### 1b. Vercel — sitenin çalışacağı yer
1. https://vercel.com/signup adresine git
2. **"Continue with GitHub"** ile gir (yeni şifre gerekmez)
3. Hobby (ücretsiz) planı seç

### 1c. Neon — veritabanı
1. https://neon.tech adresine git → **Sign up**
2. **GitHub ile giriş yap**
3. Yeni proje oluştur: ad `dedektiforhan`, bölge **Frankfurt (eu-central-1)**
   — Türkiye'ye en yakın bölge, site daha hızlı açılır
4. Sana bir **bağlantı adresi** (connection string) verecek:
   `postgresql://kullanici:sifre@ep-xxx.eu-central-1.aws.neon.tech/neondb`
   Bunu kopyala, Claude'a ver.

> ⚠️ Bu adres veritabanının şifresini içerir. Kimseyle paylaşma, ekran
> görüntüsünü herkese açık yerde yayınlama.

---

## ADIM 2 — Kodu PostgreSQL'e çevir (Claude yapar)

- `prisma/schema.prisma` içinde `provider = "sqlite"` → `"postgresql"`
- Veritabanı tabloları Neon üzerinde oluşturulur
- Örnek/gerçek veriler yüklenir

---

## ADIM 3 — Kodu GitHub'a yükle (Claude yapar, Orhan onaylar)

Proje GitHub'da **özel (private)** bir depoya yüklenir — kodu kimse göremez.

★ `.env` dosyası **yüklenmez** (`.gitignore` engelliyor). Şifreler ve PayTR
anahtarları GitHub'a asla gitmez.

---

## ADIM 4 — Vercel'e bağla

1. Vercel → **Add New Project** → GitHub deposunu seç
2. **Environment Variables** bölümüne şunlar girilir:

| Anahtar | Değer |
|---|---|
| `DATABASE_URL` | Neon bağlantı adresi |
| `NEXT_PUBLIC_SITE_URL` | `https://www.dedektiforhan.com` |
| `AUTH_SECRET` | Rastgele üretilecek uzun anahtar |
| `AUTH_TRUST_HOST` | `true` |
| `PAYTR_MERCHANT_ID` | 599682 |
| `PAYTR_MERCHANT_KEY` | (PayTR panelinden) |
| `PAYTR_MERCHANT_SALT` | (PayTR panelinden) |
| `PAYTR_TEST_MODE` | Önce `1`, her şey denendikten sonra `0` |

3. **Deploy** → 1-2 dakika sürer

---

## ADIM 5 — Alan adını bağla (Natro DNS)

Vercel sana iki kayıt verecek. Natro'da şu yol izlenir:

1. natro.com → Müşteri Girişi
2. **Alan Adı Yönetimi** → `dedektiforhan.com` → **DNS Yönetimi**
3. Vercel'in verdiği kayıtları ekle:

| Tür | Ad | Değer |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

★ **E-posta kayıtlarına (MX) DOKUNMA.** Onlar Natro'da kalmalı, yoksa
e-postaların çalışmaz.

4. Yayılma 5 dakika ile 24 saat sürebilir (genelde 15-30 dakika).

---

## ADIM 6 — PayTR Bildirim URL (ÇOK ÖNEMLİ)

PayTR paneli → **Destek & Kurulum** → **Ayarlar** → Bildirim URL:

```
https://www.dedektiforhan.com/api/odeme/bildirim
```

★★ Bu adres tanımlanmazsa: **ödeme alınır ama üyenin erişimi açılmaz** ve işlem
PayTR tarafında "askıda" kalır. Orhan'ın mağazasında hâlihazırda bu sebeple
askıda kalmış işlemler var — aynı hataya düşülmemeli.

---

## ADIM 7 — Yayın öncesi son kontrol

- [ ] Satıcı bilgileri girildi (`src/lib/site.ts` → `saticiBilgileri`)
- [ ] SSL kilidi görünüyor (Vercel otomatik verir)
- [ ] Test ödemesi yapıldı (PayTR test kartıyla), erişim açıldı
- [ ] `PAYTR_TEST_MODE` → `0` yapıldı
- [ ] Gerçek eğitimler ve fiyatlar panelden girildi
- [ ] Yönetici şifresi değiştirildi
- [ ] Google Search Console'a site haritası bildirildi:
      `https://www.dedektiforhan.com/sitemap.xml`

---

## Sonradan güncelleme nasıl olur?

Kodda bir değişiklik yapıldığında GitHub'a gönderilir; Vercel bunu görüp
siteyi **otomatik** günceller (1-2 dakika). Orhan'ın bir şey yapmasına gerek yok.

İçerik değişikliği (eğitim, fiyat, yazı) için kod güncellemesi gerekmez —
yönetim panelinden yapılır, anında yayına girer.
