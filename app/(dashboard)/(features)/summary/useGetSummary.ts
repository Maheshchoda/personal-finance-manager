import {
  GetSummaryRequestType as RequestType,
  GetSummaryResponseType as ResponseType,
} from "@/app/(dashboard)/hooks/api/apiTypes";
import { category } from "@/drizzle/schema";

import { client } from "@/lib/hono";
import { convertAmountFromMilliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const GetSummary = async ({
  from,
  to,
  accountId,
}: RequestType): Promise<ResponseType> => {
  const response = await client.api.summary.$get({
    query: {
      from,
      to,
      accountId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Summaries`);
  }
  const { data } = await response.json();
  return {
    ...data,
    income: convertAmountFromMilliUnits(data.income),
    expenses: convertAmountFromMilliUnits(data.expenses),
    balance: convertAmountFromMilliUnits(data.balance),
    topSpendingCategories: data.topSpendingCategories.map((category) => ({
      ...category,
      totalSpent: convertAmountFromMilliUnits(category.totalSpent),
    })),
    days: data.days.map((day) => ({
      ...day,
      income: day.income > 0 ? convertAmountFromMilliUnits(day.income) : 0,
      expenses:
        day.expenses > 0 ? convertAmountFromMilliUnits(day.expenses) : 0,
    })),
  };
};

const useGetSummary = ({ from, to, accountId }: RequestType) => {
  return useQuery<ResponseType, Error>({
    queryKey: ["summary"],
    queryFn: () => GetSummary({ from, to, accountId }),
  });
};

export default useGetSummary;
