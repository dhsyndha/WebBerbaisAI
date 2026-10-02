import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpinKelompok from "./pages/SpinKelompok";
import HasilKelompok from "./pages/HasilKelompok";
import CariJudul from "./pages/CariJudul";
import CariIdeMateri from "./pages/CariIdeMateri";
import AcakTopik from "./pages/AcakTopik";
import BuatPertanyaan from "./pages/BuatPertanyaan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spin-kelompok" element={<SpinKelompok />} />
        <Route path="/hasil-kelompok" element={<HasilKelompok />} />
        <Route path="/cari-judul" element={<CariJudul />} />
        <Route path="/cari-ide-materi" element={<CariIdeMateri />} />
        <Route path="/acak-topik" element={<AcakTopik />} />
        <Route path="/buat-pertanyaan" element={<BuatPertanyaan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;