import express from "express";
import path from "path";
import fs, { promises as fsPromises } from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

// API: Dapatkan senarai RSVP / Ucapan daripada Fail JSON
app.get("/api/rsvps", async (req, res) => {
  try {
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

// API: Simpan RSVP baru ke dalam Fail JSON
app.post("/api/rsvp", async (req, res) => {
  try {
    const { name, status, pax, wishes } = req.body;
    
    if (!name || !status) {
      return res.status(400).json({ error: "Nama dan Status Kehadiran adalah wajib." });
    }

    const newRsvp = {
      id: "rsvp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      status,
      pax: Number(pax) || 1,
      wishes: wishes ? wishes.trim() : "",
      createdAt: new Date().toISOString()
    };

    rsvpsMemoryCache.push(newRsvp);

    // Tulis semula fail pangkalan data secara asid / tidak menghalang
    await fsPromises.writeFile(DB_FILE, JSON.stringify(rsvpsMemoryCache, null, 2), "utf-8");

    res.status(201).json({ success: true, rsvp: newRsvp });
  } catch (error) {
    console.error("Gagal menyimpan RSVP ke Fail JSON:", error);
    res.status(500).json({ error: "Gagal mendaftar status RSVP anda." });
  }
});

// API: Penjana Ucapan menggunakan Gemini AI (Pembantu Ucapan Pintar)
app.post("/api/gemini/generate-wish", async (req, res) => {
  try {
    const { relationship, tone, keywords } = req.body;

    if (!relationship || !tone) {
      return res.status(400).json({ error: "Sila lengkapkan maklumat hubungan dan nada ucapan." });
    }

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
    console.error("Gagal menjana ucapan AI:", error);
    res.status(500).json({ error: error.message || "Gagal menghubungi API kecerdasan buatan Gemini." });
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
