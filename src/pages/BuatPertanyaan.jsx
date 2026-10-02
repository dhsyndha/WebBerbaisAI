import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuatPertanyaan.css";

function BuatPertanyaan() {
  const navigate = useNavigate();
  const [topik, setTopik] = useState("");
  const [jumlah, setJumlah] = useState("5");
  const [kesulitan, setKesulitan] = useState("campuran");
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownKesulitan, setDropdownKesulitan] = useState(false);
  const [popup, setPopup] = useState("");

  async function buatPertanyaan() {
    if (!topik.trim()) {
      setPopup("Topik atau tema wajib diisi.");
      return;
    }

    if (!jumlah || Number(jumlah) < 1 || Number(jumlah) > 50) {
      setPopup("Jumlah pertanyaan harus antara 1 sampai 50.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topik: topik.trim(),
          jumlah: Number(jumlah),
          kesulitan
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pertanyaan.");
      }

      setHasil(data.pertanyaan || []);
    } catch (error) {
      setPopup(error.message);
    } finally {
      setLoading(false);
    }
  }

  function simpanHasil() {
    if (!hasil.length) return;

    const isi = [
      `Topik: ${topik}`,
      `Jumlah: ${hasil.length} pertanyaan`,
      `Tingkat Kesulitan: ${kesulitan}`,
      "",
      ...hasil.map((item, index) => `${index + 1}. ${item}`)
    ].join("\n");

    const blob = new Blob([isi], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pertanyaan-dysa.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="halaman-pertanyaan">
      <div className="konten-pertanyaan">
        <header className="header-pertanyaan">
          <button
            className="tombol-kembali-pertanyaan"
            onClick={() => navigate("/")}
            aria-label="Kembali"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <h1>
            Spin By <span>Dysa</span>
          </h1>

          <button
            className="tombol-home-pertanyaan"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v12h14V9" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </button>
        </header>

        <section className="hero-pertanyaan">
          <h2>
            Siap <span>untuk Spin?</span>
          </h2>
          <p>
            Masukkan topik atau tema, atur jumlah pertanyaan
            yang ingin dibuat, lalu tekan tombol spin.
          </p>
        </section>

        <section className="form-pertanyaan">
          <div className="baris-pertanyaan">
            <div className="label-pertanyaan">
              <div className="ikon-pertanyaan pink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 7h6M9 11h6M9 15h4" />
                </svg>
              </div>
              <strong>Topik / Tema</strong>
            </div>

            <div>
              <input
                type="text"
                value={topik}
                onChange={e => setTopik(e.target.value)}
                placeholder="Cloud Computing"
              />
              <small>Masukkan topik atau tema (misal: Cloud Computing)</small>
            </div>
          </div>

          <div className="baris-pertanyaan">
            <div className="label-pertanyaan">
              <div className="ikon-pertanyaan ungu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 6h13M8 12h13M8 18h13" />
                  <path d="M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </div>
              <strong>Jumlah Pertanyaan</strong>
            </div>

            <div>
              <input
                type="number"
                min="1"
                max="50"
                value={jumlah}
                onChange={e => setJumlah(e.target.value)}
              />
              <small>Masukkan jumlah soal yang ingin dibuat (1–50)</small>
            </div>
          </div>

          <div className="baris-pertanyaan">
            <div className="label-pertanyaan">
              <div className="ikon-pertanyaan biru">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                  <circle cx="8" cy="6" r="2" />
                  <circle cx="15" cy="12" r="2" />
                  <circle cx="10" cy="18" r="2" />
                </svg>
              </div>

              <strong>
                Tingkat Kesulitan
                <small>(Optional)</small>
              </strong>
            </div>

            <div className="dropdown-pertanyaan">
              <button
                type="button"
                className="tombol-dropdown-pertanyaan"
                onClick={() => setDropdownKesulitan(!dropdownKesulitan)}
              >
                <span>
                  {kesulitan === "campuran"
                    ? "Campuran (Mudah - Sulit)"
                    : kesulitan.charAt(0).toUpperCase() + kesulitan.slice(1)}
                </span>

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {dropdownKesulitan && (
                <div className="menu-dropdown-pertanyaan">
                  {[
                    { value: "campuran", label: "Campuran (Mudah - Sulit)" },
                    { value: "mudah", label: "Mudah" },
                    { value: "sedang", label: "Sedang" },
                    { value: "sulit", label: "Sulit" }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.value}
                      className={kesulitan === item.value ? "aktif" : ""}
                      onClick={() => {
                        setKesulitan(item.value);
                        setDropdownKesulitan(false);
                      }}
                    >
                      <span>{item.label}</span>

                      {kesulitan === item.value && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <button
          className="tombol-buat-pertanyaan"
          onClick={buatPertanyaan}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          {loading ? "Membuat..." : "Buat Pertanyaan"}
        </button>

        {hasil.length > 0 && (
          <section className="hasil-pertanyaan">
            <div className="judul-hasil-pertanyaan">
              <div>
                <h2>Hasil Pertanyaan</h2>
                <p>Pertanyaan tentang “{topik}” yang dibuat oleh AI.</p>
              </div>
              <span>{hasil.length} soal</span>
            </div>

            <div className="daftar-pertanyaan">
              {hasil.map((item, index) => (
                <div className="kartu-pertanyaan" key={index}>
                  <b>{index + 1}</b>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="aksi-pertanyaan">
              <button
                className="tombol-simpan-pertanyaan"
                onClick={simpanHasil}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Simpan
              </button>

              <button
                className="tombol-spin-lagi-pertanyaan"
                onClick={buatPertanyaan}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                {loading ? "Membuat..." : "Buat Lagi"}
              </button>
            </div>
          </section>
        )}

        {popup && (
          <div className="overlay-pertanyaan">
            <div className="popup-pertanyaan">
              <div className="ikon-popup-pertanyaan">!</div>
              <h3>Oops!</h3>
              <p>{popup}</p>
              <button onClick={() => setPopup("")}>Oke</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default BuatPertanyaan;