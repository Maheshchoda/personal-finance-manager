import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
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

  const fetchData = async (): Promise<ResponseType<T>> => {
    const queryParams = getQueryParams(itemName, params);
    const response = await client.api[itemName].$get({ query: queryParams });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${CapTrimEnd(itemName)}.`);
    }

    const { data } = await response.json();

    if (itemName === "transactions") {
      return (data as TransactionResponseType).map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliUnits(transaction.amount),
      })) as ResponseType<T>;
    }

    return data as ResponseType<T>;
  };

  return useQuery<ResponseType<T>, Error>({
    queryKey: getQueryKey(itemName, params),
    queryFn: fetchData,
  });
};

const getQueryKey = <T extends ItemType>(
  itemName: T,
  params: ReadonlyURLSearchParams,
): QueryKey => {
  const queryParams = getQueryParams(itemName, params);
  return [itemName, queryParams];
};

const getQueryParams = (
  itemName: ItemType,
  params: ReadonlyURLSearchParams,
) => {
  if (itemName === "transactions") {
    return {
      from: params.get("from") || "",
      to: params.get("to") || "",
      accountId: params.get("accountId") || "",
    };
  }
  return {};
};

export default useGetItems;
