"use client";

import { useActionState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, Lock, Unlock } from "lucide-react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { dersEkle, dersSil, dersTasi, type FormDurum } from "../actions";

type Ders = {
  id: string;
  baslik: string;
  videoUrl: string | null;
  sureDk: number;
  ucretsizOnizleme: boolean;
  sira: number;
};

const baslangic: FormDurum = { durum: "bos" };

export function DersYoneticisi({
  courseId,
  dersler,
}: {
  courseId: string;
  dersler: Ders[];
}) {
  const [state, formAction, bekliyor] = useActionState(
    dersEkle.bind(null, courseId),
    baslangic,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  // Ders eklendikten sonra formu temizle ki ikinci ders için hazır olsun.
  useEffect(() => {
    if (state.durum === "bos") formRef.current?.reset();
  }, [state]);

  const toplamDk = dersler.reduce((t, d) => t + d.sureDk, 0);

  return (
    <aside className="grid content-start gap-5">
      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-baslik text-base font-bold">Dersler</h2>
          <span className="text-xs text-metin3">
            {dersler.length} ders · {Math.round(toplamDk / 60)} sa {toplamDk % 60} dk
          </span>
        </div>

        {dersler.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gece-600 p-6 text-center text-sm text-metin3">
            Henüz ders yok. Aşağıdan ekleyebilirsin.
          </p>
        ) : (
          <ol className="grid gap-2">
            {dersler.map((d, i) => (
              <li
                key={d.id}
                className="flex items-center gap-2 rounded-xl border border-gece-700 bg-gece-900 p-3"
              >
                <span className="w-5 shrink-0 text-center text-xs text-metin3">
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {d.ucretsizOnizleme ? (
                      <Unlock size={12} className="shrink-0 text-basari" />
                    ) : (
                      <Lock size={12} className="shrink-0 text-metin3" />
                    )}
                    <span className="truncate text-sm font-medium">{d.baslik}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-metin3">
                    {d.sureDk} dk
                    {d.videoUrl ? " · video bağlı" : " · video YOK"}
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  <form action={dersTasi.bind(null, d.id, courseId, "yukari")}>
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Yukarı taşı"
                      className="rounded p-1.5 text-metin3 hover:bg-gece-800 hover:text-metin disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                  </form>
                  <form action={dersTasi.bind(null, d.id, courseId, "asagi")}>
                    <button
                      type="submit"
                      disabled={i === dersler.length - 1}
                      aria-label="Aşağı taşı"
                      className="rounded p-1.5 text-metin3 hover:bg-gece-800 hover:text-metin disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </form>
                  <form action={dersSil.bind(null, d.id, courseId)}>
                    <button
                      type="submit"
                      aria-label="Dersi sil"
                      className="rounded p-1.5 text-metin3 hover:bg-hata/10 hover:text-hata"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6"
      >
        <h2 className="font-baslik text-base font-bold">Ders ekle</h2>

        {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

        <Alan etiket="Ders başlığı" hata={hatalar?.baslik}>
          <input
            name="baslik"
            required
            className={girdiStil}
            placeholder="Giriş: Bu eğitimde ne öğreneceksin?"
          />
        </Alan>

        <Alan
          etiket="Video bağlantısı"
          ipucu="YouTube (gizli liste) veya Vimeo gömme adresi. Sonra da ekleyebilirsin."
          hata={hatalar?.videoUrl}
        >
          <input
            name="videoUrl"
            className={girdiStil}
            placeholder="https://www.youtube.com/embed/..."
          />
        </Alan>

        <Alan etiket="Süre (dakika)" hata={hatalar?.sureDk}>
          <input name="sureDk" type="number" min={0} defaultValue={0} className={girdiStil} />
        </Alan>

        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="ucretsizOnizleme"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffc53d]"
          />
          <span>
            <span className="block font-medium">Ücretsiz önizleme</span>
            <span className="mt-0.5 block text-xs text-metin3">
              Satın almayanlar da bu dersi izleyebilir. Satışa çok yardımcı olur.
            </span>
          </span>
        </label>

        <Buton type="submit" tur="ikincil" disabled={bekliyor}>
          <Plus size={15} /> {bekliyor ? "Ekleniyor…" : "Dersi Ekle"}
        </Buton>
      </form>
    </aside>
  );
}
