import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { FaStar, FaCalendar, FaClock, FaGlobe, FaTag, FaTv, FaChartLine } from "react-icons/fa";
import "../../../src/Styles/Details.css";

export default function Detail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const API_BASE_URL = "https://api.jikan.moe/v4";

  const {
    data: apiData,
    loading,
    error,
  } = useFetch(`${API_BASE_URL}/${type}/${id}/full`);

  useEffect(() => {
    if (apiData) {
      console.log(apiData);
      setData(apiData.data);
    }
  }, [apiData]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading">Cargando detalles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="details-container">
        <div className="error-message">
          No se encontró información para este título.
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="details-image-container">
          <img
            src={
              data.images?.jpg?.large_image_url || data.images?.jpg?.image_url
            }
            alt={data.title}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <h1 className="details-title">{data.title}</h1>
          {data.title_japanese && (
            <h2 className="details-japanese-title">{data.title_japanese}</h2>
          )}

          <div className="details-meta">
            {data.score && (
              <div className="details-meta-item">
                <FaStar className="details-meta-icon" />
                <span>{data.score}</span>
              </div>
            )}

            {data.type && (
              <div className="details-meta-item">
                <FaTag className="details-meta-icon" />
                <span>{data.type}</span>
              </div>
            )}

            {data.episodes && (
              <div className="details-meta-item">
                <FaClock className="details-meta-icon" />
                <span>{data.episodes} episodios</span>
              </div>
            )}

            {data.rating && (
              <div className="details-meta-item">
                <FaStar className="details-meta-icon" />
                <span>{data.rating}</span>
              </div>
            )}

            {data.aired?.string && (
              <div className="details-meta-item">
                <FaCalendar className="details-meta-icon" />
                <span>{data.aired.string}</span>
              </div>
            )}

            {data.broadcast?.string && (
              <div className="details-meta-item">
                <FaTv className="details-meta-icon" />
                <span>{data.broadcast.string}</span>
              </div>
            )}

            {data.popularity && (
              <div className="details-meta-item">
                <FaChartLine className="details-meta-icon" />
                <span>#{data.popularity}</span>
              </div>
            )}
            {data.status && (
              <div className="details-meta-item">
                <FaGlobe className="details-meta-icon" />
                <span>{data.status}</span>
              </div>
            )}
          </div>

          {data.synopsis && (
            <div className="details-synopsis">
              <p>{data.synopsis}</p>
            </div>
          )}

          {data.background && (
            <div className="details-section">
              <h3 className="details-section-title">Información adicional</h3>
              <p>{data.background}</p>
            </div>
          )}

          {data.genres && data.genres.length > 0 && (
            <div className="details-section">
              <h3 className="details-section-title">Géneros</h3>
              <div className="details-genres">
                {data.genres.map((genre) => (
                  <span key={genre.mal_id} className="details-genre">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {type === "manga" && (
            <>
              {data.chapters && (
                <div className="details-meta-item">
                  <span>Capítulos: {data.chapters}</span>
                </div>
              )}
              {data.volumes && (
                <div className="details-meta-item">
                  <span>Volúmenes: {data.volumes}</span>
                </div>
              )}
              {data.authors && data.authors.length > 0 && (
                <div className="details-section">
                  <h3 className="details-section-title">Autores</h3>
                  <ul>
                    {data.authors.map((author) => (
                      <li key={author.mal_id}>{author.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.publishers && data.publishers.length > 0 && (
                <div className="details-section">
                  <h3 className="details-section-title">Editorial</h3>
                  <div className="details-publishers">
                    {data.publishers.map((publisher) => (
                      <span
                        key={publisher.mal_id}
                        className="details-publisher"
                      >
                        {publisher.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {type === "anime" && (
            <>
              {data.studios && data.studios.length > 0 && (
                <div className="details-section">
                  <h3 className="details-section-title">
                    Estudio de producción
                  </h3>
                  <div className="details-studios">
                    {data.studios.map((studio) => (
                      <span key={studio.mal_id} className="details-studio">
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.trailer && data.trailer.embed_url && (
                <div>
                  <h3 className="details-section-title">Tráiler</h3>
                  <iframe
                    src={data.trailer.embed_url}
                    title="Tráiler"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="details-trailer"
                  />
                </div>
              )}
            </>
          )}

          {data.url && (
            <div className="details-section">
              <h3 className="details-section-title">Enlace oficial</h3>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="details-link"
              >
                Visitar página oficial
              </a>
            </div>
          )}
        </div>
      </div>
      <button onClick={() => navigate(-1)} className="details-button">
        Volver
      </button>
    </div>
  );
}
