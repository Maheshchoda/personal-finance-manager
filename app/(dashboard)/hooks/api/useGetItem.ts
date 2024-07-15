import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type TransactionResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$get"],
  200
>["data"];
type DefaultResponseType = InferResponseType<
  (typeof client.api)[Exclude<ItemType, "transactions">][":id"]["$get"],
  200
>["data"];

type ResponseType<T extends ItemType> = T extends "transactions"
  ? TransactionResponseType
  : DefaultResponseType;

interface Params<T extends ItemType> {
  id: string;
  itemName: T;
}

const getItem = async <T extends ItemType>({
  id,
  itemName,
}: Params<T>): Promise<ResponseType<T>> => {
  if (!id) {
    throw new Error(`ID is required to fetch ${CapTrimEnd(itemName, true)}.`);
  }
  const response = await client.api[itemName][":id"].$get({ param: { id } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${CapTrimEnd(itemName, true)}.`);
  }
  const { data } = await response.json();
  return data as ResponseType<T>;
};

const useGetItem = <T extends ItemType>({ id, itemName }: Params<T>) => {
  return useQuery<ResponseType<T>, Error>({
    enabled: !!id,
    queryKey: [`${CapTrimEnd(itemName, true)}`, { id }],
    queryFn: () => getItem({ id, itemName }),
  });
};

export default useGetItem;
