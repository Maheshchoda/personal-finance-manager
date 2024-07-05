import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

const getAccounts = async () => {
  const response = await client.api.accounts.$get();
  if (!response.ok) throw new Error("Failed to Fetch Accounts.");
  const { data } = await response.json();
  return data;
};

const useGetAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
};

export default useGetAccounts;
