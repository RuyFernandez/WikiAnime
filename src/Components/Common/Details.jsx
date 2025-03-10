import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { FaStar, FaCalendar, FaClock, FaGlobe } from "react-icons/fa";
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
  } = useFetch(`${API_BASE_URL}/${type}/${id}`);

  useEffect(() => {
    if (apiData) {
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
        <div className="error-message">No se encontró información para este título.</div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="details-image-container">
          <img 
            src={data.images?.jpg?.large_image_url || data.images?.jpg?.image_url} 
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
            
            {data.aired?.from && (
              <div className="details-meta-item">
                <FaCalendar className="details-meta-icon" />
                <span>{new Date(data.aired.from).getFullYear()}</span>
              </div>
            )}
            
            {data.episodes && (
              <div className="details-meta-item">
                <FaClock className="details-meta-icon" />
                <span>{data.episodes} episodios</span>
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
        </div>
      </div>
      <button onClick={() => navigate(-1)} className="details-button">Volver</button>
    </div>
  );
}
