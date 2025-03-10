import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimeList from "./AnimeList";
import MangaList from "../Manga/MangaList";
import Scroll from "../Layout/Scroll";
import useFetch from "../../hooks/useFetch";
import "../../Styles/Anime.css";
import "../../Styles/List.css";

export default function JikanSearch({ searchValue }) {
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const API_BASE_URL = "https://api.jikan.moe/v4";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const genreFilter = queryParams.get("genre");
  const isAnimePage = location.pathname.includes("anime");
  const isMangaPage = location.pathname.includes("manga");

  const animeSearchUrl = searchValue
    ? `${API_BASE_URL}/anime?q=${searchValue}`
    : null;
  const mangaSearchUrl = searchValue
    ? `${API_BASE_URL}/manga?q=${searchValue}`
    : null;

  const animeGenreUrl =
    genreFilter && isAnimePage
      ? `${API_BASE_URL}/anime?genres=${genreFilter}&page=1`
      : null;
  const mangaGenreUrl =
    genreFilter && isMangaPage
      ? `${API_BASE_URL}/manga?genres=${genreFilter}&page=1`
      : null;

  const {
    data: animeData,
    loading: animeLoading,
    error: animeError,
  } = useFetch(animeSearchUrl);
  const {
    data: mangaData,
    loading: mangaLoading,
    error: mangaError,
  } = useFetch(mangaSearchUrl);

  const {
    data: animeGenreData,
    loading: animeGenreLoading,
    error: animeGenreError,
  } = useFetch(animeGenreUrl);
  const {
    data: mangaGenreData,
    loading: mangaGenreLoading,
    error: mangaGenreError,
  } = useFetch(mangaGenreUrl);

  const initialAnimeUrl =
    !searchValue && !genreFilter
      ? `${API_BASE_URL}/seasons/now?&limit=20`
      : null;
  const initialMangaUrl =
    !searchValue && !genreFilter ? `${API_BASE_URL}/top/manga?&limit=10` : null;

  const {
    data: initialAnimeData,
    loading: initialAnimeLoading,
    error: initialAnimeError,
  } = useFetch(initialAnimeUrl);
  const {
    data: initialMangaData,
    loading: initialMangaLoading,
    error: initialMangaError,
  } = useFetch(initialMangaUrl);

  useEffect(() => {
    if (animeData) {
      setAnimeList(animeData.data);
    }
    if (mangaData) {
      setMangaList(mangaData.data);
    }

    setLoading(animeLoading || mangaLoading);

    if (animeError || mangaError) {
      setError(animeError || mangaError);
    }
  }, [
    animeData,
    mangaData,
    animeLoading,
    mangaLoading,
    animeError,
    mangaError,
  ]);

  useEffect(() => {
    if (searchValue || genreFilter) return;

    if (initialAnimeData) {
      setAnimeList(initialAnimeData.data);
    }

    if (initialMangaData) {
      setMangaList(initialMangaData.data);
    }

    setLoading(initialAnimeLoading || initialMangaLoading);

    if (initialAnimeError || initialMangaError) {
      setError(initialAnimeError || initialMangaError);
    }
  }, [
    searchValue,
    genreFilter,
    initialAnimeData,
    initialMangaData,
    initialAnimeLoading,
    initialMangaLoading,
    initialAnimeError,
    initialMangaError,
  ]);

  useEffect(() => {
    if (!genreFilter) return;

    setPage(1);

    if (animeGenreData && isAnimePage) {
      setAnimeList(animeGenreData.data);
      setMangaList([]);
      setHasMore(animeGenreData.pagination?.has_next_page || false);
      setLoading(false);
    }

    if (mangaGenreData && isMangaPage) {
      setMangaList(mangaGenreData.data);
      setAnimeList([]);
      setHasMore(mangaGenreData.pagination?.has_next_page || false);
      setLoading(false);
    }

    if (animeGenreError || mangaGenreError) {
      setError(animeGenreError || mangaGenreError);
      setLoading(false);
    }
  }, [
    genreFilter,
    isAnimePage,
    isMangaPage,
    animeGenreData,
    mangaGenreData,
    animeGenreError,
    mangaGenreError,
  ]);

  const fetchMoreData = async () => {
    if (!hasMore || isRequesting) return;

    console.log("Fetching more data, page:", page + 1);
    setIsRequesting(true);

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      let url = null;

      if (searchValue) {
        if (isAnimePage) {
          url = `${API_BASE_URL}/anime?q=${searchValue}&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/manga?q=${searchValue}&page=${nextPage}`;
        }
      } else if (genreFilter) {
        if (isAnimePage) {
          url = `${API_BASE_URL}/anime?genres=${genreFilter}&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/manga?genres=${genreFilter}&page=${nextPage}`;
        }
      } else {
        if (isAnimePage) {
          url = `${API_BASE_URL}/seasons/now?&limit=20&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/top/manga?&limit=10&page=${nextPage}`;
        }
      }

      if (url) {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          if (isAnimePage) {
            setAnimeList((prev) => [...prev, ...data.data]);
          } else if (isMangaPage) {
            setMangaList((prev) => [...prev, ...data.data]);
          }

          setHasMore(data.pagination?.has_next_page || false);
          console.log("Has more:", data.pagination?.has_next_page);
        } else {
          console.error("Error en la respuesta:", response.status);
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
      setError(error.message);
      setHasMore(false);
    } finally {
      setTimeout(() => {
        setIsRequesting(false);
      }, 1000);
    }
  };

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Scroll onLoadMore={fetchMoreData} hasMore={hasMore}>
        {animeList.length > 0 && (
          <section>
            <h2 className="h2">Anime</h2>
            <AnimeList animeList={animeList} />
          </section>
        )}
        {mangaList.length > 0 && (
          <section>
            <h2 className="h2">Manga</h2>
            <MangaList mangaList={mangaList} />
          </section>
        )}
      </Scroll>
    </div>
  );
}
