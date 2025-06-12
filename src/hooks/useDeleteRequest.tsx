import { useState } from "react";
import baseApi from "../config/api";
import { store } from "../store";

type RequestProps = {
  path?: string | null;
  token?: any;
};

export const useDeleteRequest = (endpoint?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const request = async ({ path, token = null }: RequestProps) => {
    setLoading(true);
    setError(null);

    try {
      console.log(store.getState()?.auth?.token);
      const response = await baseApi.delete(path ? path : endpoint ?? "", {
        headers: { Authorization: token ?? store.getState()?.auth?.token },
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => setData(null);

  return { request, loading, error, data, clearData };
};
