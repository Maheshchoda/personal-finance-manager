import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

const useGetItems = ({ itemName }: ResourceType) => {
  const params = useSearchParams();
  return useQuery({
    queryKey: getQueryKey(params, itemName),
    queryFn: () => fetchData(params, itemName),
  });
};

const getQueryKey = (
  params: ReadonlyURLSearchParams,
  itemName: ResourceType["itemName"],
): QueryKey => {
  if (itemName === "transactions") {
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";
    return [itemName, { from, to, accountId }];
  }

  return [itemName];
};

const fetchData =
  (params: ReadonlyURLSearchParams, itemName: ResourceType["itemName"]) =>
  async () => {
    if (itemName === "transactions") {
      const from = params.get("from") || "";
      const to = params.get("to") || "";
      const accountId = params.get("accountId") || "";

      const response = await client.api[itemName].$get({
        query: { from, to, accountId },
      });

      return handleResponse(response, itemName);
    }

    const response = await client.api[itemName].$get();
    return handleResponse(response, itemName);
  };

const handleResponse = async (response: Response, itemName: string) => {
  if (!response.ok) {
    throw new Error(`Failed to fetch ${CapTrimEnd(itemName)}.`);
  }

  const { data } = await response.json();
  return data;
};

export default useGetItems;
