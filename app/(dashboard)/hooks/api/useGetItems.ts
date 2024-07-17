import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import {
  MultipleItemsResponseType as ResponseType,
  MultipleItemsResponseTypes,
} from "@/app/(dashboard)/hooks/api/apiTypes";

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
      return (data as MultipleItemsResponseTypes["transactions"]).map(
        (transaction) => ({
          ...transaction,
          amount: convertAmountFromMiliUnits(transaction.amount),
        }),
      ) as ResponseType<T>;
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
