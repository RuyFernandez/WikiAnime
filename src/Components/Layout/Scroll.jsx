import { useEffect, useRef } from "react";

export default function Scroll({ onLoadMore, hasMore, children }) {
  const observer = useRef(null);
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "250px" }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore, onLoadMore]);

  return (
    <div>
      {children}
      {hasMore && <div ref={lastElementRef} style={{ height: "1rem" }} />}
    </div>
  );
};