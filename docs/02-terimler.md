# Terimler Sözlüğü — Orhan için

Bu dosya, projede geçen her teknik terimin **günlük Türkçe** karşılığıdır.
Yeni bir terim kullanıldığında buraya eklenir. Bir şeyi anlamadıysan buraya bak;
burada yoksa sor, buraya eklerim.

---

## Temel kavramlar

**Alan adı (domain)**
`dedektiforhan.com`. Sadece bir **adres**, dükkânın tabelası gibi. Adresin bir yerde
kayıtlı olması, dükkânın da orada olmasını gerektirmez.

**Barındırma (hosting)**
Sitenin **çalıştığı bilgisayar**. Dükkânın kendisi. Dünyanın herhangi bir yerindeki
bir sunucu olabilir; adres onu gösterir.

**DNS**
Adresi dükkâna bağlayan **yön levhası**. "dedektiforhan.com'a gelen bu sunucuya gitsin"
kaydı. Değiştirmek 2 dakika sürer, ayarları biz gireriz.

**Paylaşımlı hosting**
Tek bir bilgisayarda **yüzlerce sitenin** birlikte yaşadığı ucuz barındırma. Senin
Natro paketin bu. Ucuz ama kısıtlı: ağır iş yapamazsın, istediğin programı kuramazsın.

**VPS / Sunucu**
Sana **ayrılmış** bir bilgisayar. İstediğini kurarsın, ağır iş yaparsın. Aylık ücretli.

**Sunucu (server)**
7/24 açık duran, siteni ziyaretçilere sunan bilgisayar.

---

## Sitenin parçaları

**Frontend (ön yüz)**
Ziyaretçinin **gördüğü** her şey: yazılar, renkler, butonlar, fotoğraflar.

**Backend (arka yüz)**
Perde arkasında **çalışan mantık**: "bu kişi giriş yaptı mı", "ödemesi geçti mi",
"bu eğitimi izlemeye hakkı var mı".

**Veritabanı**
Bilgilerin saklandığı **elektronik defter**: üyeler, siparişler, eğitimler, blog yazıları.

**API**
İki programın **birbiriyle konuşma kanalı**. Senin Python programlarını siteye bunun
üzerinden bağlayacağız: site "şunu yap" der, program yapar, sonucu geri yollar.

---

## Kullandığımız teknolojiler

**Next.js**
Sitenin yazıldığı **hazır iskelet** (framework). Facebook'un React teknolojisi üzerine
kurulu. Hız ve Google uyumluluğunda bugün en iyilerinden.

**TypeScript**
Yazdığımız programlama dili. JavaScript'in **hata yakalayan** sürümü — bir yanlışlık
yaptığımızda site yayına çıkmadan önce uyarır.

**Tailwind CSS**
Görünümü (renk, boşluk, yazı tipi) düzenleme aracı. Tasarımı tek yerden yönetiriz.

**Prisma**
Veritabanıyla konuşma aracı. Ham veritabanı komutları yerine anlaşılır komutlar yazarız.

**Auth.js**
Üyelik altyapısı. Şifreleri güvenli saklar, giriş/çıkış işlerini yürütür.

**Vercel**
Next.js'i yapan firmanın **barındırma servisi**. Senin ölçeğinde ücretsiz, dünya
çapında hızlı.

**PayTR**
Türkiye'de kart tahsilatı yapan **sanal POS** sağlayıcısı. Aboneliği o çekecek.

**WordPress**
Hazır site kurma sistemi. Eski siten bununla yapılmış. Yeni sitede **kullanmıyoruz**
(gerekçe `CLAUDE.md` bölüm 3'te).

---

## Google ve SEO

**SEO**
Sitenin Google'da **üst sıralara çıkması** için yapılan işlerin tamamı.

**Core Web Vitals**
Google'ın verdiği **hız karnesi**. Üç notu var ve sıralamayı etkiler:

| Kısaltma | Ne ölçer | Geçme notu |
|---|---|---|
| **LCP** | Ana içerik ne kadar hızlı görünüyor | 2,5 saniye altı |
| **INP** | Tıklamaya ne kadar hızlı cevap veriyor | 200 milisaniye altı |
| **CLS** | Sayfa yüklenirken zıplıyor mu | 0,1 altı |

**SSR (sunucu tarafında oluşturma)**
Sayfanın ziyaretçiye gelmeden **sunucuda hazır pişirilmesi**. Google'ın sevdiği yöntem,
çünkü sayfayı anında okuyabiliyor.

**Sitemap (site haritası)**
Sitendeki tüm sayfaların Google'a verilen **listesi**. Otomatik üretilecek.

**JSON-LD / Yapısal veri**
Google'a "bu bir eğitim, fiyatı şu, eğitmeni şu" diye **makine diliyle** anlatan
görünmez etiketler. Arama sonuçlarında yıldız/fiyat görünmesini sağlar.

---

## Güvenlik

**SSL / HTTPS**
Adres çubuğundaki **kilit işareti**. Ziyaretçiyle site arasındaki trafiği şifreler.
Ödeme alan bir sitede **zorunlu**. (Not: Natro'daki sertifikanın süresi dolmuş.)

**Şifreleme (hash)**
Üye şifrelerini **geri döndürülemez** biçimde saklama. Veritabanı çalınsa bile
şifreler okunamaz. Biz de böyle saklıyoruz.

**.env dosyası**
Şifre ve anahtarların tutulduğu **gizli dosya**. Asla internete veya yedeklemeye girmez.

---

## Geliştirme süreci

**Faz**
Projenin **aşaması**. Her faz kendi başına çalışır durumda biter.

**Dev sunucusu (localhost)**
Sitenin **sadece senin bilgisayarında** çalışan test hâli. Adresi `localhost:3000`.
İnternette kimse göremez, denemeler burada yapılır.

**Deploy (yayına alma)**
Sitenin test ortamından **gerçek internete** taşınması.

**Commit / Git**
Yapılan değişikliklerin **kayıt altına alınması**. Bir şey bozulursa geri dönebiliriz.

**Migration (şema göçü)**
Veritabanının yapısını değiştirme işlemi. Örneğin "üyelere doğum tarihi alanı ekle".
