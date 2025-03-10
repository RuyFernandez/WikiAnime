import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";

export default function AnimeList({ animeList = [] }) {
  return (
    <div className="list">
      {animeList.length > 0 ? (
        animeList.map((anime, index) => (
          <div key={`${anime.mal_id}-${index}`} className="list-container">
            <h3>{anime.title}</h3>
            <Link to={`/anime/${anime.mal_id}`}>
              {anime.score && (
                <div className="list-score">
                  <BsStarFill style={{ marginRight: '2px' }} /> {anime.score.toFixed(1)}
                </div>
              )}
              <div className="card-image">
                {anime.images?.jpg?.image_url && (
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="genres">
                {anime.genres && anime.genres.length > 0 && (
                  <div>
                    {anime.genres.map((genre) => (
                      <p key={genre.name}>{genre.name}</p>
                    ))}
                  </div>
                )}
              </div>
              {(anime.type || anime.episodes) && (
                <div className="list-info">
                  <span>{anime.type || "TV"}</span>
                  <span>{anime.episodes ? `${anime.episodes} episodios` : "En emisión"}</span>
                </div>
              )}
            </Link>
          </div>
        ))
      ) : (
        <div className="list-empty-message">
          <p>No hay animes disponibles.</p>
        </div>
      )}
    </div>
  );
}
