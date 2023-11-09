import { useState, useEffect } from "react";

const KEY = "7344cdaa";

// here we can use export default as well.
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // callback?.();
    // this is used for cleaning up. it is a browser property
    // nothing to do with react.
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
          { signal: controller.signal }
        );

        // res.ok returns a boolean value for if the data was fetched or not.
        if (!res.ok) {
          throw new Error("Something went wrong with fetching data");
        }

        const data = await res.json();
        // console.log(data);
        if (data.Response === "False") throw new Error("Movie not Found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        console.log(err.message);

        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseMovie is called before fetchMovie so as to clean
    // the previous results
    // handleCloseMovie();
    fetchMovies();
    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
