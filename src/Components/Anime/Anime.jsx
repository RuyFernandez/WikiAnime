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
  const [sortCriteria, setSortCriteria] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [cache, setCache] = useState({});

  const API_BASE_URL = "https://api.jikan.moe/v4";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const genreFilter = queryParams.get("genre");
  const isAnimePage = location.pathname.includes("anime");
  const isMangaPage = location.pathname.includes("manga");

  const getSortParam = (criteria) => {
    if (isMangaPage) {
      switch (criteria) {
        case 'popularity':
          return 'popularity';
        case 'score':
          return 'score';
        case 'title':
          return 'title';
        case 'chapters':
          return 'chapters';
        case 'start_date':
          return 'start_date';
        default:
          return 'popularity';
      }
    } else {
      switch (criteria) {
        case 'popularity':
          return 'popularity';
        case 'score':
          return 'score';
        case 'title':
          return 'title';
        case 'episodes':
          return 'episodes';
        case 'start_date':
          return 'start_date';
        default:
          return 'popularity';
      }
    }
  };

  const animeSearchUrl = searchValue
    ? `${API_BASE_URL}/anime?q=${searchValue}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}`
    : null;
  const mangaSearchUrl = searchValue
    ? `${API_BASE_URL}/manga?q=${searchValue}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}`
    : null;

  const animeGenreUrl =
    genreFilter && isAnimePage
      ? `${API_BASE_URL}/anime?genres=${genreFilter}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=1`
      : null;
  const mangaGenreUrl =
    genreFilter && isMangaPage
      ? `${API_BASE_URL}/manga?genres=${genreFilter}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=1`
      : null;

  const initialAnimeUrl =
    !searchValue && !genreFilter
      ? `${API_BASE_URL}/seasons/now?order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&limit=20`
      : null;
  const initialMangaUrl =
    !searchValue && !genreFilter
      ? `${API_BASE_URL}/top/manga?order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&limit=10`
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

  const sortAnimeList = (list, criteria, order) => {
    if (!list || list.length === 0) return list;

    return list.slice().sort((a, b) => {
      let valueA, valueB;
      switch (criteria) {
        case 'popularity':
          valueA = a.popularity || 0;
          valueB = b.popularity || 0;
          break;
        case 'score':
          valueA = a.score || 0;
          valueB = b.score || 0;
          break;
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          break;
        case 'episodes':
          valueA = a.episodes || 0;
          valueB = b.episodes || 0;
          break;
        case 'chapters':
          valueA = a.chapters || 0;
          valueB = b.chapters || 0;
          break;
        case 'start_date':
          valueA = new Date(a.aired?.from || 0);
          valueB = new Date(b.aired?.from || 0);
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const fetchMoreData = debounce(async () => {
    if (!hasMore || isRequesting) return;

    const cacheKey = `${searchValue || 'initial'}-${genreFilter || 'all'}-${page + 1}`;
    if (cache[cacheKey]) {
      if (isAnimePage) {
        setAnimeList((prev) => [...prev, ...cache[cacheKey]]);
      } else if (isMangaPage) {
        setMangaList((prev) => [...prev, ...cache[cacheKey]]);
      }
      setPage((prev) => prev + 1);
      return;
    }

    setIsRequesting(true);
    const nextPage = page + 1;

    try {
      let url = null;
      if (searchValue) {
        if (isAnimePage) {
          url = `${API_BASE_URL}/anime?q=${searchValue}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/manga?q=${searchValue}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=${nextPage}`;
        }
      } else if (genreFilter) {
        if (isAnimePage) {
          url = `${API_BASE_URL}/anime?genres=${genreFilter}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/manga?genres=${genreFilter}&order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&page=${nextPage}`;
        }
      } else {
        if (isAnimePage) {
          url = `${API_BASE_URL}/seasons/now?order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&limit=20&page=${nextPage}`;
        } else if (isMangaPage) {
          url = `${API_BASE_URL}/top/manga?order_by=${getSortParam(sortCriteria)}&sort=${sortOrder}&limit=10&page=${nextPage}`;
        }
      }

      if (url) {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCache((prev) => ({ ...prev, [cacheKey]: data.data }));
          if (isAnimePage) {
            setAnimeList((prev) => [...prev, ...data.data]);
          } else if (isMangaPage) {
            setMangaList((prev) => [...prev, ...data.data]);
          }
          setHasMore(data.pagination?.has_next_page || false);
          setPage(nextPage);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsRequesting(false);
    }
  }, 300);

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

  useEffect(() => {
    if (animeList.length > 0 && sortCriteria) {
      const sortedList = sortAnimeList(animeList, sortCriteria, sortOrder);
      setAnimeList(sortedList);
    }
  }, [sortCriteria, sortOrder]);

  const showSortOptions = searchValue || genreFilter;

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="anime-container">
      {showSortOptions && (
        <div className="sort-controls">
          <label htmlFor="sortCriteria">Ordenar por:</label>
          <select
            id="sortCriteria"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="popularity">Popularidad</option>
            <option value="score">Puntuación</option>
            <option value="title">Título</option>
            {isMangaPage ? (
              <option value="chapters">Capítulos</option>
            ) : (
              <option value="episodes">Episodios</option>
            )}
            <option value="start_date">Fecha de inicio</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      )}
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
