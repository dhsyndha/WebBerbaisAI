import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AcakTopik.css";

function AcakTopik() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("kelompok");
  const [dropdown, setDropdown] = useState(false);
  const [kelompok, setKelompok] = useState("");
  const [nama, setNama] = useState("");
  const [topik, setTopik] = useState("");
  const [hasil, setHasil] = useState(null);
  const [pesanPopup, setPesanPopup] = useState("");

  const pilihanMode = [
    { value: "kelompok", label: "Sudah ada kelompoknya" },
    { value: "nama", label: "Berdasarkan nama" }
  ];

  const modeAktif = pilihanMode.find(item => item.value === mode);

  function acakArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function mulaiSpin() {
    const daftarKelompok = kelompok
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    const daftarNama = nama
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    const daftarTopik = topik
      .split("\n")
      .map(x => x.trim())
      .filter(Boolean);

    if (!daftarKelompok.length || !daftarTopik.length) {
      setPesanPopup("Daftar kelompok dan topik wajib diisi.");
      return;
    }

    if (mode === "nama" && !daftarNama.length) {
      setPesanPopup("Daftar nama wajib diisi.");
      return;
    }

    const topikAcak = acakArray(daftarTopik);

    if (mode === "kelompok") {
      const hasilSpin = daftarKelompok.map((namaKelompok, index) => ({
        kelompok: namaKelompok,
        topik: topikAcak[index % topikAcak.length]
      }));

      setHasil(hasilSpin);
      return;
    }

    const namaAcak = acakArray(daftarNama);

    const hasilSpin = daftarKelompok.map((namaKelompok, index) => ({
      kelompok: namaKelompok,
      nama: namaAcak.filter(
        (_, i) => i % daftarKelompok.length === index
      ),
      topik: topikAcak[index % topikAcak.length]
    }));

    setHasil(hasilSpin);
  }

  function simpanHasil() {
    if (!hasil) return;

    const isi = hasil
      .map(item => {
        const daftarNama = item.nama
          ? `\nNama: ${item.nama.join(", ")}`
          : "";

        return `Kelompok: ${item.kelompok}${daftarNama}\nTopik: ${item.topik}`;
      })
      .join("\n\n");

    const blob = new Blob([isi], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hasil-spin-dysa.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function reset() {
    setHasil(null);
    setKelompok("");
    setNama("");
    setTopik("");
    setDropdown(false);
  }

  function pilihMode(value) {
    setMode(value);
    setDropdown(false);
    setHasil(null);
    setPesanPopup("");
  }

  return (
    <main className="halaman-topik">
      <div className="konten-topik">
        <header className="header-topik">
          <button
            className="tombol-back"
            onClick={() => navigate("/")}
            aria-label="Kembali"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <h1>
            Spin By <span>Dysa</span>
          </h1>

          <button
            className="tombol-home-topik"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v12h14V9" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </button>
        </header>

        <section className="hero-topik">
          <h2>
            Acak <span>Topik</span>
          </h2>
          <p>
            Masukkan data yang diperlukan, lalu tekan tombol spin
            untuk mendapatkan hasilnya.
          </p>
        </section>

        <section className="form-topik">
          <div className="baris-input-topik">
            <div className="label-input-topik">
              <div className="ikon-input-topik">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <strong>Mode</strong>
            </div>

            <div className="dropdown-topik">
              <button
                type="button"
                className={`tombol-dropdown-topik ${dropdown ? "aktif" : ""}`}
                onClick={() => setDropdown(!dropdown)}
              >
                <span>{modeAktif.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={dropdown ? "putar" : ""}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {dropdown && (
                <div className="menu-dropdown-topik">
                  {pilihanMode.map(item => (
                    <button
                      type="button"
                      key={item.value}
                      className={mode === item.value ? "dipilih" : ""}
                      onClick={() => pilihMode(item.value)}
                    >
                      {item.label}

                      {mode === item.value && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5 12 4 4L19 6"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="baris-input-topik">
            <div className="label-input-topik">
              <div className="ikon-input-topik biru">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
              </div>
              <strong>Daftar Kelompok</strong>
            </div>

            <div className="kolom-input-topik">
              <textarea
                value={kelompok}
                onChange={e => setKelompok(e.target.value)}
                placeholder={"Kelompok 1\nKelompok 2\nKelompok 3\nKelompok 4"}
              />
              <small>Masukkan nama kelompok (satu per baris)</small>
            </div>
          </div>

          {mode === "nama" && (
            <div className="baris-input-topik">
              <div className="label-input-topik">
                <div className="ikon-input-topik pink">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <circle cx="17" cy="9" r="3" />
                    <path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 7 0" />
                  </svg>
                </div>
                <strong>Daftar Nama</strong>
              </div>

              <div className="kolom-input-topik">
                <textarea
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  placeholder={"Dhea\nAlya\nRaka\nSalsa\nBimo"}
                />
                <small>Masukkan nama (satu per baris)</small>
              </div>
            </div>
          )}

          <div className="baris-input-topik">
            <div className="label-input-topik">
              <div className="ikon-input-topik pink">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 7h6M9 11h6M9 15h4" />
                </svg>
              </div>
              <strong>Daftar Topik</strong>
            </div>

            <div className="kolom-input-topik">
              <textarea
                value={topik}
                onChange={e => setTopik(e.target.value)}
                placeholder={"Sistem Informasi Manajemen\nBig Data\nCloud Computing\nKeamanan Informasi"}
              />
              <small>Masukkan topik (satu per baris)</small>
            </div>
          </div>
        </section>

        <button className="tombol-spin-topik" onClick={mulaiSpin}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Spin Sekarang
        </button>

        {hasil && (
          <section className="hasil-topik">
            <div className="judul-hasil-topik">
              <h2>Hasil Spin</h2>
              <span>{hasil.length} kelompok</span>
            </div>

            {hasil.map((item, index) => (
              <div className="kartu-hasil-topik" key={index}>
                <div className="isi-hasil-topik">
                  <p>
                    <span>Kelompok</span>
                    <b>{item.kelompok}</b>
                  </p>

                  {mode === "nama" && (
                    <p>
                      <span>Nama</span>
                      <b>{item.nama.join(", ")}</b>
                    </p>
                  )}

                  <p>
                    <span>Topik</span>
                    <b>{item.topik}</b>
                  </p>
                </div>
              </div>
            ))}

            <div className="aksi-topik">
              <button
                className="tombol-simpan-topik"
                onClick={simpanHasil}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Simpan
              </button>

              <button
                className="tombol-spin-lagi"
                onClick={mulaiSpin}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Spin Lagi
              </button>

              <button
                className="tombol-reset-topik"
                onClick={reset}
              >
                Mulai Awal
              </button>
            </div>
          </section>
        )}

        {pesanPopup && (
          <div
            className="overlay-pesan-topik"
            onClick={() => setPesanPopup("")}
          >
            <div
              className="popup-pesan-topik"
              onClick={e => e.stopPropagation()}
            >
              <div className="ikon-pesan-topik">!</div>
              <h3>Oops!</h3>
              <p>{pesanPopup}</p>
              <button onClick={() => setPesanPopup("")}>
                Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AcakTopik;