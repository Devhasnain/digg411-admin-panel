import { useState, useEffect, useCallback } from "react";
import baseApi from "../config/api";

export const useQuery = (endpoint: string, token?: string,autoFetch: boolean = true) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);


  const request = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseApi.get(endpoint, {
        headers: { Authorization: token ?? "" },
      });

      setData(response.data);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request was aborted");
        return;
      }
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if(autoFetch) request();
  }, [ endpoint, autoFetch]);

  return { request, loading, error, data };
};
