import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CariIdeMateri.css";

function CariIdeMateri() {
  const navigate = useNavigate();
  const [materi, setMateri] = useState("");
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [tabPopup, setTabPopup] = useState("youtube");
  const [pesanPopup, setPesanPopup] = useState("");

  async function cariIde() {
    if (!materi.trim()) {
      setPesanPopup("Masukkan topik atau mata kuliah terlebih dahulu.");
      return;
    }

    setLoading(true);
    setHasil([]);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          materi: materi.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mencari ide.");
      }

      setHasil(data.hasil || []);
    } catch (error) {
      setPesanPopup(error.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMateri("");
    setHasil([]);
    setPopup(null);
    setTabPopup("youtube");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function bukaReferensi(item) {
    setPopup({
      judul: item.judul,
      deskripsi: item.deskripsi,
      youtube: item.youtube || [],
      artikel: item.artikel || [],
      website: item.website || []
    });
    setTabPopup("youtube");
  }

  function dataPopup() {
    if (!popup) return [];
    if (tabPopup === "youtube") return popup.youtube;
    if (tabPopup === "artikel") return popup.artikel;
    return popup.website;
  }

  function judulPopup() {
    if (tabPopup === "youtube") return "Referensi Video YouTube";
    if (tabPopup === "artikel") return "Artikel Referensi";
    return "Website Referensi";
  }

  return (
    <main className="halaman-ide">
      <div className="konten-ide">
        <header className="header-ide">
          <button
            className="tombol-back-ide"
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
            className="tombol-home-ide"
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

        <section className="hero-ide">
          <h2>
            Cari <span>Ide Materi</span>
          </h2>
          <p>
            Dapatkan ide materi menarik sesuai dengan
            <br />
            mata kuliah atau topik yang kamu inginkan,
            <br />
            beserta referensi lengkapnya.
          </p>
        </section>

        <section className="form-ide">
          <label>Masukkan topik atau mata kuliah</label>

          <div className="input-ide">
            <svg
              className="ikon-search-ide"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              value={materi}
              onChange={e => setMateri(e.target.value)}
              placeholder="Contoh: Sistem Informasi Manajemen"
              onKeyDown={e => {
                if (e.key === "Enter") cariIde();
              }}
            />

            {materi && (
              <button
                className="hapus-input-ide"
                onClick={() => setMateri("")}
                aria-label="Hapus"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>

          <button
            className="tombol-cari-ide"
            onClick={cariIde}
            disabled={loading}
          >
            <span>{loading ? "Sedang Mencari..." : "Cari Ide"}</span>

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
          <section className="hasil-ide">
            <div className="judul-hasil-ide">
              <h2>Hasil Ide Materi</h2>
              <span>{hasil.length} ide ditemukan</span>
            </div>

            {hasil.map((item, index) => (
              <article className="kartu-ide" key={index}>
                <div className="nomor-ide">{index + 1}</div>

                <div className="isi-ide">
                  <h3>{item.judul}</h3>
                  <p>{item.deskripsi}</p>

                  {item.tag?.length > 0 && (
                    <div className="tag-ide">
                      {item.tag.map((tag, i) => (
                        <span key={i}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="referensi-ide"
                  onClick={() => bukaReferensi(item)}
                >
                  <div className="referensi-judul">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
                    </svg>
                    <strong>Referensi</strong>
                  </div>

                  <div className="jumlah-referensi-ide">
                    <span>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 15l5-3-5-3v6z" />
                        <path d="M21 7.2a2.7 2.7 0 0 0-1.9-1.9C17.4 5 12 5 12 5s-5.4 0-7.1.3A2.7 2.7 0 0 0 3 7.2 28 28 0 0 0 2.7 12 28 28 0 0 0 3 16.8a2.7 2.7 0 0 0 1.9 1.9C6.6 19 12 19 12 19s5.4 0 7.1-.3a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .3-4.8 28 28 0 0 0-.3-4.8z" />
                      </svg>
                      {item.youtube?.length || 0} video
                    </span>

                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2h9l3 3v17H6z" />
                        <path d="M14 2v4h4" />
                        <path d="M9 12h6M9 16h6" />
                      </svg>
                      {item.artikel?.length || 0} artikel
                    </span>

                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
                      </svg>
                      {item.website?.length || 0} website
                    </span>
                  </div>

                  <svg className="panah-ide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </article>
            ))}

            <button className="tombol-ide-lain" onClick={reset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Cari Ide Lain
            </button>
          </section>
        )}
      </div>

      {pesanPopup && (
        <div className="overlay-pesan-ide" onClick={() => setPesanPopup("")}>
          <div className="popup-pesan-ide" onClick={e => e.stopPropagation()}>
            <div className="ikon-pesan-ide">!</div>
            <h3>Oops!</h3>
            <p>{pesanPopup}</p>
            <button onClick={() => setPesanPopup("")}>Mengerti</button>
          </div>
        </div>
      )}

      {popup && (
        <div className="overlay-ide" onClick={() => setPopup(null)}>
          <div className="popup-ide" onClick={e => e.stopPropagation()}>
            <div className="header-popup-ide">
              <div>
                <span>REFERENSI</span>
                <h3>{popup.judul}</h3>
                <p>{popup.deskripsi}</p>
              </div>

              <button onClick={() => setPopup(null)} aria-label="Tutup">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="tab-popup-ide">
              <button className={tabPopup === "youtube" ? "aktif" : ""} onClick={() => setTabPopup("youtube")}>
                YouTube ({popup.youtube.length})
              </button>
              <button className={tabPopup === "artikel" ? "aktif" : ""} onClick={() => setTabPopup("artikel")}>
                Artikel ({popup.artikel.length})
              </button>
              <button className={tabPopup === "website" ? "aktif" : ""} onClick={() => setTabPopup("website")}>
                Website ({popup.website.length})
              </button>
            </div>

            <div className="judul-popup-ide">
              <h4>{judulPopup()}</h4>
              <span>{dataPopup().length} sumber</span>
            </div>

            <div className="isi-popup-ide">
              {dataPopup().length > 0 ? (
                dataPopup().map((referensi, index) => (
                  <a
                    href={referensi.url}
                    target="_blank"
                    rel="noreferrer"
                    className="item-popup-ide"
                    key={index}
                  >
                    <b>{index + 1}</b>
                    <div>
                      <strong>{referensi.nama}</strong>
                      {referensi.deskripsi && <p>{referensi.deskripsi}</p>}
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 5h5v5" />
                      <path d="M10 14 19 5" />
                      <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
                    </svg>
                  </a>
                ))
              ) : (
                <p className="referensi-kosong">Tidak ada referensi ditemukan.</p>
              )}
            </div>

            <button className="tombol-tutup-ide" onClick={() => setPopup(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default CariIdeMateri;