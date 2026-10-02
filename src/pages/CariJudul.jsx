import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CariJudul.css";

function CariJudul() {
  const navigate = useNavigate();
  const [materi, setMateri] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [hasil, setHasil] = useState([]);
  const [terbuka, setTerbuka] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [popupPesan, setPopupPesan] = useState("");
  const [pesanSalin, setPesanSalin] = useState(false);

  async function cariJudul() {
    if (!materi.trim()) {
      setPopupPesan("Masukkan materi atau kata kunci terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          materi,
          kataKunci
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mencari judul.");
      }

      setHasil(data.hasil || []);
      setTerbuka(0);
    } catch (error) {
      setPopupPesan(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function salinJudul(judul) {
    try {
      await navigator.clipboard.writeText(judul);
      setPesanSalin(true);

      setTimeout(() => {
        setPesanSalin(false);
      }, 1800);
    } catch {
      setPesanSalin(false);
    }
  }

  function reset() {
    setMateri("");
    setKataKunci("");
    setHasil([]);
    setTerbuka(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function ambilArtikel(item) {
    return item.artikel?.length > 0
      ? item.artikel
      : item.semuaReferensi?.slice(0, 3) || [];
  }

  function ambilWebsite(item) {
    return item.website?.length > 0
      ? item.website
      : item.semuaReferensi?.slice(3, 6) || [];
  }

  function toggleItem(index) {
    setTerbuka(terbuka === index ? -1 : index);
  }

  function bukaPopup(tipe, referensi) {
    setPopup({
      tipe,
      referensi
    });
  }

  return (
    <main className="halaman-judul">
      <div className="konten-judul">
        <header className="header-judul">
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

        <section className="hero-judul">
          <h2>
            Cari <span>Judul</span>
          </h2>

          <p>
            Masukkan materi atau kata kunci,
            <br />
            dan dapatkan rekomendasi judul beserta referensinya.
          </p>
        </section>

        <section className="form-judul">
          <label>Materi / Kata Kunci</label>

          <input
            type="text"
            value={materi}
            onChange={e => setMateri(e.target.value)}
            placeholder="Contoh: Sistem Informasi Manajemen"
          />

          <label>
            Kata kunci tambahan <span>(opsional)</span>
          </label>

          <input
            type="text"
            value={kataKunci}
            onChange={e => setKataKunci(e.target.value)}
            placeholder="Contoh: perusahaan, teknologi, AI"
          />

          <button
            className="tombol-cari"
            onClick={cariJudul}
            disabled={loading}
          >
            <span>
              {loading ? "Sedang Mencari..." : "Cari Judul"}
            </span>

            {!loading && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            )}
          </button>
        </section>

        {hasil.length > 0 && (
          <section className="hasil-judul">
            <div className="judul-section">
              <h2>Hasil Rekomendasi</h2>
              <span>{hasil.length} judul ditemukan</span>
            </div>

            {hasil.map((item, index) => {
              const artikel = ambilArtikel(item);
              const website = ambilWebsite(item);

              return (
                <article className="item-judul" key={index}>
                  <div className="header-item">
                    <div className={`nomor-judul nomor-${index + 1}`}>
                      {index + 1}
                    </div>

                    <button
                      className="isi-item"
                      onClick={() => toggleItem(index)}
                    >
                      <h3>{item.judul}</h3>
                      <p>{item.deskripsi}</p>
                    </button>

                    <button
                      className="tombol-salin"
                      onClick={() => salinJudul(item.judul)}
                      aria-label="Salin judul"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="10"
                          height="10"
                          rx="2"
                        />
                        <path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
                      </svg>
                    </button>

                    <button
                      className="ikon-buka"
                      onClick={() => toggleItem(index)}
                      aria-label={
                        terbuka === index ? "Tutup" : "Buka"
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {terbuka === index ? (
                          <path d="m18 15-6-6-6 6" />
                        ) : (
                          <path d="m6 9 6 6 6-6" />
                        )}
                      </svg>
                    </button>
                  </div>

                  {terbuka === index && (
                    <div className="detail-item">
                      <button
                        className="bagian-referensi"
                        onClick={() =>
                          bukaPopup("Artikel Terkait", artikel)
                        }
                      >
                        <div className="judul-referensi">
                          <span className="ikon-referensi">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="2"
                              />
                              <path d="M8 8h8M8 12h8M8 16h5" />
                            </svg>
                          </span>
                          <h4>Artikel Terkait</h4>
                        </div>

                        <div className="preview-referensi">
                          {artikel.slice(0, 3).map((referensi, i) => (
                            <p key={i}>
                              <span>•</span>
                              {referensi.nama}
                            </p>
                          ))}
                        </div>

                        <small>Lihat semua referensi</small>
                      </button>

                      <button
                        className="bagian-referensi"
                        onClick={() =>
                          bukaPopup("Website Referensi", website)
                        }
                      >
                        <div className="judul-referensi">
                          <span className="ikon-referensi">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                              <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
                            </svg>
                          </span>
                          <h4>Website Referensi</h4>
                        </div>

                        <div className="preview-referensi">
                          {website.slice(0, 3).map((referensi, i) => (
                            <p key={i}>
                              <span>•</span>
                              {referensi.nama}
                            </p>
                          ))}
                        </div>

                        <small>Lihat semua referensi</small>
                      </button>
                    </div>
                  )}
                </article>
              );
            })}

            <button
              className="tombol-reset-judul"
              onClick={reset}
            >
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
              <span>Cari Judul Lain</span>
            </button>
          </section>
        )}
      </div>

      {popup && (
        <div
          className="overlay-referensi"
          onClick={() => setPopup(null)}
        >
          <div
            className="popup-referensi"
            onClick={e => e.stopPropagation()}
          >
            <div className="header-popup-referensi">
              <div>
                <span className="label-popup">REFERENSI</span>
                <h3>{popup.tipe}</h3>
              </div>

              <button
                className="tutup-popup"
                onClick={() => setPopup(null)}
                aria-label="Tutup"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="isi-popup-referensi">
              {popup.referensi.length > 0 ? (
                popup.referensi.map((referensi, index) => (
                  <a
                    href={referensi.url}
                    target="_blank"
                    rel="noreferrer"
                    className="item-popup-referensi"
                    key={index}
                  >
                    <span className="nomor-popup">
                      {index + 1}
                    </span>

                    <div>
                      <strong>{referensi.nama}</strong>

                      {referensi.deskripsi && (
                        <p>{referensi.deskripsi}</p>
                      )}
                    </div>

                    <svg
                      className="panah-popup"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </a>
                ))
              ) : (
                <p className="tidak-ada-popup">
                  Tidak ada referensi ditemukan.
                </p>
              )}
            </div>

            <button
              className="tombol-tutup-popup"
              onClick={() => setPopup(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {popupPesan && (
        <div
          className="overlay-pesan-judul"
          onClick={() => setPopupPesan("")}
        >
          <div
            className="popup-pesan-judul"
            onClick={e => e.stopPropagation()}
          >
            <div className="ikon-pesan-judul">!</div>
            <h3>Oops!</h3>
            <p>{popupPesan}</p>
            <button onClick={() => setPopupPesan("")}>
              Oke
            </button>
          </div>
        </div>
      )}

      {pesanSalin && (
        <div className="popup-salin">
          <div className="ikon-popup-salin">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>
          <span>Berhasil disalin!</span>
        </div>
      )}
    </main>
  );
}

export default CariJudul;