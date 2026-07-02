import { useEffect, useState, FormEvent } from "react";
import { CheckCircle, MessageSquare, Send, Users, Heart, Search, HelpCircle, Check, X } from "lucide-react";
import { RSVP } from "../types";

interface RSVPFormProps {
  initialGuestName: string;
}

export default function RSVPForm({ initialGuestName }: RSVPFormProps) {
  const [name, setName] = useState(initialGuestName);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir" | "belum_pasti">("hadir");
  const [pax, setPax] = useState(1);
  const [wishes, setWishes] = useState("");
  
  // Keadaan status borang
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Keadaan senarai ucapan (guestbook)
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);

  // Tab aktif dan carian
  const [activeTab, setActiveTab] = useState<"wishes" | "list">("wishes");
  const [searchQuery, setSearchQuery] = useState("");

  // Ambil senarai ucapan dari pelayan
  const fetchWishes = async () => {
    try {
      const response = await fetch("/api/rsvps");
      if (response.ok) {
        const data = await response.json();
        setRsvps(data);
      }
    } catch (err) {
      console.error("Gagal mendapatkan senarai ucapan:", err);
    } finally {
      setIsLoadingWishes(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Sila isi nama anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          status,
          pax: status === "hadir" ? pax : 0,
          wishes: wishes.trim(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setWishes("");
        // Muat semula senarai ucapan secara dinamik supaya ucapan tetamu terpampang terus
        await fetchWishes();
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Gagal menghantar pengesahan.");
      }
    } catch (err) {
      setErrorMsg("Ralat rangkaian. Sila cuba sekali lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pembantu Format Tarikh Melayu
  const formatMalayDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      const days = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun", 
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
      ];
      const dayName = days[d.getDay()];
      const dateNum = d.getDate();
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      
      let hours = d.getHours();
      const ampm = hours >= 12 ? "Petang" : "Pagi";
      hours = hours % 12;
      hours = hours ? hours : 12; // Jam 0 dijadikan 12
      const mins = String(d.getMinutes()).padStart(2, "0");

      return `${dayName}, ${dateNum} ${monthName} ${year}, ${hours}:${mins} ${ampm}`;
    } catch (e) {
      return "Baru-baru ini";
    }
  };

  const filteredRsvps = rsvps.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-16">
      {/* Bahagian 1: Borang Pengesahan RSVP */}
      <div id="rsvp-section" className="bg-emerald-deep/60 border border-gold-muted/30 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm relative max-w-2xl mx-auto">
        {/* Hiasan Bucu Gold */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gold-bright/30"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold-bright/30"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold-bright/30"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold-bright/30"></div>

        <div className="text-center mb-8">
          <Heart className="mx-auto text-gold-muted mb-2 animate-pulse" size={28} />
          <h3 className="font-display text-xl md:text-2xl font-bold text-gold-bright tracking-wider uppercase">
            Sila Sahkan Kehadiran
          </h3>
          <p className="text-xs text-gold-light/70 font-sans mt-2">
            Mohon sahkan kehadiran anda bagi membantu kelancaran pengurusan majlis.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-deep text-emerald-deep mb-2">
              <CheckCircle size={36} className="stroke-[2.5]" />
            </div>
            <h4 className="font-display text-lg font-bold text-gold-bright uppercase tracking-wide">
              Terima Kasih Atas Pengesahan Anda!
            </h4>
            <p className="text-xs md:text-sm text-gold-light/90 font-sans max-w-md mx-auto leading-relaxed">
              Kehadiran dan doa anda amat kami hargai. Maklumat anda telah berjaya disimpan ke dalam sistem tetamu.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 px-5 py-2.5 rounded-full border border-gold-muted/50 hover:border-gold-bright text-xs text-gold-light font-medium tracking-wider uppercase hover:bg-emerald-dark/40 transition-all cursor-pointer"
            >
              Hantar Pengesahan Baru
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-200 text-xs text-center font-sans">
                {errorMsg}
              </div>
            )}

            {/* Nama */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans tracking-widest text-gold-light/90 uppercase font-medium">
                Nama Tetamu
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Penuh Anda"
                className="w-full py-3 px-4 rounded-xl bg-emerald-dark/80 border border-gold-muted/30 focus:border-gold-bright focus:outline-none text-white placeholder-gold-light/30 text-sm tracking-wide transition-colors"
              />
            </div>

            {/* Kehadiran */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans tracking-widest text-gold-light/90 uppercase font-medium mb-1">
                Status Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "hadir", label: "Hadir" },
                  { id: "tidak_hadir", label: "Tidak Hadir" },
                  { id: "belum_pasti", label: "Belum Pasti" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatus(item.id as any)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer text-center ${
                      status === item.id
                        ? "bg-gradient-to-r from-gold-deep to-gold-bright text-emerald-deep border-gold-bright shadow-lg shadow-gold-deep/20"
                        : "bg-emerald-dark/60 border-gold-muted/20 text-gold-light/80 hover:border-gold-muted/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Pax (Hanya jika Hadir) */}
            {status === "hadir" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-sans tracking-widest text-gold-light/90 uppercase font-medium flex items-center gap-2">
                  <Users size={14} className="text-gold-muted" />
                  Bilangan Pax (Tetamu)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPax(num)}
                      className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        pax === num
                          ? "bg-gold-muted text-emerald-deep border-gold-bright"
                          : "bg-emerald-dark/40 border-gold-muted/10 text-gold-light/70 hover:border-gold-muted/40"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gold-light/50 font-sans italic mt-1">
                  *Termasuk diri anda sendiri. Maksimum 5 pax.
                </p>
              </div>
            )}

            {/* Ucapan & Doa */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans tracking-widest text-gold-light/90 uppercase font-medium flex items-center gap-2">
                <MessageSquare size={14} className="text-gold-muted" />
                Ucapan, Doa & Dedikasi
              </label>
              <textarea
                rows={4}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Titipkan doa, ucapan selamat bersara, kenangan manis atau pesanan ikhlas anda untuk Nik Norizan di sini..."
                className="w-full py-3 px-4 rounded-xl bg-emerald-dark/80 border border-gold-muted/30 focus:border-gold-bright focus:outline-none text-white placeholder-gold-light/30 text-sm tracking-wide transition-colors resize-none leading-relaxed"
                maxLength={400}
              />
            </div>

            {/* Butang Hantar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-deep to-gold-bright text-emerald-deep font-display font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_20px_rgba(210,177,104,0.4)] transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-emerald-deep border-t-transparent rounded-full"></span>
                  Menghantar...
                </>
              ) : (
                <>
                  <Send size={14} className="stroke-[2.5]" />
                  Hantar Pengesahan & Doa
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Bahagian 2: Buku Ucapan, Statistik & Senarai RSVP */}
      <div id="wishes-section" className="space-y-8 max-w-2xl mx-auto">
        
        {/* Ringkasan Statistik Rasmi */}
        <div className="bg-emerald-deep/40 border border-gold-muted/15 p-5 rounded-2xl shadow-lg">
          <h4 className="text-xs font-sans font-bold text-gold-bright uppercase tracking-[0.2em] text-center mb-4">
            ✦ RINGKASAN STATUS JEMPUTAN ✦
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Hadir (Pax) */}
            <div className="p-3 rounded-xl bg-emerald-dark/60 border border-emerald-500/10 text-center flex flex-col justify-center">
              <span className="text-[10px] font-sans text-gold-light/60 uppercase tracking-widest block mb-1">
                Jumlah Pax
              </span>
              <span className="font-mono text-lg font-bold text-emerald-400">
                {rsvps.filter((item) => item.status === "hadir").reduce((acc, item) => acc + (item.pax || 0), 0)}
              </span>
              <span className="text-[9px] text-gold-light/40">Orang Hadir</span>
            </div>

            {/* Rekod Hadir */}
            <div className="p-3 rounded-xl bg-emerald-dark/60 border border-gold-muted/10 text-center flex flex-col justify-center">
              <span className="text-[10px] font-sans text-gold-light/60 uppercase tracking-widest block mb-1">
                Keluarga/Nama
              </span>
              <span className="font-mono text-lg font-bold text-gold-bright">
                {rsvps.filter((item) => item.status === "hadir").length}
              </span>
              <span className="text-[9px] text-gold-light/40">Pendaftaran</span>
            </div>

            {/* Tidak Hadir */}
            <div className="p-3 rounded-xl bg-emerald-dark/60 border border-zinc-500/10 text-center flex flex-col justify-center">
              <span className="text-[10px] font-sans text-gold-light/60 uppercase tracking-widest block mb-1">
                Tidak Hadir
              </span>
              <span className="font-mono text-lg font-bold text-zinc-400">
                {rsvps.filter((item) => item.status === "tidak_hadir").length}
              </span>
              <span className="text-[9px] text-gold-light/40">Menitip Doa</span>
            </div>

            {/* Belum Pasti */}
            <div className="p-3 rounded-xl bg-emerald-dark/60 border border-yellow-500/10 text-center flex flex-col justify-center">
              <span className="text-[10px] font-sans text-gold-light/60 uppercase tracking-widest block mb-1">
                Belum Pasti
              </span>
              <span className="font-mono text-lg font-bold text-yellow-500">
                {rsvps.filter((item) => item.status === "belum_pasti").length}
              </span>
              <span className="text-[9px] text-gold-light/40">Belum Sah</span>
            </div>
          </div>
        </div>

        {/* Tab Pilihan Navigasi */}
        <div className="flex border-b border-gold-muted/20">
          <button
            onClick={() => setActiveTab("wishes")}
            className={`flex-1 py-3 text-xs md:text-sm font-display font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer text-center ${
              activeTab === "wishes"
                ? "border-gold-bright text-gold-bright bg-gold-muted/5"
                : "border-transparent text-gold-light/50 hover:text-gold-light/95"
            }`}
          >
            Buku Ucapan & Doa ({rsvps.length})
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 py-3 text-xs md:text-sm font-display font-semibold tracking-wider uppercase border-b-2 transition-all cursor-pointer text-center ${
              activeTab === "list"
                ? "border-gold-bright text-gold-bright bg-gold-muted/5"
                : "border-transparent text-gold-light/50 hover:text-gold-light/95"
            }`}
          >
            Senarai Kehadiran ({rsvps.length})
          </button>
        </div>

        {isLoadingWishes ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <div className="animate-spin h-6 w-6 border-2 border-gold-muted border-t-transparent rounded-full"></div>
            <span className="text-xs text-gold-light/60 font-sans">Sistem sedang memuatkan maklumat...</span>
          </div>
        ) : (
          <>
            {/* KANDUNGAN TAB 1: BUKU UCAPAN & DOA */}
            {activeTab === "wishes" && (
              <div className="space-y-4">
                {rsvps.length === 0 ? (
                  <div className="text-center py-12 bg-emerald-deep/20 border border-gold-muted/10 rounded-2xl">
                    <p className="text-xs text-gold-light/50 font-sans">Belum ada ucapan lagi. Jadilah yang pertama menitipkan doa!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {rsvps.map((item) => (
                      <div
                        key={item.id}
                        className="relative bg-emerald-deep/40 border border-gold-muted/15 p-5 rounded-2xl shadow-lg hover:border-gold-muted/30 transition-all"
                      >
                        {/* Badge Kehadiran */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          {item.status === "hadir" ? (
                            <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                              Hadir • {item.pax} Pax
                            </span>
                          ) : item.status === "tidak_hadir" ? (
                            <span className="bg-zinc-900/60 text-zinc-300 border border-zinc-500/30 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                              Menitip Doa
                            </span>
                          ) : (
                            <span className="bg-yellow-950/60 text-yellow-200 border border-yellow-500/30 text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                              Belum Pasti
                            </span>
                          )}
                        </div>

                        {/* Info Penulis */}
                        <div className="space-y-1 pr-24">
                          <h4 className="font-sans text-xs md:text-sm font-bold text-gold-bright tracking-wide">
                            {item.name}
                          </h4>
                          <span className="block text-[9px] font-sans text-gold-light/50">
                            {formatMalayDate(item.createdAt)}
                          </span>
                        </div>

                        {/* Teks Ucapan */}
                        {item.wishes ? (
                          <p className="mt-3 font-serif text-xs md:text-sm text-white/90 leading-relaxed italic border-l-2 border-gold-muted/30 pl-3">
                            &ldquo;{item.wishes}&rdquo;
                          </p>
                        ) : (
                          <p className="mt-3 font-serif text-xs text-gold-light/40 italic pl-3 border-l border-gold-muted/10">
                            *Menitipkan doa kesejahteraan tanpa ucapan teks.*
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* KANDUNGAN TAB 2: SENARAI KEHADIRAN (GUEST REGISTER) */}
            {activeTab === "list" && (
              <div className="space-y-4">
                {/* Bar Carian Tetamu */}
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-light/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama tetamu di sini..."
                    className="w-full py-2.5 pl-11 pr-4 rounded-xl bg-emerald-dark/80 border border-gold-muted/20 focus:border-gold-bright focus:outline-none text-white placeholder-gold-light/30 text-xs tracking-wide transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-light/40 hover:text-gold-light cursor-pointer text-xs font-bold"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {filteredRsvps.length === 0 ? (
                  <div className="text-center py-12 bg-emerald-deep/20 border border-gold-muted/10 rounded-2xl">
                    <p className="text-xs text-gold-light/50 font-sans">
                      Tiada nama tetamu ditemui untuk carian "{searchQuery}".
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-deep/40 border border-gold-muted/15 rounded-2xl overflow-hidden shadow-xl max-h-[500px] overflow-y-auto">
                    {/* Header List */}
                    <div className="grid grid-cols-12 gap-2 bg-emerald-dark/80 border-b border-gold-muted/15 p-3 text-[10px] font-sans font-bold text-gold-bright tracking-wider uppercase">
                      <div className="col-span-6 pl-2">Nama Tetamu</div>
                      <div className="col-span-3 text-center">Status</div>
                      <div className="col-span-3 text-right pr-2">Bilangan (Pax)</div>
                    </div>

                    {/* Body List */}
                    <div className="divide-y divide-gold-muted/10">
                      {filteredRsvps.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-gold-muted/5 transition-all text-xs"
                        >
                          {/* Nama */}
                          <div className="col-span-6 pl-2 font-semibold text-white truncate pr-2">
                            {item.name}
                          </div>

                          {/* Status */}
                          <div className="col-span-3 text-center">
                            {item.status === "hadir" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Check size={10} className="stroke-[3]" /> Hadir
                              </span>
                            ) : item.status === "tidak_hadir" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-zinc-400 bg-zinc-950/40 px-2 py-0.5 rounded-full border border-zinc-500/20">
                                <X size={10} className="stroke-[3]" /> Tidak Hadir
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-yellow-500 bg-yellow-950/40 px-2 py-0.5 rounded-full border border-yellow-500/20">
                                <HelpCircle size={10} className="stroke-[3]" /> Belum Pasti
                              </span>
                            )}
                          </div>

                          {/* Pax */}
                          <div className="col-span-3 text-right pr-4 font-mono font-bold text-gold-light">
                            {item.status === "hadir" ? `${item.pax} Orang` : "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
