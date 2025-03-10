import { Link } from "react-router-dom";
import '../../Styles/Filter.css'

const genresList = [
  { name: "Acción", value: "1" },
  { name: "Aventura", value: "2" },
  { name: "Carreras", value: "3" },
  { name: "Comedia", value: "4" },
  { name: "Avant Garde", value: "5" },
  { name: "Demonios", value: "6" },
  { name: "Misterio", value: "7" },
  { name: "Drama", value: "8" },
  { name: "Ecchi", value: "9" },
  { name: "Fantasía", value: "10" },
  { name: "Juegos", value: "11" },
  { name: "Hentai", value: "12" },
  { name: "Histórico", value: "13" },
  { name: "Terror", value: "14" },
  { name: "Niños", value: "15" },
  { name: "Artes Marciales", value: "17" },
  { name: "Mecha", value: "18" },
  { name: "Música", value: "19" },
  { name: "Parodia", value: "20" },
  { name: "Samurái", value: "21" },
  { name: "Romance", value: "22" },
  { name: "Escolar", value: "23" },
  { name: "Ciencia Ficción", value: "24" },
  { name: "Shoujo", value: "25" },
  { name: "Shoujo Ai", value: "26" },
  { name: "Shounen", value: "27" },
  { name: "Shounen Ai", value: "28" },
  { name: "Espacial", value: "29" },
  { name: "Deportes", value: "30" },
  { name: "Superpoderes", value: "31" },
  { name: "Vampiro", value: "32" },
  { name: "Harem", value: "35" },
  { name: "Slice of Life", value: "36" },
  { name: "Sobrenatural", value: "37" },
  { name: "Militar", value: "38" },
  { name: "Policía", value: "39" },
  { name: "Psicológico", value: "40" },
];

export default function MangaFilter() {
  return (
    <div className="filter">
      <h3 className="filter-title">Géneros</h3>
      <ul className="filter-list">
        {genresList.map((genre) => (
          <li key={genre.value} className="filter-item">
            <Link to={`/manga?genre=${genre.value}`} className="filter-link">{genre.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
