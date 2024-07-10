import ResourceType from "@/components/entities/Resource";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

interface Params extends ResourceType {
  id: string;
}

const getItem = async ({ id, itemName }: Params) => {
  if (!id) {
    throw new Error(`ID is required to fetch ${itemName}.`);
  }
  const response = await client.api[itemName][":id"].$get({ param: { id } });
  if (!response.ok)
    throw new Error(`Failed to Fetch ${CapTrimEnd(itemName, true)}.`);
  const { data } = await response.json();
  return data;
};

const useGetItem = ({ id, itemName }: Params) => {
  return useQuery({
    enabled: !!id,
    queryKey: [[`${itemName.slice(0, -1)}`], { id }],
    queryFn: () => getItem({ id, itemName }),
  });
};

export default useGetItem;
