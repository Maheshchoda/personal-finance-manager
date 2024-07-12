import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

interface Params {
  id: string;
  itemName: ItemType;
}

const getItem = async ({ id, itemName }: Params) => {
  if (!id) {
    throw new Error(`ID is required to fetch ${CapTrimEnd(itemName, true)}.`);
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
    queryKey: [`${CapTrimEnd(itemName, true)}`, { id }],
    queryFn: () => getItem({ id, itemName }),
  });
};

export default useGetItem;
