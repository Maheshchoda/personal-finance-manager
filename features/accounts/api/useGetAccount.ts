import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

interface Params {
  id?: string;
}

const getAccount = async ({ id }: Params) => {
  if (!id) {
    throw new Error("ID is required to fetch account.");
  }
  const response = await client.api.accounts[":id"].$get({ param: { id } });
  if (!response.ok) throw new Error("Failed to Fetch Account.");
  const { data } = await response.json();
  console.log(data, "Received from Backend");
  return data;
};

const useGetAccount = ({ id }: Params) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: () => getAccount({ id }),
  });
};

export default useGetAccount;
