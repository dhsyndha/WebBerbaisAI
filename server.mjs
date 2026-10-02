import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ai openrouter
async function generateAI(prompt) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Spin By Dysa"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENROUTER ERROR:", data);

      if (response.status === 401) {
        throw new Error("Koneksi AI bermasalah. Periksa API Key.");
      }

      if (response.status === 429) {
        throw new Error("AI sedang terlalu banyak digunakan. Coba lagi beberapa saat.");
      }

      if (response.status >= 500) {
        throw new Error("Layanan AI sedang bermasalah. Coba lagi nanti.");
      }

      throw new Error("AI tidak dapat memproses permintaan.");
    }

    const teks = data.choices?.[0]?.message?.content
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!teks) {
      throw new Error("AI tidak memberikan hasil. Silakan coba lagi.");
    }

    return JSON.parse(teks);
  } catch (error) {
    console.error("AI ERROR:", error.message);

    if (
      error.message === "fetch failed" ||
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.name === "TypeError"
    ) {
      throw new Error(
        "Tidak dapat terhubung ke AI. Periksa koneksi internet kamu lalu coba lagi."
      );
    }

    if (error instanceof SyntaxError) {
      throw new Error(
        "AI memberikan hasil yang tidak dapat diproses. Silakan coba lagi."
      );
    }

    throw new Error(
      error.message || "Terjadi kesalahan saat menghubungi AI."
    );
  }
}

// cari judul
async function buatJudul(materi, kataKunci) {
  const prompt = `
Buat 15 judul presentasi yang berbeda dan relevan berdasarkan materi berikut.

Materi: ${materi}
Kata kunci tambahan: ${kataKunci || "tidak ada"}

Ketentuan:
- Cocok untuk mahasiswa.
- Spesifik dan mudah dipahami.
- Jangan membuat judul yang sama atau terlalu mirip.
- Gunakan bahasa Indonesia.
- Setiap judul memiliki deskripsi singkat.
- Buat judul dengan variasi sudut pandang.
- Balas hanya JSON array.

Format:
[
  {
    "judul": "Judul",
    "deskripsi": "Deskripsi"
  }
]
`;

  return generateAI(prompt);
}

// cari ide materi
async function buatIdeMateri(materi) {
  const prompt = `
Buat 20 ide materi presentasi yang berbeda dan relevan berdasarkan topik berikut:

${materi}

Ketentuan:
- Cocok untuk mahasiswa.
- Ide harus spesifik dan mudah dikembangkan menjadi materi presentasi.
- Jangan membuat ide yang sama atau terlalu mirip.
- Gunakan bahasa Indonesia.
- Setiap ide memiliki judul.
- Setiap ide memiliki deskripsi singkat.
- Setiap ide memiliki 3 kata kunci/tag.
- Gunakan variasi seperti studi kasus, penerapan, analisis, strategi, teknologi, masalah, solusi, perkembangan, dampak, dan inovasi.
- Balas hanya JSON array.

Format:
[
  {
    "judul": "Judul ide",
    "deskripsi": "Deskripsi singkat",
    "tag": ["Tag 1", "Tag 2", "Tag 3"]
  }
]
`;

  return generateAI(prompt);
}

// cari referensi
async function cariGoogle(query) {
  const response = await fetch(
    "https://google.serper.dev/search",
    {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        gl: "id",
        hl: "id",
        num: 20
      })
    }
  );

  const data = await response.json();

  console.log("QUERY:", query);
  console.log("STATUS:", response.status);
  console.log("HASIL:", data.organic?.length || 0);

  if (!response.ok) {
    throw new Error(
      data.message || "Gagal mengambil hasil Google."
    );
  }

  return data.organic || [];
}

// ubah hasil
function ubahHasil(data, youtube = false) {
  return data
    .filter(item => item.title && item.link)
    .filter(item => {
      const url = item.link.toLowerCase();

      if (youtube) {
        return (
          url.includes("youtube.com") ||
          url.includes("youtu.be")
        );
      }

      return !(
        url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        url.includes("facebook.com") ||
        url.includes("instagram.com") ||
        url.includes("tiktok.com") ||
        url.includes("twitter.com") ||
        url.includes("x.com")
      );
    })
    .map(item => ({
      nama: item.title,
      url: item.link,
      deskripsi: item.snippet || ""
    }))
    .filter(
      (item, index, self) =>
        index === self.findIndex(x => x.url === item.url)
    );
}

// kata penting
function kataPenting(teks) {
  const stopword = [
    "dan",
    "atau",
    "yang",
    "dengan",
    "dalam",
    "untuk",
    "pada",
    "dari",
    "terhadap",
    "tentang",
    "sebagai",
    "cara",
    "studi",
    "analisis",
    "pengaruh",
    "penerapan",
    "implementasi",
    "berbasis"
  ];

  return teks
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(kata => kata.length > 3)
    .filter(kata => !stopword.includes(kata));
}

// sesuai judul
function sesuaiJudul(item, judul) {
  const kata = kataPenting(judul);

  if (kata.length === 0) {
    return true;
  }

  const teks =
    `${item.nama} ${item.deskripsi} ${item.url}`.toLowerCase();

  const cocok = kata.filter(kata =>
    teks.includes(kata)
  );

  return cocok.length >= Math.min(2, kata.length);
}

// filter sesuai judul
function filterSesuaiJudul(data, judul) {
  return data.filter(item =>
    sesuaiJudul(item, judul)
  );
}

// gabungkan referensi
function gabungkanReferensi(daftar) {
  return daftar
    .flat()
    .filter(item => item?.url)
    .filter(
      (item, index, self) =>
        index === self.findIndex(x => x.url === item.url)
    );
}

// pisahkan referensi
function pisahkanReferensi(data) {
  const semua = ubahHasil(data);

  const artikel = semua.filter(item => {
    const url = item.url.toLowerCase();
    const nama = item.nama.toLowerCase();

    return (
      url.includes(".pdf") ||
      url.includes("journal") ||
      url.includes("jurnal") ||
      url.includes("researchgate") ||
      url.includes("scholar.google") ||
      nama.includes("jurnal") ||
      nama.includes("penelitian") ||
      nama.includes("research")
    );
  });

  const website = semua.filter(
    item => !artikel.some(x => x.url === item.url)
  );

  return {
    artikel,
    website
  };
}

// api cari judul
app.post("/search", async (req, res) => {
  try {
    const { materi, kataKunci } = req.body;

    if (!materi?.trim()) {
      return res.status(400).json({
        error: "Materi wajib diisi."
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY belum ada di .env."
      });
    }

    if (!process.env.SERPER_API_KEY) {
      return res.status(500).json({
        error: "SERPER_API_KEY belum ada di .env."
      });
    }

    const daftarJudul = await buatJudul(
      materi.trim(),
      kataKunci?.trim()
    );

    const hasil = [];

    for (const item of daftarJudul) {
      const judul = item.judul.trim();

      const queryArtikel =
        `${judul} jurnal penelitian`;

      const queryWebsite =
        `${judul} referensi`;

      const [hasilArtikel, hasilWebsite] =
        await Promise.all([
          cariGoogle(queryArtikel),
          cariGoogle(queryWebsite)
        ]);

      const semuaArtikel = filterSesuaiJudul(
        ubahHasil(hasilArtikel),
        judul
      );

      const semuaWebsite = filterSesuaiJudul(
        ubahHasil(hasilWebsite),
        judul
      );

      const artikel = semuaArtikel.slice(0, 10);
      const website = semuaWebsite.slice(0, 10);

      hasil.push({
        judul,
        deskripsi: item.deskripsi,
        artikel,
        website,
        semuaReferensi: [
          ...artikel,
          ...website
        ]
      });
    }

    res.json({
      hasil
    });
  } catch (error) {
    console.error("ERROR SEARCH:", error);

    res.status(500).json({
      error:
        error.message ||
        "Terjadi kesalahan pada server."
    });
  }
});

// api cari ide materi
app.post("/ideas", async (req, res) => {
  try {
    const { materi } = req.body;

    if (!materi?.trim()) {
      return res.status(400).json({
        error: "Topik wajib diisi."
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY belum ada di .env."
      });
    }

    if (!process.env.SERPER_API_KEY) {
      return res.status(500).json({
        error: "SERPER_API_KEY belum ada di .env."
      });
    }

    console.log("Membuat ide untuk:", materi);

    const daftarIde = await buatIdeMateri(
      materi.trim()
    );

    const hasil = [];

    for (const ide of daftarIde) {
      const judul = ide.judul.trim();

      const queryArtikel = [
        `${judul} jurnal`,
        `${judul} penelitian`
      ];

      const queryWebsite = [
        `${judul} referensi`,
        `${judul} materi`
      ];

      const queryYouTube = [
        `${judul} YouTube`
      ];

      const semuaQuery = [
        ...queryArtikel,
        ...queryWebsite,
        ...queryYouTube
      ];

      const semuaHasil = await Promise.all(
        semuaQuery.map(query =>
          cariGoogle(query)
        )
      );

      const hasilArtikel = semuaHasil.slice(
        0,
        queryArtikel.length
      );

      const hasilWebsite = semuaHasil.slice(
        queryArtikel.length,
        queryArtikel.length + queryWebsite.length
      );

      const hasilYouTube = semuaHasil.slice(
        queryArtikel.length + queryWebsite.length
      );

      const artikel = gabungkanReferensi(
        hasilArtikel.map(data => {
          const dipisah = pisahkanReferensi(data);

          return filterSesuaiJudul(
            dipisah.artikel,
            judul
          );
        })
      ).slice(0, 10);

      const website = gabungkanReferensi(
        hasilWebsite.map(data => {
          const dipisah = pisahkanReferensi(data);

          return filterSesuaiJudul(
            dipisah.website,
            judul
          );
        })
      ).slice(0, 10);

      const youtube = gabungkanReferensi(
        hasilYouTube.map(data =>
          filterSesuaiJudul(
            ubahHasil(data, true),
            judul
          )
        )
      ).slice(0, 10);

      hasil.push({
        judul,
        deskripsi: ide.deskripsi,
        tag: ide.tag || [],
        youtube,
        artikel,
        website,
        referensi: [
          ...artikel,
          ...website
        ]
      });

      console.log(
        `Ide "${judul}" -> ${youtube.length} YouTube | ${artikel.length} artikel | ${website.length} website`
      );
    }

    res.json({
      hasil
    });
  } catch (error) {
    console.error("ERROR IDE:", error);

    res.status(500).json({
      error:
        error.message ||
        "Gagal mencari ide materi."
    });
  }
});

// buat pertanyaan
async function buatPertanyaan(materi, jumlah, tingkat) {
  const prompt = `
Buat ${jumlah} pertanyaan berdasarkan topik berikut:

Topik: ${materi}
Tingkat kesulitan: ${tingkat}

Ketentuan:
- Cocok untuk mahasiswa.
- Gunakan bahasa Indonesia.
- Pertanyaan harus benar-benar sesuai dengan topik.
- Jangan membuat pertanyaan yang sama atau terlalu mirip.
- Cocok untuk diskusi, presentasi, atau sesi tanya jawab.
- Jika mudah, fokus pada pemahaman dasar.
- Jika sedang, fokus pada penjelasan dan penerapan.
- Jika sulit, fokus pada analisis, perbandingan, evaluasi, atau studi kasus.
- Jangan sertakan jawaban.
- Balas hanya JSON array.

Format:
[
  {
    "pertanyaan": "Isi pertanyaan"
  }
]
`;

  return generateAI(prompt);
}

// api buat pertanyaan
app.post("/questions", async (req, res) => {
  try {
    const {
      topik,
      jumlah,
      kesulitan
    } = req.body;

    if (!topik?.trim()) {
      return res.status(400).json({
        error: "Topik atau tema wajib diisi."
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY belum ada di .env."
      });
    }

    const jumlahPertanyaan = Number(jumlah) || 5;
    const tingkat = kesulitan || "campuran";

    const hasilAI = await buatPertanyaan(
      topik.trim(),
      jumlahPertanyaan,
      tingkat
    );

    const pertanyaan = Array.isArray(hasilAI)
      ? hasilAI
          .map(item =>
            typeof item === "string"
              ? item
              : item.pertanyaan
          )
          .filter(Boolean)
      : [];

    res.json({
      pertanyaan
    });
  } catch (error) {
    console.error("ERROR QUESTIONS:", error);

    res.status(500).json({
      error:
        error.message ||
        "Gagal membuat pertanyaan."
    });
  }
});

// jalankan server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});