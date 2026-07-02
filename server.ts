import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

// Pastikan direktori data wujud
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data awal (seed data) jika fail tidak wujud
const SEED_RSVPS = [
  {
    id: "seed-1",
    name: "Haji Ahmad Fauzi & Keluarga",
    status: "hadir",
    pax: 2,
    wishes: "Selamat bersara Tuan Nik Norizan! Terima kasih atas segala bimbingan dan jasa sepanjang kita berkhidmat bersama. Semoga kehidupan persaraan ini membawa sejuta keberkatan dan kebahagiaan bersama keluarga tercinta.",
    createdAt: "2026-07-02T08:15:00.000Z"
  },
  {
    id: "seed-2",
    name: "Fatimah Az-Zahra",
    status: "hadir",
    pax: 1,
    wishes: "Tahniah atas persaraan Kak Nik Norizan! Jasamu dikenang, budimu disanjung tinggi. Semoga dikurniakan kesihatan yang afiyah, ketenangan jiwa, dan sentiasa dalam peliharaan Allah SWT.",
    createdAt: "2026-07-02T09:00:00.000Z"
  },
  {
    id: "seed-3",
    name: "Dato' Khairul Anuar & Datin",
    status: "hadir",
    pax: 2,
    wishes: "Selamat Menikmati Fasa Persaraan, Sahabatku Nik Norizan! Semoga lembaran baru ini dipenuhi dengan aktiviti yang bermanfaat, ketenangan minda, dan kegembiraan yang berpanjangan.",
    createdAt: "2026-07-02T09:30:00.000Z"
  }
];

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_RSVPS, null, 2), "utf-8");
}

app.use(express.json());

// API: Dapatkan senarai RSVP / Ucapan
app.get("/api/rsvps", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const rsvps = JSON.parse(data);
      // Susun mengikut tarikh terkini dahulu
      rsvps.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(rsvps);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Gagal membaca fail RSVP:", error);
    res.status(500).json({ error: "Gagal membaca data RSVP." });
  }
});

// API: Simpan RSVP baru
app.post("/api/rsvp", (req, res) => {
  try {
    const { name, status, pax, wishes } = req.body;
    
    if (!name || !status) {
      return res.status(400).json({ error: "Nama dan Status Kehadiran adalah wajib." });
    }

    const newRsvp = {
      id: "rsvp-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      status,
      pax: Number(pax) || 1,
      wishes: wishes ? wishes.trim() : "",
      createdAt: new Date().toISOString()
    };

    let rsvps = [];
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      rsvps = JSON.parse(fileData);
    }

    rsvps.push(newRsvp);
    fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), "utf-8");

    res.status(201).json({ success: true, rsvp: newRsvp });
  } catch (error) {
    console.error("Gagal menyimpan RSVP:", error);
    res.status(500).json({ error: "Gagal menyimpan data RSVP anda." });
  }
});

// Integrasi Vite
async function start() {
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
    console.log(`Server sedang berjalan di http://0.0.0.0:${PORT}`);
  });
}

start();
