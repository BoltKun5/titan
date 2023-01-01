import { useState } from "react";
import { loggedApi } from "../../axios";

export const useFetchData = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async (path: string, params: any) => {
    try {
      setIsLoading(true)
      const response = await loggedApi.get(path, { params });
      return response.data;
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    fetch,
  }
}
