import { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Copy, 
  Phone, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  Check, 
  Map, 
  MessageSquare, 
  Volume2, 
  Navigation,
  Music4
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Envelope from "./components/Envelope";
import Countdown from "./components/Countdown";
import RSVPForm from "./components/RSVPForm";
import MusicPlayer from "./components/MusicPlayer";
// @ts-ignore
import rumahDestinasi from "./assets/images/rumah_destinasi_1783011299777.jpg";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Butiran Majlis
  const eventDetails = {
    title: "MAJLIS PERSARAAN DAN KESYUKURAN",
    honoree: "NIK NORIZAN BINTI NIK OSMAN",
    date: "Khamis, 27 Ogos 2026",
    hijriDate: "13 Safar 1448H",
    time: "2:00 Petang",
    venue: "PT 1452, KG HUTAN PASIR, 16450 KETEREH, KELANTAN",
    address: "PT 1452, KG HUTAN PASIR, 16450 KETEREH, KELANTAN",
    mapsUrl: "https://maps.app.goo.gl/v1xqFSMBaEVD5r4A7g_st=ac",
    wazeUrl: "https://waze.com/ul?q=PT+1452,+KG+HUTAN+PASIR,+16450+KETEREH,+KELANTAN",
    countdownTarget: "2026-08-27T14:00:00",
  };

  // Senarai Atur Cara
  const itinerary = [
    { time: "2:00 Petang", title: "Ketibaan Para Tetamu & Pengesahan RSVP", desc: "Para tetamu mengambil tempat di dewan utama manakala urusetia membantu pengesahan rsvp." },
    { time: "2:15 Petang", title: "Ketibaan Yang Diraikan", desc: "Ketibaan Yang Diraikan Puan Nik Norizan binti Nik Osman bersama ahli keluarga terdekat." },
    { time: "2:30 Petang", title: "Bacaan Doa Selamat & Aluan Urusetia", desc: "Memohon keberkatan majlis dengan bacaan doa kesejahteraan dunia & akhirat." },
    { time: "2:45 Petang", title: "Tayangan Video Kenang-Kenangan", desc: "Tayangan montaj riwayat perkhidmatan, pencapaian, kenangan manis & dedikasi rakan sekerja." },
    { time: "3:00 Petang", title: "Sesi Jamuan Makan & Selingan Muzik", desc: "Sesi menikmati juadah istimewa dengan alunan muzik persaraan bertemakan sanjungan bakti." },
    { time: "3:45 Petang", title: "Ucapan Khas Yang Diraikan & Cenderamata", desc: "Ucapan penuh makna daripada Puan Nik Norizan binti Nik Osman disusuli penyampaian tanda penghargaan." },
    { time: "4:15 Petang", title: "Sesi Fotografi & Bersalaman Memohon Restu", desc: "Sesi fotografi kenang-kenangan bersama keluarga & sahabat handai serta lambaian perpisahan." },
    { time: "4:30 Petang", title: "Majlis Bersurai", desc: "Majlis tamat dengan seribu memori indah. Selamat bersara diucapkan buat Puan Nik Norizan!" },
  ];

  // Penyelaras RSVP (WhatsApp)
  const coordinators = [
    { name: "Penyelaras Majlis (Urusetia)", phone: "011-10045980", desc: "Pertanyaan Majlis & RSVP" },
    { name: " Sofia (Keluarga)", phone: "011-10045980", desc: "Panduan Lokasi & Aturcara" },
  ];

  const handleOpenInvitation = (name: string) => {
    setGuestName(name);
    setIsOpen(true);
    // Tatal skrin ke atas sekiranya kedudukan berada di tengah
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Salin Alamat ke Papan Keratan (Clipboard)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventDetails.address);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2500);
  };

  // Google Calendar URL (UTC Offset: Kelantan adalah +08:00, jadi 2:00 petang adalah 06:00 pagi UTC)
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Majlis Persaraan & Kesyukur Nik Norizan binti Nik Osman`
  )}&dates=20260827T060000Z/20260827T083000Z&details=${encodeURIComponent(
    `Jemputan Khas ke Majlis Persaraan dan Kesyukuran Nik Norizan binti Nik Osman.\n\nTempat: ${eventDetails.venue}\nAlamat: ${eventDetails.address}`
  )}&location=${encodeURIComponent(eventDetails.venue)}&sf=true&output=xml`;

  // WhatsApp Link Generator
  const getWhatsAppLink = (phone: string, coordinatorName: string) => {
    const cleanPhone = "60" + phone.replace(/[^0-9]/g, "");
    const msg = `Assalamualaikum ${coordinatorName}, saya *${guestName || "Tetamu"}* ingin bertanyakan maklumat lanjut berkaitan Majlis Persaraan & Kesyukuran Nik Norizan binti Nik Osman pada 27 Ogos 2026 nanti. Terima kasih.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white selection:bg-gold-bright selection:text-emerald-deep relative flex flex-col items-center">
      
      {/* 1. Skrin Pengenalan (Envelope) */}
      <AnimatePresence>
        {!isOpen && (
          <Envelope onOpen={handleOpenInvitation} />
        )}
      </AnimatePresence>

      {/* 2. Pemain Muzik YouTube Tersembunyi dengan widget terapung */}
      <MusicPlayer playRequested={isOpen} />

      {/* 3. Kandungan Kad Jemputan Utama */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-3xl px-4 py-8 md:py-16 space-y-16 relative"
        >
          {/* Latar Belakang hiasan gold kelam */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ECC574_1px,transparent_1px)] [background-size:24px_24px] -z-10"></div>

          {/* Banner Aluan Khas Atas */}
          <div className="text-center bg-emerald-deep/40 border-b border-gold-muted/20 py-3 rounded-2xl mb-4">
            <p className="text-[10px] md:text-xs tracking-[0.25em] text-gold-bright uppercase font-medium">
              Selamat Datang, {guestName}
            </p>
          </div>

          {/* SECTION A: KEPALA KAD (HERO) */}
          <section className="text-center space-y-6 relative py-8">
            {/* Hiasan Atas */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gold-muted text-xs">✦</span>
              <span className="text-gold-bright text-lg">✦</span>
              <span className="text-gold-muted text-xs">✦</span>
            </div>

            <p className="text-xs md:text-sm tracking-[0.3em] text-gold-bright font-display uppercase font-semibold">
              Keluarga Puan Nik Norizan
            </p>

            <div className="space-y-1">
              <p className="text-[11px] md:text-xs text-gold-light/60 tracking-[0.2em] font-sans">
                Dengan penuh hormat dan takzimnya menjemput anda ke
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide text-white leading-relaxed pt-2">
                MAJLIS PERSARAAN DAN KESYUKURAN
              </h2>
            </div>

            {/* Nama Tokoh Retiring */}
            <div className="py-6 relative max-w-xl mx-auto">
              {/* Bingkai Elegant */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-muted/40 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold-muted/40 to-transparent"></div>
              
              <p className="font-script text-3xl md:text-4xl text-gold-muted tracking-wide mb-1">
                Meraikan Sanjungan Bakti
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-bright tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {eventDetails.honoree}
              </h1>
            </div>

            {/* Rangkap Pantun/Puisi Persaraan Tradisional */}
            <div className="max-w-md mx-auto italic font-serif text-xs md:text-sm text-gold-light/95 leading-relaxed bg-emerald-deep/30 p-5 rounded-2xl border border-gold-muted/10">
              <p className="mb-2">Tuai padi antara nampak,</p>
              <p className="mb-2">Esok jangan layu-layuan;</p>
              <p className="mb-2">Intan bersinar permata berkilat,</p>
              <p className="mb-4">Kenangan manis di hati terpahat.</p>
              <p className="text-[11px] not-italic text-gold-muted font-sans font-medium tracking-widest uppercase mt-4">
                &mdash; Jasamu Dikenang Budimu Disanjung &mdash;
              </p>
            </div>
          </section>

          {/* SECTION B: HITUNG UNDUR (COUNTDOWN) */}
          <section className="py-4">
            <Countdown targetDate={eventDetails.countdownTarget} />
          </section>

          {/* SECTION C: BUTIRAN MAJLIS & NAVIGASI */}
          <section className="bg-emerald-deep/40 border border-gold-muted/20 rounded-3xl p-6 md:p-8 shadow-xl relative">
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold-bright/40"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold-bright/40"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold-bright/40"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold-bright/40"></div>

            <div className="text-center mb-8">
              <Sparkles className="mx-auto text-gold-muted mb-2" size={24} />
              <h3 className="font-display text-lg md:text-xl font-bold text-gold-bright tracking-widest uppercase">
                Butiran Majlis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              {/* Tarikh */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-dark/40 border border-gold-muted/5 transition-all hover:bg-emerald-dark/60">
                <Calendar className="text-gold-muted mb-3" size={26} />
                <h4 className="text-xs font-sans font-bold text-gold-bright uppercase tracking-wider mb-1">
                  Tarikh Majlis
                </h4>
                <p className="text-sm font-semibold text-white font-sans">{eventDetails.date}</p>
                <p className="text-xs text-gold-light/60 font-sans mt-0.5">{eventDetails.hijriDate}</p>
              </div>

              {/* Masa */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-dark/40 border border-gold-muted/5 transition-all hover:bg-emerald-dark/60">
                <Clock className="text-gold-muted mb-3" size={26} />
                <h4 className="text-xs font-sans font-bold text-gold-bright uppercase tracking-wider mb-1">
                  Masa Majlis
                </h4>
                <p className="text-sm font-semibold text-white font-sans">{eventDetails.time}</p>
                <p className="text-xs text-gold-light/60 font-sans mt-0.5">Sila hadir awal</p>
              </div>

              {/* Tempat */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-dark/40 border border-gold-muted/5 transition-all hover:bg-emerald-dark/60">
                <MapPin className="text-gold-muted mb-3" size={26} />
                <h4 className="text-xs font-sans font-bold text-gold-bright uppercase tracking-wider mb-1">
                  Tempat
                </h4>
                <p className="text-sm font-semibold text-white font-sans leading-snug">{eventDetails.venue}</p>
              </div>
            </div>

            {/* Integrasi Peta Lokasi & Penunjuk Arah */}
            <div className="mt-8 pt-8 border-t border-gold-muted/10 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[11px] font-mono text-gold-muted uppercase tracking-widest block">
                  Panduan Ke Lokasi
                </span>
                <p className="text-xs text-gold-light/80 font-sans max-w-md mx-auto leading-relaxed">
                  {eventDetails.address}
                </p>
              </div>

              {/* Butang Navigasi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                <a
                  href={eventDetails.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 hover:border-gold-bright text-xs font-semibold text-gold-light tracking-wide uppercase transition-all cursor-pointer hover:bg-emerald-dark/80"
                >
                  <Map size={14} className="text-gold-bright" />
                  Google Maps
                </a>
                <a
                  href={eventDetails.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 hover:border-gold-bright text-xs font-semibold text-gold-light tracking-wide uppercase transition-all cursor-pointer hover:bg-emerald-dark/80"
                >
                  <Navigation size={14} className="text-gold-bright rotate-45" />
                  Waze
                </a>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 hover:border-gold-bright text-xs font-semibold text-gold-light tracking-wide uppercase transition-all cursor-pointer hover:bg-emerald-dark/80"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Berjaya Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-gold-bright" />
                      Salin Alamat
                    </>
                  )}
                </button>
              </div>

              {/* Tambah ke Google Calendar */}
              <div className="text-center pt-2">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-gold-deep to-gold-bright text-emerald-deep font-display font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-[0_0_15px_rgba(210,177,104,0.3)] transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Calendar size={14} className="stroke-[2.5]" />
                  Simpan Pada Kalendar (Google)
                </a>
              </div>

              {/* Gambar Destinasi & QR Code Lokasi */}
              <div className="mt-8 pt-8 border-t border-gold-muted/10">
                <h4 className="text-xs font-sans font-bold text-gold-bright uppercase tracking-[0.2em] text-center mb-6">
                  Visual Destinasi & Kod QR Lokasi
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Gambar Rumah Destinasi */}
                  <div className="flex flex-col p-4 rounded-2xl bg-emerald-dark/60 border border-gold-muted/10 shadow-lg relative group overflow-hidden">
                    <span className="text-[10px] font-mono text-gold-muted uppercase tracking-widest mb-2 block">
                      ✦ Kediaman Majlis (Destinasi)
                    </span>
                    <div className="flex-1 rounded-xl overflow-hidden border border-gold-muted/20 relative aspect-video">
                      <img 
                        src={rumahDestinasi} 
                        alt="Gambar Rumah Destinasi" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[11px] text-gold-light/60 font-sans mt-3 text-center italic">
                      Visual kediaman lokasi majlis di Ketereh untuk panduan anda
                    </p>
                  </div>

                  {/* QR Code Lokasi */}
                  <div className="flex flex-col p-4 rounded-2xl bg-emerald-dark/60 border border-gold-muted/10 shadow-lg relative group items-center justify-between text-center">
                    <div className="w-full text-left">
                      <span className="text-[10px] font-mono text-gold-muted uppercase tracking-widest mb-2 block">
                        ✦ Imbas Untuk Navigasi
                      </span>
                    </div>
                    
                    <div className="p-3 bg-white rounded-2xl border border-gold-muted/30 shadow-inner max-w-[180px] mx-auto transition-transform duration-300 hover:scale-[1.03]">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(eventDetails.mapsUrl)}`}
                        alt="QR Code Lokasi Google Maps" 
                        className="w-full h-auto aspect-square rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-semibold text-gold-bright">
                        Imbas Dengan Kamera Telefon
                      </p>
                      <p className="text-[11px] text-gold-light/60 font-sans max-w-xs mx-auto leading-normal">
                        Imbas kod QR di atas menggunakan aplikasi kamera telefon pintar anda untuk membuka lokasi Google Maps secara langsung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION D: ATUR CARA MAJLIS */}
          <section className="space-y-8">
            <div className="text-center">
              <span className="text-gold-muted text-xs">✦ ✦ ✦</span>
              <h3 className="font-display text-lg md:text-xl font-bold text-gold-bright tracking-widest uppercase mt-2">
                Atur Cara Majlis
              </h3>
              <p className="text-xs text-gold-light/70 font-sans mt-1">
                Tentatif pengisian majlis sepanjang jamuan berlangsung.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-lg mx-auto pl-4 border-l-2 border-gold-muted/20 space-y-8 py-2">
              {itinerary.map((item, index) => (
                <div key={index} className="relative group pl-6">
                  {/* Penunjuk Bulatan Emas */}
                  <div className="absolute -left-[27px] top-1.5 flex items-center justify-center w-3 h-3 rounded-full bg-[#0a0c10] border-2 border-gold-bright transition-all group-hover:scale-125">
                    <div className="w-1 h-1 rounded-full bg-gold-deep"></div>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-mono font-bold text-gold-bright bg-emerald-deep/60 px-2.5 py-0.5 border border-gold-muted/15 rounded-md">
                      {item.time}
                    </span>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-white tracking-wide">
                      {item.title}
                    </h4>
                    {item.desc && (
                      <p className="text-[11px] md:text-xs text-gold-light/60 font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION E: BORANG RSVP & BUKU UCAPAN */}
          <section className="pt-4">
            <RSVPForm initialGuestName={guestName} />
          </section>

          {/* SECTION F: HUBUNGI KAMI */}
          <section className="bg-emerald-deep/30 border border-gold-muted/10 rounded-2xl p-6 md:p-8 text-center space-y-6 max-w-xl mx-auto">
            <div className="space-y-1">
              <h3 className="font-display text-base md:text-lg font-bold text-gold-bright tracking-widest uppercase">
                Hubungi Kami
              </h3>
              <p className="text-[11px] md:text-xs text-gold-light/70 font-sans">
                Hubungi talian di bawah untuk maklumat lanjut, pertanyaan parkir atau maklumat hotel berdekatan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coordinators.map((coord, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-emerald-dark/60 border border-gold-muted/10"
                >
                  <div className="text-left">
                    <h4 className="font-sans text-xs font-bold text-white tracking-wide">
                      {coord.name}
                    </h4>
                    <span className="text-[10px] font-sans text-gold-muted">{coord.desc}</span>
                  </div>
                  
                  <a
                    href={getWhatsAppLink(coord.phone, coord.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-emerald-mid border border-gold-muted/20 hover:border-gold-bright text-gold-light transition-all cursor-pointer"
                    title={`Hubungi ${coord.name} melalui WhatsApp`}
                  >
                    <Phone size={14} className="text-gold-bright" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION G: KATA-KATA PENGHARGAAN PENUTUP */}
          <footer className="text-center pt-8 border-t border-gold-muted/20 space-y-4">
            <p className="font-script text-2xl text-gold-muted tracking-wide">
              Sekian, Terima Kasih
            </p>
            <p className="text-[10px] md:text-xs text-gold-light/40 font-sans tracking-widest leading-relaxed max-w-sm mx-auto uppercase">
              Kehadiran dan doa restu sekalian tetamu amat kami sanjung bagi memeriahkan lagi majlis ini.
            </p>
            <div className="pt-4 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gold-light/30 font-sans tracking-widest">
                DIKEMASKINI DENGAN INTEGRASI LIVE KEPADA CORE CLOUD
              </span>
              <span className="text-[8px] text-gold-light/20 font-sans tracking-widest">
                PRODUK MAJLIS KREATIF DIGITAL PERSARAAN
              </span>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gold-deep border border-gold-bright text-emerald-deep font-sans font-bold text-xs px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 tracking-wide"
          >
            <Check size={14} className="stroke-[3]" />
            Alamat berjaya disalin ke papan keratan!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
