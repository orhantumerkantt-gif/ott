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
    <YasalDuzen baslik="İptal ve İade Politikası" guncelleme="16 Ağustos 2026">
      <h2>1. Kapsam</h2>
      <p>
        Bu politika, {site.url} üzerinden satın alınan dijital eğitim setleri,
        aylık abonelik, yazılımlar ve birebir danışmanlık hizmetleri için geçerlidir.
      </p>

      <h2>2. Dijital ürünlerde iade yapılmaz</h2>
      <p>
        <strong>
          Eğitim setleri ve yazılımlar dijital ürünlerdir. Ödeme onaylandığı anda
          erişim otomatik olarak açılır ve teslim tamamlanmış sayılır. Bu ürünlerde
          satış sonrası iade veya geri ödeme yapılmaz.
        </strong>
      </p>
      <p>
        Bunun yasal dayanağı, 6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;a
        dayanılarak çıkarılan Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesidir:{" "}
        <em>
          elektronik ortamda anında ifa edilen ve tüketiciye anında teslim edilen
          gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.
        </em>
      </p>
      <p>
        Bu nedenle, ödeme sayfasında siparişi onaylamadan önce{" "}
        <strong>
          &quot;dijital içeriğin anında teslim edildiğini ve cayma hakkımın
          bulunmadığını kabul ediyorum&quot;
        </strong>{" "}
        kutusunu işaretlemeniz istenir. Bu onay verilmeden ödeme başlatılamaz; onay
        tarihiniz sipariş kaydınıza işlenir.
      </p>

      <h3>Satın almadan önce inceleyin</h3>
      <p>
        İade yapılmadığı için, satın almadan önce ürünü tanımanız önemlidir.
        Eğitim sayfalarındaki ücretsiz önizleme derslerini izleyebilir, içerik
        listesini okuyabilir ve aklınıza takılan her şeyi{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a> adresinden
        satın alma öncesinde sorabilirsiniz. Sorularınızı memnuniyetle yanıtlıyoruz.
      </p>

      <h3>Yanlışlıkla iki kez ödeme</h3>
      <p>
        Aynı ürün için teknik bir hata sonucu iki kez tahsilat yapıldıysa, fazladan
        alınan tutar iade edilir. Bu bir cayma değil, hatalı tahsilatın
        düzeltilmesidir.
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

      <h2>5. Ayıplı hizmet — tek istisna</h2>
      <p>
        İade yapılmaması kuralı, <strong>size hiç teslim edilmeyen bir hizmeti
        kapsamaz.</strong> Satın aldığınız içeriğe teknik bir sebeple
        erişemiyorsanız önce sorunu çözmek için destek veririz; sorun makul sürede
        giderilemezse bedel iade edilir. Bu, mevzuatın satıcıya yüklediği bir
        sorumluluktur ve sözleşmeyle ortadan kaldırılamaz.
      </p>

      <h2>6. Onaylanan iadelerde süre ve yöntem</h2>
      <p>
        Yukarıdaki istisnai durumlarda onaylanan iadeler, onay tarihinden itibaren{" "}
        <strong>en geç 14 gün</strong> içinde, ödemenin yapıldığı karta/hesaba
        iade edilir. Bankanın hesabınıza yansıtma süresi ayrıca 2-10 iş günü
        sürebilir; bu süre satıcının kontrolünde değildir.
      </p>

      <h2>7. İletişim</h2>
      <p>
        İptal ve iade talepleriniz için:{" "}
        <a href={`mailto:${site.iletisim.email}`}>{site.iletisim.email}</a>
      </p>
    </YasalDuzen>
  );
}
