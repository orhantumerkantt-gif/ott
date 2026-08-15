import type { Metadata } from "next";
import { YasalDuzen, SaticiTablosu } from "../yasal-duzen";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Satıcı ile alıcı arasındaki mesafeli satış sözleşmesi koşulları.",
  alternates: { canonical: "/yasal/mesafeli-satis-sozlesmesi" },
};

export default function MesafeliSatisSozlesmesi() {
  return (
    <YasalDuzen baslik="Mesafeli Satış Sözleşmesi" guncelleme="14 Ağustos 2026">
      <h2>Madde 1 — Taraflar</h2>
      <h3>Satıcı</h3>
      <SaticiTablosu />
      <h3>Alıcı</h3>
      <p>
        Sipariş sırasında bildirdiği ad, soyad, e-posta, telefon ve adres bilgileri
        esas alınan üye.
      </p>

      <h2>Madde 2 — Konu</h2>
      <p>
        Bu sözleşme, Alıcı&apos;nın {site.url} internet sitesi üzerinden elektronik
        ortamda sipariş verdiği, nitelikleri ve satış fiyatı aşağıda belirtilen
        dijital ürün ve hizmetlerin satışı ile ilgili olarak 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
        gereğince tarafların hak ve yükümlülüklerini düzenler.
      </p>

      <h2>Madde 3 — Sözleşme konusu ürün/hizmet</h2>
      <ul>
        <li>
          <strong>Eğitim setleri:</strong> Dijital video eğitimler. Ödeme onaylandığında
          üye paneli üzerinden süresiz erişim açılır.
        </li>
        <li>
          <strong>Aylık abonelik:</strong> Yayındaki tüm eğitim ve yazılımlara,
          abonelik süresi boyunca erişim hakkı. Aylık olarak yenilenir.
        </li>
        <li>
          <strong>Yazılımlar:</strong> Dijital olarak indirilen bilgisayar programları.
        </li>
        <li>
          <strong>Birebir danışmanlık:</strong> Karşılıklı belirlenen tarihte, çevrim
          içi yapılan danışmanlık görüşmesi.
        </li>
      </ul>
      <p>
        Ürünün adı, adedi ve satış bedeli sipariş sırasında ekranda ve sipariş
        özetinde gösterilir; tüm fiyatlar Türk Lirası (TL) cinsinden ve KDV dahildir.
      </p>

      <h2>Madde 4 — Genel hükümler</h2>
      <ol>
        <li>
          Alıcı, sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme
          şekline ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik
          ortamda gerekli teyidi verdiğini kabul eder.
        </li>
        <li>
          Sözleşme konusu ürün dijital olduğundan, ödeme onayının Satıcı&apos;ya
          ulaşmasının ardından erişim <strong>anında</strong> açılır. Fiziksel
          teslimat söz konusu değildir.
        </li>
        <li>
          Alıcı&apos;ya tanınan erişim <strong>kişiseldir</strong>; hesap bilgileri
          paylaşılamaz, içerik çoğaltılamaz, yeniden satılamaz veya dağıtılamaz.
          Aksi hâlde Satıcı erişimi iade yükümlülüğü olmaksızın durdurabilir.
        </li>
        <li>
          Satıcı, eğitim içeriklerini güncelleme ve iyileştirme hakkını saklı tutar.
          Güncellemeler mevcut alıcılar için ek ücrete tabi değildir.
        </li>
        <li>
          Satıcı hiçbir surette <strong>kazanç garantisi vermez</strong>. Sunulan
          içerik bilgi ve deneyim paylaşımıdır; sonuçlar kişiden kişiye değişir.
        </li>
      </ol>

      <h2>Madde 5 — Ödeme</h2>
      <p>
        Ödemeler PayTR altyapısı üzerinden, 3D Secure doğrulaması ile tahsil edilir.
        Kart bilgileri Satıcı tarafından görülmez, saklanmaz ve işlenmez.
      </p>

      <h2>Madde 6 — Cayma hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca,{" "}
        <strong>elektronik ortamda anında ifa edilen ve tüketiciye anında teslim
        edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.</strong>{" "}
        Ayrıntılar ve istisnalar için{" "}
        <a href="/yasal/iade-politikasi">İptal ve İade Politikası</a> sayfasına bakınız.
      </p>

      <h2>Madde 7 — Uyuşmazlık</h2>
      <p>
        Bu sözleşmeden doğabilecek uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca ilan
        edilen parasal sınırlar dâhilinde Alıcı&apos;nın yerleşim yerindeki Tüketici
        Hakem Heyetleri, bu sınırların üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri
        yetkilidir.
      </p>

      <h2>Madde 8 — Yürürlük</h2>
      <p>
        Alıcı, siteye üye olurken ve/veya siparişi onaylarken bu sözleşmenin tüm
        koşullarını kabul etmiş sayılır. Sözleşme, siparişin Satıcı tarafından
        onaylanmasıyla yürürlüğe girer.
      </p>
    </YasalDuzen>
  );
}
