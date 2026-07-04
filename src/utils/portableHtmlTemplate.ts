export function generatePortableHtml(): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jemputan Rasmi: Majlis Persaraan & Kesyukuran Puan Nik Norizan</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        gold: {
                            deep: '#D2B168',
                            bright: '#ECC574',
                            light: '#F5E4C3',
                            muted: '#A89260',
                        },
                        emerald: {
                            deep: '#0F2C23',
                            dark: '#081B15',
                            light: '#2D5A4E',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #081B15;
            color: #F5E4C3;
            background-image: radial-gradient(#ECC574 0.5px, transparent 0.5px);
            background-size: 24px 24px;
            background-attachment: fixed;
        }
        .text-glow {
            text-shadow: 0 0 10px rgba(236, 197, 116, 0.4);
        }
        .border-ornament {
            border-image: linear-gradient(to right, transparent, #D2B168, transparent) 1;
        }
    </style>
</head>
<body class="min-h-screen font-sans antialiased text-gold-light p-4 md:p-8 flex items-center justify-center">

    <!-- Bekas Utama Kad -->
    <main class="w-full max-w-2xl bg-emerald-deep/95 border-2 border-gold-bright/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-8 backdrop-blur-sm">
        
        <!-- Hiasan Sudut Tradisional -->
        <div class="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-bright rounded-tl-3xl opacity-60"></div>
        <div class="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-bright rounded-tr-3xl opacity-60"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-bright rounded-bl-3xl opacity-60"></div>
        <div class="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-bright rounded-br-3xl opacity-60"></div>

        <!-- Banner Atas -->
        <div class="text-center">
            <span class="text-xs tracking-[0.3em] text-gold-bright uppercase font-medium block mb-2">✦ KAD JEMPUTAN MUDAH ALIH (OFFLINE) ✦</span>
            <div class="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-bright to-transparent mx-auto"></div>
        </div>

        <!-- Kepala Kad (Bismillah & Tajuk) -->
        <header class="text-center space-y-4">
            <div class="text-gold-bright text-xl font-serif italic mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <p class="text-xs tracking-[0.25em] text-gold-muted uppercase font-bold">Jemputan Ke Majlis</p>
            <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gold-bright tracking-wide text-glow leading-tight">
                PERSARAAN & KESYUKURAN
            </h1>
            <p class="text-xs text-gold-light/60 font-sans tracking-[0.15em] uppercase">Sanjungan Bakti, Kilauan Budi</p>
        </header>

        <!-- Divider Tradisional -->
        <div class="flex items-center justify-center gap-4 py-2">
            <div class="w-16 h-[1px] bg-gold-muted/40"></div>
            <span class="text-gold-bright text-lg">✦</span>
            <div class="w-16 h-[1px] bg-gold-muted/40"></div>
        </div>

        <!-- Tokoh Yang Diraikan -->
        <section class="text-center space-y-3">
            <p class="text-xs text-gold-light/50 uppercase tracking-widest">Meraikan Fasa Persaraan Bonda Tercinta</p>
            <h2 class="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                PUAN NIK NORIZAN<br>BINTI NIK OSMAN
            </h2>
            <p class="text-xs text-gold-bright/80 font-serif italic">Mantan Pendidik Berdedikasi</p>
        </section>

        <!-- Doa Persaraan -->
        <blockquote class="p-5 rounded-2xl bg-emerald-dark/60 border border-gold-muted/15 text-center space-y-2">
            <p class="text-xs md:text-sm text-gold-light/90 font-sans italic leading-relaxed">
                "Jasamu dikenang, budimu disanjung tinggi. Semoga persaraan ini dipenuhi ketenangan jiwa, limpahan kesihatan yang afiyah, dan keberkatan yang melimpah-ruah dari Allah SWT di samping keluarga tercinta."
            </p>
            <cite class="text-[10px] text-gold-muted font-display uppercase tracking-widest block font-bold mt-2">— Daripada Ahli Keluarga & Jawatankuasa Majlis</cite>
        </blockquote>

        <!-- Butiran Acara (Tarikh, Masa, Tempat) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            
            <!-- Tarikh -->
            <div class="p-4 rounded-xl bg-emerald-dark/40 border border-gold-muted/10 flex flex-col justify-between">
                <div class="text-gold-bright mb-2 mx-auto">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                    <h4 class="text-[10px] font-mono tracking-widest text-gold-muted uppercase font-bold">Hari & Tarikh</h4>
                    <p class="text-sm font-bold text-white mt-1">Khamis</p>
                    <p class="text-xs text-gold-light/80">27 Ogos 2026</p>
                    <p class="text-[10px] text-gold-muted">13 Safar 1448H</p>
                </div>
            </div>

            <!-- Masa -->
            <div class="p-4 rounded-xl bg-emerald-dark/40 border border-gold-muted/10 flex flex-col justify-between">
                <div class="text-gold-bright mb-2 mx-auto">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h4 class="text-[10px] font-mono tracking-widest text-gold-muted uppercase font-bold">Atur Masa</h4>
                    <p class="text-sm font-bold text-white mt-1">2:00 Petang</p>
                    <p class="text-xs text-gold-light/80">Hingga Selesai</p>
                    <p class="text-[10px] text-gold-muted">Zon Waktu Malaysia (MYT)</p>
                </div>
            </div>

            <!-- Tempat -->
            <div class="p-4 rounded-xl bg-emerald-dark/40 border border-gold-muted/10 flex flex-col justify-between">
                <div class="text-gold-bright mb-2 mx-auto">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                </div>
                <div>
                    <h4 class="text-[10px] font-mono tracking-widest text-gold-muted uppercase font-bold">Lokasi Majlis</h4>
                    <p class="text-xs font-bold text-white mt-1 leading-tight">Ketereh, Kelantan</p>
                    <p class="text-[10px] text-gold-light/70 mt-1 line-clamp-2">PT 1452, Kg Hutan Pasir</p>
                    <p class="text-[9px] text-gold-muted">16450 Ketereh</p>
                </div>
            </div>
        </section>

        <!-- Jam Hitung Detik (Countdown) -->
        <section class="p-6 rounded-2xl bg-emerald-dark/85 border border-gold-muted/20 text-center space-y-4 shadow-inner">
            <h4 class="text-xs font-mono tracking-widest text-gold-bright uppercase font-bold">Menghitung Detik Pertemuan</h4>
            <div class="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                <div class="p-2 rounded-xl bg-emerald-deep/90 border border-gold-muted/10">
                    <span id="days" class="font-display text-lg md:text-xl font-bold text-white block">00</span>
                    <span class="text-[9px] text-gold-muted uppercase font-semibold">Hari</span>
                </div>
                <div class="p-2 rounded-xl bg-emerald-deep/90 border border-gold-muted/10">
                    <span id="hours" class="font-display text-lg md:text-xl font-bold text-white block">00</span>
                    <span class="text-[9px] text-gold-muted uppercase font-semibold">Jam</span>
                </div>
                <div class="p-2 rounded-xl bg-emerald-deep/90 border border-gold-muted/10">
                    <span id="minutes" class="font-display text-lg md:text-xl font-bold text-white block">00</span>
                    <span class="text-[9px] text-gold-muted uppercase font-semibold">Minit</span>
                </div>
                <div class="p-2 rounded-xl bg-emerald-deep/90 border border-gold-muted/10">
                    <span id="seconds" class="font-display text-lg md:text-xl font-bold text-white block">00</span>
                    <span class="text-[9px] text-gold-muted uppercase font-semibold">Saat</span>
                </div>
            </div>
        </section>

        <!-- Navigasi Lokasi -->
        <section class="space-y-4 text-center">
            <h4 class="text-xs font-sans font-bold text-gold-bright uppercase tracking-[0.2em]">Navigasi & Panduan Arah</h4>
            <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <a href="https://maps.app.goo.gl/aNP2PP5NEZB7n27h8" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 text-gold-bright text-xs font-semibold uppercase hover:bg-emerald-dark/80 transition-all">
                    📍 Google Maps
                </a>
                <a href="https://waze.com/ul?q=PT%201452%20KG%20HUTAN%20PASIR%20KETEREH%20KELANTAN" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-dark border border-gold-muted/30 text-gold-bright text-xs font-semibold uppercase hover:bg-emerald-dark/80 transition-all">
                    🚗 Waze
                </a>
            </div>
        </section>



        <!-- RSVP Form (Offline / Direct WhatsApp Integration) -->
        <section id="rsvp-section" class="p-6 rounded-2xl bg-emerald-dark/80 border border-gold-bright/30 space-y-4 shadow-xl">
            <div class="text-center">
                <h4 class="text-xs font-sans font-bold text-gold-bright uppercase tracking-[0.2em]">BORANG PENGESAHAN KEHADIRAN</h4>
                <p class="text-[11px] text-gold-light/60 mt-1">Sila isi borang ini untuk mengesahkan kehadiran terus ke WhatsApp Urus Setia</p>
            </div>

            <form onsubmit="sendWhatsappRSVP(event)" class="space-y-4 text-left">
                <!-- Nama -->
                <div class="space-y-1">
                    <label class="block text-[10px] tracking-widest text-gold-light/80 uppercase font-bold">Nama Penuh Anda</label>
                    <input type="text" id="rsvp-name" required placeholder="Contoh: Haji Ahmad Fauzi" class="w-full py-2 px-3 bg-emerald-deep border border-gold-muted/30 text-xs text-white rounded-xl focus:outline-none focus:border-gold-bright placeholder-gold-light/25">
                </div>

                <!-- Kehadiran -->
                <div class="space-y-1">
                    <label class="block text-[10px] tracking-widest text-gold-light/80 uppercase font-bold">Status Kehadiran</label>
                    <select id="rsvp-status" required onchange="togglePaxInput()" class="w-full py-2 px-3 bg-emerald-deep border border-gold-muted/30 text-xs text-white rounded-xl focus:outline-none focus:border-gold-bright">
                        <option value="hadir">Hadir ✅</option>
                        <option value="tidak_hadir">Tidak Hadir ❌</option>
                        <option value="belum_pasti">Belum Pasti ❓</option>
                    </select>
                </div>

                <!-- Bilangan Pax -->
                <div id="pax-container" class="space-y-1">
                    <label class="block text-[10px] tracking-widest text-gold-light/80 uppercase font-bold">Bilangan Tetamu (Termasuk Anda)</label>
                    <select id="rsvp-pax" class="w-full py-2 px-3 bg-emerald-deep border border-gold-muted/30 text-xs text-white rounded-xl focus:outline-none focus:border-gold-bright">
                        <option value="1">1 Orang</option>
                        <option value="2" selected>2 Orang</option>
                        <option value="3">3 Orang</option>
                        <option value="4">4 Orang</option>
                        <option value="5">5 Orang</option>
                    </select>
                </div>

                <!-- Ucapan & Doa -->
                <div class="space-y-1">
                    <label class="block text-[10px] tracking-widest text-gold-light/80 uppercase font-bold">Ucapan, Doa & Dedikasi</label>
                    <textarea id="rsvp-wishes" rows="3" placeholder="Tuliskan ucapan ikhlas anda buat Puan Nik Norizan..." class="w-full py-2 px-3 bg-emerald-deep border border-gold-muted/30 text-xs text-white rounded-xl focus:outline-none focus:border-gold-bright placeholder-gold-light/25"></textarea>
                </div>

                <button type="submit" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-deep to-gold-bright text-emerald-deep font-sans font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] shadow-lg cursor-pointer">
                    💬 Hantar Pengesahan (WhatsApp)
                </button>
            </form>
        </section>

        <!-- Penutup & Salam Hormat -->
        <footer class="text-center space-y-2 pt-4 border-t border-gold-muted/15">
            <p class="text-xs text-gold-light/50 font-serif italic">"Sumbangan anda dikenang selamanya, ukhuwah kita kekal abadi."</p>
            <p class="text-[9px] text-gold-muted tracking-wider uppercase font-bold mt-2">© 2026 Keluarga Bonda Nik Norizan | Kad Offline Mudah Alih</p>
        </footer>

    </main>

    <!-- JavaScript untuk Countdown & RSVP -->
    <script>
        // Jam Hitung Detik (Target: 27 Ogos 2026, 2:00 PM)
        const targetDate = new Date('2026-08-27T14:00:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                document.getElementById('days').innerText = '00';
                document.getElementById('hours').innerText = '00';
                document.getElementById('minutes').innerText = '00';
                document.getElementById('seconds').innerText = '00';
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = d.toString().padStart(2, '0');
            document.getElementById('hours').innerText = h.toString().padStart(2, '0');
            document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
            document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();

        // Sembunyikan pax input jika tidak hadir
        function togglePaxInput() {
            const status = document.getElementById('rsvp-status').value;
            const container = document.getElementById('pax-container');
            if (status === 'tidak_hadir') {
                container.style.display = 'none';
            } else {
                container.style.display = 'block';
            }
        }

        // Fungsi untuk Hantar RSVP ke WhatsApp
        function sendWhatsappRSVP(event) {
            event.preventDefault();
            const name = document.getElementById('rsvp-name').value.trim();
            const status = document.getElementById('rsvp-status').value;
            const pax = document.getElementById('rsvp-pax').value;
            const wishes = document.getElementById('rsvp-wishes').value.trim();

            const statusLabels = {
                hadir: 'HADIR ✅',
                tidak_hadir: 'TIDAK HADIR ❌',
                belum_pasti: 'BELUM PASTI ❓'
            };

            const statusText = statusLabels[status] || status.toUpperCase();
            const wishesText = wishes ? '"' + wishes + '"' : '-(Tiada ucapan)-';
            const paxText = status === 'hadir' ? pax + ' Orang' : '-';

            const message = "Assalamu'alaikum Puan Nik Norizan & Urus Setia,\\n\\nSaya ingin mengesahkan kehadiran saya bagi *Majlis Persaraan dan Kesyukuran Puan Nik Norizan binti Nik Osman* melalui Kad Jemputan Offline.\\n\\n*Butiran Pengesahan:*\\n👤 *Nama:* " + name + "\\n📢 *Status:* " + statusText + "\\n👥 *Bilangan Pax:* " + paxText + "\\n✍️ *Ucapan/Doa:* " + wishesText + "\\n\\nTerima kasih.";

            const whatsappUrl = "https://wa.me/601110045980?text=" + encodeURIComponent(message);
            window.open(whatsappUrl, '_blank');
        }
    </script>
</body>
</html>`;
}
