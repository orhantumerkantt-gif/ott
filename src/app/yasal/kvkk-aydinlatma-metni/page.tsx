import type { Metadata } from "next";
import { YasalDuzen, SaticiTablosu } from "../yasal-duzen";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
  alternates: { canonical: "/yasal/kvkk-aydinlatma-metni" },
};

export default function KvkkAydinlatmaMetni() {
  return (
    <YasalDuzen baslik="KVKK Aydınlatma Metni" guncelleme="14 Ağustos 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
        veri sorumlusu sıfatıyla hazırlanmıştır.
      </p>

      <h2>1. Veri sorumlusu</h2>
      <SaticiTablosu />

      <h2>2. İşlenen kişisel veriler</h2>
      <ul>
        <li><strong>Kimlik:</strong> ad, soyad</li>
        <li><strong>İletişim:</strong> e-posta adresi, telefon numarası</li>
        <li><strong>Müşteri işlem:</strong> sipariş kayıtları, abonelik durumu, erişim geçmişi</li>
        <li><strong>İşlem güvenliği:</strong> IP adresi, giriş kayıtları</li>
      </ul>

      <h2>3. İşleme amaçları</h2>
      <ul>
        <li>Üyelik kaydının oluşturulması ve hesabın yönetilmesi</li>
        <li>Satın alınan hizmetin sunulması ve erişimin açılması</li>
        <li>Ödeme işlemlerinin gerçekleştirilmesi ve doğrulanması</li>
        <li>Talep, şikâyet ve destek süreçlerinin yürütülmesi</li>
        <li>Yasal yükümlülüklerin (fatura, muhasebe kayıtları) yerine getirilmesi</li>
        <li>Hizmet güvenliğinin sağlanması, kötüye kullanımın önlenmesi</li>
      </ul>

      <h2>4. Hukuki sebepler</h2>
      <ul>
        <li>
          <strong>Sözleşmenin kurulması ve ifası</strong> (KVKK m.5/2-c) — üyelik ve
          satın alma işlemleri
        </li>
        <li>
          <strong>Hukuki yükümlülük</strong> (KVKK m.5/2-ç) — vergi ve muhasebe
          mevzuatı gereği saklama
        </li>
        <li>
          <strong>Meşru menfaat</strong> (KVKK m.5/2-f) — güvenlik ve dolandırıcılık
          önleme
        </li>
        <li>
          <strong>Açık rıza</strong> (KVKK m.5/1) — yalnızca pazarlama amaçlı iletiler
          için; rıza vermemeniz hizmet almanızı engellemez
        </li>
      </ul>

      <h2>5. Aktarım</h2>
      <p>
        Kişisel verileriniz, hizmetin sunulabilmesi için ödeme kuruluşu (PayTR),
        barındırma ve e-posta sağlayıcıları ile sınırlı olarak paylaşılır. Yasal
        zorunluluk hâlinde yetkili kamu kurum ve kuruluşlarına aktarılabilir.
        Bunun dışında hiçbir üçüncü kişiyle paylaşılmaz ve satılmaz.
      </p>

      <h2>6. Toplama yöntemi</h2>
      <p>
        Veriler; üyelik formu, iletişim formu, sipariş süreçleri ve otomatik sistem
        kayıtları aracılığıyla, elektronik ortamda toplanır.
      </p>

      <h2>7. KVKK m.11 kapsamındaki haklarınız</h2>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Silinmesini veya yok edilmesini isteme</li>
        <li>Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</li>
        <li>
          Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme
        </li>
        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>

      <h2>8. Başvuru</h2>
      <p>
        Haklarınıza ilişkin taleplerinizi{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a> adresine
        iletebilirsiniz. Başvurunuz en geç <strong>30 gün</strong> içinde
        sonuçlandırılır.
      </p>
    </YasalDuzen>
  );
}
