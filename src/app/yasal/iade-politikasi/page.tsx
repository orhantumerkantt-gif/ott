import type { Metadata } from "next";
import { YasalDuzen } from "../yasal-duzen";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası",
  description:
    "Dijital ürün ve hizmetlerde cayma hakkı, iptal ve iade koşulları.",
  alternates: { canonical: "/yasal/iade-politikasi" },
};

export default function IadePolitikasi() {
  return (
    <YasalDuzen baslik="İptal ve İade Politikası" guncelleme="14 Ağustos 2026">
      <h2>1. Kapsam</h2>
      <p>
        Bu politika, {site.url} üzerinden satın alınan dijital eğitim setleri,
        aylık abonelik, yazılımlar ve birebir danışmanlık hizmetleri için geçerlidir.
      </p>

      <h2>2. Dijital içerikte cayma hakkı</h2>
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği uyarınca, <strong>elektronik ortamda anında ifa edilen ve
        tüketiciye anında teslim edilen gayrimaddi mallarda</strong> cayma hakkı
        kullanılamaz.
      </p>
      <p>
        Bu nedenle: eğitim içeriğine erişim açıldıktan, ders izlenmeye başlandıktan
        veya yazılım indirildikten sonra cayma hakkı kullanılamaz.
      </p>

      <h3>Cayma hakkının kullanılabildiği durum</h3>
      <p>
        Ödeme tamamlandıktan sonra <strong>hiçbir derse girmediyseniz, hiçbir
        yazılımı indirmediyseniz</strong> ve satın alma üzerinden 14 gün geçmediyse,
        bedelin tamamı iade edilir. Talebinizi{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a> adresine
        sipariş numaranızla iletmeniz yeterlidir.
      </p>

      <h2>3. Abonelik iptali</h2>
      <ul>
        <li>Aboneliğinizi istediğiniz zaman, taahhüt olmaksızın iptal edebilirsiniz.</li>
        <li>
          İptal ettiğinizde <strong>içinde bulunduğunuz dönemin sonuna kadar</strong>{" "}
          erişiminiz devam eder; dönem sonunda yenileme yapılmaz.
        </li>
        <li>
          Başlamış bir abonelik dönemi için kısmi (gün bazlı) iade yapılmaz;
          ödediğiniz sürenin tamamını kullanırsınız.
        </li>
        <li>İptal için panelinizden veya e-posta ile talep göndermeniz yeterlidir.</li>
      </ul>

      <h2>4. Birebir danışmanlık</h2>
      <ul>
        <li>
          Görüşme saatinden <strong>en az 24 saat önce</strong> yapılan iptallerde
          ücretin tamamı iade edilir veya görüşme ileri bir tarihe ertelenir.
        </li>
        <li>
          24 saatten kısa süre kala yapılan iptallerde veya görüşmeye katılınmaması
          durumunda ücret iade edilmez; hizmet verilmiş sayılır.
        </li>
        <li>
          Görüşmenin satıcı kaynaklı bir sebeple gerçekleşmemesi hâlinde ücret
          tam olarak iade edilir veya karşılıklı uygun bir tarihe ertelenir.
        </li>
      </ul>

      <h2>5. Ayıplı hizmet</h2>
      <p>
        Satın aldığınız içeriğe teknik bir sebeple erişemiyorsanız, önce sorunu
        çözmek için destek veriyoruz. Sorun makul sürede giderilemezse bedel
        iade edilir.
      </p>

      <h2>6. İade süresi ve yöntemi</h2>
      <p>
        Onaylanan iadeler, onay tarihinden itibaren <strong>en geç 14 gün</strong>{" "}
        içinde, ödemenin yapıldığı karta/hesaba iade edilir. Bankanın hesabınıza
        yansıtma süresi ayrıca 2-10 iş günü sürebilir; bu süre satıcının
        kontrolünde değildir.
      </p>

      <h2>7. İletişim</h2>
      <p>
        İptal ve iade talepleriniz için:{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a>
      </p>
    </YasalDuzen>
  );
}
