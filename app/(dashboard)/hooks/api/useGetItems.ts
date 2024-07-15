import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

type TransactionResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  200
>["data"];

type DefaultResponseType = InferResponseType<
  (typeof client.api)[Exclude<ItemType, "transactions">]["$get"],
  200
>["data"];

type ResponseType<T extends ItemType> = T extends "transactions"
  ? TransactionResponseType
  : DefaultResponseType;

const useGetItems = <T extends ItemType>(itemName: T) => {
  const params = useSearchParams();
  return useQuery<ResponseType<T>, Error>({
    queryKey: getQueryKey<T>(params, itemName),
    queryFn: () => fetchData(params, itemName),
  });
};

const getQueryKey = <T extends ItemType>(
  params: ReadonlyURLSearchParams,
  itemName: T,
): QueryKey => {
  if (itemName === "transactions") {
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";
    return [itemName, { from, to, accountId }];
  }

  return [itemName];
};

const fetchData = async <T extends ItemType>(
  params: ReadonlyURLSearchParams,
  itemName: ItemType,
): Promise<ResponseType<T>> => {
  let response;
  if (itemName === "transactions") {
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    response = await client.api[itemName].$get({
      query: { from, to, accountId },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${CapTrimEnd(itemName)}.`);
    }

    const { data } = await response.json();
    return data as ResponseType<T>;
  } else {
    response = await client.api[itemName].$get();
    if (!response.ok) {
      throw new Error(`Failed to fetch ${CapTrimEnd(itemName)}.`);
    }

    const { data } = await response.json();
    return data as ResponseType<T>;
  }
};

export default useGetItems;
