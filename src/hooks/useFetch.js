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
                  `Error fetching data from ${singleUrl}: ${response.statusText || 'Unknown error'}`
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
              `Error fetching data from ${url}: ${response.statusText || 'Unknown error'}`
            );
          }

          const result = await response.json();

          if (isMounted) {
            setData(result);
          }
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          const errorMessage = err.message.includes('Failed to fetch')
            ? 'Network error: Please check your internet connection'
            : err.message;
          setError(errorMessage);
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
