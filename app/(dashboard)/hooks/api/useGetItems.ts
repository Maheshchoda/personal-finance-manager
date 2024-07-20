import { ItemType } from "@/components/entities/ItemType";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

import { client } from "@/lib/hono";
import { convertAmountFromMilliUnits } from "@/lib/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { MultipleItemResponseType as ResponseType } from "@/app/(dashboard)/hooks/api/apiTypes";

const useGetItems = <T extends ItemType>(itemType: T) => {
  const params = useSearchParams();

  const fetchData = async (): Promise<ResponseType<T>> => {
    const queryParams = getQueryParams(itemType, params);
    const response = await client.api[itemType].$get({ query: queryParams });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${CapTrimEnd(itemType)}.`);
    }

    const { data } = await response.json();

    if (itemType === "transactions") {
      return (data as ResponseType<"transactions">).map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMilliUnits(transaction.amount),
      })) as ResponseType<T>;
    }

    return data as ResponseType<T>;
  };

  return useQuery<ResponseType<T>, Error>({
    queryKey: getQueryKey(itemType, params),
    queryFn: fetchData,
  });
};

const getQueryKey = <T extends ItemType>(
  itemType: T,
  params: ReadonlyURLSearchParams,
): QueryKey => {
  const queryParams = getQueryParams(itemType, params);
  return [itemType, queryParams];
};

const getQueryParams = (
  itemType: ItemType,
  params: ReadonlyURLSearchParams,
) => {
  if (itemType === "transactions") {
    return {
      from: params.get("from") || "",
      to: params.get("to") || "",
      accountId: params.get("accountId") || "",
    };
  }
  return {};
};

export default useGetItems;
