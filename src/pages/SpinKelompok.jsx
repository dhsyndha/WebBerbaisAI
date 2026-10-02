import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpinKelompok.css";

function SpinKelompok() {
  const navigate = useNavigate();
  const [peserta, setPeserta] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [pesan, setPesan] = useState("");

  const jumlahPeserta = peserta
    .split("\n")
    .map(nama => nama.trim())
    .filter(nama => nama !== "").length;

  function mulaiSpin() {
    const daftar = peserta
      .split("\n")
      .map(nama => nama.trim())
      .filter(nama => nama !== "");

    const jumlahKelompok = Number(jumlah);

    if (daftar.length === 0) {
      setPesan("Masukkan daftar peserta terlebih dahulu.");
      return;
    }

    if (!jumlahKelompok || jumlahKelompok < 1) {
      setPesan("Masukkan jumlah kelompok.");
      return;
    }

    if (jumlahKelompok > daftar.length) {
      setPesan("Jumlah kelompok tidak boleh lebih banyak dari peserta.");
      return;
    }

    const acak = [...daftar].sort(() => Math.random() - 0.5);
    const kelompok = Array.from(
      { length: jumlahKelompok },
      () => []
    );

    acak.forEach((nama, index) => {
      kelompok[index % jumlahKelompok].push(nama);
    });

    navigate("/hasil-kelompok", {
      state: {
        hasil: kelompok,
        totalPeserta: daftar.length
      }
    });
  }

  function reset() {
    setPeserta("");
    setJumlah("");
    setPesan("");
  }

  return (
    <main className="halaman-spin">
      <div className="konten-spin">
        <header className="header-spin">
          <button
            type="button"
            className="tombol-kembali"
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
            type="button"
            className="tombol-home"
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

        <section className="judul-spin">
          <h2>
            Spin <span>Kelompok</span>
          </h2>
          <p>
            Masukkan daftar peserta, tentukan jumlah
            <br />
            kelompok, dan biarkan sistem membaginya
            <br />
            secara acak.
          </p>
        </section>

        <section className="kotak-spin">
          <div className="judul-input">
            <h3>Daftar Peserta</h3>
            <span>{jumlahPeserta} orang</span>
          </div>

          <textarea
            value={peserta}
            onChange={e => setPeserta(e.target.value)}
            placeholder={`Masukkan nama peserta (1 baris 1 nama)

Contoh:
Andi
Budi
Citra
Dewi`}
          />
        </section>

        <section className="kotak-spin">
          <h3>Jumlah Kelompok</h3>

          <input
            type="number"
            min="1"
            value={jumlah}
            onChange={e => setJumlah(e.target.value)}
            placeholder="Contoh: 3"
          />
        </section>

        <div className="aksi-spin">
          <button
            type="button"
            className="tombol-mulai"
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
            Spin Sekarang
          </button>

          <button
            type="button"
            className="tombol-reset"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </div>

      {pesan && (
        <div className="overlay-popup">
          <div className="popup">
            <div className="popup-ikon">!</div>

            <h3>Oops!</h3>

            <p>{pesan}</p>

            <button
              type="button"
              onClick={() => setPesan("")}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default SpinKelompok;