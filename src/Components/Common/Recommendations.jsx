import React, { useState, useEffect } from "react";
import AnimeList from "../Anime/AnimeList";
import MangaList from "../Manga/MangaList";
import useFetch from "../../hooks/useFetch";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "../../Styles/Anime.css";


export default function Recommendations() {
  const [animeRecommendations, setAnimeRecommendations] = useState([]);
  const [mangaRecommendations, setMangaRecommendations] = useState([]);
  const API_BASE_URL = "https://api.jikan.moe/v4";
  const LIMIT = 5;

  const {
    data: animeData,
    loading: animeLoading,
    error: animeError,
  } = useFetch(`${API_BASE_URL}/recommendations/anime`);

  const {
    data: mangaData,
    loading: mangaLoading,
    error: mangaError,
  } = useFetch(`${API_BASE_URL}/recommendations/manga`);

  useEffect(() => {
    if (animeData) {
      const processedData = animeData.data
        .slice(0, LIMIT)
        .map((rec) => rec.entry[0]);
      setAnimeRecommendations(processedData);
    }
  }, [animeData]);

  useEffect(() => {
    if (mangaData) {
      const processedData = mangaData.data
        .slice(0, LIMIT)
        .map((rec) => rec.entry[0]);
      setMangaRecommendations(processedData);
    }
  }, [mangaData]);

  const loading = animeLoading || mangaLoading;
  const error = animeError || mangaError;

  if (loading) return (
    <div className="recommendations-loading">
      <AiOutlineLoading3Quarters className="loading-icon spin" />
      <p>Cargando recomendaciones...</p>
    </div>
  );
  
  if (error) return (
    <div className="recommendations-error">
      <BiErrorCircle className="error-icon" />
      <p>{error}</p>
      <p>Por favor, intenta nuevamente más tarde.</p>
    </div>
  );

  return (
    <div className="recommendations-container">
      <div className="recommendations-section">
        <h2 className="h2">Top 5 Recomendaciones de Anime</h2>
        <AnimeList animeList={animeRecommendations} />
      </div>
      
      <div className="recommendations-section">
        <h2 className="h2">Top 5 Recomendaciones de Manga</h2>
        <MangaList mangaList={mangaRecommendations} />
      </div>
    </div>
  );
}
