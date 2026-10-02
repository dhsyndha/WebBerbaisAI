import { useNavigate } from "react-router-dom";
import KartuFitur from "../components/KartuFitur";
import "./Home.css";

function Beranda() {
  const navigate = useNavigate();

  return (
    <main className="beranda">
      <div className="beranda-konten">
        <section className="hero">
          <h1>
            Spin By <span>Dysa</span>
          </h1>

          <p>
            Satu tempat untuk mempermudah
            <br />
            persiapan presentasi kamu.
          </p>

          <div className="garis" />
        </section>

        <section className="fitur">
          <KartuFitur
            judul="Spin Kelompok"
            deskripsi="Acak anggota kelompok secara otomatis."
            warna="cream"
            klik={() => navigate("/spin-kelompok")}
          />

          <KartuFitur
            judul="Cari Judul"
            deskripsi="Dapatkan rekomendasi judul presentasi."
            warna="sangria"
            klik={() => navigate("/cari-judul")}
          />

          <KartuFitur
            judul="Cari Ide Materi"
            deskripsi="Temukan ide materi presentasi."
            warna="cornflower"
            klik={() => navigate("/cari-ide-materi")}
          />

          <KartuFitur
            judul="Acak Topik"
            deskripsi="Bagikan topik secara acak untuk setiap kelompok."
            warna="cream"
            klik={() => navigate("/acak-topik")}
          />

          <KartuFitur
            judul="Buat Pertanyaan"
            deskripsi="Generate pertanyaan dari materi untuk diskusi atau tanya jawab."
            warna="sangria"
             klik={() => navigate("/buat-pertanyaan")}
          />
        </section>
      </div>
    </main>
  );
}

export default Beranda;