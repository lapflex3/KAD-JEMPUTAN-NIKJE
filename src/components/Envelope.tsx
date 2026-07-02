import { useState, useEffect, FormEvent } from "react";
import { MailOpen } from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import kadJemputanCover from "../assets/images/kad_jemputan_cover_1783011760406.jpg";

interface EnvelopeProps {
  onOpen: (guestName: string) => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [nameInput, setNameInput] = useState("");

  // Ambil nama dari query string jika ada (cth: ?to=Haji+Ahmad)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to") || params.get("nama") || params.get("guest");
    if (toParam) {
      setNameInput(toParam.trim());
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || "Tetamu Kehormat";
    onOpen(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10] px-4 overflow-y-auto py-8">
      {/* Latar Belakang hiasan gold kelam */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ECC574_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-emerald-deep/95 border border-gold-muted/40 p-6 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.85)] text-center text-white my-auto"
      >
        {/* Hiasan Sudut Elegant */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-muted/40 rounded-tl-xl"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-muted/40 rounded-tr-xl"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-muted/40 rounded-bl-xl"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-muted/40 rounded-br-xl"></div>

        {/* Gambar Muka Depan Kad Jemputan */}
        <div className="relative mx-auto w-full max-w-[280px] aspect-[3/4] mb-6 rounded-2xl overflow-hidden border-2 border-gold-bright/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group">
          <img
            src={kadJemputanCover}
            alt="Muka Depan Kad Jemputan"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Efek Sinaran Emas di atas Gambar */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/60 via-transparent to-transparent opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Tajuk Kecil */}
        <p className="text-xs font-sans tracking-[0.25em] text-gold-muted uppercase font-medium mb-1">
          KAD JEMPUTAN RASMI
        </p>

        {/* Tajuk Utama */}
        <h1 className="font-display text-lg md:text-xl font-bold text-white tracking-wide leading-relaxed mb-4">
          MAJLIS PERSARAAN DAN KESYUKURAN
        </h1>

        <p className="text-[11px] text-gold-light/70 font-sans tracking-wide mb-1 uppercase">
          Meraikan Sanjungan Bakti
        </p>
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-gold-bright tracking-wide mb-6">
          NIK NORIZAN BINTI NIK OSMAN
        </h2>

        {/* Borang Kemasukan Nama Tetamu */}
        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
          <div className="space-y-2">
            <label className="block text-xs text-gold-light/80 font-sans tracking-wider">
              Sila masukkan nama anda untuk membuka kad:
            </label>
            <input
              type="text"
              placeholder="Nama Tetamu"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full text-center py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 focus:border-gold-bright focus:outline-none text-white placeholder-gold-light/30 tracking-wide font-sans text-sm md:text-base transition-colors shadow-inner"
              maxLength={40}
            />
          </div>

          {/* Butang Buka Sampul (Wax Seal Motif) */}
          <button
            type="submit"
            className="w-full group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep text-emerald-deep font-display font-bold text-xs md:text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_25px_rgba(236,197,116,0.5)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <MailOpen size={18} className="transition-transform group-hover:scale-110" />
            Buka Kad Jemputan
          </button>
        </form>

        {/* Label kecil di bawah */}
        <p className="text-[10px] text-gold-light/40 font-sans mt-6 tracking-wider">
          *Muzik latar belakang akan dimainkan secara automatik selepas dibuka
        </p>
      </motion.div>
    </div>
  );
}

