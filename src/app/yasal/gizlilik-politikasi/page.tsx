import type { Metadata } from "next";
import { YasalDuzen } from "../yasal-duzen";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Kişisel verilerin toplanması, kullanımı ve korunması hakkında bilgi.",
  alternates: { canonical: "/yasal/gizlilik-politikasi" },
};

export default function GizlilikPolitikasi() {
  return (
    <YasalDuzen baslik="Gizlilik Politikası" guncelleme="14 Ağustos 2026">
      <h2>1. Hangi verileri topluyoruz?</h2>
      <table>
        <thead>
          <tr>
            <th className="text-left">Veri</th>
            <th className="text-left">Ne zaman</th>
            <th className="text-left">Niçin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ad, soyad, e-posta</td>
            <td>Üyelik kaydında</td>
            <td>Hesap oluşturma, giriş, iletişim</td>
          </tr>
          <tr>
            <td>Telefon</td>
            <td>İsteğe bağlı</td>
            <td>Sipariş ve danışmanlık iletişimi</td>
          </tr>
          <tr>
            <td>Sipariş bilgileri</td>
            <td>Satın alma sırasında</td>
            <td>Yasal kayıt, erişim yönetimi, fatura</td>
          </tr>
          <tr>
            <td>IP adresi</td>
            <td>Ödeme sırasında</td>
            <td>Ödeme sağlayıcısının dolandırıcılık kontrolü</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Toplamadığımız veriler</h2>
      <ul>
        <li>
          <strong>Kart bilgileriniz.</strong> Kart numarası, son kullanma tarihi ve CVV
          bize hiçbir zaman ulaşmaz. Bu veriler doğrudan PayTR ve bankanız arasında
          işlenir.
        </li>
        <li>Şifreniz düz metin olarak saklanmaz; geri döndürülemez şekilde şifrelenir.</li>
      </ul>

      <h2>3. Verilerinizi kimlerle paylaşıyoruz?</h2>
      <p>Verileriniz satılmaz, kiralanmaz, pazarlama amacıyla üçüncü kişilere aktarılmaz.</p>
      <ul>
        <li>
          <strong>PayTR</strong> — ödeme işlemi için gerekli asgari bilgi (ad, e-posta,
          telefon, tutar, IP).
        </li>
        <li>
          <strong>Barındırma ve e-posta sağlayıcıları</strong> — hizmetin teknik olarak
          çalışabilmesi için.
        </li>
        <li>
          <strong>Yetkili kamu kurumları</strong> — yalnızca hukuki zorunluluk hâlinde.
        </li>
      </ul>

      <h2>4. Veri güvenliği</h2>
      <ul>
        <li>Site ve kullanıcı arasındaki trafik SSL/TLS ile şifrelenir.</li>
        <li>Şifreler bcrypt algoritmasıyla, geri döndürülemez biçimde saklanır.</li>
        <li>Şifre sıfırlama bağlantıları 60 dakika geçerlidir ve tek kullanımlıktır.</li>
        <li>Yönetim paneline yalnızca yetkili hesaplar erişebilir.</li>
      </ul>

      <h2>5. Saklama süresi</h2>
      <p>
        Üyelik verileri hesabınız aktif olduğu sürece saklanır. Hesabınızı sildirmeniz
        hâlinde, yasal saklama yükümlülüğü bulunan kayıtlar (fatura ve sipariş
        kayıtları — 10 yıl) dışındaki veriler silinir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>
        Verilerinize erişme, düzeltme, silinmesini isteme ve işlemeye itiraz etme
        haklarınız vardır. Talepleriniz için:{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a>. Ayrıntı için{" "}
        <a href="/yasal/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>.
      </p>

      <h2>7. Değişiklikler</h2>
      <p>
        Bu politika güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır ve
        sayfa başındaki tarih güncellenir.
      </p>
    </YasalDuzen>
  );
}
