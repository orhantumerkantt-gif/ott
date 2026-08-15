/**
 * Örnek veri yükleyici.  Çalıştırmak için:  npm run seed
 *
 * Idempotent: aynı komut tekrar tekrar çalıştırılabilir, kayıtlar çoğalmaz
 * (upsert kullanılıyor). Orhan panelden içerik girmeye başladığında bu
 * dosyadaki örnekler onun kayıtlarını EZMEZ — sadece kendi slug'larını günceller.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // ── Yönetici hesabı ────────────────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL ?? "orhantumerkantt@gmail.com").toLowerCase();
  const adminSifre = process.env.ADMIN_SIFRE ?? "DedektifOrhan2026!";

  await db.user.upsert({
    where: { email: adminEmail },
    update: { rol: "ADMIN" },
    create: {
      email: adminEmail,
      adSoyad: "Orhan Tümerkan",
      passwordHash: await bcrypt.hash(adminSifre, 10),
      rol: "ADMIN",
      epostaOnayli: true,
    },
  });
  console.log(`✓ Yönetici hesabı hazır: ${adminEmail}`);

  // ── Abonelik planı ─────────────────────────────────────────────────
  await db.plan.upsert({
    where: { slug: "aylik" },
    update: { fiyatKurus: 250_000 },
    create: {
      slug: "aylik",
      ad: "Aylık Abonelik",
      aciklama: "Tüm eğitimlere ve yazılımlara sınırsız erişim.",
      fiyatKurus: 250_000,
      periyotAy: 1,
      ozellikler: JSON.stringify([
        "Tüm eğitim setleri dahil",
        "Tüm yazılımlar dahil",
        "Yeni içerikler otomatik tanımlanır",
        "İstediğin zaman iptal",
      ]),
      aktif: true,
    },
  });
  console.log("✓ Abonelik planı hazır");

  // ── Örnek eğitimler ────────────────────────────────────────────────
  const egitimler = [
    {
      slug: "sifirdan-youtube-kanali",
      baslik: "Sıfırdan YouTube Kanalı Kurma",
      altBaslik: "Kanal açmaktan para kazanma şartlarını sağlamaya kadar",
      aciklama:
        "Hiç deneyimin olmadan başlıyoruz. Niş seçimi, kanal kurulumu, ilk 30 videonun " +
        "planı, algoritmanın nasıl çalıştığı ve para kazanma şartlarını (4.000 saat / " +
        "1.000 abone) en kısa sürede sağlamanın yolu.",
      seviye: "BASLANGIC",
      sureDk: 480,
      fiyatKurus: 150_000,
      eskiFiyatKurus: 250_000,
      oneCikan: true,
      sira: 1,
    },
    {
      slug: "yapay-zeka-ile-icerik-uretimi",
      baslik: "Yapay Zekâ ile İçerik Üretimi",
      altBaslik: "Kamera karşısına geçmeden video üretmenin tam sistemi",
      aciklama:
        "Senaryodan seslendirmeye, görselden montaja kadar tüm üretim hattını yapay " +
        "zekâ araçlarıyla kurma. Kullandığım araçların tamamını ekran kaydıyla, " +
        "tıklama tıklama gösteriyorum.",
      seviye: "ORTA",
      sureDk: 620,
      fiyatKurus: 250_000,
      oneCikan: true,
      sira: 2,
    },
    {
      slug: "shorts-ve-tiktok-buyume",
      baslik: "Shorts & TikTok Büyüme Sistemi",
      altBaslik: "Kısa videoyla hızlı büyümenin kuralları",
      aciklama:
        "Kısa video algoritmasının mantığı, ilk 3 saniye kurgusu, seri içerik üretimi " +
        "ve platformlar arası dağıtım. Milyonlarca görüntüleme almış videoların " +
        "yapı sökümü.",
      seviye: "ORTA",
      sureDk: 380,
      fiyatKurus: 180_000,
      sira: 3,
    },
    {
      slug: "kanal-gelir-modelleri",
      baslik: "Kanal Gelir Modelleri",
      altBaslik: "AdSense dışında para kazanmanın 7 yolu",
      aciklama:
        "Reklam geliri tek gelir kalemi değil. Sponsorluk, ürün satışı, üyelik, " +
        "bağlı pazarlama, kanal satışı ve lisanslama modellerini gerçek rakamlarla " +
        "anlatıyorum.",
      seviye: "ILERI",
      sureDk: 300,
      fiyatKurus: 200_000,
      sira: 4,
    },
  ];

  for (const e of egitimler) {
    const kurs = await db.course.upsert({
      where: { slug: e.slug },
      update: {},
      create: { ...e, yayinda: true, abonelikDahil: true },
    });

    // Her eğitime örnek ders listesi (yoksa)
    const mevcut = await db.lesson.count({ where: { courseId: kurs.id } });
    if (mevcut === 0) {
      const dersler = [
        { baslik: "Giriş: Bu eğitimde ne öğreneceksin?", ucretsizOnizleme: true, sureDk: 8 },
        { baslik: "Temel kavramlar ve kurulum", sureDk: 42 },
        { baslik: "Uygulama: adım adım birlikte yapıyoruz", sureDk: 65 },
        { baslik: "Sık yapılan hatalar ve çözümleri", sureDk: 30 },
        { baslik: "Kapanış ve yol haritan", sureDk: 15 },
      ];
      await db.lesson.createMany({
        data: dersler.map((d, i) => ({
          courseId: kurs.id,
          baslik: d.baslik,
          sureDk: d.sureDk,
          ucretsizOnizleme: d.ucretsizOnizleme ?? false,
          sira: i + 1,
        })),
      });
    }
  }
  console.log(`✓ ${egitimler.length} eğitim hazır`);

  // ── Örnek yazılımlar ───────────────────────────────────────────────
  const yazilimlar = [
    {
      slug: "video-pipeline",
      ad: "Video Pipeline",
      kisaAciklama: "Videoyu indir, altyazısını sil, sahneleri yeniden kur, çok dilli seslendir.",
      aciklama:
        "Uçtan uca otomatik video üretim hattı. Kaynak videodan başlayıp altyazısı " +
        "silinmiş, sahneleri yeniden düzenlenmiş, çok dilli seslendirilmiş ve " +
        "altyazılı Shorts çıktısı üretir.",
      fiyatKurus: 400_000,
      surum: "2.4.0",
      platform: "Windows",
      sira: 1,
    },
    {
      slug: "kapak-yapici",
      ad: "Kapak Yapıcı",
      kisaAciklama: "Tıklanma oranı yüksek kapak görsellerini toplu üretir.",
      aciklama:
        "Şablon tabanlı, toplu kapak (thumbnail) üretim aracı. A/B testi için " +
        "varyant üretir, metin ve yüz konumlandırmasını otomatik yapar.",
      fiyatKurus: 150_000,
      surum: "1.8.2",
      platform: "Windows",
      sira: 2,
    },
    {
      slug: "telif-kalkani",
      ad: "Telif Kalkanı",
      kisaAciklama: "Yüklemeden önce telif riskini tespit eder.",
      aciklama:
        "Videonun görsel ve işitsel parmak izini çıkarıp bilinen telifli içeriklerle " +
        "karşılaştırır. Yükleme öncesi risk raporu üretir.",
      fiyatKurus: 200_000,
      surum: "1.3.0",
      platform: "Windows",
      sira: 3,
    },
  ];

  for (const y of yazilimlar) {
    await db.software.upsert({
      where: { slug: y.slug },
      update: {},
      create: { ...y, yayinda: true, abonelikDahil: true },
    });
  }
  console.log(`✓ ${yazilimlar.length} yazılım hazır`);

  // ── Örnek blog yazısı ──────────────────────────────────────────────
  await db.post.upsert({
    where: { slug: "yapay-zeka-ile-youtube-2026" },
    update: {},
    create: {
      slug: "yapay-zeka-ile-youtube-2026",
      baslik: "2026'da Yapay Zekâ ile YouTube: Neler Değişti?",
      ozet:
        "Yapay zekâ araçları içerik üretimini kökten değiştirdi. Peki algoritma " +
        "buna nasıl tepki veriyor ve hangi yöntemler hâlâ işe yarıyor?",
      icerik:
        "## Kısa cevap\n\nYapay zekâ üretimi yasak değil; **düşük kaliteli** üretim " +
        "cezalandırılıyor.\n\n## Uzun cevap\n\nSon bir yılda yönettiğim kanallarda " +
        "yaptığım testler şunu gösterdi: izlenme süresi ve elde tutma oranı hâlâ " +
        "en belirleyici iki ölçüt.\n\n### Ne işe yarıyor\n\n- Özgün senaryo, yapay " +
        "zekâ destekli üretim\n- İlk 3 saniyede net vaat\n- Düzenli yayın takvimi\n\n" +
        "### Ne işe yaramıyor\n\n- Tamamen otomatik, insan dokunuşu olmayan seri üretim\n" +
        "- Başka kanallardan doğrudan kopyalama\n",
      etiketler: "yapay zeka,youtube,algoritma",
      yayinda: true,
      yayinTarihi: new Date("2026-08-01"),
      okumaDk: 6,
    },
  });
  console.log("✓ Örnek blog yazısı hazır");
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
