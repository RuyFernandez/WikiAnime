import React, { useState, useEffect } from "react";
import AnimeList from "../Anime/AnimeList";
import MangaList from "../Manga/MangaList";
import { FiRefreshCw } from "react-icons/fi";
import "../../Styles/Random.css";

export default function Random() {
  const [animes, setAnimes] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const API_BASE_URL = "https://api.jikan.moe/v4";
  const excludedGenre = "Hentai";

  const loadRandomData = async (forceReload = false) => {
    const storedAnimes = localStorage.getItem("randomAnimes");
    const storedMangas = localStorage.getItem("randomMangas");
    const timestamp = localStorage.getItem("randomDataTimestamp");
    const oneHourInMs = 60 * 60 * 1000;

    const isDataValid =
      storedAnimes &&
      storedMangas &&
      timestamp &&
      Date.now() - parseInt(timestamp) < oneHourInMs;

    if (isDataValid && !forceReload) {
      setAnimes(JSON.parse(storedAnimes));
      setMangas(JSON.parse(storedMangas));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchSingleRandom = async (type, index) => {
        await new Promise((resolve) => setTimeout(resolve, index * 350));

        try {
          const response = await fetch(`${API_BASE_URL}/random/${type}`);
          if (!response.ok) {
            throw new Error(`Error al obtener ${type} random`);
          }
          const result = await response.json();
          return result.data;
        } catch (error) {
          console.error(`Error fetching random ${type}:`, error);
          return null;
        }
      };

      const animePromises = Array(5)
        .fill()
        .map((_, index) => fetchSingleRandom("anime", index));
      const animeResults = await Promise.all(animePromises);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const mangaPromises = Array(5)
        .fill()
        .map((_, index) => fetchSingleRandom("manga", index));
      const mangaResults = await Promise.all(mangaPromises);

      const filteredAnimes = animeResults
        .filter((item) => item !== null)
        .filter(
          (anime) =>
            !anime.genres?.some((genre) => genre.name === excludedGenre)
        );

      const filteredMangas = mangaResults
        .filter((item) => item !== null)
        .filter(
          (manga) =>
            !manga.genres?.some((genre) => genre.name === excludedGenre)
        );

      setAnimes(filteredAnimes);
      setMangas(filteredMangas);

      localStorage.setItem("randomAnimes", JSON.stringify(filteredAnimes));
      localStorage.setItem("randomMangas", JSON.stringify(filteredMangas));
      localStorage.setItem("randomDataTimestamp", Date.now().toString());
    } catch (err) {
      setError(err.message || "Error al cargar contenido aleatorio");
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };

  const handleReload = () => {
    setIsReloading(true);
    loadRandomData(true);
  };

  useEffect(() => {
    loadRandomData();
  }, []);

  return (
    <div className="random-container">
      <h2 className="random-title">¡Recomendaciones aleatorias!</h2>

      {loading ? (
        <div className="random-loading">Cargando recomendaciones...</div>
      ) : error ? (
        <div className="random-error">
          {error}. Por favor intenta nuevamente.
        </div>
      ) : (
        <>
          <div className="random-actions">
            <button
              className="random-action-button"
              onClick={() => loadRandomData(true)}
              disabled={isReloading}
            >
              <FiRefreshCw className="random-action-icon" />
              {isReloading
                ? "Actualizando..."
                : "Obtener nuevas recomendaciones"}
            </button>
          </div>

          <div className="random-content">
            <h3>Anime aleatorio</h3>
            <AnimeList animeList={animes} />
          </div>

          <div className="random-content">
            <h3>Manga aleatorio</h3>
            <MangaList mangaList={mangas} />
          </div>
        </>
      )}
    </div>
  );
}
