import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Layout/Header.jsx";
import JikanSearch from "./Components/Anime/Anime.jsx";
import AnimeFilter from "./Components/Anime/AnimeFilter.jsx";
import MangaFilter from "./Components/Manga/MangaFilter.jsx";
import Random from "./Components/Common/Random.jsx";
import Recommendations from "./Components/Common/Recommendations.jsx";
import Detail from "./Components/Common/Details.jsx";
import BackToTop from "./Components/Layout/BackToTop.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";


export default function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <ThemeProvider>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <Routes>
        <Route path="/" element={<JikanSearch searchValue={searchValue} />} />

        <Route path="/anime/filter" element={<AnimeFilter />} />
        <Route path="/manga/filter" element={<MangaFilter />} />

        <Route path="/anime/:id" element={<Detail type="anime" />} />
        <Route path="/manga/:id" element={<Detail type="manga" />} />

        <Route
          path="/anime"
          element={<JikanSearch searchValue={searchValue} />}
        />
        <Route
          path="/manga"
          element={<JikanSearch searchValue={searchValue} />}
        />

        <Route path="/random" element={<Random />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
      <BackToTop />
    </ThemeProvider>
  );
}
