import type { Metadata } from "next";
import { YasalDuzen, SaticiTablosu } from "../yasal-duzen";
import { site, fiyatlar, kurusTL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description:
    "Mesafeli sözleşme öncesi tüketiciye sunulması zorunlu ön bilgilendirme.",
  alternates: { canonical: "/yasal/on-bilgilendirme-formu" },
};

export default function OnBilgilendirmeFormu() {
  return (
    <YasalDuzen baslik="Ön Bilgilendirme Formu" guncelleme="16 Ağustos 2026">
      <p>
        Bu form, Mesafeli Sözleşmeler Yönetmeliği uyarınca, sipariş vermeden önce
        tüketiciye sunulması zorunlu bilgileri içerir.
      </p>

      <h2>1. Satıcıya ilişkin bilgiler</h2>
      <SaticiTablosu />

      <h2>2. Ürün/hizmetin temel nitelikleri</h2>
      <table>
        <thead>
          <tr>
            <th className="text-left">Hizmet</th>
            <th className="text-left">Nitelik</th>
            <th className="text-left">Bedel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Aylık abonelik</td>
            <td>Yayındaki tüm eğitim ve yazılımlara erişim, aylık yenilenir</td>
            <td>{kurusTL(fiyatlar.abonelikAylikKurus)} / ay</td>
          </tr>
          <tr>
            <td>Birebir danışmanlık</td>
            <td>Çevrim içi, ekran paylaşımlı, 60 dakikalık görüşme</td>
            <td>{kurusTL(fiyatlar.danismanlikSaatlikKurus)} / saat</td>
          </tr>
          <tr>
            <td>Eğitim setleri</td>
            <td>Dijital video eğitim, süresiz erişim</td>
            <td>İlgili eğitim sayfasında belirtilir</td>
          </tr>
          <tr>
            <td>Yazılımlar</td>
            <td>Dijital indirilebilir program</td>
            <td>İlgili yazılım sayfasında belirtilir</td>
          </tr>
        </tbody>
      </table>
      <p>
        Tüm bedeller Türk Lirası cinsinden olup <strong>KDV dahildir</strong>. Dijital
        teslimat yapıldığı için kargo/teslimat ücreti alınmaz.
      </p>

      <h2>3. Ödeme ve teslimat</h2>
      <ul>
        <li>Ödeme, PayTR sanal POS altyapısı üzerinden kredi/banka kartı ile yapılır.</li>
        <li>Ödemenin onaylanmasıyla birlikte erişim <strong>anında</strong> açılır.</li>
        <li>Erişim, üye panelinden ({site.url}/panel) sağlanır.</li>
        <li>Danışmanlık hizmetinde tarih, taraflarca karşılıklı belirlenir.</li>
      </ul>

      <h2>4. Cayma hakkı — dijital üründe iade yoktur</h2>
      <p>
        Eğitim setleri ve yazılımlar, ödemenin onaylandığı anda teslim edilen
        dijital ürünlerdir. Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi
        uyarınca bu ürünlerde <strong>cayma hakkı kullanılamaz ve satış sonrası
        iade yapılmaz.</strong>
      </p>
      <p>
        Bu nedenle ödeme sayfasında, siparişi onaylamadan önce bu durumu açıkça
        kabul etmeniz istenir. Onay vermeden ödeme başlatılamaz.
      </p>
      <p>
        Satın almadan önce ücretsiz önizleme derslerini izlemenizi ve sorularınızı{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a> adresine
        iletmenizi öneririz. Ayrıntı:{" "}
        <a href="/yasal/iade-politikasi">İptal ve İade Politikası</a>.
      </p>

      <h2>5. Şikâyet ve itiraz</h2>
      <p>
        Talep ve şikâyetlerinizi{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a> adresine
        iletebilirsiniz. Uyuşmazlık hâlinde, parasal sınırlar dâhilinde yerleşim
        yerinizdeki Tüketici Hakem Heyeti veya Tüketici Mahkemesi&apos;ne
        başvurabilirsiniz.
      </p>

      <h2>6. Onay</h2>
      <p>
        Sipariş vermeniz, bu ön bilgilendirme formunu okuduğunuz ve kabul ettiğiniz
        anlamına gelir.
      </p>
    </YasalDuzen>
  );
}
