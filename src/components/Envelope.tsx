import { useState, useEffect, FormEvent } from "react";
import { MailOpen, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10] px-4 overflow-hidden">
      {/* Latar Belakang hiasan gold kelam */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ECC574_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-emerald-deep/90 border border-gold-muted/40 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center text-white"
      >
        {/* Hiasan Sudut Elegant */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-muted/50 rounded-tl-xl"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-muted/50 rounded-tr-xl"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-muted/50 rounded-bl-xl"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-muted/50 rounded-br-xl"></div>

        {/* Logo/Lambang Persaraan Klasik */}
        <div className="mx-auto w-20 h-20 rounded-full border border-gold-bright/30 flex items-center justify-center bg-emerald-dark/80 mb-6 shadow-lg shadow-black/40">
          <span className="font-display text-2xl font-bold text-gold-bright tracking-widest">
            NN
          </span>
        </div>

        {/* Tajuk Kecil */}
        <p className="text-xs md:text-sm font-sans tracking-[0.25em] text-gold-muted uppercase font-medium mb-2">
          Jemputan Rasmi Digital
        </p>

        {/* Tajuk Utama */}
        <h1 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed mb-6">
          MAJLIS JAMUAN SEMPENA PERSARAAN
        </h1>

        {/* Hiasan garisan dan bintang */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-muted"></div>
          <span className="text-gold-bright">✿</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-muted"></div>
        </div>

        <p className="text-xs text-gold-light/70 font-sans tracking-wide mb-1 uppercase">
          Meraikan Sanjungan Bakti
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gold-bright tracking-wide mb-8">
          NIK NORIZAN
        </h2>

        {/* Borang Kemasukan Nama Tetamu */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm text-gold-light/80 font-sans tracking-wider">
              Sila masukkan nama anda:
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
            className="w-full group relative flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep text-emerald-deep font-display font-bold text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_25px_rgba(236,197,116,0.5)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <MailOpen size={18} className="transition-transform group-hover:scale-110" />
            Buka Jemputan
          </button>
        </form>

        {/* Label kecil di bawah */}
        <p className="text-[10px] text-gold-light/40 font-sans mt-8 tracking-wider">
          *Muzik latar belakang akan dimainkan secara automatik selepas dibuka
        </p>
      </motion.div>
    </div>
  );
}
