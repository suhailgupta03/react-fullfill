import { useState, useEffect } from "react";

/**
 * Use this function to get the data-fetch
 * hook. Returns an array containing the data
 * object as the first index and a boolean
 * flag as the second index (which denotes
 * if the data was successfully loaded from
 * the server)
 * @param {String} url
 */
export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUrl() {
    const response = await fetch(url);
    const json = await response.json();
    setData(json);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);

  return [data, loading];
}
