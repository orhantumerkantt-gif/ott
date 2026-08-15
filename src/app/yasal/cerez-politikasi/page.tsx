import type { Metadata } from "next";
import { YasalDuzen } from "../yasal-duzen";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Sitede kullanılan çerezler ve amaçları hakkında bilgi.",
  alternates: { canonical: "/yasal/cerez-politikasi" },
};

export default function CerezPolitikasi() {
  return (
    <YasalDuzen baslik="Çerez Politikası" guncelleme="14 Ağustos 2026">
      <h2>1. Çerez nedir?</h2>
      <p>
        Çerezler, ziyaret ettiğiniz siteler tarafından tarayıcınıza kaydedilen küçük
        metin dosyalarıdır. Sitenin sizi hatırlamasını sağlarlar.
      </p>

      <h2>2. Bu sitede hangi çerezler kullanılıyor?</h2>
      <table>
        <thead>
          <tr>
            <th className="text-left">Çerez</th>
            <th className="text-left">Amaç</th>
            <th className="text-left">Süre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Oturum çerezi</td>
            <td>Giriş yaptığınızda oturumunuzun açık kalmasını sağlar</td>
            <td>30 gün</td>
          </tr>
          <tr>
            <td>Güvenlik çerezi</td>
            <td>Form gönderimlerinde sahtecilik saldırılarını engeller</td>
            <td>Oturum boyunca</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>
          Bu sitede reklam, izleme veya profilleme amaçlı üçüncü taraf çerezi
          kullanılmamaktadır.
        </strong>{" "}
        Kullanılan çerezlerin tamamı, sitenin çalışması için <em>zorunlu</em> olan
        teknik çerezlerdir; bu nedenle ayrıca onayınız aranmaz.
      </p>

      <h2>3. Çerezleri nasıl yönetirim?</h2>
      <p>
        Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Ancak
        oturum çerezini engellerseniz siteye giriş yapamaz, satın aldığınız içeriklere
        erişemezsiniz.
      </p>
      <ul>
        <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
        <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
        <li>Safari: Tercihler → Gizlilik</li>
        <li>Edge: Ayarlar → Çerezler ve site izinleri</li>
      </ul>

      <h2>4. Değişiklikler</h2>
      <p>
        İleride analiz veya reklam çerezi kullanılması hâlinde bu sayfa güncellenir ve
        gerekli onay mekanizması eklenir.
      </p>

      <h2>5. İletişim</h2>
      <p>
        Sorularınız için:{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a>
      </p>
    </YasalDuzen>
  );
}
