import { useState, useEffect } from "react";

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (Array.isArray(url)) {
          if (url.length === 0) {
            setData([]);
            setLoading(false);
            return;
          }

          const promises = url.map((singleUrl) =>
            fetch(singleUrl, { ...options, signal }).then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error en la petición a ${singleUrl}: ${response.status}`
                );
              }
              return response.json();
            })
          );

          const results = await Promise.all(promises);

          if (isMounted) {
            setData(results);
          }
        } else {
          const response = await fetch(url, { ...options, signal });

          if (!response.ok) {
            throw new Error(
              `Error en la petición a ${url}: ${response.status}`
            );
          }

          const result = await response.json();

          if (isMounted) {
            setData(result);
          }
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setError(err.message || "Error desconocido en la petición");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}
