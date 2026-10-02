import { useLocation, useNavigate } from "react-router-dom";
import "./HasilKelompok.css";

function HasilKelompok() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <main className="halaman-hasil">
        <div className="konten-hasil kosong">
          <h2>Belum ada hasil</h2>
          <button onClick={() => navigate("/spin-kelompok")}>
            Mulai Spin
          </button>
        </div>
      </main>
    );
  }

  const { hasil, totalPeserta } = state;

  function spinUlang() {
    const semuaPeserta = hasil.flat();
    const acak = [...semuaPeserta].sort(() => Math.random() - 0.5);
    const kelompokBaru = Array.from(
      { length: hasil.length },
      () => []
    );

    acak.forEach((nama, index) => {
      kelompokBaru[index % hasil.length].push(nama);
    });

    navigate("/hasil-kelompok", {
      replace: true,
      state: {
        hasil: kelompokBaru,
        totalPeserta
      }
    });
  }

  function simpanHasil() {
    let isi = "HASIL SPIN BY DYSA\n\n";

    hasil.forEach((kelompok, index) => {
      isi += `Kelompok ${index + 1}\n`;

      kelompok.forEach((nama, i) => {
        isi += `${i + 1}. ${nama}\n`;
      });

      isi += "\n";
    });

    const file = new Blob([isi], {
      type: "text/plain;charset=utf-8"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "hasil-spin-dysa.txt";
    link.click();

    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="halaman-hasil">
      <div className="konten-hasil">
        <div className="hasil-gambar">
          <header className="header-hasil">
            <button
              className="tombol-kembali-hasil"
              onClick={() => navigate("/spin-kelompok")}
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
              className="tombol-home-hasil"
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

          <section className="judul-hasil">
            <div className="ikon-sukses">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <h2>Pembagian Kelompok Selesai!</h2>
            <p>Berikut hasil pembagian kelompok secara acak.</p>
          </section>

          <section className="ringkasan">
            <div>
              <span>Total Peserta</span>
              <strong>{totalPeserta}</strong>
              <small>orang</small>
            </div>

            <div className="garis-ringkasan"></div>

            <div>
              <span>Jumlah Kelompok</span>
              <strong>{hasil.length}</strong>
              <small>kelompok</small>
            </div>
          </section>

          <section className="daftar-hasil">
            {hasil.map((kelompok, index) => (
              <div className="kartu-kelompok" key={index}>
                <div className="nomor-kelompok">
                  {index + 1}
                </div>

                <div className="isi-kelompok">
                  <div className="judul-kelompok">
                    <h3>Kelompok {index + 1}</h3>
                    <span>{kelompok.length} orang</span>
                  </div>

                  {kelompok.map((nama, i) => (
                    <div className="nama-anggota" key={i}>
                      <b>{i + 1}</b>
                      <p>{nama}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="aksi-hasil">
          <button onClick={simpanHasil}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Simpan Hasil
          </button>

          <button onClick={spinUlang}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Spin Ulang
          </button>
        </div>
      </div>
    </main>
  );
}

export default HasilKelompok;