import nodemailer from "nodemailer";
import { site } from "@/lib/site";

/**
 * E-posta gönderimi.
 *
 * SMTP ayarları BOŞSA hata fırlatmaz — mesajı konsola yazar. Sebep:
 * geliştirme sırasında (ve Orhan e-posta sağlayıcısını bağlamadan önce)
 * kayıt/şifre sıfırlama akışının çalışmaya devam etmesi gerekiyor.
 * Aksi halde SMTP yok diye kayıt olmak imkânsız hale gelirdi.
 */
function tasiyici() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 -> SSL, 587 -> STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function epostaGonder(opts: {
  kime: string;
  konu: string;
  html: string;
  duzMetin?: string;
}) {
  const t = tasiyici();
  const kimden = process.env.SMTP_FROM ?? `${site.ad} <bilgi@${site.domain}>`;

  if (!t) {
    console.warn(
      `\n[E-POSTA GÖNDERİLMEDİ — SMTP ayarlı değil]\n` +
        `  Kime : ${opts.kime}\n  Konu : ${opts.konu}\n` +
        `  ${opts.duzMetin ?? opts.html.replace(/<[^>]+>/g, " ").trim()}\n`,
    );
    return { gonderildi: false as const };
  }

  await t.sendMail({
    from: kimden,
    to: opts.kime,
    subject: opts.konu,
    html: opts.html,
    text: opts.duzMetin,
  });
  return { gonderildi: true as const };
}

/** Markanın rengine uygun basit e-posta şablonu. */
export function epostaSablonu(baslik: string, govde: string, butonAd?: string, butonUrl?: string) {
  return `
<div style="background:#05070f;padding:32px 16px;font-family:system-ui,-apple-system,Segoe UI,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#0b1120;border:1px solid #17233d;border-radius:16px;padding:32px">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#ffc53d;font-weight:700">DEDEKTİF</p>
    <p style="margin:0 0 24px;font-size:20px;font-weight:800;color:#eaeff9">ORHAN</p>
    <h1 style="margin:0 0 16px;font-size:20px;color:#eaeff9">${baslik}</h1>
    <div style="font-size:15px;line-height:1.7;color:#97a5c2">${govde}</div>
    ${
      butonAd && butonUrl
        ? `<div style="margin-top:28px"><a href="${butonUrl}" style="display:inline-block;background:#ffc53d;color:#05070f;padding:13px 24px;border-radius:12px;font-weight:700;text-decoration:none">${butonAd}</a></div>
           <p style="margin-top:18px;font-size:12px;color:#64748b">Buton çalışmazsa bu adresi tarayıcına yapıştır:<br>${butonUrl}</p>`
        : ""
    }
    <hr style="margin:28px 0 16px;border:0;border-top:1px solid #17233d">
    <p style="margin:0;font-size:12px;color:#64748b">${site.url}</p>
  </div>
</div>`;
}
