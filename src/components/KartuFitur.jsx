function KartuFitur({ judul, deskripsi, warna, klik }) {
  return (
    <div onClick={klik} className={`kartu-fitur ${warna}`} >
      <div>
        <h2>{judul}</h2>
        <p>{deskripsi}</p>
      </div>

      <div className="panah">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M13 6l6 6-6 6"
          />
        </svg>
      </div>
    </div>
  );
}

export default KartuFitur;