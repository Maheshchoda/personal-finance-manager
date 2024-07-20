import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { convertAmountFromMilliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import { SingleItemResponseType as ResponseType } from "@/app/(dashboard)/hooks/api/apiTypes";

interface Params<T extends ItemType> {
  id: string;
  itemType: T;
}

const getItem = async <T extends ItemType>({
  id,
  itemType,
}: Params<T>): Promise<ResponseType<T>> => {
  if (!id) {
    throw new Error(`ID is required to fetch ${CapTrimEnd(itemType, true)}.`);
  }
  const response = await client.api[itemType][":id"].$get({ param: { id } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${CapTrimEnd(itemType, true)}.`);
  }
  const { data } = await response.json();

  if (itemType === "transactions") {
    const transaction = data as ResponseType<"transactions">;
    return {
      ...transaction,
      amount: convertAmountFromMilliUnits(transaction.amount),
    } as ResponseType<T>;
  }

  return data as ResponseType<T>;
};

const useGetItem = <T extends ItemType>({ id, itemType }: Params<T>) => {
  return useQuery<ResponseType<T>, Error>({
    enabled: !!id,
    queryKey: [`${CapTrimEnd(itemType, true)}`, { id }],
    queryFn: () => getItem({ id, itemType }),
  });
};

export default useGetItem;
