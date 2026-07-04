import express from "express";
import path from "path";
import fs, { promises as fsPromises } from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Firestore } from "firebase/firestore";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "rsvps.json");

// Pastikan direktori data wujud
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data awal (seed data) jika pangkalan data kosong
const SEED_RSVPS: any[] = [];

let rsvpsMemoryCache: any[] = [];

// Mulakan pangkalan data JSON
async function initializeDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      console.log("Mencipta fail pangkalan data JSON baru dengan data seed...");
      await fsPromises.writeFile(DB_FILE, JSON.stringify(SEED_RSVPS, null, 2), "utf-8");
      rsvpsMemoryCache = [...SEED_RSVPS];
    } else {
      const data = await fsPromises.readFile(DB_FILE, "utf-8");
      rsvpsMemoryCache = JSON.parse(data);
      console.log("Pangkalan data JSON berjaya dimuatkan.");
    }
  } catch (error) {
    console.error("Gagal melancarkan pangkalan data JSON:", error);
    // Sandaran memori jika sistem fail gagal
    rsvpsMemoryCache = [...SEED_RSVPS];
  }
}

// Mulakan Klien Firebase Firestore secara santai (lazy load)
let db: Firestore | null = null;
let isFirebaseActive = false;

function getFirestoreDb(): Firestore | null {
  if (db === null && !isFirebaseActive) {
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const firebaseApp = initializeApp(config);
        if (config.firestoreDatabaseId) {
          db = getFirestore(firebaseApp, config.firestoreDatabaseId);
        } else {
          db = getFirestore(firebaseApp);
        }
        isFirebaseActive = true;
        console.log("Firebase Firestore berjaya dilancarkan.");
      } else {
        console.warn("Fail firebase-applet-config.json tidak ditemui. Menggunakan fallback pangkalan data JSON.");
      }
    } catch (error) {
      console.error("Gagal melancarkan Firebase Firestore:", error);
    }
  }
  return db;
}

// Pasangkan middleware parser JSON
app.use(express.json());

// Inisialisasi Klien Gemini secara santai (lazy load)
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY tidak dikonfigurasikan di dalam pelayan.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return ai;
}

// API: Dapatkan senarai RSVP / Ucapan daripada Firebase Firestore (dengan fallback Fail JSON)
app.get("/api/rsvps", async (req, res) => {
  try {
    const firestoreDb = getFirestoreDb();
    if (firestoreDb) {
      try {
        const rsvpsCol = collection(firestoreDb, "rsvps");
        const q = query(rsvpsCol, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const rsvpsList: any[] = [];
        querySnapshot.forEach((doc) => {
          rsvpsList.push({ id: doc.id, ...doc.data() });
        });
        return res.json(rsvpsList);
      } catch (fbError) {
        console.error("Ralat membaca dari Firestore, menggunakan fallback JSON:", fbError);
      }
    }

    // Susun secara tertib tarikh menurun (terbaru dahulu)
    const sortedRsvps = [...rsvpsMemoryCache].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    res.json(sortedRsvps);
  } catch (error) {
    console.error("Gagal mendapatkan senarai RSVP:", error);
    res.status(500).json({ error: "Gagal membaca data dari pangkalan data." });
  }
});

// API: Simpan RSVP baru ke dalam Firebase Firestore (dengan fallback Fail JSON)
app.post("/api/rsvp", async (req, res) => {
  try {
    const { name, status, pax, wishes } = req.body;
    
    if (!name || !status) {
      return res.status(400).json({ error: "Nama dan Status Kehadiran adalah wajib." });
    }

    const tempId = "rsvp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
    const newRsvp: any = {
      name: name.trim(),
      status,
      pax: Number(pax) || 1,
      wishes: wishes ? wishes.trim() : "",
      createdAt: new Date().toISOString()
    };

    const firestoreDb = getFirestoreDb();
    if (firestoreDb) {
      try {
        const rsvpsCol = collection(firestoreDb, "rsvps");
        const docRef = await addDoc(rsvpsCol, newRsvp);
        newRsvp.id = docRef.id;

        // Kemas kini cache memori dan fail sandaran tempatan juga untuk integriti data
        rsvpsMemoryCache.push(newRsvp);
        await fsPromises.writeFile(DB_FILE, JSON.stringify(rsvpsMemoryCache, null, 2), "utf-8").catch(() => {});

        return res.status(201).json({ success: true, rsvp: newRsvp });
      } catch (fbError) {
        console.error("Ralat menyimpan ke Firestore, menggunakan fallback JSON sahaja:", fbError);
      }
    }

    // Fallback simpan ke JSON sahaja jika Firestore tiada/gagal
    newRsvp.id = tempId;
    rsvpsMemoryCache.push(newRsvp);
    await fsPromises.writeFile(DB_FILE, JSON.stringify(rsvpsMemoryCache, null, 2), "utf-8");

    res.status(201).json({ success: true, rsvp: newRsvp });
  } catch (error) {
    console.error("Gagal menyimpan RSVP:", error);
    res.status(500).json({ error: "Gagal mendaftar status RSVP anda." });
  }
});

// Fungsi sandaran (fallback) untuk menjana ucapan persaraan berkualiti tinggi jika API Gemini mengalami masalah (cth: kunci ralat/leaked)
function generateFallbackWish(relationship: string, tone: string, keywords: string): string {
  const relLower = (relationship || "").toLowerCase();
  const toneLower = (tone || "").toLowerCase();
  
  const isStudent = relLower.includes("murid") || relLower.includes("pelajar") || relLower.includes("student");
  const isFamily = relLower.includes("saudara") || relLower.includes("keluarga") || relLower.includes("family");
  
  let result = "";

  if (toneLower.includes("keagamaan") || toneLower.includes("doa")) {
    result = `Barakallahulakum sempena persaraan Puan Nik Norizan binti Nik Osman. Kami mendoakan semoga Allah SWT sentiasa melimpahkan rahmat, taufik, dan hidayah-Nya buat Puan sekeluarga. Semoga dikurniakan kesihatan yang afiyah, umur yang berkat, serta ketenangan jiwa dalam menempuh fasa baru ini. Semoga segala amal jasa, sumbangan, dan kebaikan yang Puan curahkan menjadi ladang pahala yang mengalir berterusan. Amin ya Rabbal Alamin.`;
  } else if (toneLower.includes("puitis") || toneLower.includes("tradisional") || toneLower.includes("pantun")) {
    if (isStudent) {
      result = `Pucuk pauh sedang mekar,
Tumbuh subur di tepi taman;
Jasa Puan guru penyabar,
Akan dikenang sepanjang zaman.

Setinggi-tinggi penghargaan dan ucapan terima kasih buat Puan Nik Norizan binti Nik Osman yang dikasihi atas segala bimbingan, didikan, dan kesabaran mencurahkan ilmu kepada kami. Semoga Puan diberkati dengan kebahagiaan dan ketenangan berpanjangan sempena persaraan ini.`;
    } else {
      result = `Tuai padi antara nampak,
Esok jangan layu-layuan;
Intan budi kami nampak,
Esok jangan rindu-rinduan.

Selamat bersara diucapkan kepada Puan Nik Norizan binti Nik Osman. Segala jasa bakti, nasihat, dan kebaikan Puan sepanjang berkhidmat bersama kami amatlah kami hargai. Kenangan manis bersama Puan akan sentiasa mekar dalam ingatan kami.`;
    }
  } else if (toneLower.includes("mesra") || toneLower.includes("santai")) {
    if (isStudent) {
      result = `Selamat bersara Cikgu Nik Norizan binti Nik Osman yang paling mesra dan disayangi! Terima kasih cikgu kerana sentiasa penyabar mendidik kami dan menceriakan hari-hari persekolahan kami. Kami mendoakan semoga Cikgu sentiasa sihat walafiat, gembira, dan diberkati dalam setiap urusan kehidupan selepas persaraan ini. Terima kasih cikgu!`;
    } else if (isFamily) {
      result = `Selamat bersara buat Puan Nik Norizan yang disayangi! Kami sangat bangga dengan dedikasi dan kejayaan luar biasa sepanjang tempoh perkhidmatan Puan. Semoga fasa persaraan ini dipenuhi dengan kebahagiaan, ketenangan, dan kesihatan yang baik bersama keluarga tersayang. Nikmati masa berkualiti ini sepenuhnya!`;
    } else {
      result = `Selamat bersara buat Kak Nik Norizan yang tersayang! Kehilangan Kak Nik pastinya akan amat dirasai oleh kami semua di sini. Terima kasih atas segala gelak tawa, nasihat, dan bimbingan berharga yang pernah dikongsikan. Semoga fasa baru dalam hidup Kak Nik dipenuhi dengan kesihatan, ketenangan, dan kegembiraan yang melimpah-limpah bersama keluarga!`;
    }
  } else {
    // Formal & Profesional
    result = `Setinggi-tinggi penghargaan dan ucapan terima kasih diucapkan kepada Yang Berbahagia Puan Nik Norizan binti Nik Osman atas dedikasi, integriti, dan sumbangan bakti yang tiada galang ganti sepanjang tempoh perkhidmatan. Sumbangan cemerlang Puan telah memberikan impak yang amat besar kepada institusi ini. Semoga Puan dikurniakan persaraan yang sejahtera, penuh ketenangan, dan kesihatan yang berkekalan.`;
  }

  // Jika ada kata kunci tambahan, selitkan dengan cara yang teratur
  if (keywords && keywords.trim().length > 0) {
    const kw = keywords.trim();
    result += `\n\nTerima kasih juga buat Puan atas kenangan indah dan perkongsian ilmu mengenai "${kw}" yang sentiasa hidup dalam ingatan kami.`;
  }

  return result;
}

// API: Penjana Ucapan menggunakan Gemini AI (Pembantu Ucapan Pintar)
app.post("/api/gemini/generate-wish", async (req, res) => {
  const { relationship, tone, keywords } = req.body;

  if (!relationship || !tone) {
    return res.status(400).json({ error: "Sila lengkapkan maklumat hubungan dan nada ucapan." });
  }

  try {
    const client = getGeminiClient();

    const prompt = `Anda adalah seorang sasterawan Melayu dan penulis kad ucapan persaraan profesional kelas tinggi.
Sila jana ucapan persaraan dan kesyukuran yang sangat menyentuh perasaan, puitis, dan penuh keberkatan untuk tokoh guru/kakitangan bernama "Puan Nik Norizan binti Nik Osman" sempena majlis persaraannya.

Sila tulis ucapan menggunakan kriteria berikut:
1. Hubungan tetamu dengan yang diraikan: ${relationship}
2. Nada penulisan: ${tone}
${keywords ? `3. Kata kunci tambahan atau kenangan indah untuk dimasukkan: "${keywords}"` : ""}

Arahan khusus:
- Gunakan bahasa Melayu tinggi, murni, dan penuh adab sopan (elakkan perkataan bahasa Indonesia).
- Jika nada ucapan adalah "puitis & tradisional", selitkan serangkap pantun 4 kerat yang indah tentang persaraan atau kenangan di awal atau di akhir ucapan.
- Jika nada ucapan adalah "keagamaan & doa", sertakan doa kebaikan, kesihatan yang afiyah, kebahagiaan berpanjangan, dan keberkatan hidup dunia akhirat bersama keluarga tercinta.
- Panjang ucapan hendaklah antara 3 hingga 5 ayat yang padat, berkesan, dan syahdu.
- Tulis teks ucapan secara langsung dan sedia untuk disalin. Sila elakkan menulis sebarang placeholder seperti [Nama Anda] atau sebarang teks pengenalan seperti "Berikut adalah ucapan anda:". Teks ucapan mestilah sedia digunakan oleh tetamu.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const wish = response.text || "";
    res.json({ success: true, wish: wish.trim() });
  } catch (error: any) {
    console.warn("Ralat Gemini API (cth: kunci tamat tempoh / leaked), mengaktifkan penjana sandaran (fallback):", error.message || error);
    // Menggunakan penjana sandaran (fallback) berkualiti tinggi yang terselamat daripada ralat API key leaked
    const fallbackWish = generateFallbackWish(relationship, tone, keywords.trim());
    res.json({ success: true, wish: fallbackWish, isFallback: true });
  }
});

// Integrasi Vite & Permulaan Pelayan
async function start() {
  // Aktifkan SQLite database dahulu
  await initializeDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server sedang berjalan lancar di http://0.0.0.0:${PORT}`);
  });
}

start();
