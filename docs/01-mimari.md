# Mimari — "çok boyutlu ve geliştirilebilir" ne demek

Orhan'ın şartı: *"yeni fazlar için açık uçlu kod uçları, birbirleriyle ilişkileri için
gerekli düzenlemeler"* ve *"minimum kod maksimum verim"*.

Bu belge o şartın **somut karşılığıdır**. Yeni bir özellik eklerken buradaki kalıplara
uyulur; uymayan bir şey yazılacaksa önce bu belge güncellenir.

---

## 1. Katmanlar

```
┌──────────────────────────────────────────────┐
│  GÖRÜNÜM        sayfalar + bileşenler        │  ← ziyaretçinin gördüğü
├──────────────────────────────────────────────┤
│  İŞ MANTIĞI     lib/ altındaki modüller      │  ← kurallar burada
├──────────────────────────────────────────────┤
│  VERİ           Prisma + veritabanı          │  ← tek kayıt yeri
├──────────────────────────────────────────────┤
│  DIŞ DÜNYA      PayTR · e-posta · Python     │  ← hepsi arayüz arkasında
└──────────────────────────────────────────────┘
```

**Kural:** Görünüm katmanı veritabanına doğrudan yazmaz, dış servisi doğrudan çağırmaz.
Her şey iş mantığı katmanından geçer. Sebep: bir kuralı değiştirmek gerektiğinde
tek bir dosyaya bakılır, 30 sayfa taranmaz.

---

## 2. Açık uç #1 — Ödeme sağlayıcısı değiştirilebilir

Bugün PayTR kullanıyoruz. Yarın iyzico, Stripe veya havale eklemek gerekirse
**sitenin geri kalanı hiç değişmemeli.**

Bunun için ortak bir sözleşme var:

```ts
// src/lib/odeme/tur.ts
export interface OdemeSaglayici {
  ad: string;
  odemeBaslat(siparis: Siparis): Promise<{ yontem: "iframe" | "yonlendirme"; adres: string }>;
  bildirimDogrula(govde: unknown): Promise<{ gecerli: boolean; merchantOid: string; basarili: boolean }>;
  abonelikIptal?(abonelikId: string): Promise<void>;
}
```

- `src/lib/odeme/paytr.ts` → bu sözleşmeyi uygular
- `src/lib/odeme/index.ts` → hangi sağlayıcının aktif olduğunu seçer
- Sayfalar **yalnız** `odemeBaslat()` çağırır, PayTR'nin varlığından haberi olmaz

**Yeni sağlayıcı eklemek:** tek dosya yaz, `index.ts`'e kaydet. Başka hiçbir yer değişmez.

---

## 3. Açık uç #2 — Ürün tipleri aynı kalıptan

Bugün 4 tip satıyoruz: **eğitim · yazılım · abonelik · danışmanlık**.
Yarın "şablon paketi", "webinar", "koçluk programı" eklenebilir.

Hepsi ortak bir kalıba oturur:

```ts
export interface SatilabilirUrun {
  tur: string;              // "EGITIM" | "YAZILIM" | ...
  id: string;
  ad: string;
  fiyatKurus: number;
  abonelikDahilMi: boolean;
  /** Ödeme onaylandıktan sonra ne olacak? Erişim açma mantığı burada. */
  erisimAc(userId: string): Promise<void>;
}
```

Ödeme onayı geldiğinde sistem **tek bir yerde** `erisimAc()` çağırır. Yeni ürün tipi
eklerken ödeme kodu hiç açılmaz.

---

## 4. Açık uç #3 — Python köprüsü (Faz 9) ⭐

Orhan'ın asıl istediği: *"elimizdeki mevcut programları sunucuda çalıştırdığımda
web sitesine bağlayabilmeliyim."*

### Neden doğrudan siteye gömülmüyor

Python araçları ağır: ffmpeg, GPU, saatlerce süren işler. Bunları web sitesinin içine
koymak demek, bir video işlenirken **bütün sitenin donması** demek. Bu yüzden ayrılar.

### Yapı

```
   Ziyaretçi
       │
       ▼
┌──────────────┐   iş isteği    ┌──────────────┐   çalıştır   ┌──────────────┐
│  Site        │ ─────────────► │  İş kuyruğu  │ ───────────► │ Python servisi│
│  (Vercel)    │ ◄───────────── │              │ ◄─────────── │ (ayrı sunucu) │
└──────────────┘   durum/sonuç  └──────────────┘   sonuç      └──────────────┘
```

**Kritik kural:** Python servisi çökerse **site çalışmaya devam eder.** Kullanıcı
"işlem başarısız, tekrar deneyin" görür; site kapanmaz.

### Sözleşme

```ts
export interface HarciServis {
  ad: string;                                  // "video-pipeline"
  saglikliMi(): Promise<boolean>;              // ayakta mı?
  isBaslat(girdi: unknown): Promise<{ isId: string }>;
  isDurumu(isId: string): Promise<{ durum: "bekliyor"|"calisiyor"|"bitti"|"hata"; sonuc?: unknown }>;
}
```

Site yalnız bu dört şeyi bilir. Python tarafında ne olduğu, hangi kütüphaneyi
kullandığı siteyi ilgilendirmez.

### Güvenlik

- Python servisi **internete açık olmaz**; yalnız site erişir (paylaşılan gizli anahtar)
- Her üyenin kullanım kotası site tarafında sayılır — servis kötüye kullanılamaz
- Üyeden gelen veri servise gitmeden **doğrulanır**

---

## 5. Açık uç #4 — Ayarlar koddan çıkarıldı

Fiyatlar, metinler ve açılıp kapanan özellikler **veritabanında** tutulur.
Orhan panelden değiştirir; kod dokunulmaz, yeniden yayına alma gerekmez.

| Ne | Nerede |
|---|---|
| Abonelik ve danışmanlık fiyatı | `Setting` tablosu (panelden) |
| Eğitim/yazılım fiyatları | Kendi kayıtlarında (panelden) |
| Marka metinleri, iletişim | `src/lib/site.ts` (kod, nadiren değişir) |
| Sırlar (PayTR anahtarları vb.) | `.env` — **asla** veritabanında veya kodda değil |

---

## 6. "Minimum kod maksimum verim" nasıl sağlanıyor

| İlke | Uygulama |
|---|---|
| Tekrar yazma | Buton/kart/form parçaları tek yerde (`components/ui.tsx`) |
| Tasarımı tek yerden yönet | Renk ve yazı tipleri `globals.css` içinde token |
| Metin tek kaynak | Marka metinleri `lib/site.ts` |
| Kural tek kaynak | Erişim kontrolü yalnız `lib/yetki.ts` |
| Erken soyutlama yapma | Arayüz **yalnız** gerçekten değişecek yerlere (ödeme, harici servis) |

★ **Aşırı soyutlama da bir hatadır.** "İleride lazım olur" diye katman eklenmez;
yukarıdaki dört açık uç, gerçekten değişeceği bilinen yerlerdir.

---

## 7. Performans kuralları (Faz 10'a bırakılmaz, baştan uygulanır)

Google'ın eşikleri: **LCP < 2,5sn · INP < 200ms · CLS < 0,1**
(sitelerin %43'ü INP'de kalıyor — çünkü sonradan düzeltmek mimari değişikliği ister)

| Kural | Gerekçe |
|---|---|
| Varsayılan **sunucu bileşeni**; `"use client"` yalnız gerektiğinde | Tarayıcıya inen JS azalır → INP düşer |
| Görseller `next/image` ile, **genişlik/yükseklik verilerek** | Sayfa zıplamaz → CLS korunur |
| Görseller WebP, ölçüsü sınırlı | LCP düşer |
| Yazı tipleri `next/font` ile gömülü | Dışarıdan font çekmek LCP'yi geciktirir |
| Ana sayfa üstünde ağır JS yok | LCP doğrudan etkilenir |
| Liste sayfaları sayfalanır | Uzun liste = uzun boyama süresi |

---

## 8. Klasör düzeni

```
src/
  app/            sayfalar (klasör adı = adres)
    api/          arka uç uç noktaları
    panel/        üye alanı (korumalı)
    admin/        yönetim (yalnız yönetici)
    yasal/        sözleşmeler
  components/     arayüz parçaları
    marka/        logo vb.
  lib/            iş mantığı
    odeme/        ödeme sağlayıcıları
    servisler/    Python köprüsü (Faz 9)
    site.ts       marka metinleri ve fiyatlar
    yetki.ts      erişim kuralları
    db.ts         veritabanı bağlantısı
prisma/           veritabanı şeması
docs/             bu belgeler
public/gorseller/ ONAYLI görseller
```
