import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";

export default function MangaList({ mangaList = [] }) {
  return (
    <div className="list">
      {mangaList.length > 0 ? (
        mangaList.map((manga, index) => (
          <div key={`${manga.mal_id}-${index}`} className="list-container">
            <h3>{manga.title}</h3>
            <Link to={`/manga/${manga.mal_id}`}>
              {manga.score && (
                <div className="list-score">
                  <BsStarFill style={{ marginRight: '2px' }} /> {manga.score.toFixed(1)}
                </div>
              )}
              <div className="card-image">
                {manga.images?.jpg?.image_url && (
                  <img
                    src={manga.images.jpg.image_url}
                    alt={manga.title}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="genres">
                {manga.genres && manga.genres.length > 0 && (
                  <div>
                    {manga.genres.map((genre) => (
                      <p key={genre.name}>{genre.name}</p>
                    ))}
                  </div>
                )}
              </div>
              {(manga.type || manga.chapters) && (
                <div className="list-info">
                  <span>{manga.type || "Manga"}</span>
                  <span>{manga.chapters ? `${manga.chapters} capítulos` : "En publicación"}</span>
                </div>
              )}
            </Link>
          </div>
        ))
      ) : (
        <div className="list-empty-message">
          <p>No hay mangas disponibles.</p>
        </div>
      )}
    </div>
  );
}
