import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

const getItems = async ({ itemName }: ResourceType) => {
  const response = await client.api[itemName].$get();
  if (!response.ok) throw new Error(`Failed to Fetch ${CapTrimEnd(itemName)}.`);
  const { data } = await response.json();
  return data;
};

const useGetItems = ({ itemName }: ResourceType) => {
  return useQuery({
    queryKey: [itemName],
    queryFn: () => getItems({ itemName }),
  });
};

export default useGetItems;
