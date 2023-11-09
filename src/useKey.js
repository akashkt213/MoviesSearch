import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
        console.log("closing");
      }
    }

    document.addEventListener("keydown", callback);

    // clean up function..if not cleaned then the useEffect gets accumulated
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [action, key]);
}
