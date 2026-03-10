import { Product } from "@/db/schema";
import { ApiResponseBody } from "@/lib/http/types";
import useSWR from "swr";

export function useProduct() {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<ApiResponseBody<Product[]>>(
    "/api/products",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isError: error,
    isLoading,
    mutate
  }
}
